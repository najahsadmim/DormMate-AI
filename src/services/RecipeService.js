import recipes from '../data/recipes.json';

/**
 * IMAGE ENGINE: Generates a professional AI image URL.
 */
const buildImageUrl = (queryText) => {
  if (!queryText) {
    return "https://image.pollinations.ai/prompt/professional-food-photography-healthy-meal-studio-lighting-4k";
  }
  const professionalPrompt = `professional food photography, ${queryText}, high resolution, 4k, studio lighting, bokeh background, appetizing, gourmet, white plate`;
  const encodedPrompt = encodeURIComponent(professionalPrompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true`;
};

const RecipeService = {
  getAllRecipes: () => {
    return Array.isArray(recipes) ? recipes : [];
  },

  getRecipeById: (id) => {
    if (!id) return null;
    const stringId = String(id);

    // 1. Search static JSON
    const staticRecipe = recipes.find(r => r && String(r.id) === stringId);
    if (staticRecipe) return staticRecipe;

    // 2. Search AI-Generated Cache
    try {
      const aiCache = JSON.parse(localStorage.getItem('ai_generated_recipes') || '[]');
      if (Array.isArray(aiCache)) {
        const generatedRecipe = aiCache.find(r => r && String(r.id) === stringId);
        if (generatedRecipe) return generatedRecipe;
      }
    } catch (e) {
      console.error("Cache read error", e);
    }
    
    return null;
  },

  getFeaturedRecipe: () => {
    if (!recipes || recipes.length === 0) return null;
    return recipes[Math.floor(Math.random() * recipes.length)];
  },

  filterRecipes: (filters = {}, userProfile = {}) => {
    const f = filters || {};
    const p = userProfile || {};

    // Safety check: Ensure recipes is an array
    if (!Array.isArray(recipes)) return [];

    return recipes.filter(recipe => {
      if (!recipe) return false;

      // UI-based filters
      if (f.maxBudget && recipe.estimatedCost > f.maxBudget) return false;
      if (f.maxCalories && recipe.calories > f.maxCalories) return false;
      if (f.minProtein && recipe.protein < f.minProtein) return false;
      if (f.maxTime && recipe.cookingTime > f.maxTime) return false;

      // Profile-based: Dietary Preferences (Defensive check for .tags)
      const tags = recipe.tags || [];
      if (p.dietaryPreferences && Array.isArray(p.dietaryPreferences) && p.dietaryPreferences.length > 0) {
        const hasRequiredTag = p.dietaryPreferences.every(pref => tags.includes(pref));
        if (!hasRequiredTag) return false;
      }

      // Profile-based: Allergies (Defensive check for .ingredients)
      const ingredients = recipe.ingredients || [];
      if (p.allergies) {
        const allergiesList = p.allergies.toLowerCase().split(',').map(a => a.trim());
        const containsAllergy = ingredients.some(ing => 
          allergiesList.some(allergy => String(ing).toLowerCase().includes(allergy))
        );
        if (containsAllergy) return false;
      }

      // Profile-based: Equipment (Defensive check for .equipment)
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
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, profile: userProfile }),
      });

      if (!response.ok) throw new Error('AI Server Error');
      const data = await response.json(); 

      if (data.type === 'recommendation') {
        return (data.results || []).map(choice => {
          const recipe = RecipeService.getRecipeById(choice.id);
          if (!recipe) return null;
          return { 
            ...recipe, 
            aiReason: choice.reason, 
            image: buildImageUrl(choice.image_query || recipe.title) 
          };
        }).filter(Boolean);
      }

      if (data.type === 'generated') {
        const newRecipe = data.recipe;
        newRecipe.id = Date.now(); 
        newRecipe.image = buildImageUrl(newRecipe.image_query || newRecipe.title);

        const aiCache = JSON.parse(localStorage.getItem('ai_generated_recipes') || '[]');
        const updatedCache = Array.isArray(aiCache) ? [...aiCache, newRecipe] : [newRecipe];
        localStorage.setItem('ai_generated_recipes', JSON.stringify(updatedCache));

        return [newRecipe]; 
      }

      return [];
    } catch (error) {
      console.error("AI Service Error:", error);
      return []; 
    }
  }
};

export default RecipeService;
