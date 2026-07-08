import React from 'react';

const SearchPage = () => {
  return (
    <div className="px-6 py-12 max-w-4xl mx-auto font-poppins">
      <h2 className="text-4xl font-bold text-tangerine mb-2">Find Your Next Meal</h2>
      <p className="text-forestGreen font-semibold mb-8">Search by ingredients, budget, or health goals.</p>
      
      <div className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200 text-center">
        <p className="text-gray-500 italic">Search results will appear here based on your AI query.</p>
        <div className="mt-4 text-forestGreen font-medium">Try: "Cheap high-protein dinner under Tk 100"</div>
      </div>
    </div>
  );
};

export default SearchPage;
