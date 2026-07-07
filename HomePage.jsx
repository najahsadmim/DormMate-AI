import React, { useState } from 'react';
import RecipeCard from './RecipeCard';

const HomePage = () => {
  const [budget, setBudget] = useState(250);

  const trendingRecipes = [
    { name: "Chicken Khichuri", cost: 120, calories: 420, protein: 28, time: 25, rating: 4.8, healthyChoice: true, image: "https://via.placeholder.com/300x200?text=Khichuri" },
    { name: "Egg Fried Rice", cost: 80, calories: 350, protein: 15, time: 15, rating: 4.5, healthyChoice: false, image: "https://via.placeholder.com/300x200?text=EggRice" },
    { name: "Veggie Noodles", cost: 60, calories: 300, protein: 10, time: 12, rating: 4.2, healthyChoice: true, image: "https://via.placeholder.com/300x200?text=Noodles" },
    { name: "One-Pot Pasta", cost: 150, calories: 500, protein: 20, time: 20, rating: 4.7, healthyChoice: false, image: "https://via.placeholder.com/300x200?text=Pasta" },
  ];

  return (
    <div className="bg-white min-h-screen font-poppins pb-20">
      {/* Hero Section */}
      <section className="px-6 py-10 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-tangerine mb-4">
          What are you cooking today?
        </h2>
        <p className="text-forestGreen font-semibold mb-8">
          AI-powered meals tailored to your budget and health.
        </p>
        
        <div className="relative max-w-2xl mx-auto mb-8">
          <input 
            type="text" 
            placeholder="Try 'High protein breakfast under Tk 100'..." 
            className="w-full px-6 py-4 rounded-full border-2 border-forestGreen focus:outline-none focus:ring-2 ring-tangerine text-gray-700 shadow-sm"
          />
          <button className="absolute right-2 top-2 bg-tangerine text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition">
            Search
          </button>
        </div>

        {/* Budget Filter */}
        <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="flex justify-between mb-4">
            <span className="text-forestGreen font-bold">Budget Limit</span>
            <span className="text-tangerine font-bold text-lg">Tk {budget}</span>
          </div>
          <input 
            type="range" 
            min="50" 
            max="500" 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)} 
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tangerine"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Tk 50</span>
            <span>Tk 500</span>
          </div>
        </div>
      </section>

      {/* Recipe of the Week (Featured) */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-forestGreen mb-6">Recipe of the Week</h3>
        <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden group cursor-pointer shadow-xl">
          <img src="https://via.placeholder.com/1200x400?text=Featured+Healthy+Meal" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Featured" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 text-white">
            <h4 className="text-3xl font-bold mb-2">Quinoa & Roasted Veggie Bowl</h4>
            <p className="text-sm opacity-90 mb-4">Budget friendly, High Protein, Ready in 20 mins.</p>
            <div className="flex gap-3">
              <span className="bg-tangerine px-3 py-1 rounded-full text-xs font-bold">Tk 110</span>
              <span className="bg-forestGreen px-3 py-1 rounded-full text-xs font-bold">450 kcal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Categories */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-forestGreen">Recommended For You</h3>
          <button className="text-tangerine font-bold text-sm hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingRecipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Floating Pantry Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-tangerine text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold font-poppins">
          <span className="text-2xl">📷</span>
          <span className="hidden md:inline">Scan Pantry</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
