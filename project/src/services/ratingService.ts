import { localStorageService } from './localStorageService';

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  swapRequestId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Date;
}

class RatingService {
  private readonly RATINGS_KEY = 'skillswap_ratings';

  private getRatings(): Rating[] {
    const ratings = localStorage.getItem(this.RATINGS_KEY);
    return ratings ? JSON.parse(ratings) : [];
  }

  private saveRatings(ratings: Rating[]): void {
    localStorage.setItem(this.RATINGS_KEY, JSON.stringify(ratings));
  }

  // Submit a rating for a user
  submitRating(ratingData: Omit<Rating, 'id' | 'createdAt'>): Rating {
    const ratings = this.getRatings();
    
    // Check if rating already exists for this swap request
    const existingRating = ratings.find(r => r.swapRequestId === ratingData.swapRequestId);
    if (existingRating) {
      throw new Error('Rating already submitted for this swap request');
    }

    const newRating: Rating = {
      ...ratingData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    ratings.push(newRating);
    this.saveRatings(ratings);

    // Update user's average rating
    this.updateUserRating(ratingData.toUserId);

    return newRating;
  }

  // Get all ratings for a user
  getUserRatings(userId: string): Rating[] {
    const ratings = this.getRatings();
    return ratings.filter(r => r.toUserId === userId);
  }

  // Get average rating for a user
  getUserAverageRating(userId: string): number {
    const userRatings = this.getUserRatings(userId);
    if (userRatings.length === 0) return 0;
    
    const totalRating = userRatings.reduce((sum, rating) => sum + rating.rating, 0);
    return Math.round((totalRating / userRatings.length) * 10) / 10; // Round to 1 decimal
  }

  // Update user's average rating in their profile
  private updateUserRating(userId: string): void {
    const averageRating = this.getUserAverageRating(userId);
    const user = localStorageService.getUserById(userId);
    
    if (user) {
      localStorageService.updateUserProfile(userId, { rating: averageRating });
    }
  }

  // Get rating for a specific swap request
  getRatingForSwapRequest(swapRequestId: string): Rating | null {
    const ratings = this.getRatings();
    return ratings.find(r => r.swapRequestId === swapRequestId) || null;
  }

  // Check if user has rated a specific swap request
  hasUserRatedSwapRequest(userId: string, swapRequestId: string): boolean {
    const ratings = this.getRatings();
    return ratings.some(r => r.fromUserId === userId && r.swapRequestId === swapRequestId);
  }

  // Get recent ratings for a user (for display)
  getRecentUserRatings(userId: string, limit: number = 5): Rating[] {
    const userRatings = this.getUserRatings(userId);
    return userRatings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const ratingService = new RatingService(); 