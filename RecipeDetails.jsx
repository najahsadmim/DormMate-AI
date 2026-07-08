import React from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetails = () => {
  const { id } = useParams(); // Captures the :id from the URL

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto font-poppins">
      {/* Back Button */}
      <button 
        onClick={() => window.history.back()} 
        className="text-forestGreen font-bold mb-6 flex items-center gap-2 hover:text-tangerine transition"
      >
        ← Back to Recipes
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
        <div className="h-80 bg-gray-200 w-full">
          {/* Image will go here */}
          <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
            Recipe Image Placeholder (ID: {id})
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-4xl font-bold text-tangerine mb-4">Recipe Name</h2>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <span className="bg-green-100 text-forestGreen px-3 py-1 rounded-full text-sm font-bold">Easy</span>
            <span className="bg-orange-100 text-tangerine px-3 py-1 rounded-full text-sm font-bold">Tk 120</span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">25 Mins</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-forestGreen mb-4">Ingredients</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Placeholder ingredient 1</li>
                <li>Placeholder ingredient 2</li>
                <li>Placeholder ingredient 3</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-forestGreen mb-4">Steps</h3>
              <ol className="list-decimal list-inside space-y-4 text-gray-600">
                <li>First step of the AI recipe...</li>
                <li>Second step of the AI recipe...</li>
                <li>Final plating and serving...</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
