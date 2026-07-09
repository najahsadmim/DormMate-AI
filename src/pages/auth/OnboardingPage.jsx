import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { DIETARY_TAGS } from '../../utils/constants';

const OnboardingPage = () => {
  const { profile, updateProfile } = useContext(UserContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const finalizeOnboarding = () => {
    updateProfile(profile);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12">
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2 rounded-full mb-12 overflow-hidden">
          <div 
            className="bg-tangerine h-full transition-all duration-500" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-tangerine mb-4">Dietary & Religious Needs</h2>
            <p className="text-forestGreen mb-8 font-medium">We ensure every recipe respects your beliefs and health.</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {DIETARY_TAGS.map(tag => (
                <button 
                  key={tag}
                  onClick={() => {
                    const current = profile.dietaryPreferences;
                    const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
                    updateProfile({...profile, dietaryPreferences: next});
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all text-left font-semibold ${
                    profile.dietaryPreferences.includes(tag) 
                    ? 'border-tangerine bg-orange-50 text-tangerine' 
                    : 'border-gray-100 text-gray-600 hover:border-forestGreen'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-tangerine mb-4">Health & Allergies</h2>
            <p className="text-forestGreen mb-8 font-medium">Your safety is our priority. Tell us what to avoid.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-forestGreen font-bold mb-2">Allergies (e.g. Peanuts, Shellfish)</label>
                <input 
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50"
                  value={profile.allergies}
                  onChange={(e) => updateProfile({...profile, allergies: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-forestGreen font-bold mb-2">Medical Conditions (e.g. Diabetes, Hypertension)</label>
                <input 
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50"
                  value={profile.medicalConditions}
                  onChange={(e) => updateProfile({...profile, medicalConditions: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-tangerine mb-4">Budget & Goals</h2>
            <p className="text-forestGreen mb-8 font-medium">Let's make sure the meals are affordable and fit your goals.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-forestGreen font-bold mb-2">Nutrition Goal</label>
                <select 
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 ring-tangerine bg-gray-50"
                  value={profile.nutritionGoal}
                  onChange={(e) => updateProfile({...profile, nutritionGoal: e.target.value})}
                >
                  <option value="">Select a goal</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="balanced">Balanced Diet</option>
                  <option value="budget-first">Maximum Savings</option>
                </select>
              </div>
              <div>
                <label className="block text-forestGreen font-bold mb-2">Cooking Skill</label>
                <div className="flex gap-3">
                  {['beginner', 'intermediate', 'advanced'].map(skill => (
                    <button 
                      key={skill}
                      onClick={() => updateProfile({...profile, cookingSkill: skill})}
                      className={`flex-1 py-3 rounded-xl border-2 capitalize font-bold transition-all ${
                        profile.cookingSkill === skill ? 'border-tangerine bg-orange-50 text-tangerine' : 'border-gray-100 text-gray-400'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fadeIn text-center">
            <div className="text-6xl mb-6">🍳</div>
            <h2 className="text-3xl font-bold text-tangerine mb-4">You're All Set!</h2>
            <p className="text-forestGreen mb-8 font-medium">DormMate AI now knows exactly how to help you cook smarter and eat better.</p>
            <button 
              onClick={finalizeOnboarding}
              className="w-full bg-forestGreen text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg"
            >
              Start Cooking!
            </button>
          </div>
        )}

        {step < 4 && (
          <div className="flex justify-between mt-12">
            <button onClick={handleBack} disabled={step === 1} className={`font-bold ${step === 1 ? 'invisible' : 'text-gray-400 hover:text-forestGreen'}`}>
              Back
            </button>
            <button onClick={handleNext} className="bg-tangerine text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all">
              Next Step
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default OnboardingPage;