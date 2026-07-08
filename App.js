import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PantryPage from './pages/PantryPage';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
import RecipeDetails from './pages/RecipeDetails';

function App() {
  return (
    <Router>
      <div className="App bg-white min-h-screen">
        {/* Persistent Navbar across all routes */}
        <Navbar />
        
        {/* Dynamic Page Content */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/pantry" element={<PantryPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
