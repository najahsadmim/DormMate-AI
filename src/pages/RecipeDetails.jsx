import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeService from '../services/RecipeService';
import { UserContext } from '../contexts/UserContext';
import { UI_TEXT } from '../utils/constants';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);

  // The service now handles JSON vs Cache automatically
  const recipe = RecipeService.getRecipeById(id);

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center font-poppins">
        <h2 className="text-4xl font-bold text-tangerine mb-4">{UI_TEXT.RECIPE_NOT_FOUND}</h2>
        <p className="text-gray-500 mb-8">This recipe might have expired from your AI session.</p>
        <button onClick={() => navigate('/')} className="bg-forestGreen text-white px-6 py-3 rounded-full font-bold">Return Home</button>
      </div>
    );
  }

  const isGenerated = !RecipeService.getAllRecipes().find(r => String(r.id) === String(id));
  const missingEquipment = recipe.equipment?.filter(item => !profile.equipment?.includes(item)) || [];

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto font-poppins">
      <button onClick={() => navigate(-1)} className="text-forestGreen font-bold mb-6 flex items-center gap-2 hover:text-tangerine transition">
        ← Back to Recipes
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <div className="h-96 w-full relative">
          <img 
            src={recipe.image || "https://via.placeholder.com/800x600?text=Delicious+Meal"} 
            alt={recipe.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-4 left-4">
            {isGenerated && (
              <span className="bg-tangerine text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg">
                ✨ AI Generated Recipe
              </span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8 text-white">
            <h2 className="text-4xl font-bold mb-2">{recipe.title}</h2>
            <p className="text-gray-200 italic">{recipe.description || "Customized by DormMate AI for your needs."}</p>
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-green-100 text-forestGreen px-4 py-1 rounded-full text-sm font-bold">{recipe.difficulty}</span>
            <span className="bg-orange-100 text-tangerine px-4 py-1 rounded-full text-sm font-bold">Tk {recipe.estimatedCost}</span>
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">{recipe.cookingTime} Mins</span>
          </div>

          {missingEquipment.length > 0 && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 text-red-700 text-sm font-medium">
              <span>⚠️</span>
              <p>You might be missing: <span className="font-bold">{missingEquipment.join(', ')}</span></p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-forestGreen mb-6 flex items-center gap-2">🛒 Ingredients</h3>
              <ul className="space-y-3">
                {recipe.ingredients?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="text-tangerine font-bold">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-forestGreen mb-6 flex items-center gap-2">🍳 Cooking Steps</h3>
              <div className="space-y-6">
                {recipe.steps?.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-tangerine text-white rounded-full flex items-center justify-center font-bold">{i + 1}</span>
                    <p className="text-gray-600 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
