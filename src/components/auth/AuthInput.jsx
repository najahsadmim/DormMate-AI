import React from 'react';

const AuthInput = ({ label, type = "text", placeholder, value, onChange, name }) => {
  return (
    <div className="w-full mb-4">
      <label className="block text-forestGreen font-bold mb-2 text-sm ml-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine transition-all bg-gray-50"
      />
    </div>
  );
};

export default AuthInput;