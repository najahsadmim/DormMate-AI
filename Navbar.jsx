import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-tangerine rounded-full flex items-center justify-center text-white font-bold text-xl">
          {/* Logo */}
          L
        </div>
        <h1 className="text-2xl font-bold text-tangerine font-poppins">DormMate AI</h1>
      </div>
      <div className="hidden md:flex gap-6 text-forestGreen font-semibold font-poppins">
        <a href="#" className="hover:text-tangerine transition">Home</a>
        <a href="#" className="hover:text-tangerine transition">Search</a>
        <a href="#" className="hover:text-tangerine transition">Pantry Scan</a>
        <a href="#" className="hover:text-tangerine transition">Profile</a>
      </div>
      <button className="bg-forestGreen text-white px-4 py-2 rounded-full font-poppins text-sm">Sign In</button>
    </nav>
  );
};

export default Navbar;
