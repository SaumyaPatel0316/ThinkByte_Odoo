import React from 'react';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="flex flex-col items-center">
        <img
          src="/public/ThinkByte_Logo.png"
          alt="ThinkByte Logo"
          className="h-20 w-20 mb-4 animate-bounce"
        />
        <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-200 tracking-wide animate-pulse">
          ThinkByte
        </h1>
        <p className="mt-4 text-lg text-blue-700 dark:text-blue-300 animate-fade-in">
          Skill Swap Platform
        </p>
      </div>
    </div>
  );
} 