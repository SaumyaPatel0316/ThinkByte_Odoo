import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  PencilIcon, 
  PlusIcon, 
  XMarkIcon,
  UserIcon,
  MapPinIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';


export function Profile() {
  const { user, updateProfile, isProfileComplete } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    profilePhoto: user?.profilePhoto || '',
    isPublic: user?.isPublic ?? true,
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: user?.availability || [],
  });

  // Update formData when user data changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        location: user.location || '',
        profilePhoto: user.profilePhoto || '',
        isPublic: user.isPublic ?? true,
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability || [],
      });
    }
  }, [user]);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  const handleSave = async () => {
    console.log('Saving profile data:', formData);
    setSaveStatus('saving');
    try {
      await updateProfile(formData);
      console.log('Profile saved successfully');
      setSaveStatus('success');
      setIsEditing(false);
      
      // Reset success status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      location: user?.location || '',
      profilePhoto: user?.profilePhoto || '',
      isPublic: user?.isPublic ?? true,
      skillsOffered: user?.skillsOffered || [],
      skillsWanted: user?.skillsWanted || [],
      availability: user?.availability || [],
    });
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    const normalizedSkill = newSkillOffered.trim();
    if (normalizedSkill && !formData.skillsOffered.some(skill => skill.toLowerCase() === normalizedSkill.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, normalizedSkill]
      }));
      setNewSkillOffered('');
    }
  };

  const removeSkillOffered = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s !== skill)
    }));
  };

  const addSkillWanted = () => {
    const normalizedSkill = newSkillWanted.trim();
    if (normalizedSkill && !formData.skillsWanted.some(skill => skill.toLowerCase() === normalizedSkill.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, normalizedSkill]
      }));
      setNewSkillWanted('');
    }
  };

  const removeSkillWanted = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(s => s !== skill)
    }));
  };

  const addAvailability = () => {
    const normalizedAvailability = newAvailability.trim();
    if (normalizedAvailability && !formData.availability.some(avail => avail.toLowerCase() === normalizedAvailability.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        availability: [...prev.availability, normalizedAvailability]
      }));
      setNewAvailability('');
    }
  };

  const removeAvailability = (availability: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter(a => a !== availability)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          {!isProfileComplete && (
            <div className="mt-2 flex items-center space-x-2 text-yellow-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">Profile incomplete - Add your skills and availability</span>
            </div>
          )}
          {saveStatus === 'success' && (
            <div className="mt-2 flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Profile saved successfully!</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="mt-2 flex items-center space-x-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Error saving profile. Please try again.</span>
            </div>
          )}
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`px-4 py-2 rounded-lg transition-colors ${
                saveStatus === 'saving' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : saveStatus === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : saveStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {saveStatus === 'saving' ? 'Saving...' : 
               saveStatus === 'success' ? 'Saved!' : 
               saveStatus === 'error' ? 'Error!' : 
               'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Profile Photo */}
            <div className="text-center mb-6">
              {formData.profilePhoto ? (
                <div className="relative">
                  <img 
                    src={formData.profilePhoto} 
                    alt={formData.name}
                    className="h-24 w-24 rounded-full object-cover mx-auto mb-4"
                  />
                  {isEditing && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      ✓
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-24 w-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log('File selected:', file.name, file.size);
                        
                        // Validate file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size must be less than 5MB');
                          return;
                        }
                        
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          console.log('File converted to base64, length:', (reader.result as string).length);
                          setFormData(prev => ({ 
                            ...prev, 
                            profilePhoto: reader.result as string 
                          }));
                        };
                        reader.onerror = () => {
                          console.error('Error reading file');
                          alert('Error reading file. Please try again.');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-800"
                  />
                  {formData.profilePhoto && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, profilePhoto: '' }))}
                      className="mt-2 text-red-600 hover:text-red-800 text-xs underline"
                    >
                      Remove photo
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{user?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="City, State/Country"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{user?.location || 'Not specified'}</p>
                )}
              </div>

              {/* Privacy Setting */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                    {formData.isPublic ? (
                      <EyeIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <EyeSlashIcon className="h-4 w-4 mr-1" />
                    )}
                    Public Profile
                  </span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.isPublic 
                    ? 'Your profile is visible to other users'
                    : 'Your profile is private and not visible to others'
                  }
                </p>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Swaps</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.totalSwaps || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.rating?.toFixed(1) || '0.0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.joinedAt ? new Date(user.joinedAt).getFullYear() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

                  {/* Skills and Availability */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Offered */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills I Can Teach</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skillsOffered.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkillOffered(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
              {formData.skillsOffered.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No skills added yet</p>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a skill..."
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm"
                />
                <button
                  onClick={addSkillOffered}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  disabled={!newSkillOffered.trim()}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Skills Wanted */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills I Want to Learn</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skillsWanted.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-400"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkillWanted(skill)}
                      className="ml-2 text-teal-600 hover:text-teal-800 transition-colors"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
              {formData.skillsWanted.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No skills added yet</p>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a skill..."
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm"
                />
                <button
                  onClick={addSkillWanted}
                  className="bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                  disabled={!newSkillWanted.trim()}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <ClockIcon className="h-5 w-5 inline mr-2" />
              Availability
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.availability.map((time) => (
                <span
                  key={time}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400"
                >
                  {time}
                  {isEditing && (
                    <button
                      onClick={() => removeAvailability(time)}
                      className="ml-2 text-orange-600 hover:text-orange-800 transition-colors"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
              {formData.availability.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No availability set</p>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g., Weekends, Evening weekdays..."
                  value={newAvailability}
                  onChange={(e) => setNewAvailability(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAvailability()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm"
                />
                <button
                  onClick={addAvailability}
                  className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                  disabled={!newAvailability.trim()}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}