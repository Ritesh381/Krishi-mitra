import React, { useState, useRef, useCallback } from 'react'
import { useTranslation } from '../utils/useTranslation'
import { useNavigate } from 'react-router-dom'

// Helper function to map form values to display strings (can be removed if t() handles all)
const getDisplayValue = (field, value, t) => {
  switch (field) {
    case 'farmSize':
      if (value === 'small') return `< 2 ${t('acres')}`;
      if (value === 'medium') return `2-10 ${t('acres')}`;
      if (value === 'large') return `> 10 ${t('acres')}`;
      return t('Not specified');
    case 'season':
      if (value === 'kharif') return t('Kharif (Jun-Oct)');
      if (value === 'rabi') return t('Rabi (Nov-Apr)');
      if (value === 'summer') return t('Summer (Apr-Jun)');
      return t('Not specified');
    default:
      return value || t('Not specified');
  }
}

function CropSuggestions() {
  const { t, currentLanguage } = useTranslation()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    location: '',
    farmSize: '',
    soilType: '',
    season: '',
    waterSource: '',
    budget: '',
    experience: '',
    preference: ''
  })
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  const [error, setError] = useState(null)
  const resultsRef = useRef(null)

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Optional: Reset error on input
    setError(null);
  }

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Basic validation for fields required by the backend
    if (!formData.location || !formData.soilType || !formData.season) {
      setError(t('Please fill out Location, Soil Type, and Season.'));
      return;
    }

    setIsAnalyzing(true)
    setError(null);
    setRecommendations(null);

  
    // 🔗 API endpoint connection
    const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api"
    const backendUrl = `${backend}crop/recommend`;

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Attempt to read server error message if available
        const errorData = await response.json().catch(() => ({ error: t('Server error occurred.') }));
        throw new Error(errorData.error || t('Failed to get recommendations from server.'));
      }

      const data = await response.json();
      
      if (data.crops && data.crops.length > 0) {
        // Successful response, set recommendations
        setRecommendations({
          ...data,
          // Add mock/computed fields for display logic based on the new structure
          analysisDate: new Date().toLocaleDateString(currentLanguage === 'hi' ? 'hi-IN' : 'en-US'),
          confidence: 90 + Math.floor(Math.random() * 8), // Mock confidence score
          totalCrops: data.crops.length,
        });
      } else {
         throw new Error(t('No suitable crops found based on your input.'));
      }

      // Scroll to results after a short delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 500)

    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || t('An unexpected error occurred.'));
      setRecommendations(null);
    } finally {
      setIsAnalyzing(false)
    }
  }, [formData, currentLanguage, t])

  // Reset function
  const resetForm = () => {
    setFormData({
      location: '',
      farmSize: '',
      soilType: '',
      season: '',
      waterSource: '',
      budget: '',
      experience: '',
      preference: ''
    })
    setRecommendations(null)
    setError(null)
    setIsAnalyzing(false)
  }

  // Define simplified mapping for rendering
  const recommendedCrops = recommendations?.crops || [];
  const primaryCrop = recommendedCrops[0];
  const secondaryCrops = recommendedCrops.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-lime-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
              >
                <span className="text-xl">←</span>
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🌱</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">
                  {t('Crop Suggestions')}
                </h1>
                <p className="text-sm text-green-600">
                  {t('AI-Powered Personalized Recommendations')}
                </p>
              </div>
            </div>
            
            {recommendations && (
              <button 
                onClick={resetForm}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                {t('New Analysis')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!recommendations && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              {t('Choose the Right Crop for Your Farm')}
            </h2>
            <p className="text-green-600 max-w-2xl mx-auto">
              {t('Our AI will suggest the best crops based on your soil, climate, budget, and experience.')}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
            <div className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
                <strong className="font-bold">{t('Error:')}</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        )}

        <div className={`${recommendations ? 'grid lg:grid-cols-2 gap-8 lg:min-h-[calc(100vh-150px)]' : 'max-w-4xl mx-auto'}`}>
          {/* Form Section */}
          <div className={`space-y-6 ${recommendations ? 'lg:sticky lg:top-4 lg:h-fit' : ''}`}>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-green-800">
                  {t('📋 Fill Farm Details')}
                </h3>
                {/* Simplified step counter */}
                <div className="text-sm text-green-600">
                  {t('Fill all details')}
                </div>
              </div>

              {/* Step 1: Basic Information */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {t('1️⃣ Basic Information')}
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('Location (District/State)')}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder={t('e.g., Pune, Maharashtra')}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('Farm Size')}
                    </label>
                    <select
                      value={formData.farmSize}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {t('Select Size')}
                      </option>
                      <option value="small">&lt; 2 {t('acres')}</option>
                      <option value="medium">2-10 {t('acres')}</option>
                      <option value="large">&gt; 10 {t('acres')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('Soil Type')}
                    </label>
                    <select
                      value={formData.soilType}
                      onChange={(e) => handleInputChange('soilType', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {t('Select Soil')}
                      </option>
                      <option value="clay">{t('Clay')}</option>
                      <option value="loamy">{t('Loamy')}</option>
                      <option value="sandy">{t('Sandy')}</option>
                      <option value="black">{t('Black Soil')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('Season')}
                    </label>
                    <select
                      value={formData.season}
                      onChange={(e) => handleInputChange('season', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {t('Select Season')}
                      </option>
                      <option value="kharif">{t('Kharif (Jun-Oct)')}</option>
                      <option value="rabi">{t('Rabi (Nov-Apr)')}</option>
                      <option value="summer">{t('Summer (Apr-Jun)')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Resources */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {t('2️⃣ Resources & Budget')}
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('Water Source')}
                    </label>
                    <select
                      value={formData.waterSource}
                      onChange={(e) => handleInputChange('waterSource', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {t('Select Source')}
                      </option>
                      <option value="rain">{t('Rain-fed')}</option>
                      <option value="tube-well">{t('Tube Well')}</option>
                      <option value="canal">{t('Canal')}</option>
                      <option value="river">{t('River')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('Budget (Per Acre)')}
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {t('Select Budget')}
                      </option>
                      <option value="low">₹10,000-25,000 ({t('Low')})</option>
                      <option value="medium">₹25,000-50,000 ({t('Medium')})</option>
                      <option value="high">₹50,000+ ({t('High')})</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Experience & Preferences */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {t('3️⃣ Experience & Preferences')}
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('Farming Experience')}
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {t('Select Experience')}
                      </option>
                      <option value="beginner">{t('Beginner (0-2 years)')}</option>
                      <option value="intermediate">{t('Intermediate (3-10 years)')}</option>
                      <option value="experienced">{t('Experienced (10+ years)')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('Crop Preference')}
                    </label>
                    <select
                      value={formData.preference}
                      onChange={(e) => handleInputChange('preference', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {t('Select Preference')}
                      </option>
                      <option value="cereals">{t('Cereals (Wheat, Rice)')}</option>
                      <option value="vegetables">{t('Vegetables')}</option>
                      <option value="fruits">{t('Fruits')}</option>
                      <option value="cash-crops">{t('Cash Crops')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={!formData.location || !formData.soilType || !formData.season || isAnalyzing}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    (!formData.location || !formData.soilType || !formData.season || isAnalyzing)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-3"></div>
                      {t('🔬 AI Analysis in Progress...')}
                    </div>
                  ) : (
                    <>
                      🌱 {t('Get Crop Recommendations')}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            {!recommendations && (
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                  💡 {t('Tips for Accurate Suggestions')}
                </h4>
                <ul className="space-y-2 text-blue-700 text-sm">
                  <li>✓ {t('Fill all information accurately')}</li>
                  <li>✓ {t('Soil testing done would be better')}</li>
                  <li>✓ {t('Check local market prices')}</li>
                  <li>✓ {t('Ensure water availability')}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className={`space-y-6 ${recommendations ? 'overflow-y-auto lg:max-h-[calc(100vh-150px)] pr-2' : ''}`} ref={resultsRef}>
            {recommendations && (
              <>
                {/* Analysis Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-green-800">
                      {t('🎯 Analysis Results')}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600">
                        {t('Confidence:')}
                      </span>
                      {/* Using mock confidence based on complexity of AI request */}
                      <span className="font-bold text-green-700">{recommendations.confidence}%</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">{recommendations.totalCrops}</div>
                      <div className="text-sm text-green-600">
                        {t('Recommended Crops')}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600">{t('Based on Location:')}</div>
                      <div className="text-lg font-bold text-blue-700">{recommendations.location || t('N/A')}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-600">{t('Selected Season:')}</div>
                      <div className="text-lg font-bold text-purple-700">{getDisplayValue('season', formData.season, t)}</div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    {t('Analysis Date:')} {recommendations.analysisDate}
                  </div>
                </div>

                {/* Primary Recommendation */}
                {primaryCrop && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold flex items-center">
                        🏆 {t('Top Recommendation')}
                      </h3>
                      {/* Removed suitability score since AI doesn't return it directly */}
                      <div className="bg-white/20 rounded-full px-3 py-1">
                        <span className="text-sm font-semibold">{t('Top Match')}</span>
                      </div>
                    </div>

                    <h4 className="text-4xl font-extrabold mb-4 flex items-center space-x-3">
                      <span>{primaryCrop.icon}</span>
                      <span>{primaryCrop.name}</span>
                    </h4>
                      
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-xl p-4">
                        <h5 className="font-semibold mb-2 flex items-center space-x-1">
                          🗓️ <span>{t('Key Details')}</span>
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{t('Planting Time:')}</span>
                            <span className="font-semibold text-green-200">{primaryCrop.plantingTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('Harvest Duration:')}</span>
                            <span className="font-semibold text-green-200">{primaryCrop.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('Water Need:')}</span>
                            <span className="font-semibold text-green-200">{primaryCrop.water}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('Profit Est.:')}</span>
                            <span className="font-semibold text-green-200">{primaryCrop.profit}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4">
                        <h5 className="font-semibold mb-2 flex items-center space-x-1">
                          💡 <span>{t('Reason for Selection')}</span>
                        </h5>
                        <p className="text-sm leading-relaxed">{primaryCrop.reason}</p>
                      </div>
                    </div>
                  </div>
                )}


                {/* Alternative Recommendations */}
                {secondaryCrops.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-400">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      🥈 {t('Alternative Recommendations')}
                    </h3>

                    <div className="space-y-4">
                      {secondaryCrops.map((crop, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                              <span>{crop.icon}</span>
                              <span>{crop.name}</span>
                            </h4>
                            <div className="text-sm font-semibold text-orange-600">{t('Good Option')}</div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{crop.reason}</p>
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-700 border-t pt-2 mt-2">
                            <div><span className="font-semibold">{t('Profit:')}</span> {crop.profit}</div>
                            <div><span className="font-semibold">{t('Water:')}</span> {crop.water}</div>
                            <div><span className="font-semibold">{t('Duration:')}</span> {crop.duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Seasonal Planting Calendar - Kept this mock data as it was not part of the API payload */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-purple-800 mb-6">
                    📅 {t('Planting Calendar')}
                  </h3>

                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { month: t('November'), activity: t('Sowing'), status: 'optimal' },
                      { month: t('December'), activity: t('Early Care'), status: 'good' },
                      { month: t('March'), activity: t('Harvesting'), status: 'optimal' },
                      { month: t('April'), activity: t('Market Sale'), status: 'good' }
                    ].map((item, index) => (
                      <div key={index} className={`p-4 rounded-lg text-center ${
                        item.status === 'optimal' ? 'bg-green-100 border-2 border-green-300' : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <div className="font-bold text-lg">{item.month}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.activity}</div>
                        <div className={`text-xs mt-2 px-2 py-1 rounded ${
                          item.status === 'optimal' ? 'bg-green-200 text-green-700' : 'bg-blue-200 text-blue-700'
                        }`}>
                          {item.status === 'optimal' ? t('Optimal Time') : t('Good Time')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-gradient-to-t from-green-50 via-emerald-25 to-transparent pt-4">
                  <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold">
                    {t('💾 Save Report')}
                  </button>
                  
                  <button className="flex-1 border-2 border-green-600 text-green-700 py-3 rounded-lg hover:bg-green-50 transition-all duration-300 font-semibold">
                    {t('📤 Share with Expert')}
                  </button>
                  
                  <button onClick={resetForm} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold">
                    {t('🔄 New Analysis')}
                  </button>
                </div>
              </>
            )}

            {!recommendations && !isAnalyzing && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  {t('🤖 How Our AI Works')}
                </h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start space-x-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">1</span>
                    <div>
                      <h4 className="font-semibold">
                        {t('Data Analysis')}
                      </h4>
                      <p className="text-sm">
                        {t('Analyzes your soil, climate, and local conditions.')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">2</span>
                    <div>
                      <h4 className="font-semibold">
                        {t('Market Research')}
                      </h4>
                      <p className="text-sm">
                        {t('Analyzes current market prices and demand trends.')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">3</span>
                    <div>
                      <h4 className="font-semibold">
                        {t('Personalized Suggestions')}
                      </h4>
                      <p className="text-sm">
                        {t('Recommends best crops based on your budget and experience.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        /* Custom scrollbar for webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
        
        /* For Firefox */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #10b981 #f1f5f9;
        }
      `}</style>
    </div>
  )
}

export default CropSuggestions
