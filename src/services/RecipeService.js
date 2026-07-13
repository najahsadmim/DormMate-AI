import recipes from '../data/recipes.json';

const API_BASE_URL = 'https://dormmate-ai-backend.onrender.com';

const RecipeService = {
  getAllRecipes: () => recipes,
  
  // FIXED: Now handles both database IDs and AI-generated objects
  getRecipeById: (id) => {
    if (!id) return null;
    // If the 'id' passed is actually the whole recipe object (common with AI generation)
    if (typeof id === 'object') return id; 
    
    return recipes.find(recipe => recipe.id === parseInt(id));
  },

  getFeaturedRecipe: () => recipes[Math.floor(Math.random() * recipes.length)],

  filterRecipes: (filters = {}, userProfile = {}) => {
    const f = filters || {};
    const p = userProfile || {};
    return recipes.filter(recipe => {
      if (!recipe) return false;
      if (f.maxBudget && recipe.estimatedCost > f.maxBudget) return false;
      if (f.maxCalories && recipe.calories > f.maxCalories) return false;
      if (f.minProtein && recipe.protein < f.minProtein) return false;
      if (f.maxTime && recipe.cookingTime > f.maxTime) return false;
      const tags = recipe.tags || [];
      if (p.dietaryPreferences && Array.isArray(p.dietaryPreferences) && p.dietaryPreferences.length > 0) {
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
          return recipe ? { ...recipe, aiReason: choice.reason } : null;
        }).filter(Boolean);
      }
      if (data.type === 'generated') {
        // Pass the whole recipe object so getRecipeById doesn't fail
        return [{ ...data.recipe, aiReason: data.recipe.aiReason || "AI Generated" }]; 
      }
      return [];
    } catch (error) {
      console.error("AI Error:", error);
      return []; 
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
