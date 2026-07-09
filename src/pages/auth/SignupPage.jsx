import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import AuthInput from '../../components/auth/AuthInput';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.email || !formData.fullName) {
      alert("Please fill in all required fields.");
      return;
    }

    // 1. Log the user in (Mocking account creation)
    login({ 
      email: formData.email, 
      name: formData.fullName 
    });

    // 2. CRITICAL: Navigate to Onboarding, NOT Home.
    // New users MUST set their dietary preferences first.
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-tangerine text-center mb-2">Create Account</h2>
        <p className="text-forestGreen text-center mb-8 font-medium">Join DormMate AI and start eating better!</p>
        
        <form onSubmit={handleSignup}>
          <AuthInput 
            label="Full Name" 
            name="fullName" 
            placeholder="John Doe" 
            value={formData.fullName} 
            onChange={handleChange} 
          />
          <AuthInput 
            label="Email Address" 
            type="email" 
            name="email" 
            placeholder="email@university.edu" 
            value={formData.email} 
            onChange={handleChange} 
          />
          <AuthInput 
            label="Password" 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            value={formData.password} 
            onChange={handleChange} 
          />
          <AuthInput 
            label="Confirm Password" 
            type="password" 
            name="confirmPassword" 
            placeholder="••••••••" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
          />
          
          <button className="w-full bg-forestGreen text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md mt-4">
            Create Account
          </button>
        </form>
        
        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-tangerine font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;