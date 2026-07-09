import React from 'react';
import { NavLink } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';

const Navbar = () => {
  const activeStyle = "text-tangerine font-bold border-b-2 border-tangerine";
  const inactiveStyle = "text-forestGreen font-semibold hover:text-tangerine transition";

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
        <button className="bg-forestGreen text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-green-700 transition">Sign In</button>
      </div>
    </nav>
  );
};
export default Navbar;