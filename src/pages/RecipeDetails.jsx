import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeService from '../services/RecipeService';
import { UserContext } from '../contexts/UserContext';
import { UI_TEXT } from '../utils/constants';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);
  
  const [substitution, setSubstitution] = useState(null);
  const [isLoadingSub, setIsLoadingSub] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);

  const recipe = RecipeService.getRecipeById(id);

  // Effect: Fetch AI Nutrition Insight based on User's Goal
  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const response = await fetch('http://localhost:8000/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: `Briefly explain why ${recipe?.title} is a good choice for a user whose goal is ${profile?.nutritionGoal || 'healthy eating'}.`, 
            profile 
          }),
        });
        const data = await response.json();
        setAiInsight(data.results?.[0]?.reason || "A great, balanced meal for your needs!");
      } catch (e) {
        setAiInsight("A nutritious and budget-friendly choice!");
      } finally {
        setIsLoadingInsight(false);
      }
    };
    if (recipe) fetchInsight();
  }, [recipe, profile]);

  const handleSubstitute = async (ingredient) => {
    setIsLoadingSub(true);
    try {
      const response = await fetch('http://localhost:8000/substitute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient, recipe_title: recipe.title, profile }),
      });
      const data = await response.json();
      setSubstitution(data);
    } catch (e) {
      alert("AI substitution failed. Please try again.");
    } finally {
      setIsLoadingSub(false);
    }
  };

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center font-poppins">
        <h2 className="text-4xl font-bold text-tangerine mb-4">{UI_TEXT.RECIPE_NOT_FOUND}</h2>
        <button onClick={() => navigate('/')} className="bg-forestGreen text-white px-6 py-3 rounded-full font-bold">Return Home</button>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto font-poppins">
      <button onClick={() => navigate(-1)} className="text-forestGreen font-bold mb-6 flex items-center gap-2 hover:text-tangerine transition">
        {UI_TEXT.BACK_BUTTON}
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <div className="h-96 w-full relative">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8 text-white">
            <h2 className="text-4xl font-bold mb-2">{recipe.title}</h2>
            <p className="text-gray-200 italic">{recipe.description}</p>
          </div>
        </div>
        
        <div className="p-8">
          {/* AI Nutrition Insight Box */}
          <div className="mb-8 p-4 bg-orange-50 border-l-4 border-tangerine rounded-r-xl italic text-sm text-tangerine font-medium">
            {isLoadingInsight ? "✨ AI is analyzing nutrition..." : `✨ AI Insight: ${aiInsight}`}
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            <span className="bg-green-100 text-forestGreen px-4 py-1 rounded-full text-sm font-bold">{recipe.difficulty}</span>
            <span className="bg-orange-100 text-tangerine px-4 py-1 rounded-full text-sm font-bold">Tk {recipe.estimatedCost}</span>
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">{recipe.cookingTime} Mins</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-forestGreen mb-6 flex items-center gap-2">🛒 Ingredients</h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((item, i) => (
                  <li key={i} className="flex items-center justify-between group py-1">
                    <div className="flex items-start gap-3 text-gray-600">
                      <span className="text-tangerine font-bold">•</span> {item}
                    </div>
                    <button 
                      onClick={() => handleSubstitute(item)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] bg-gray-100 px-2 py-1 rounded hover:bg-tangerine hover:text-white transition font-bold"
                    >
                      Substitute?
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-forestGreen mb-6 flex items-center gap-2">🍳 Cooking Steps</h3>
              <div className="space-y-6">
                {recipe.steps.map((step, i) => (
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

      {/* Substitution Modal */}
      {substitution && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center animate-fadeIn shadow-2xl">
            <div className="text-4xl mb-4">💡</div>
            <h4 className="text-xl font-bold text-forestGreen mb-2">Smart Substitution</h4>
            <p className="text-gray-600 mb-4">Instead of {substitution.ingredient || 'this ingredient'}, use:</p>
            <div className="text-2xl font-bold text-tangerine mb-4">{substitution.substitute}</div>
            <p className="text-sm text-gray-400 italic mb-6">{substitution.reason}</p>
            <button 
              onClick={() => setSubstitution(null)}
              className="w-full bg-forestGreen text-white py-2 rounded-xl font-bold hover:bg-green-700 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
