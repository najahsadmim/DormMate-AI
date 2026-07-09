import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import RecipeService from '../services/RecipeService';
import { UserContext } from '../contexts/UserContext';
import { BUDGET_LIMITS } from '../utils/constants';

const HomePage = () => {
  const navigate = useNavigate();
  const { profile, user } = useContext(UserContext);
  
  // Local state for the budget slider
  const [budget, setBudget] = useState(250);

  // 1. Fetch a dynamic featured recipe for the "Recipe of the Week"
  const featuredRecipe = RecipeService.getFeaturedRecipe();

  // 2. Use the Filtering Engine to get personalized recommendations
  // We pass the current budget slider value AND the user's profile (allergies, religion, etc.)
  const recommendedRecipes = RecipeService.filterRecipes(
    { maxBudget: budget }, 
    profile
  );

  return (
    <div className="bg-white min-h-screen font-poppins pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="px-6 py-10 text-center max-w-4xl mx-auto">
        {/* Personalized Greeting */}
        <div className="mb-6 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold text-tangerine mb-4">
            {user ? `Welcome back, ${user.name}! 👋` : "What are you cooking today?"}
          </h2>
          <p className="text-forestGreen font-semibold">
            AI-powered meals tailored to your budget and health.
          </p>
        </div>
        
        {/* AI Search Bar (Input for Phase 6) */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <input 
            type="text" 
            placeholder="Try 'High protein breakfast under Tk 100'..." 
            className="w-full px-6 py-4 rounded-full border-2 border-forestGreen focus:outline-none focus:ring-2 ring-tangerine text-gray-700 shadow-sm transition-all"
            onKeyDown={(e) => e.key === 'Enter' && navigate('/search')}
          />
          <button 
            onClick={() => navigate('/search')}
            className="absolute right-2 top-2 bg-tangerine text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition shadow-md"
          >
            Search
          </button>
        </div>

        {/* Budget Slider Card */}
        <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between mb-4">
            <span className="text-forestGreen font-bold">Max Budget Limit</span>
            <span className="text-tangerine font-bold text-lg">Tk {budget}</span>
          </div>
          <input 
            type="range" 
            min={BUDGET_LIMITS.MIN} 
            max={BUDGET_LIMITS.MAX} 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)} 
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tangerine"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Tk {BUDGET_LIMITS.MIN}</span>
            <span>Tk {BUDGET_LIMITS.MAX}</span>
          </div>
        </div>
      </section>

      {/* --- FEATURED SECTION: Recipe of the Week --- */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-forestGreen mb-6 flex items-center gap-2">
          <span>⭐</span> Recipe of the Week
        </h3>
        <Link to={`/recipe/${featuredRecipe.id}`} className="block group">
          <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden cursor-pointer shadow-xl transition-transform duration-300 group-hover:scale-[1.01]">
            <img 
              src={featuredRecipe.image} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Featured" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
              <h4 className="text-3xl font-bold mb-2">{featuredRecipe.title}</h4>
              <p className="text-sm opacity-90 mb-4 max-w-md">{featuredRecipe.description}</p>
              <div className="flex gap-3">
                <span className="bg-tangerine px-3 py-1 rounded-full text-xs font-bold">Tk {featuredRecipe.estimatedCost}</span>
                <span className="bg-forestGreen px-3 py-1 rounded-full text-xs font-bold">{featuredRecipe.calories} kcal</span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* --- PERSONALIZED SECTION: Recommended For You --- */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-forestGreen">Recommended For You</h3>
          <button 
            onClick={() => navigate('/search')} 
            className="text-tangerine font-bold text-sm hover:underline transition"
          >
            Advanced Filters →
          </button>
        </div>
        
        {recommendedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 italic">No recipes match your current budget and profile.</p>
            <p className="text-forestGreen font-bold mt-2">Try increasing your budget slider! ↑</p>
          </div>
        )}
      </section>

      {/* --- FLOATING ACTION BUTTON: Pantry Scan --- */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => navigate('/pantry')}
          className="bg-tangerine text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-2 font-bold font-poppins group"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform">📷</span>
          <span className="hidden md:inline">Scan Pantry</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;