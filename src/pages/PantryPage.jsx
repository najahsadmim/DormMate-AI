import React, { useState, useRef } from 'react'; // Added useRef
import { useNavigate } from 'react-router-dom';
import RecipeService from '../services/RecipeService';

const PantryPage = () => {
  const navigate = useNavigate();
  
  // FIX: Create a reference to the hidden file input
  const fileInputRef = useRef(null); 

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // This function is triggered when the user actually selects a file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // FIX: Manual trigger for the file upload
  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically clicks the hidden input
    }
  };

  const scanPantry = async () => {
    if (!image) return alert("Please upload a photo first!");
    
    setIsLoading(true);
    try {
      const ingredients = await RecipeService.scanPantry(image);
      setDetectedIngredients(ingredients);
    } catch (e) {
      alert("AI failed to analyze the image. Please try a clearer photo.");
    } finally {
      setIsLoading(false);
    }
  };

  const findRecipes = () => {
    const query = `I have these ingredients: ${detectedIngredients.join(', ')}. What can I cook?`;
    navigate(`/search?q=${encodeURIComponent(query)}&ai=true`);
  };

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto font-poppins">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-tangerine mb-4">AI Pantry Scanner</h2>
        <p className="text-forestGreen font-semibold mb-8">
          Snap a photo of your ingredients, and let Gemma suggest the meal.
        </p>
        
        <div className="relative max-w-md mx-auto">
          {/* HIDDEN INPUT: We use ref instead of id */}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="hidden" 
            ref={fileInputRef} 
          />

          {/* CLICKABLE AREA: Now uses onClick instead of htmlFor */}
          <div 
            onClick={triggerUpload}
            className="cursor-pointer flex flex-col items-center justify-center w-full h-80 border-4 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:border-tangerine transition-all overflow-hidden relative group"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-gray-400 group-hover:text-tangerine transition-colors">
                <span className="text-6xl mb-4">📷</span>
                <span className="font-bold">Click to Upload Kitchen Photo</span>
              </div>
            )}
            
            {preview && (
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white text-tangerine px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Change Photo
                </span>
              </div>
            )}
          </div>
        </div>

        {image && (
          <button 
            onClick={scanPantry}
            disabled={isLoading}
            className="mt-8 bg-tangerine text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition shadow-xl disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">🌀</span> Gemma is analyzing...
              </>
            ) : (
              <>
                <span>✨</span> Scan Ingredients
              </>
            )}
          </button>
        )}
      </div>

      {detectedIngredients.length > 0 && (
        <div className="animate-fadeIn bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center">
          <h3 className="text-2xl font-bold text-forestGreen mb-6">Detected Ingredients</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {detectedIngredients.map((ing, i) => (
              <span key={i} className="bg-orange-100 text-tangerine px-4 py-2 rounded-full text-sm font-bold border border-tangerine/20">
                {ing}
              </span>
            ))}
          </div>
          <button 
            onClick={findRecipes}
            className="bg-forestGreen text-white px-12 py-4 rounded-full font-bold hover:bg-green-700 transition shadow-lg flex items-center gap-2 mx-auto"
          >
            Find Recipes with these →
          </button>
        </div>
      )}
    </div>
  );
};

export default PantryPage;
