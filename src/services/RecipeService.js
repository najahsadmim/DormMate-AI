import recipes from '../data/recipes.json';

const RecipeService = {
  getAllRecipes: () => recipes,

  getRecipeById: (id) => {
    if (!id) return null;
    const stringId = String(id);

    // 1. Search static JSON (Convert JSON ids to strings for comparison)
    const staticRecipe = recipes.find(r => String(r.id) === stringId);
    if (staticRecipe) return staticRecipe;

    // 2. Search LocalStorage Cache
    const aiCache = JSON.parse(localStorage.getItem('ai_generated_recipes') || '[]');
    const generatedRecipe = aiCache.find(r => String(r.id) === stringId);
    
    return generatedRecipe || null;
  },

  getFeaturedRecipe: () => recipes[Math.floor(Math.random() * recipes.length)],

  filterRecipes: (filters, userProfile) => {
    // (Keep your existing filter logic here exactly as it was)
    return recipes; 
  },

  getAIRecommendations: async (query, userProfile) => {
    try {
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, profile: userProfile }),
      });

      const data = await response.json();
      
      // Dynamic Image Logic: Pulls a real image from the web based on the query
      const buildImageUrl = (queryText) => {
        if (!queryText) return "https://via.placeholder.com/800x600?text=Yummy+Meal";
        // Use a reliable food image proxy
        return `https://loremflickr.com/800/600/food,${encodeURIComponent(queryText)}`;
      };

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
        // Ensure unique ID
        newRecipe.id = Date.now(); 
        newRecipe.image = buildImageUrl(newRecipe.image_query || newRecipe.title);

        // SAVE TO CACHE IMMEDIATELY
        const aiCache = JSON.parse(localStorage.getItem('ai_generated_recipes') || '[]');
        aiCache.push(newRecipe);
        localStorage.setItem('ai_generated_recipes', JSON.stringify(aiCache));

        return [newRecipe]; 
      }

      return [];
    } catch (error) {
      console.error("AI Error:", error);
      return []; 
    }
  }
};

export default RecipeService;
