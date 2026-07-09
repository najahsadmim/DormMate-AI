import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import AuthInput from '../../components/auth/AuthInput';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email, name: 'Student' }); // Mock login
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-tangerine text-center mb-2">Welcome Back!</h2>
        <p className="text-forestGreen text-center mb-8 font-medium">Log in to your AI cooking assistant</p>
        <form onSubmit={handleLogin}>
          <AuthInput label="Email Address" type="email" placeholder="email@university.edu" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <AuthInput label="Password" type="password" placeholder="••••••••" />
          <button className="w-full bg-forestGreen text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md mt-4">
            Sign In
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6 text-sm">
          Don't have an account? <Link to="/signup" className="text-tangerine font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;