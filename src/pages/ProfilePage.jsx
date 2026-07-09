import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { KITCHEN_EQUIPMENT } from '../utils/constants';

const ProfilePage = () => {
  const { profile, updateProfile, user } = useContext(UserContext);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.username || user?.name || '');

  // 1. Safety Check: Ensure user is logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center font-poppins">
        <h2 className="text-3xl font-bold text-tangerine mb-4">Please Log In</h2>
        <p className="text-forestGreen mb-8">You need to be signed in to manage your profile.</p>
        <a href="/login" className="bg-forestGreen text-white px-6 py-3 rounded-full font-bold">Go to Login</a>
      </div>
    );
  }

  // 2. FIXED: Defensive Input Handler
  // We use "value || ''" to ensure we never save 'undefined' or 'null' into the global state,
  // which is a common cause of UI crashes in React.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateProfile({ ...profile, [name]: value || '' });
  };

  const saveName = () => {
    updateProfile({ ...profile, username: tempName });
    setIsEditingName(false);
  };

  const cancelEdit = () => {
    setTempName(profile.username || user.name || '');
    setIsEditingName(false);
  };

  return (
    <div className="px-6 py-12 max-w-2xl mx-auto font-poppins">
      <h2 className="text-4xl font-bold text-tangerine mb-2">My Profile</h2>
      <p className="text-forestGreen font-semibold mb-8">Personalize your AI experience.</p>

      <div className="bg-white shadow-md rounded-3xl p-8 border border-gray-100 space-y-6">
        
        {/* IDENTITY HEADER */}
        <div className="flex flex-col items-center text-center mb-10 pb-8 border-b border-gray-100">
          <div className="relative group mb-4">
            <div className="w-24 h-24 bg-tangerine rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white ring-4 ring-tangerine/20">
              { (profile.username || user.name)?.charAt(0).toUpperCase() }
            </div>
            <div className="absolute bottom-0 right-0 bg-forestGreen text-white p-2 rounded-full text-xs shadow-lg">
              ✓
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            {isEditingName ? (
              <div className="flex items-center gap-2 animate-fadeIn">
                <span className="text-gray-400 font-bold">@</span>
                <input 
                  type="text" 
                  className="text-2xl font-bold text-forestGreen border-b-2 border-tangerine outline-none bg-transparent w-48 text-center"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  autoFocus
                />
                <button onClick={saveName} className="text-green-500 hover:scale-125 transition">✅</button>
                <button onClick={cancelEdit} className="text-red-500 hover:scale-125 transition">❌</button>
              </div>
            ) : (
              <div className="flex items-center gap-3 group">
                <h3 className="text-2xl font-bold text-forestGreen">
                  {profile.username ? `@${profile.username}` : user.name}
                </h3>
                <button 
                  onClick={() => {
                    setTempName(profile.username || user.name || '');
                    setIsEditingName(true);
                  }}
                  className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-tangerine hover:bg-orange-50 transition-all opacity-0 group-hover:opacity-100"
                  title="Edit Name"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-2">Your unique identity across DormMate AI</p>
        </div>

        {/* DIETARY & HEALTH SECTION */}
        <div className="space-y-6">
          <h4 className="text-sm uppercase tracking-widest font-bold text-gray-400 border-l-4 border-tangerine pl-3 mb-4">
            Dietary & Health
          </h4>
          
          <div>
            <label className="block text-forestGreen font-bold mb-2">Dietary Preferences</label>
            <input 
              type="text" 
              name="dietaryPreferences"
              placeholder="e.g. Halal, Vegan" 
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50 transition-all" 
              // We handle both the Onboarding Array and the Profile String here
              value={Array.isArray(profile.dietaryPreferences) ? profile.dietaryPreferences.join(', ') : profile.dietaryPreferences || ''}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-forestGreen font-bold mb-2">Allergies</label>
            <input 
              type="text" 
              name="allergies"
              placeholder="e.g. Peanuts, Seafood" 
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50 transition-all" 
              value={profile.allergies || ''}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-forestGreen font-bold mb-2">Medical Conditions</label>
            <input 
              type="text" 
              name="medicalConditions"
              placeholder="e.g. Diabetes" 
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50 transition-all" 
              value={profile.medicalConditions || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* KITCHEN TOOLS SECTION */}
        <div className="pt-6">
          <h4 className="text-sm uppercase tracking-widest font-bold text-gray-400 border-l-4 border-tangerine pl-3 mb-4">
            Kitchen Tools
          </h4>
          <div className="flex flex-wrap gap-3">
            {KITCHEN_EQUIPMENT.map(item => (
              <button 
                key={item}
                onClick={() => {
                  const current = profile.equipment || [];
                  const next = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
                  updateProfile({...profile, equipment: next});
                }}
                className={`px-4 py-2 rounded-full border-2 text-xs font-bold transition-all ${
                  profile.equipment?.includes(item) 
                  ? 'border-tangerine bg-orange-50 text-tangerine' 
                  : 'border-gray-100 text-gray-400 bg-gray-50 hover:border-forestGreen'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* FINANCIALS SECTION */}
        <div className="pt-6">
          <h4 className="text-sm uppercase tracking-widest font-bold text-gray-400 border-l-4 border-tangerine pl-3 mb-4">
            Financials
          </h4>
          <div>
            <label className="block text-forestGreen font-bold mb-2">Average Daily Budget (Tk)</label>
            <input 
              type="number" 
              name="budgetPreference"
              placeholder="Tk" 
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50 transition-all" 
              value={profile.budgetPreference || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="pt-6">
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
            <p className="text-xs text-tangerine font-bold italic">
              ✨ Your preferences are synced in real-time with the AI assistant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;