import React, { useEffect, useState } from 'react'
import { useTranslation } from '../utils/useTranslation'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { t, currentLanguage } = useTranslation()
  const navigate = useNavigate();

  const handlePestDetectionRedirect = () => {
    navigate('/pest-detection')
  }

  const handleCropSuggestionsRedirect = () => {
    navigate('/crop-suggestions')
  }
  const handleMarketPricesRedirect = () => {
    navigate('/market-prices')
  }
  const handleIrrigationPlannerRedirect = () => {
    navigate('/irrigation-planner')
  }

  // Add individual handlers for each feature (you can create more as needed)
  const handleFeatureClick = (route) => {
    if (route === '/pest-detection') {
      handlePestDetectionRedirect()
    }
    else if (route === '/crop-suggestions') {
      handleCropSuggestionsRedirect()
    }
    // Add more route handling here as you create more pages
    else if (route === '/chat') {
      navigate('/chat')
    }
    else if (route === '/market-prices') {
      handleMarketPricesRedirect()
    }
    else if (route === '/irrigation') {
      handleIrrigationPlannerRedirect()
    }
    // etc.
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  })
  
  const [user] = useState({
    name: currentLanguage === 'hi' ? 'रमेश कुमार' : 
          currentLanguage === 'gu' ? 'રમેશ કુમાર' :
          currentLanguage === 'mr' ? 'रमेश कुमार' :
          currentLanguage === 'ta' ? 'ரமேஷ் குமார்' :
          'Ramesh Kumar',
    location: currentLanguage === 'hi' ? 'पुणे, महाराष्ट्र' :
              currentLanguage === 'gu' ? 'પુણે, મહારાષ્ટ્ર' :
              currentLanguage === 'mr' ? 'पुणे, महाराष्ट्र' :
              currentLanguage === 'ta' ? 'புணே, மகாராஷ்டிரா' :
              'Pune, Maharashtra',
    farmSize: currentLanguage === 'hi' ? '5 एकड़' :
              currentLanguage === 'gu' ? '5 એકર' :
              currentLanguage === 'mr' ? '5 एकर' :
              currentLanguage === 'ta' ? '5 ஏக்கர்' :
              '5 acres'
  })

  // Weather data structure (API-ready)
  const [weatherData] = useState({
    location: user.location,
    current: {
      temp: 28,
      condition: currentLanguage === 'hi' ? 'आंशिक बादल' :
                 currentLanguage === 'gu' ? 'આંશિક વાદળછાયું' :
                 currentLanguage === 'mr' ? 'अंशतः ढगाळ' :
                 currentLanguage === 'ta' ? 'பகுதியளவு மேகமூட்டம்' :
                 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      icon: '⛅'
    },
    forecast: [
      { 
        day: t('today'), 
        high: 32, 
        low: 22, 
        icon: '⛅', 
        condition: currentLanguage === 'hi' ? 'आंशिक बादल' :
                   currentLanguage === 'gu' ? 'આંશિક વાદળછાયું' :
                   currentLanguage === 'mr' ? 'अंशतः ढगाळ' :
                   currentLanguage === 'ta' ? 'பகுதியளவு மேகமூட்டம்' :
                   'Partly Cloudy'
      },
      { 
        day: t('tomorrow'), 
        high: 30, 
        low: 20, 
        icon: '🌤️', 
        condition: currentLanguage === 'hi' ? 'अधिकतर धूप' :
                   currentLanguage === 'gu' ? 'મોટાભાગે સનીલાઈટ' :
                   currentLanguage === 'mr' ? 'बहुतेक सूर्यप्रकाश' :
                   currentLanguage === 'ta' ? 'பெரும்பாலும் வெயில்' :
                   'Mostly Sunny'
      },
      { 
        day: currentLanguage === 'hi' ? 'गुरु' :
             currentLanguage === 'gu' ? 'ગુરુ' :
             currentLanguage === 'mr' ? 'गुरु' :
             currentLanguage === 'ta' ? 'வியாழன்' :
             'Thu', 
        high: 29, 
        low: 19, 
        icon: '☀️', 
        condition: currentLanguage === 'hi' ? 'धूप' :
                   currentLanguage === 'gu' ? 'સનીલાઈટ' :
                   currentLanguage === 'mr' ? 'सूर्यप्रकाश' :
                   currentLanguage === 'ta' ? 'வெயில்' :
                   'Sunny'
      },
      { 
        day: currentLanguage === 'hi' ? 'शुक्र' :
             currentLanguage === 'gu' ? 'શુક્ર' :
             currentLanguage === 'mr' ? 'शुक्र' :
             currentLanguage === 'ta' ? 'வெள்ளி' :
             'Fri', 
        high: 27, 
        low: 18, 
        icon: '🌦️', 
        condition: currentLanguage === 'hi' ? 'हल्की बारिश' :
                   currentLanguage === 'gu' ? 'હળવા વરસાદ' :
                   currentLanguage === 'mr' ? 'हलका पाऊस' :
                   currentLanguage === 'ta' ? 'மிதமான மழை' :
                   'Light Rain'
      }
    ]
  })

  const mainFeatures = [
    {
      title: t('aiAssistant'),
      description: t('aiAssistantDesc'),
      icon: '🤖',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      route: '/chat'
    },
    {
      title: t('pestDetectionDash'),
      description: t('pestDetectionDashDesc'),
      icon: '🔍',
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      route: '/pest-detection'
    },
    {
      title: t('cropSuggestionsDash'),
      description: t('cropSuggestionsDashDesc'),
      icon: '🌱',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      route: '/crop-suggestions'
    },
    {
      title: t('weatherInsights'),
      description: t('weatherInsightsDesc'),
      icon: '🌤️',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      route: '/weather'
    },
    {
      title: t('irrigationPlanner'),
      description: t('irrigationPlannerDesc'),
      icon: '💧',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      route: '/irrigation'
    },
    {
      title: t('marketPrices'),
      description: t('marketPricesDesc'),
      icon: '💰',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',
      route: '/market-prices'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-lime-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🌾</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">
                  {t('appName')}
                </h1>
                <p className="text-sm text-green-600">{t('welcomeBackName')}, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
                <span className="text-xl">🔔</span>
              </button>
              <button className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
                <span className="text-xl">⚙️</span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">RK</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weather Widget - API Ready */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              {/* Current Weather */}
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <div className="text-6xl">{weatherData.current.icon}</div>
                <div>
                  <h3 className="text-3xl font-bold">{weatherData.current.temp}°C</h3>
                  <p className="text-xl opacity-90">{weatherData.current.condition}</p>
                  <p className="text-sm opacity-75">📍 {weatherData.location}</p>
                </div>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 md:mb-0">
                <div className="text-center">
                  <p className="text-sm opacity-75">{t('humidity')}</p>
                  <p className="text-lg font-semibold">{weatherData.current.humidity}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-75">{t('wind')}</p>
                  <p className="text-lg font-semibold">{weatherData.current.windSpeed} km/h</p>
                </div>
              </div>

              {/* 4-Day Forecast */}
              <div className="grid grid-cols-4 gap-3">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-xs opacity-75 mb-1">{day.day}</p>
                    <div className="text-2xl mb-1">{day.icon}</div>
                    <p className="text-sm font-semibold">{day.high}°</p>
                    <p className="text-xs opacity-75">{day.low}°</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
            <span className="mr-3">🚀</span>
            {t('farmingTools')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.route)}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                
                <h3 className="text-xl font-bold text-green-800 mb-2 group-hover:text-green-900 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-green-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation() // Prevent double click
                    handleFeatureClick(feature.route)
                  }}
                  className="flex items-center text-green-700 hover:text-green-800 font-semibold transition-colors group-hover:translate-x-1 transform duration-200"
                >
                  <span>{t('getStartedBtn')}</span>
                  <span className="ml-2 text-lg">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Farm Overview */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">{t('farmOverview')}</h3>
              <p className="opacity-90 mb-4 md:mb-0">
                📍 {user.location} • 🏡 {user.farmSize} • 🌾 3 {t('activeCrops')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
