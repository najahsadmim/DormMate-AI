import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recipes from '../data/recipes.json';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the specific recipe that matches the ID from the URL
  const recipe = recipes.find((r) => r.id === parseInt(id));

  // Handle case where recipe is not found (404)
  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center font-poppins">
        <h2 className="text-4xl font-bold text-tangerine mb-4">Recipe Not Found</h2>
        <p className="text-forestGreen mb-8">Sorry, we couldn't find the meal you're looking for.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-forestGreen text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto font-poppins">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="text-forestGreen font-bold mb-6 flex items-center gap-2 hover:text-tangerine transition"
      >
        ← Back to Recipes
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        {/* Recipe Image */}
        <div className="h-96 w-full relative">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <h2 className="text-4xl font-bold text-white mb-2">{recipe.title}</h2>
            <p className="text-gray-200 italic">{recipe.description}</p>
          </div>
        </div>
        
        <div className="p-8">
          {/* Quick Info Bar */}
          <div className="flex flex-wrap gap-3 mb-10">
            <span className="bg-green-100 text-forestGreen px-4 py-1 rounded-full text-sm font-bold">
              {recipe.difficulty}
            </span>
            <span className="bg-orange-100 text-tangerine px-4 py-1 rounded-full text-sm font-bold">
              Tk {recipe.estimatedCost}
            </span>
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">
              {recipe.cookingTime} Mins
            </span>
            {recipe.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Ingredients Section */}
            <div>
              <h3 className="text-2xl font-bold text-forestGreen mb-6 flex items-center gap-2">
                🛒 Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <span className="text-tangerine font-bold">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cooking Steps Section */}
            <div>
              <h3 className="text-2xl font-bold text-forestGreen mb-6 flex items-center gap-2">
                🍳 Cooking Steps
              </h3>
              <div className="space-y-6">
                {recipe.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-tangerine text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <p className="text-gray-600 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nutrition Footer */}
          <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-3 text-center">
            <div>
              <p className="text-gray-400 text-xs uppercase font-bold">Calories</p>
              <p className="text-xl font-bold text-forestGreen">{recipe.calories} kcal</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase font-bold">Protein</p>
              <p className="text-xl font-bold text-forestGreen">{recipe.protein}g</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase font-bold">Budget</p>
              <p className="text-xl font-bold text-forestGreen">Low</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
