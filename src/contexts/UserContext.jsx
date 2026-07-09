import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    religion: '',
    dietaryPreferences: [],
    allergies: '',
    medicalConditions: '',
    nutritionGoal: '',
    budgetPreference: 'medium',
    cookingSkill: 'beginner',
    equipment: [],
  });

  // Load user data from local storage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('dormmate_user');
    const savedProfile = localStorage.getItem('dormmate_profile');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('dormmate_user', JSON.stringify(userData));
  };

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('dormmate_profile', JSON.stringify(newProfile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dormmate_user');
    localStorage.removeItem('dormmate_profile');
  };

  return (
    <UserContext.Provider value={{ user, setUser, profile, setProfile, login, updateProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};