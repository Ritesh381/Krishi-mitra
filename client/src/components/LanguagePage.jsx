import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function LanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தमிழ்' }
  ]

  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('krishiMitraLanguage')
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode)
    
    // Store the selected language in localStorage
    localStorage.setItem('krishiMitraLanguage', langCode)
    
    // Optional: Store additional language info
    const selectedLangInfo = languages.find(lang => lang.code === langCode)
    localStorage.setItem('krishiMitraLanguageInfo', JSON.stringify(selectedLangInfo))
    
    console.log('Language saved to localStorage:', langCode)
  }
 
  // Navigate to the landing page
  const handleNavigation = () => {
    navigate('/landing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-lime-50 flex flex-col items-center justify-center p-6 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Logo/Icon Area */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-3xl">🌾</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-800 via-emerald-700 to-green-600 bg-clip-text text-transparent mb-3 tracking-tight">
            KrishiMitra
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-green-700 font-medium mb-2">
            Your Digital Farming Companion
          </p>

          <p className="text-lg text-green-600/80 max-w-2xl mx-auto leading-relaxed">
            Select your preferred language to continue your agricultural journey
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-100/50 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-green-800 text-center mb-8">
            Choose Your Language
          </h2>

          {/* Show saved language indicator if exists */}
          {selectedLanguage && (
            <div className="text-center mb-6 p-3 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-green-700">
                ✓ Previously selected: {languages.find(lang => lang.code === selectedLanguage)?.name}
              </p>
            </div>
          )}

          {/* Language Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {languages.map((language, index) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`group relative overflow-hidden rounded-xl p-6 border-2 transition-all cursor-pointer duration-300 transform hover:scale-105 hover:shadow-xl ${
                  selectedLanguage === language.code
                    ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'border-green-200 bg-white hover:border-green-400 text-green-800 hover:bg-green-50'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                {/* Button Content */}
                <div className="relative z-10">
                  <div className="text-xl font-semibold mb-1 group-hover:text-white transition-colors duration-300">
                    {language.name}
                  </div>
                  <div
                    className={`text-lg font-medium ${
                      selectedLanguage === language.code
                        ? 'text-green-100'
                        : 'text-green-600 group-hover:text-white'
                    } transition-colors duration-300`}
                  >
                    {language.native}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedLanguage === language.code && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Continue Button */}
          {selectedLanguage && (
            <div className="mt-8 text-center animate-fade-in">
              <button 
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                onClick={handleNavigation}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent cursor-pointer via-white/20 to-transparent skew-x-12 w-0 group-hover:w-full transition-all duration-700"></div>

                <span className="relative flex items-center cursor-pointer">
                  Continue
                  <svg
                    className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-green-600/70">
          <p className="text-sm">
            Empowering farmers with technology • Built for rural communities
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default LanguagePage
