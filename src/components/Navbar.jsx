import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { APP_NAME } from '../utils/constants';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useContext(UserContext);

  const activeStyle = "text-tangerine font-bold border-b-2 border-tangerine";
  const inactiveStyle = "text-forestGreen font-semibold hover:text-tangerine transition";

  // Default avatar if no image is uploaded
  const avatarUrl = profile?.profilePic || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=F28C28&color=fff`;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-tangerine rounded-full flex items-center justify-center text-white font-bold text-xl">
          D
        </div>
        <h1 className="text-2xl font-bold text-tangerine font-poppins">{APP_NAME}</h1>
      </div>

      <div className="hidden md:flex gap-8 items-center">
        <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
          Home
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
          Search
        </NavLink>
        <NavLink to="/meal-plan" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
          Meal Plan
        </NavLink>
        <NavLink to="/pantry" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
          Pantry Scan
        </NavLink>
        <NavLink to="/saved" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
          Saved Recipes
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
          Profile
        </NavLink>

        {user ? (
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
            {/* USER AVATAR */}
            <div 
              onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-full overflow-hidden cursor-pointer border-2 border-tangerine hover:scale-110 transition"
            >
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-poppins text-xs font-bold hover:bg-red-50 hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="bg-forestGreen text-white px-5 py-2 rounded-full font-poppins text-sm font-bold hover:bg-green-700 transition"
          >
            Sign In
          </button>
        )}
      </div>
      
      <div className="md:hidden text-forestGreen text-2xl cursor-pointer">☰</div>
    </nav>
  );
};

export default Navbar;
