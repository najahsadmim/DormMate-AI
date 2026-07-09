import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const ProfilePage = () => {
  // Connect to the Global State
  const { profile, updateProfile, user } = useContext(UserContext);

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-tangerine">Please log in to view your profile</h2>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update only the specific field that changed
    updateProfile({ ...profile, [name]: value });
  };

  return (
    <div className="px-6 py-12 max-w-2xl mx-auto font-poppins">
      <h2 className="text-4xl font-bold text-tangerine mb-2">My Profile</h2>
      <p className="text-forestGreen font-semibold mb-8">Personalize your AI experience.</p>
      
      <div className="bg-white shadow-md rounded-3xl p-8 border border-gray-100 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-tangerine rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-gray-500 text-sm">Welcome back,</p>
            <p className="text-xl font-bold text-forestGreen">{user.name}</p>
          </div>
        </div>

        {/* Dietary Preferences - Using the existing state */}
        <div>
          <label className="block text-forestGreen font-bold mb-2">Dietary Preferences</label>
          <input 
            type="text" 
            name="dietaryPreferences"
            placeholder="e.g. Halal, Vegan" 
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50" 
            value={Array.isArray(profile.dietaryPreferences) ? profile.dietaryPreferences.join(', ') : profile.dietaryPreferences}
            onChange={handleInputChange}
          />
        </div>

        {/* Allergies - Linked to state */}
        <div>
          <label className="block text-forestGreen font-bold mb-2">Allergies</label>
          <input 
            type="text" 
            name="allergies"
            placeholder="e.g. Peanuts, Seafood" 
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50" 
            value={profile.allergies}
            onChange={handleInputChange}
          />
        </div>

        {/* Medical Conditions - Linked to state */}
        <div>
          <label className="block text-forestGreen font-bold mb-2">Medical Conditions</label>
          <input 
            type="text" 
            name="medicalConditions"
            placeholder="e.g. Diabetes" 
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50" 
            value={profile.medicalConditions}
            onChange={handleInputChange}
          />
        </div>

        {/* Budget - Linked to state */}
        <div>
          <label className="block text-forestGreen font-bold mb-2">Average Daily Budget (Tk)</label>
          <input 
            type="number" 
            name="budgetPreference"
            placeholder="Tk" 
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50" 
            value={profile.budgetPreference}
            onChange={handleInputChange}
          />
        </div>

        <div className="pt-4">
          <p className="text-center text-xs text-gray-400 font-medium">
            Changes are saved automatically to your profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;