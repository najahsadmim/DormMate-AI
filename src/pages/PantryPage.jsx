import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeService from '../services/RecipeService';

const PantryPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const scanPantry = async () => {
    if (!image) return alert("Please upload a photo first!");
    setIsLoading(true);
    try {
      const ingredients = await RecipeService.scanPantry(image);
      setDetectedIngredients(ingredients);
    } catch (e) {
      alert("AI failed to analyze image. Check if backend is awake!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto font-poppins text-center">
      <h2 className="text-4xl font-bold text-tangerine mb-4">AI Pantry Scanner</h2>
      <div className="relative max-w-md mx-auto">
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
        <div onClick={() => fileInputRef.current.click()} className="cursor-pointer flex flex-col items-center justify-center w-full h-80 border-4 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:border-tangerine transition-all overflow-hidden relative group">
          {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <div className="text-gray-400 text-6xl">📷</div>}
        </div>
        {image && (
          <button onClick={scanPantry} disabled={isLoading} className="mt-8 bg-tangerine text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition shadow-xl disabled:opacity-50 mx-auto block">
            {isLoading ? "🌀 Analyzing..." : "✨ Scan Ingredients"}
          </button>
        )}
      </div>
      {detectedIngredients.length > 0 && (
        <div className="mt-12 p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {detectedIngredients.map((ing, i) => (
              <span key={i} className="bg-orange-100 text-tangerine px-4 py-2 rounded-full text-sm font-bold">{ing}</span>
            ))}
          </div>
          <button onClick={() => navigate(`/search?q=${encodeURIComponent(detectedIngredients.join(', '))}&ai=true`)} className="bg-forestGreen text-white px-12 py-4 rounded-full font-bold hover:bg-green-700 transition shadow-lg mx-auto block">
            Find Recipes →
          </button>
        </div>
      )}
    </div>
  );
};

export default PantryPage;
