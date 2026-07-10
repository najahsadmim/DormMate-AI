import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import RecipeService from '../services/RecipeService';
import RecipeCard from '../components/RecipeCard';

const SavedPage = () => {
  const { savedRecipes } = useContext(UserContext);

  // Convert the list of IDs into full recipe objects
  const recipesToDisplay = savedRecipes.map(id => RecipeService.getRecipeById(id)).filter(Boolean);

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto font-poppins">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-tangerine mb-4">My Cookbook</h2>
        <p className="text-forestGreen font-semibold">Your favorite AI-recommended meals, all in one place.</p>
      </div>

      {recipesToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipesToDisplay.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">📖</div>
          <p className="text-gray-500 text-lg italic">Your cookbook is empty.</p>
          <p className="text-forestGreen font-bold mt-2">Start "hearting" recipes to save them here!</p>
        </div>
      )}
    </div>
  );
};

export default SavedPage;
