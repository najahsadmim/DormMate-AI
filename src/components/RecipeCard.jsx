import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { UI_TEXT } from '../utils/constants';

const RecipeCard = ({ recipe }) => {
  const { savedRecipes, toggleSaveRecipe } = useContext(UserContext);
  
  // Determine if this specific recipe is currently saved
  const isSaved = savedRecipes.includes(recipe.id);

  // Fallback for images if the URL fails
  const imageSrc = recipe.image || "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <Link 
      to={`/recipe/${recipe.id}`} 
      className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer block group"
    >
      {/* Image Container */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={recipe.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />

        {/* HEART BUTTON - Action: Save/Unsave */}
        <button 
          onClick={(e) => {
            e.preventDefault(); // CRITICAL: Prevents the Link from navigating to the recipe page
            e.stopPropagation(); // Prevents event bubbling
            toggleSaveRecipe(recipe.id);
          }}
          className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform text-lg"
        >
          {isSaved ? '❤️' : '🤍'}
        </button>

        {/* Healthy Choice Badge */}
        {recipe.healthyChoice && (
          <span className="absolute top-3 left-3 bg-white/90 text-forestGreen px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm z-10">
            {UI_TEXT.HEALTHY_CHOICE}
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-forestGreen font-poppins truncate mr-2">
            {recipe.title}
          </h3>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md font-bold">
            ★ 4.{Math.floor(Math.random() * 9) + 1}
          </span>
        </div>
        
        {/* Recipe Stats Grid */}
        <div className="grid grid-cols-2 gap-y-2 text-xs font-poppins text-gray-600 mb-4">
          <p>💰 <span className="font-semibold text-forestGreen">Tk {recipe.estimatedCost}</span></p>
          <p>🔥 <span className="font-semibold text-forestGreen">{recipe.calories} kcal</span></p>
          <p>💪 <span className="font-semibold text-forestGreen">Prot {recipe.protein}g</span></p>
          <p>⏱️ <span className="font-semibold text-forestGreen">{recipe.cookingTime} min</span></p>
        </div>
        
        {/* Footer Action */}
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
