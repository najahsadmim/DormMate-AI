import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import RecipeService from '../services/RecipeService';
import RecipeCard from '../components/RecipeCard';
import FilterPanel from '../components/FilterPanel';

const SearchPage = () => {
  // 1. State & Context
  const [searchParams] = useSearchParams();
  const { profile } = useContext(UserContext);
  
  // Filter state ( synced with FilterPanel)
  const [filters, setFilters] = useState({
    maxBudget: 500,
    maxCalories: 1000,
    minProtein: 0,
    maxTime: 60
  });

  // Search and AI states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [aiResults, setAiResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useAI, setUseAI] = useState(searchParams.get('ai') === 'true');

  // 2. Effect: Handle Redirects from Meal Plan Page
  // If URL is /search?q=Chicken+Salad&ai=true, trigger AI search immediately
  useEffect(() => {
    const query = searchParams.get('q');
    const shouldUseAI = searchParams.get('ai') === 'true';
    
    if (query && shouldUseAI) {
      setSearchQuery(query);
      setUseAI(true);
      handleAISearch(query); 
    }
  }, []);

  // 3. AI Search Handler
  const handleAISearch = async (overrideQuery) => {
    const queryToUse = overrideQuery || searchQuery;
    if (!queryToUse) return;
    
    setIsLoading(true);
    setUseAI(true);
    
    try {
      // Call the FastAPI /recommend endpoint via the service
      const results = await RecipeService.getAIRecommendations(queryToUse, profile);
      setAiResults(results || []);
    } catch (error) {
      console.error("AI Search failed:", error);
      setAiResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Local Search Logic (The "Basic Search")
  // This uses the local filter engine and matches titles/tags
  const localResults = RecipeService.filterRecipes(filters, profile).filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Determine which set of results to map over
  const displayRecipes = useAI ? aiResults : localResults;

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto font-poppins">
      
      {/* --- SEARCH HEADER --- */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-tangerine mb-4">Explore Recipes</h2>
        <div className="relative max-w-2xl mx-auto flex gap-3">
          <input 
            type="text" 
            placeholder="Try 'High protein meal for exam week'..." 
            className="flex-1 px-6 py-4 rounded-full border-2 border-forestGreen outline-none focus:ring-2 ring-tangerine shadow-sm transition-all text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
          />
          <button 
            onClick={() => handleAISearch()}
            className="bg-tangerine text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition shadow-md flex items-center gap-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin text-lg">🌀</span> Thinking...
              </span>
            ) : (
              <>
                <span>✨</span> Ask AI
              </>
            )}
          </button>
        </div>
        
        {useAI && (
          <button 
            onClick={() => { 
              setUseAI(false); 
              setAiResults([]); 
            }} 
            className="mt-4 text-sm text-gray-500 underline hover:text-tangerine transition font-medium"
          >
            Switch back to basic search
          </button>
        )}
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT SIDEBAR: Filter Panel */}
        <div className="w-full md:w-1/4">
          {/* Only show filters if NOT using AI (since AI handles constraints in the prompt) */}
          {!useAI ? (
            <FilterPanel filters={filters} setFilters={setFilters} />
          ) : (
            <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 h-fit sticky top-24">
              <h3 className="text-lg font-bold text-tangerine mb-3 flex items-center gap-2">
                <span>🧠</span> AI Reasoning
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gemma 4 is currently analyzing your <strong>budget</strong>, <strong>allergies</strong>, and <strong>equipment</strong> to find the perfect match.
              </p>
              <div className="mt-4 p-3 bg-white rounded-xl border border-orange-100 text-[11px] text-gray-500 italic">
                "Considering your {profile?.nutritionGoal || 'health'} goal..."
              </div>
            </div>
          )}
        </div>

        {/* RIGHT AREA: Recipe Grid */}
        <div className="w-full md:w-3/4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-16 h-16 bg-tangerine/20 rounded-full flex items-center justify-center text-3xl mb-4">🍳</div>
              <p className="text-tangerine font-bold text-xl">Gemma 4 is reasoning...</p>
              <p className="text-gray-400 text-sm">Scanning recipes and calculating nutrition</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(displayRecipes) && displayRecipes.length > 0 ? (
                displayRecipes.map((recipe, index) => {
                  if (!recipe) return null; 
                  
                  // Check if this recipe is AI-Generated (not in recipes.json)
                  const isGenerated = !RecipeService.getRecipeById(recipe.id);

                  return (
                    <div key={recipe.id || index} className="relative group">
                      {/* AI Reasoning Tooltip */}
                      {recipe.aiReason && (
                        <div className="absolute -top-3 left-2 right-2 z-10 bg-white border border-tangerine text-tangerine text-[10px] font-bold p-2 rounded-lg shadow-sm italic transition-all duration-300 group-hover:top-[-5px]">
                          AI: {recipe.aiReason}
                        </div>
                      )}
                      
                      {/* Generated Badge */}
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
                /* EMPTY STATE */
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="text-5xl mb-4">🥗</div>
                  <p className="text-gray-500 text-lg italic">
                    {useAI 
                      ? "Gemma 4 couldn't find a perfect match for this query." 
                      : "No recipes match your current filters and search."}
                  </p>
                  <p className="text-forestGreen font-bold mt-2">
                    {useAI 
                      ? "Try a broader query or adjust your profile!" 
                      : "Try adjusting your budget or calories!"}
                  </p>
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
