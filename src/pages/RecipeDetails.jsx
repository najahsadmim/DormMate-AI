import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeService from '../services/RecipeService';
import { UserContext } from '../contexts/UserContext';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);
  const [substitution, setSubstitution] = useState(null);
  const [isLoadingSub, setIsLoadingSub] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);

  const recipe = RecipeService.getRecipeById(id);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const response = await fetch('https://dormmate-ai-backend.onrender.com/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: `Why is ${recipe?.title} good for ${profile?.nutritionGoal || 'health'}?`, 
            profile 
          }),
        });
        const data = await response.json();
        setAiInsight(data.results?.[0]?.reason || "A healthy and budget-friendly choice!");
      } catch (e) {
        setAiInsight("A nutritious choice for your goals!");
      } finally {
        setIsLoadingInsight(false);
      }
    };
    if (recipe) fetchInsight();
  }, [recipe, profile]);

  const handleSubstitute = async (ingredient) => {
    setIsLoadingSub(true);
    try {
      const response = await fetch('https://dormmate-ai-backend.onrender.com/substitute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient, recipe_title: recipe.title, profile }),
      });
      const data = await response.json();
      setSubstitution(data);
    } catch (e) {
      alert("Substitution failed.");
    } finally {
      setIsLoadingSub(false);
    }
  };

  if (!recipe) return <div className="text-center py-20 text-4xl">Recipe Not Found</div>;

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto font-poppins">
      <button onClick={() => navigate(-1)} className="text-forestGreen font-bold mb-6">← Back</button>
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <img src={recipe.image} alt={recipe.title} className="w-full h-96 object-cover" />
        <div className="p-8">
          <div className="mb-8 p-4 bg-orange-50 border-l-4 border-tangerine italic text-sm text-tangerine">
            {isLoadingInsight ? "✨ AI is analyzing..." : `✨ AI Insight: ${aiInsight}`}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-forestGreen mb-6">🛒 Ingredients</h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((item, i) => (
                  <li key={i} className="flex items-center justify-between group py-1 border-b border-gray-50">
                    <span>{item}</span>
                    <button onClick={() => handleSubstitute(item)} className="opacity-0 group-hover:opacity-100 text-[10px] bg-gray-100 px-2 py-1 rounded hover:bg-tangerine hover:text-white transition">Substitute?</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-forestGreen mb-6">🍳 Steps</h3>
              <div className="space-y-6">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="w-8 h-8 bg-tangerine text-white rounded-full flex items-center justify-center font-bold">{i+1}</span>
                    <p className="text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {substitution && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center animate-fadeIn">
            <h4 className="text-xl font-bold text-forestGreen mb-2">Smart Substitution</h4>
            <div className="text-2xl font-bold text-tangerine mb-4">{substitution.substitute}</div>
            <p className="text-sm text-gray-400 italic mb-6">{substitution.reason}</p>
            <button onClick={() => setSubstitution(null)} className="w-full bg-forestGreen text-white py-2 rounded-xl font-bold">Got it!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
