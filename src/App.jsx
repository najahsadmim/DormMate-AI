import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; // Import Provider

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PantryPage from './pages/PantryPage';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
import RecipeDetails from './pages/RecipeDetails';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OnboardingPage from './pages/auth/OnboardingPage';

function App() {
  return (
    <UserProvider> {/* Wrap the entire app in the User Context */}
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/pantry" element={<PantryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}
export default App;