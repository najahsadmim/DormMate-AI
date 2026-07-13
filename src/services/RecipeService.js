import recipes from '../data/recipes.json';

const API_BASE_URL = 'https://dormmate-ai-backend.onrender.com';

const RecipeService = {
  getAllRecipes: () => recipes,
  getRecipeById: (id) => recipes.find(recipe => recipe.id === parseInt(id)),
  getFeaturedRecipe: () => recipes[Math.floor(Math.random() * recipes.length)],

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
      if (p.dietaryPreferences && Array.isArray(p.dietaryPreferences) && p.dietaryPreferences.length > 0) {
        const hasRequiredTag = p.dietaryPreferences.every(pref => tags.includes(pref));
        if (!hasRequiredTag) return false;
      }

      const ingredients = recipe.ingredients || [];
      if (p.allergies) {
        const allergiesList = p.allergies.toLowerCase().split(',').map(a => a.trim());
        const containsAllergy = ingredients.some(ing => 
          allergiesList.some(allergy => String(ing).toLowerCase().includes(allergy))
        );
        if (containsAllergy) return false;
      }

      const recipeEquip = recipe.equipment || [];
      const userEquip = p.equipment || [];
      if (userEquip.length > 0) {
        const hasEquipment = recipeEquip.every(item => userEquip.includes(item));
        if (!hasEquipment) return false;
      }
      return true;
    });
  },

  getAIRecommendations: async (query, userProfile) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommend`, { // FIXED URL
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
        return [data.recipe]; 
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

      const response = await fetch(`${API_BASE_URL}/scan-pantry`, { // FIXED URL
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
