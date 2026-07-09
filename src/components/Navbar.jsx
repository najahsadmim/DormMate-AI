import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { APP_NAME } from '../utils/constants';

const Navbar = () => {
  // Access user state and logout function from Global Context
  const { user, logout } = useContext(UserContext);

  const activeStyle = "text-tangerine font-bold border-b-2 border-tangerine";
  const inactiveStyle = "text-forestGreen font-semibold hover:text-tangerine transition";

  // Unique identity avatar based on email seed
  const avatarUrl = user 
    ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.email)}`
    : null;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-tangerine rounded-full flex items-center justify-center text-white font-bold text-xl">D</div>
        <h1 className="text-2xl font-bold text-tangerine font-poppins">{APP_NAME}</h1>
      </div>

      <div className="hidden md:flex gap-8 items-center">
        <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>Home</NavLink>
        <NavLink to="/search" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>Search</NavLink>
        <NavLink to="/pantry" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>Pantry Scan</NavLink>
        <NavLink to="/saved" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>Saved</NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>Profile</NavLink>

        {/* CONDITIONAL RENDERING: Member vs Guest */}
        {user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
            {/* User Avatar with Link to Profile */}
            <Link to="/profile" className="relative group">
              <img 
                src={avatarUrl} 
                alt="User Profile" 
                className="w-10 h-10 rounded-full border-2 border-tangerine hover:ring-4 ring-tangerine/20 transition-all bg-orange-50"
              />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                My Profile
              </span>
            </Link>
            
            {/* Logout Button */}
            <button 
              onClick={logout}
              className="text-xs font-bold text-gray-400 hover:text-red-500 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          /* GUEST VIEW: Sign In Button now navigates correctly */
          <Link to="/login">
            <button className="bg-forestGreen text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-green-700 transition active:scale-95">
              Sign In
            </button>
          </Link>
        )}
      </div>
      
      {/* Mobile Menu Toggle */}
      <div className="md:hidden text-forestGreen text-2xl cursor-pointer">
        ☰
      </div>
    </nav>
  );
};

export default Navbar;