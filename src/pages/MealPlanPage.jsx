import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { API_BASE_URL } from '../services/RecipeService'; 

const MealPlanPage = () => {
  const { profile, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePlan = async () => {
    setIsLoading(true);
    
    // 1. Define the final URL clearly
    const finalUrl = `${API_BASE_URL}/plan-week`;
    console.log("Requesting meal plan from:", finalUrl);

    try {
      // 2. Ensure the payload matches the Python "PlanRequest" model exactly
      const payload = {
        profile: profile || {}, 
        duration_days: 7
      };

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // 3. Debugging: Log the status code if it fails
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server Error (${response.status}):`, errorText);
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      console.log("AI Response received:", data);

      // 4. Handle different JSON structures (Some AIs wrap results in 'plan', some don't)
      if (data && data.plan) {
        setPlan(data.plan);
      } else if (Array.isArray(data)) {
        setPlan(data);
      } else {
        throw new Error("AI returned data, but it wasn't in the expected list format.");
      }

    } catch (e) {
      console.error("Detailed Planning Error:", e);
      // We give the user a more helpful alert
      alert(`Error: ${e.message}. Check the browser console for details!`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMealClick = (meal) => {
    if (meal.id) {
      navigate(`/recipe/${meal.id}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(meal.meal)}&ai=true`);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center font-poppins px-6">
        <h2 className="text-3xl font-bold text-tangerine mb-4">Please Sign In</h2>
        <a href="/login" className="bg-forestGreen text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition">Login Now</a>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto font-poppins">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-tangerine mb-4">AI Weekly Planner</h2>
        <p className="text-forestGreen font-semibold mb-8">
          Customized for your {profile?.nutritionGoal || 'health'} goal.
        </p>
        
        <button 
          onClick={generatePlan}
          disabled={isLoading}
          className="bg-forestGreen text-white px-10 py-4 rounded-full font-bold hover:bg-green-700 transition shadow-lg disabled:opacity-50 flex items-center gap-2 mx-auto"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">🌀</span> Thinking...
            </>
          ) : (
            <>
              <span>✨</span> Generate My Week
            </>
          )}
        </button>
      </div>

      {plan && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {plan.map((day, i) => (
            <div 
              key={i} 
              onClick={() => handleMealClick(day)}
              className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-t-4 border-t-tangerine group"
            >
              <h4 className="text-tangerine font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
                {day.day}
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-forestGreen font-bold text-sm leading-tight group-hover:text-tangerine transition-colors">
                    {day.meal}
                  </p>
                  <p className="text-gray-400 text-[10px] font-semibold">Tk {day.cost}</p>
                </div>
                <p className="text-gray-500 text-[11px] italic leading-relaxed">
                  {day.reason}
                </p>
              </div>
              <div className="mt-4 text-center">
                <span className="text-tangerine text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  View Recipe →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!plan && !isLoading && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">📅</div>
          <p className="text-gray-400 italic">Click the button above to let Gemma 4 plan your week!</p>
        </div>
      )}
    </div>
  );
};

export default MealPlanPage;
