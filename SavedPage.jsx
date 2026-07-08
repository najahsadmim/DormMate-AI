import React from 'react';

const SavedPage = () => {
  return (
    <div className="px-6 py-12 max-w-6xl mx-auto font-poppins">
      <h2 className="text-4xl font-bold text-tangerine mb-2">My Cookbook</h2>
      <p className="text-forestGreen font-semibold mb-8">Your favorite AI-recommended recipes.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* This will later map through saved recipes state */}
        <div className="h-64 bg-gray-50 rounded-2xl border-2 border-dotted border-gray-200 flex items-center justify-center text-gray-400 italic">
          No recipes saved yet.
        </div>
      </div>
    </div>
  );
};

export default SavedPage;
