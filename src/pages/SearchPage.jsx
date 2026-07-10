import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import RecipeService from '../services/RecipeService';
import RecipeCard from '../components/RecipeCard';
import FilterPanel from '../components/FilterPanel';

const SearchPage = () => {
  const { profile } = useContext(UserContext);
  
  const [filters, setFilters] = useState({
    maxBudget: 500,
    maxCalories: 1000,
    minProtein: 0,
    maxTime: 60
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [aiResults, setAiResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const handleAISearch = async () => {
    if (!searchQuery) return;
    setIsLoading(true);
    setUseAI(true);
    
    try {
      const results = await RecipeService.getAIRecommendations(searchQuery, profile);
      setAiResults(results || []);
    } catch (error) {
      console.error("AI Search failed", error);
      setAiResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const localResults = RecipeService.filterRecipes(filters, profile).filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayRecipes = useAI ? aiResults : localResults;

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto font-poppins">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-tangerine mb-4">Explore Recipes</h2>
        <div className="relative max-w-xl mx-auto flex gap-2">
          <input 
            type="text" 
            placeholder="Try 'High protein meal for exam week'..." 
            className="flex-1 px-6 py-4 rounded-full border-2 border-forestGreen outline-none focus:ring-2 ring-tangerine shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            onClick={handleAISearch}
            className="bg-tangerine text-white px-6 py-4 rounded-full font-bold hover:bg-orange-600 transition shadow-md flex items-center gap-2"
          >
            {isLoading ? "Thinking..." : "✨ Ask AI"}
          </button>
        </div>
        {useAI && (
          <button 
            onClick={() => { setUseAI(false); setAiResults([]); }} 
            className="mt-4 text-sm text-gray-500 underline hover:text-tangerine transition"
          >
            Switch to basic search
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>

        <div className="w-full md:w-3/4">
          {isLoading ? (
            <div className="text-center py-20 animate-pulse text-tangerine font-bold text-xl">
              Gemma 4 is reasoning through your budget and allergies...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(displayRecipes) && displayRecipes.length > 0 ? (
                displayRecipes.map((recipe, index) => {
                  if (!recipe) return null; 
                  
                  // A recipe is 'Generated' if its ID isn't in the recipes.json file
                  const isGenerated = !RecipeService.getRecipeById(recipe.id);

                  return (
                    <div key={recipe.id || index} className="relative">
                      {recipe.aiReason && (
                        <div className="absolute -top-3 left-2 right-2 z-10 bg-white border border-tangerine text-tangerine text-[10px] font-bold p-2 rounded-lg shadow-sm italic">
                          AI: {recipe.aiReason}
                        </div>
                      )}
                      {isGenerated && (
                        <div className="absolute top-2 left-2 z-20 bg-tangerine text-white px-2 py-1 rounded-md text-[9px] font-bold uppercase shadow-lg">
                          ✨ AI Generated
                        </div>
                      )}
                      <RecipeCard recipe={recipe} />
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-lg italic">
                    {useAI ? "AI couldn't find a match." : "No recipes match your current filters."}
                  </p>
                  <p className="text-forestGreen font-bold mt-2">Try adjusting your filters or query!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
