import React from 'react';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
      <img src={recipe.image} alt={recipe.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-forestGreen font-poppins">{recipe.name}</h3>
          <span className="text-xs bg-green-100 text-forestGreen px-2 py-1 rounded-md font-bold">★ {recipe.rating}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-xs font-poppins text-gray-600 mb-4">
          <p>💰 <span className="font-semibold text-forestGreen">Tk {recipe.cost}</span></p>
          <p>🔥 <span className="font-semibold text-forestGreen">{recipe.calories} kcal</span></p>
          <p>💪 <span className="font-semibold text-forestGreen">Prot {recipe.protein}g</span></p>
          <p>⏱️ <span className="font-semibold text-forestGreen">{recipe.time} min</span></p>
        </div>
        
        {recipe.healthyChoice && (
          <span className="text-[10px] uppercase tracking-wider font-bold text-tangerine border border-tangerine px-2 py-1 rounded-full">
            Healthy Choice
          </span>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
