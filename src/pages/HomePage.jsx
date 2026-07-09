import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import recipes from '../data/recipes.json';
import { BUDGET_LIMITS } from '../utils/constants';

const HomePage = () => {
  const [budget, setBudget] = useState(250);
  const featuredRecipe = recipes[0];

  return (
    <div className="bg-white min-h-screen font-poppins pb-20">
      {/* Hero Section */}
      <section className="px-6 py-16 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-tangerine mb-4 tracking-tight">
          What are you cooking today?
        </h2>
        <p className="text-forestGreen font-semibold mb-10 text-lg">
          AI-powered meals tailored to your budget and health.
        </p>
       
        <div className="relative max-w-2xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Try 'High protein breakfast under Tk 100'..."
            className="w-full px-8 py-5 rounded-full border-2 border-forestGreen focus:outline-none focus:ring-4 ring-tangerine/20 text-gray-700 shadow-lg text-lg"
          />
          <button className="absolute right-2 top-2 bg-tangerine text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all shadow-md active:scale-95">
            Search
          </button>
        </div>

        {/* Budget Filter - Polished Card */}
        <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-forestGreen font-bold text-lg">Budget Limit</span>
            <span className="text-tangerine font-bold text-2xl">Tk {budget}</span>
          </div>
          <input
            type="range"
            min={BUDGET_LIMITS.MIN}
            max={BUDGET_LIMITS.MAX}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tangerine"
          />
          <div className="flex justify-between text-xs font-bold text-gray-400 mt-4 uppercase tracking-widest">
            <span>Tk {BUDGET_LIMITS.MIN}</span>
            <span>Tk {BUDGET_LIMITS.MAX}</span>
          </div>
        </div>
      </section>

      {/* Recipe of the Week - High Fidelity Match */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-forestGreen mb-6 ml-2">Recipe of the Week</h3>
        <Link to={`/recipe/${featuredRecipe.id}`} className="block group">
          <div className="relative h-72 md:h-96 w-full rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
            <img
              src={featuredRecipe.image}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Featured"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12 text-white">
              <h4 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">{featuredRecipe.title}</h4>
              <p className="text-sm md:text-lg opacity-90 mb-6 max-w-2xl drop-shadow-md">
                {featuredRecipe.description}
              </p>
              <div className="flex gap-4">
                <span className="bg-tangerine px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Tk {featuredRecipe.estimatedCost}
                </span>
                <span className="bg-forestGreen px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {featuredRecipe.calories} kcal
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Recommended Section */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 ml-2">
          <h3 className="text-2xl font-bold text-forestGreen">Recommended For You</h3>
          <button className="text-tangerine font-bold text-sm hover:underline transition">View All</button>
        </div>
       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Floating Pantry Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-tangerine text-white px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-3 font-bold font-poppins group">
          <span className="text-2xl group-hover:rotate-12 transition-transform">📷</span>
          <span className="hidden md:inline">Scan Pantry</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;