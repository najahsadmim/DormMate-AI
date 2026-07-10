import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { KITCHEN_EQUIPMENT } from '../utils/constants';

const ProfilePage = () => {
  const { profile, updateProfile, user } = useContext(UserContext);
  
  // FIX: Use optional chaining (?.) and a fallback to prevent the "White Screen of Death"
  // This ensures that if user is null, it doesn't crash; it just starts with an empty string.
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  // We use useEffect to set the tempName ONLY after the user is confirmed to exist
  useEffect(() => {
    if (user || profile) {
      setTempName(profile?.username || user?.name || '');
    }
  }, [user, profile]);

  // 1. The Guard Clause: This MUST come before any logic that assumes user exists
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center font-poppins">
        <h2 className="text-3xl font-bold text-tangerine mb-4">Please Log In</h2>
        <p className="text-forestGreen mb-8">You need to be signed in to manage your profile.</p>
        <a href="/login" className="bg-forestGreen text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition">
          Go to Login
        </a>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateProfile({ ...profile, [name]: value });
  };

  const saveName = () => {
    updateProfile({ ...profile, username: tempName });
    setIsEditingName(false);
  };

  // Safe Avatar Logic
  const avatarUrl = profile?.profilePic || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=F28C28&color=fff`;

  return (
    <div className="px-6 py-12 max-w-2xl mx-auto font-poppins">
      <h2 className="text-4xl font-bold text-tangerine mb-2">My Profile</h2>
      <p className="text-forestGreen font-semibold mb-8">Personalize your AI experience.</p>
      
      <div className="bg-white shadow-md rounded-3xl p-8 border border-gray-100 space-y-6">
        
        {/* IDENTITY HEADER */}
        <div className="flex flex-col items-center text-center mb-10 pb-8 border-b border-gray-100">
          <div className="relative group mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white ring-4 ring-tangerine/20 shadow-xl">
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
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
                  className="text-2xl font-bold text-forestGreen border-b-2 border-tangerine outline-none bg-transparent text-center"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  autoFocus
                />
                <button onClick={saveName} className="text-green-500 hover:scale-125 transition">✅</button>
                <button onClick={() => setIsEditingName(false)} className="text-red-500 hover:scale-125 transition">❌</button>
              </div>
            ) : (
              <div className="flex items-center gap-3 group">
                <h3 className="text-2xl font-bold text-forestGreen">
                  {profile?.username ? `@${profile.username}` : user?.name}
                </h3>
                <button 
                  onClick={() => setIsEditingName(true)} 
                  className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-tangerine hover:bg-orange-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ACCOUNT IDENTITY SECTION */}
        <div className="space-y-6">
          <h4 className="text-sm uppercase tracking-widest font-bold text-gray-400 border-l-4 border-tangerine pl-3 mb-4">
            Account Identity
          </h4>
          <div>
            <label className="block text-forestGreen font-bold mb-2">Profile Picture URL</label>
            <input 
              type="text" 
              name="profilePic"
              placeholder="Paste an image link (jpg, png)..." 
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50 transition-all" 
              value={profile?.profilePic || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* HEALTH & GOALS SECTION */}
        <div className="space-y-6 pt-6">
          <h4 className="text-sm uppercase tracking-widest font-bold text-gray-400 border-l-4 border-tangerine pl-3 mb-4">
            Dietary & Health
          </h4>
          <div>
            <label className="block text-forestGreen font-bold mb-2">Nutrition Goal</label>
            <select 
              name="nutritionGoal"
              value={profile?.nutritionGoal || ""} 
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50 transition-all"
            >
              <option value="">Select a goal</option>
              <option value="muscle-gain">Muscle Gain (High Protein)</option>
              <option value="weight-loss">Weight Loss (Low Calorie)</option>
              <option value="balanced">Balanced Diet</option>
              <option value="budget-first">Maximum Savings</option>
            </select>
          </div>

          <div>
            <label className="block text-forestGreen font-bold mb-2">Dietary Preferences</label>
            <input 
              type="text" 
              name="dietaryPreferences"
              placeholder="e.g. Halal, Vegan" 
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50 transition-all" 
              value={profile?.dietaryPreferences || ''}
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
              value={profile?.allergies || ''}
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
                  const current = profile?.equipment || [];
                  const next = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
                  updateProfile({...profile, equipment: next});
                }}
                className={`px-4 py-2 rounded-full border-2 text-xs font-bold transition-all ${
                  profile?.equipment?.includes(item) ? 'border-tangerine bg-orange-50 text-tangerine' : 'border-gray-100 text-gray-400 bg-gray-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* BUDGET SECTION */}
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
              value={profile?.budgetPreference || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
