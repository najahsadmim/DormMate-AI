import recipes from '../data/recipes.json';

// CHANGE THIS to your Render URL when deploying, or leave as localhost for local testing
export const API_BASE_URL = 'https://dormmate-ai-backend.onrender.com'; 

const buildImageUrl = (queryText) => {
  if (!queryText) return "https://image.pollinations.ai/prompt/professional-food-photography-healthy-meal-studio-lighting-4k";
  const professionalPrompt = `professional food photography, ${queryText}, high resolution, 4k, studio lighting, bokeh background, appetizing, gourmet, white plate`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(professionalPrompt)}?width=800&height=600&nologo=true`;
};

const RecipeService = {
  getAllRecipes: () => Array.isArray(recipes) ? recipes : [],

  getRecipeById: (id) => {
    if (!id) return null;
    const stringId = String(id);
    const staticRecipe = recipes.find(r => r && String(r.id) === stringId);
    if (staticRecipe) return staticRecipe;

    try {
      const aiCache = JSON.parse(localStorage.getItem('ai_generated_recipes') || '[]');
      return aiCache.find(r => r && String(r.id) === stringId) || null;
    } catch (e) { return null; }
  },

  getFeaturedRecipe: () => recipes.length > 0 ? recipes[Math.floor(Math.random() * recipes.length)] : null,

  filterRecipes: (filters = {}, userProfile = {}) => {
    const f = filters || {};
    const p = userProfile || {};
    if (!Array.isArray(recipes)) return [];

    return recipes.filter(recipe => {
      if (!recipe) return false;
      if (f.maxBudget && recipe.estimatedCost > f.maxBudget) return false;
      if (f.maxCalories && recipe.calories > f.maxCalories) return false;
      if (f.minProtein && recipe.protein < f.minProtein) return false;
      if (f.maxTime && recipe.cookingTime > f.maxTime) return false;

      const tags = recipe.tags || [];
      if (p.dietaryPreferences?.length > 0) {
        if (!p.dietaryPreferences.every(pref => tags.includes(pref))) return false;
      }

      const ingredients = recipe.ingredients || [];
      if (p.allergies) {
        const allergiesList = p.allergies.toLowerCase().split(',').map(a => a.trim());
        if (ingredients.some(ing => allergiesList.some(allergy => String(ing).toLowerCase().includes(allergy)))) return false;
      }

      const recipeEquip = recipe.equipment || [];
      const userEquip = p.equipment || [];
      if (userEquip.length > 0 && !recipeEquip.every(item => userEquip.includes(item))) return false;

      return true;
    });
  },

  // --- AI ENDPOINTS ---

  getAIRecommendations: async (query, userProfile) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, profile: userProfile }),
      });
      if (!response.ok) throw new Error('AI Server Error');
      const data = await response.json(); 

      if (data.type === 'recommendation') {
        return (data.results || []).map(choice => {
          const recipe = RecipeService.getRecipeById(choice.id);
          return recipe ? { ...recipe, aiReason: choice.reason, image: buildImageUrl(recipe.title) } : null;
        }).filter(Boolean);
      }
      if (data.type === 'generated') {
        const newRecipe = data.recipe;
        newRecipe.id = Date.now(); 
        newRecipe.image = buildImageUrl(newRecipe.title);
        const aiCache = JSON.parse(localStorage.getItem('ai_generated_recipes') || '[]');
        localStorage.setItem('ai_generated_recipes', JSON.stringify([...aiCache, newRecipe]));
        return [newRecipe]; 
      }
      return [];
    } catch (error) {
      console.error("AI Error:", error);
      return []; 
    }
  },

  getAIPlan: async (profile) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plan-week`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, duration_days: 7 }),
      });
      if (!response.ok) throw new Error('Planner Error');
      const data = await response.json();
      return data.plan || [];
    } catch (error) {
      console.error("Planning Error:", error);
      return [];
    }
  },

  getAISubstitute: async (ingredient, recipeTitle, profile) => {
    try {
      const response = await fetch(`${API_BASE_URL}/substitute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient, recipe_title: recipeTitle, profile }),
      });
      if (!response.ok) throw new Error('Substitution Error');
      return await response.json();
    } catch (error) {
      console.error("Substitution Error:", error);
      return null;
    }
  },

  scanPantry: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const response = await fetch(`${API_BASE_URL}/scan-pantry`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Vision Server Error');
      const data = await response.json();
      return data.ingredients;
    } catch (error) {
      console.error("Pantry Scan Error:", error);
      throw error;
    }
  }
};

export default RecipeService;
