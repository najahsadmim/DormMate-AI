import React from 'react';
import { Link } from 'react-router-dom';
import { UI_TEXT } from '../utils/constants'; 

const RecipeCard = ({ recipe }) => {
  // Fallback for images if the URL fails
  const imageSrc = recipe.image || "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <Link 
      to={`/recipe/${recipe.id}`} 
      className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer block group"
    >
      {/* Image Container with Zoom Effect */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={recipe.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        {recipe.healthyChoice && (
          <span className="absolute top-3 right-3 bg-white/90 text-forestGreen px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {UI_TEXT.HEALTHY_CHOICE}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-forestGreen font-poppins truncate mr-2">
            {recipe.title}
          </h3>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md font-bold">
            ★ 4.{Math.floor(Math.random() * 9) + 1}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-xs font-poppins text-gray-600 mb-4">
          <p>💰 <span className="font-semibold text-forestGreen">Tk {recipe.estimatedCost}</span></p>
          <p>🔥 <span className="font-semibold text-forestGreen">{recipe.calories} kcal</span></p>
          <p>💪 <span className="font-semibold text-forestGreen">Prot {recipe.protein}g</span></p>
          <p>⏱️ <span className="font-semibold text-forestGreen">{recipe.cookingTime} min</span></p>
        </div>
        
        <div className="text-center">
            <span className="text-tangerine font-bold text-xs group-hover:underline transition">
                View Recipe →
            </span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;