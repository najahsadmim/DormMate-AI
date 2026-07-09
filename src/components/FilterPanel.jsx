import React from 'react';

const FilterPanel = ({ filters, setFilters }) => {
  const handleSliderChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  return (
    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 h-fit sticky top-24">
      <h3 className="text-xl font-bold text-forestGreen mb-6 font-poppins">Filters</h3>
      
      <div className="space-y-8">
        {/* Budget Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-gray-600">Max Budget</label>
            <span className="text-tangerine font-bold">Tk {filters.maxBudget}</span>
          </div>
          <input 
            type="range" min="50" max="500" step="10"
            value={filters.maxBudget} 
            onChange={(e) => handleSliderChange('maxBudget', e.target.value)}
            className="w-full accent-tangerine"
          />
        </div>

        {/* Calorie Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-gray-600">Max Calories</label>
            <span className="text-tangerine font-bold">{filters.maxCalories} kcal</span>
          </div>
          <input 
            type="range" min="100" max="1000" step="50"
            value={filters.maxCalories} 
            onChange={(e) => handleSliderChange('maxCalories', e.target.value)}
            className="w-full accent-tangerine"
          />
        </div>

        {/* Protein Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-gray-600">Min Protein</label>
            <span className="text-tangerine font-bold">{filters.minProtein}g</span>
          </div>
          <input 
            type="range" min="0" max="50" step="1"
            value={filters.minProtein} 
            onChange={(e) => handleSliderChange('minProtein', e.target.value)}
            className="w-full accent-tangerine"
          />
        </div>

        {/* Time Filter */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-gray-600">Max Time</label>
            <span className="text-tangerine font-bold">{filters.maxTime} min</span>
          </div>
          <input 
            type="range" min="5" max="60" step="5"
            value={filters.maxTime} 
            onChange={(e) => handleSliderChange('maxTime', e.target.value)}
            className="w-full accent-tangerine"
          />
        </div>

        <button 
          onClick={() => setFilters({ maxBudget: 500, maxCalories: 1000, minProtein: 0, maxTime: 60 })}
          className="w-full py-2 text-sm text-gray-500 font-semibold hover:text-tangerine transition"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;