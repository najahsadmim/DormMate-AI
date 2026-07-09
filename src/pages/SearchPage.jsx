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

  // Get filtered recipes based on UI filters AND User Profile
  const filteredRecipes = RecipeService.filterRecipes(filters, profile).filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto font-poppins">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-tangerine mb-4">Explore Recipes</h2>
        <div className="relative max-w-xl mx-auto">
          <input 
            type="text" 
            placeholder="Search by ingredient or tag (e.g. 'Chicken' or 'Cheap')..." 
            className="w-full px-6 py-4 rounded-full border-2 border-forestGreen outline-none focus:ring-2 ring-tangerine shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar: Filters */}
        <div className="w-full md:w-1/4">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>

        {/* Right Area: Recipe Grid */}
        <div className="w-full md:w-3/4">
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg italic">No recipes match your current filters and profile.</p>
              <p className="text-forestGreen font-bold mt-2">Try adjusting your budget or calories!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;