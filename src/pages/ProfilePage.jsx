import React from 'react';

const ProfilePage = () => {
  return (
    <div className="px-6 py-12 max-w-2xl mx-auto font-poppins">
      <h2 className="text-4xl font-bold text-tangerine mb-2">My Profile</h2>
      <p className="text-forestGreen font-semibold mb-8">Personalize your AI experience.</p>
      
      <div className="bg-white shadow-md rounded-3xl p-8 border border-gray-100 space-y-6">
        <div>
          <label className="block text-forestGreen font-bold mb-2">Dietary Preferences</label>
          <input type="text" placeholder="e.g. Halal, Vegan" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine" />
        </div>
        <div>
          <label className="block text-forestGreen font-bold mb-2">Allergies</label>
          <input type="text" placeholder="e.g. Peanuts, Seafood" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine" />
        </div>
        <div>
          <label className="block text-forestGreen font-bold mb-2">Average Daily Budget</label>
          <input type="number" placeholder="Tk" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine" />
        </div>
        <button className="w-full bg-forestGreen text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
