import recipes from '../data/recipes.json';

const RecipeService = {
  getAllRecipes: () => recipes,
  getRecipeById: (id) => recipes.find(recipe => recipe.id === parseInt(id)),
  getFeaturedRecipe: () => recipes[Math.floor(Math.random() * recipes.length)],

  filterRecipes: (filters, userProfile) => {
    return recipes.filter(recipe => {
      // 1. Budget Filter
      if (filters.maxBudget && recipe.estimatedCost > filters.maxBudget) return false;

      // 2. Calorie Filter
      if (filters.maxCalories && recipe.calories > filters.maxCalories) return false;

      // 3. Protein Filter
      if (filters.minProtein && recipe.protein < filters.minProtein) return false;

      // 4. Cooking Time Filter
      if (filters.maxTime && recipe.cookingTime > filters.maxTime) return false;

      // --- FIXED: Dietary/Religious Restrictions ---
      if (userProfile.dietaryPreferences) {
        // Convert string "Halal, Vegan" into array ['Halal', 'Vegan'] if necessary
        const preferences = Array.isArray(userProfile.dietaryPreferences) 
          ? userProfile.dietaryPreferences 
          : userProfile.dietaryPreferences.split(',').map(p => p.trim()).filter(p => p !== "");

        if (preferences.length > 0) {
          const hasRequiredTag = preferences.every(pref => 
            recipe.tags.some(tag => tag.toLowerCase().includes(pref.toLowerCase()))
          );
          if (!hasRequiredTag) return false;
        }
      }

      // --- FIXED: Allergy Filter ---
      if (userProfile.allergies && typeof userProfile.allergies === 'string') {
        const allergiesList = userProfile.allergies.toLowerCase().split(',').map(a => a.trim()).filter(a => a !== "");
        const containsAllergy = recipe.ingredients.some(ing => 
          allergiesList.some(allergy => ing.toLowerCase().includes(allergy))
        );
        if (containsAllergy) return false;
      }

      // 5. Equipment Filter
      if (userProfile.equipment && userProfile.equipment.length > 0) {
        const hasEquipment = recipe.equipment.every(item => 
          userProfile.equipment.includes(item)
        );
        if (!hasEquipment) return false;
      }

      return true;
    });
  }
};

export default RecipeService;