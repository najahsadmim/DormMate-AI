import React from 'react';

const PantryPage = () => {
  return (
    <div className="px-6 py-12 max-w-4xl mx-auto font-poppins text-center">
      <h2 className="text-4xl font-bold text-tangerine mb-2">AI Pantry Scanner</h2>
      <p className="text-forestGreen font-semibold mb-8">Turn your leftovers into gourmet meals.</p>
      
      <div className="aspect-video bg-gray-100 rounded-3xl border-4 border-white shadow-inner flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">📷</span>
        <button className="bg-tangerine text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition">
          Upload Kitchen Photo
        </button>
      </div>
      <p className="mt-6 text-gray-400 text-sm">Our AI will detect your ingredients automatically.</p>
    </div>
  );
};

export default PantryPage;
