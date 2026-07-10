import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 1. User Authentication State
  const [user, setUser] = useState(null);
  
  // 2. Personalized Profile State
  const [profile, setProfile] = useState({
    username: '',
    profilePic: '',
    religion: '',
    dietaryPreferences: [],
    allergies: '',
    medicalConditions: '',
    nutritionGoal: '',
    budgetPreference: 'medium',
    cookingSkill: 'beginner',
    equipment: [],
  });

  // 3. Saved Recipes State (The Personal Cookbook)
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Load all data from localStorage on app launch
  useEffect(() => {
    const savedUser = localStorage.getItem('dormmate_user');
    const savedProfile = localStorage.getItem('dormmate_profile');
    const savedBook = localStorage.getItem('dormmate_saved');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedBook) setSavedRecipes(JSON.parse(savedBook));
  }, []);

  // Auth Actions
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('dormmate_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dormmate_user');
    localStorage.removeItem('dormmate_profile');
    localStorage.removeItem('dormmate_saved');
  };

  // Profile Actions
  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('dormmate_profile', JSON.stringify(newProfile));
  };

  // Saved Recipes Actions
  const toggleSaveRecipe = (recipeId) => {
    setSavedRecipes(prev => {
      const isSaved = prev.includes(recipeId);
      const updated = isSaved 
        ? prev.filter(id => id !== recipeId) // Remove if already saved
        : [...prev, recipeId];               // Add if not saved
      
      localStorage.setItem('dormmate_saved', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ 
      user, setUser, 
      profile, setProfile, 
      login, updateProfile, logout, 
      savedRecipes, toggleSaveRecipe 
    }}>
      {children}
    </UserContext.Provider>
  );
};
