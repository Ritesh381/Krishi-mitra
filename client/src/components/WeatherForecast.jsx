import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from '../utils/useTranslation'
import { useNavigate } from 'react-router-dom'

function WeatherForecast() {
  const { t, currentLanguage } = useTranslation()
  const navigate = useNavigate()
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days')
  const [selectedCrop, setSelectedCrop] = useState('all')
  const [weatherData, setWeatherData] = useState(null)
  const [farmingAlerts, setFarmingAlerts] = useState([])
  const [cropAdvisories, setCropAdvisories] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDetailedForecast, setShowDetailedForecast] = useState(false)

  // Initialize with real Bangalore weather data based on search results
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      // Current Bangalore weather (based on search results)
      setWeatherData({
        location: {
          name: currentLanguage === 'hi' ? 'बंगलौर, कर्नाटक' :
                 currentLanguage === 'gu' ? 'બેંગલુરુ, કર્ણાટક' :
                 currentLanguage === 'mr' ? 'बेंगळुरू, कर्नाटक' :
                 currentLanguage === 'ta' ? 'பெங்களூரு, கர்நாடகம்' :
                 'Bangalore, Karnataka',
          coordinates: '12.97°N, 77.59°E',
          elevation: '920m'
        },
        current: {
          temperature: 26,
          humidity: 73,
          windSpeed: 14,
          windDirection: 'E',
          pressure: 1013,
          visibility: 8,
          uvIndex: 6,
          dewPoint: 21,
          feelsLike: 29,
          condition: currentLanguage === 'hi' ? 'हल्की बारिश की संभावना' :
                     currentLanguage === 'gu' ? 'હલકા વરસાદની શક્યતા' :
                     currentLanguage === 'mr' ? 'हल्का पाऊस पडण्याची शक्यता' :
                     currentLanguage === 'ta' ? 'லேசான மழை சாத்தியம்' :
                     'Patchy rain possible',
          rainfall24h: 3.9,
          soilTemp: 23,
          leafWetness: 85
        },
        forecast: [
          {
            date: '2025-10-29',
            day: currentLanguage === 'hi' ? 'आज' :
                 currentLanguage === 'gu' ? 'આજ' :
                 currentLanguage === 'mr' ? 'आज' :
                 currentLanguage === 'ta' ? 'இன்று' : 'Today',
            high: 26, low: 17, rainfall: 0.1, humidity: 75, wind: 12,
            condition: currentLanguage === 'hi' ? 'हल्की बारिश' :
                      currentLanguage === 'gu' ? 'હલકો વરસાદ' :
                      currentLanguage === 'mr' ? 'हलका पाऊस' :
                      currentLanguage === 'ta' ? 'லேசான மழை' : 'Light rain',
            uvIndex: 2, soilMoisture: 78
          },
          {
            date: '2025-10-30',
            day: currentLanguage === 'hi' ? 'कल' :
                 currentLanguage === 'gu' ? 'કાલે' :
                 currentLanguage === 'mr' ? 'उद्या' :
                 currentLanguage === 'ta' ? 'நாளை' : 'Tomorrow',
            high: 27, low: 18, rainfall: 8.2, humidity: 80, wind: 15,
            condition: currentLanguage === 'hi' ? 'मध्यम बारिश' :
                      currentLanguage === 'gu' ? 'મધ્યમ વરસાદ' :
                      currentLanguage === 'mr' ? 'मध्यम पाऊस' :
                      currentLanguage === 'ta' ? 'மிதமான மழை' : 'Moderate rain',
            uvIndex: 4, soilMoisture: 85
          },
          {
            date: '2025-10-31',
            day: currentLanguage === 'hi' ? 'परसों' :
                 currentLanguage === 'gu' ? 'પરસો' :
                 currentLanguage === 'mr' ? 'परवा' :
                 currentLanguage === 'ta' ? 'நாளை மறுநாள்' : 'Day After',
            high: 28, low: 19, rainfall: 2.1, humidity: 70, wind: 10,
            condition: currentLanguage === 'hi' ? 'आंशिक बादल' :
                      currentLanguage === 'gu' ? 'આંશિક વાદળો' :
                      currentLanguage === 'mr' ? 'अंशतः ढगाळ' :
                      currentLanguage === 'ta' ? 'பகுதி மேகமூட்டம்' : 'Partly cloudy',
            uvIndex: 7, soilMoisture: 70
          },
          {
            date: '2025-11-01',
            day: currentLanguage === 'hi' ? 'शुक्रवार' :
                 currentLanguage === 'gu' ? 'શુક્રવાર' :
                 currentLanguage === 'mr' ? 'शुक्रवार' :
                 currentLanguage === 'ta' ? 'வெள்ளிக்கிழமை' : 'Friday',
            high: 29, low: 20, rainfall: 0.5, humidity: 65, wind: 8,
            condition: currentLanguage === 'hi' ? 'धूप' :
                      currentLanguage === 'gu' ? 'સનીલ' :
                      currentLanguage === 'mr' ? 'सूर्यप्रकाश' :
                      currentLanguage === 'ta' ? 'வெயில்' : 'Sunny',
            uvIndex: 8, soilMoisture: 65
          },
          {
            date: '2025-11-02',
            day: currentLanguage === 'hi' ? 'शनिवार' :
                 currentLanguage === 'gu' ? 'શનિવાર' :
                 currentLanguage === 'mr' ? 'शनिवार' :
                 currentLanguage === 'ta' ? 'சனிக்கிழமै' : 'Saturday',
            high: 30, low: 21, rainfall: 0.0, humidity: 60, wind: 6,
            condition: currentLanguage === 'hi' ? 'साफ आसमान' :
                      currentLanguage === 'gu' ? 'સ્વચ્છ આકાશ' :
                      currentLanguage === 'mr' ? 'निरभ्र आकाश' :
                      currentLanguage === 'ta' ? 'தெளிவான வானம்' : 'Clear sky',
            uvIndex: 9, soilMoisture: 58
          },
          {
            date: '2025-11-03',
            day: currentLanguage === 'hi' ? 'रविवार' :
                 currentLanguage === 'gu' ? 'રવિવાર' :
                 currentLanguage === 'mr' ? 'रविवार' :
                 currentLanguage === 'ta' ? 'ஞாயிற்றுக்கிழமை' : 'Sunday',
            high: 28, low: 19, rainfall: 5.2, humidity: 72, wind: 12,
            condition: currentLanguage === 'hi' ? 'बिजली और बारिश' :
                      currentLanguage === 'gu' ? 'વીજળી અને વરસાદ' :
                      currentLanguage === 'mr' ? 'वीज आणि पाऊस' :
                      currentLanguage === 'ta' ? 'இடி மின்னல் மழை' : 'Thunderstorm',
            uvIndex: 5, soilMoisture: 82
          },
          {
            date: '2025-11-04',
            day: currentLanguage === 'hi' ? 'सोमवार' :
                 currentLanguage === 'gu' ? 'સોમવાર' :
                 currentLanguage === 'mr' ? 'सोमवार' :
                 currentLanguage === 'ta' ? 'திங்கட்கிழமै' : 'Monday',
            high: 27, low: 18, rainfall: 12.5, humidity: 85, wind: 18,
            condition: currentLanguage === 'hi' ? 'भारी बारिश' :
                      currentLanguage === 'gu' ? 'ભારે વરસાદ' :
                      currentLanguage === 'mr' ? 'मुसळधार पाऊस' :
                      currentLanguage === 'ta' ? 'கனமழை' : 'Heavy rain',
            uvIndex: 3, soilMoisture: 95
          }
        ],
        monthlyStats: {
          avgTemp: 25.2,
          totalRainfall: 205.9,
          rainyDays: 26,
          sunshineHours: 186,
          avgHumidity: 73,
          maxTemp: 32,
          minTemp: 15
        }
      })

      // Farming alerts based on current conditions
      setFarmingAlerts([
        {
          id: 1,
          type: 'weather',
          priority: 'high',
          title: currentLanguage === 'hi' ? 'भारी बारिश की चेतावनी' :
                 currentLanguage === 'gu' ? 'ભારે વરસાદની ચેતવણી' :
                 currentLanguage === 'mr' ? 'मुसळधार पावसाचा इशारा' :
                 currentLanguage === 'ta' ? 'கனமழை எச்சரிக்கை' :
                 'Heavy Rainfall Alert',
          message: currentLanguage === 'hi' ? 'अगले 3 दिनों में 50mm+ बारिश। खेतों में जल निकासी की व्यवस्था करें।' :
                   currentLanguage === 'gu' ? 'આગામી 3 દિવસમાં 50mm+ વરસાદ. ખેતોમાં પાણી નિકાસની વ્યવસ્થા કરો.' :
                   currentLanguage === 'mr' ? 'पुढील 3 दिवसांत 50mm+ पाऊस. शेतात पाण्याची निस्सारणी करा.' :
                   currentLanguage === 'ta' ? 'அடுத்த 3 நாட்களில் 50mm+ மழை. வயல்களில் வடிகால் ஏற்பாடு செய்யுங்கள்.' :
                   'Expected 50mm+ rain in next 3 days. Ensure proper field drainage.',
          validUntil: '2025-11-01',
          crops: ['tomato', 'beans', 'leafy vegetables']
        },
        {
          id: 2,
          type: 'pest',
          priority: 'medium',
          title: currentLanguage === 'hi' ? 'फंगल रोग का खतरा' :
                 currentLanguage === 'gu' ? 'ફંગલ રોગનું જોખમ' :
                 currentLanguage === 'mr' ? 'बुरशीजन्य रोगाचा धोका' :
                 currentLanguage === 'ta' ? 'பூஞ்சाண நோய் ஆபत்து' :
                 'Fungal Disease Risk',
          message: currentLanguage === 'hi' ? 'उच्च आर्द्रता (73%+) के कारण फंगल संक्रमण का जोखिम। कवकनाशी का छिड़काव करें।' :
                   currentLanguage === 'gu' ? 'વધુ ભેજ (73%+) કારણે ફંગલ ચેપનું જોખમ. ફંગીસાઈડનો છંટકાવ કરો.' :
                   currentLanguage === 'mr' ? 'जास्त आर्द्रता (73%+) मुळे बुरशीजन्य संसर्गाचा धोका. बुरशीनाशकाची फवारणी करा.' :
                   currentLanguage === 'ta' ? 'அதிக ஈரப்பதம் (73%+) காரणமாக பூஞ்சாண தொற்று ஆபத்து. பூஞ்சाணகொல்லி தெளிக்கவும்.' :
                   'High humidity (73%+) increases fungal infection risk. Apply fungicides preventively.',
          validUntil: '2025-11-05',
          crops: ['tomato', 'chili', 'roses']
        },
        {
          id: 3,
          type: 'irrigation',
          priority: 'low',
          title: currentLanguage === 'hi' ? 'सिंचाई स्थगित करें' :
                 currentLanguage === 'gu' ? 'સિંચાઈ મુલતવી રાખો' :
                 currentLanguage === 'mr' ? 'सिंचन पुढे ढकला' :
                 currentLanguage === 'ta' ? 'நீர்ப்பாசனம் ஒத்திவைக்கவும்' :
                 'Postpone Irrigation',
          message: currentLanguage === 'hi' ? 'मिट्टी में नमी 78%। अगले सप्ताह तक सिंचाई की आवश्यकता नहीं।' :
                   currentLanguage === 'gu' ? 'માટીમાં ભેજ 78%. આગામી અઠવાડિયા સુધી સિંચાઈની જરૂર નથી.' :
                   currentLanguage === 'mr' ? 'मातीत ओलावा 78%. पुढील आठवड्यापर्यंत सिंचनाची गरज नाही.' :
                   currentLanguage === 'ta' ? 'மண்ணில் ஈரப்பதம் 78%. அடுத்த வாரம் வரை நீர்ப்பாசன தேவையில்லை.' :
                   'Soil moisture at 78%. No irrigation needed until next week.',
          validUntil: '2025-11-07',
          crops: ['all']
        }
      ])

      // Crop-specific advisories
      setCropAdvisories([
        {
          id: 1,
          crop: currentLanguage === 'hi' ? 'टमाटर' :
                currentLanguage === 'gu' ? 'ટમેટા' :
                currentLanguage === 'mr' ? 'टोमॅटो' :
                currentLanguage === 'ta' ? 'தக்காळி' : 'Tomato',
          stage: currentLanguage === 'hi' ? 'फूल आना' :
                 currentLanguage === 'gu' ? 'ફૂલ આવવું' :
                 currentLanguage === 'mr' ? 'फुले येणे' :
                 currentLanguage === 'ta' ? 'பூக்கும் நிலை' : 'Flowering',
          advisory: currentLanguage === 'hi' ? 'बारिश के बाद पोटाश का छिड़काव करें। फल सेट के लिए अनुकूल मौसम।' :
                    currentLanguage === 'gu' ? 'વરસાદ પછી પોટાશનો છંટકાવ કરો. ફળ સેટ માટે અનુકૂળ હવામાન.' :
                    currentLanguage === 'mr' ? 'पावसानंतर पोटॅशची फवारणी करा. फळ सेटसाठी अनुकूल हवामान.' :
                    currentLanguage === 'ta' ? 'மழைக்குப் பிறகு பொட்டாஷ் தெளிக்கவும். பழம் பிடிக்க சாதகமான காலநிலை.' :
                    'Spray potash after rain. Weather favorable for fruit setting.',
          priority: 'high',
          icon: '🍅'
        },
        {
          id: 2,
          crop: currentLanguage === 'hi' ? 'धान' :
                currentLanguage === 'gu' ? 'ધાન' :
                currentLanguage === 'mr' ? 'धान' :
                currentLanguage === 'ta' ? 'நெல்' : 'Rice',
          stage: currentLanguage === 'hi' ? 'कटाई' :
                 currentLanguage === 'gu' ? 'કાપણી' :
                 currentLanguage === 'mr' ? 'कापणी' :
                 currentLanguage === 'ta' ? 'அறுவடை' : 'Harvesting',
          advisory: currentLanguage === 'hi' ? 'बारिश रुकने के बाद तुरंत कटाई शुरू करें। धान को ढंक कर रखें।' :
                    currentLanguage === 'gu' ? 'વરસાદ બંધ થયા પછી તુરંત કાપણી શરૂ કરો. ધાનને ઢાંકીને રાખો.' :
                    currentLanguage === 'mr' ? 'पाऊस थांबल्यानंतर लगेच कापणी सुरू करा. धान झाकून ठेवा.' :
                    currentLanguage === 'ta' ? 'மழை நின்றதும் உடனே அறுவடை தொடங்குங்கள். நெல்லை மூடி வைக்கவும்.' :
                    'Start harvesting immediately after rain stops. Cover harvested rice.',
          priority: 'urgent',
          icon: '🌾'
        },
        {
          id: 3,
          crop: currentLanguage === 'hi' ? 'बैंगन' :
                currentLanguage === 'gu' ? 'રીંગણ' :
                currentLanguage === 'mr' ? 'वांगी' :
                currentLanguage === 'ta' ? 'கத்தரிக்காய்' : 'Brinjal',
          stage: currentLanguage === 'hi' ? 'फल विकास' :
                 currentLanguage === 'gu' ? 'ફળ વિકાસ' :
                 currentLanguage === 'mr' ? 'फळ विकास' :
                 currentLanguage === 'ta' ? 'பழ வளர்ச்சி' : 'Fruit Development',
          advisory: currentLanguage === 'hi' ? 'शूट एंड फ्रूट बोरर से बचाव के लिए नीम आधारित कीटनाशक का उपयोग करें।' :
                    currentLanguage === 'gu' ? 'શૂટ એન્ડ ફ્રૂટ બોરરથી બચાવ માટે નીમ આધારિત કીટનાશકનો ઉપયોગ કરો.' :
                    currentLanguage === 'mr' ? 'शूट अँड फ्रूट बोररपासून बचावासाठी कडुलिंब आधारित किटकनाशकाचा वापर करा.' :
                    currentLanguage === 'ta' ? 'சுட் அண்ட் ஃப்ரூட் போரர் பாதுகாப்பிற்கு வேப்ப அடிப்படையான பூச்சிக்கொல்லி பயன்படுத்துங்கள்.' :
                    'Use neem-based insecticide for shoot and fruit borer protection.',
          priority: 'medium',
          icon: '🍆'
        },
        {
          id: 4,
          crop: currentLanguage === 'hi' ? 'फूलगोभी' :
                currentLanguage === 'gu' ? 'ફૂલકોબી' :
                currentLanguage === 'mr' ? 'फूलकोबी' :
                currentLanguage === 'ta' ? 'காலிஃப்ளவர்' : 'Cauliflower',
          stage: currentLanguage === 'hi' ? 'रोपाई' :
                 currentLanguage === 'gu' ? 'રોપણી' :
                 currentLanguage === 'mr' ? 'लावणी' :
                 currentLanguage === 'ta' ? 'நடவு' : 'Transplanting',
          advisory: currentLanguage === 'hi' ? 'अक्टूबर-नवंबर में रोपाई के लिए आदर्श समय। मिट्टी की नमी बनाए रखें।' :
                    currentLanguage === 'gu' ? 'ઓક્ટોબર-નવેમ્બરમાં રોપણી માટે આદર્શ સમય. માટીની ભેજ જાળવી રાખો.' :
                    currentLanguage === 'mr' ? 'ऑक्टोबर-नोव्हेंबरमध्ये लावणीसाठी आदर्श वेळ. मातीची ओलावा राखा.' :
                    currentLanguage === 'ta' ? 'அக்டோபர்-நவம்பரில் நடவுக்கு சிறந்த காலம். மண் ஈரப்பதம் பராமரிக்கவும்.' :
                    'Ideal time for transplanting in Oct-Nov. Maintain soil moisture.',
          priority: 'medium',
          icon: '🥦'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [currentLanguage])

  const getAlertColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-50 border-red-500 text-red-800'
      case 'high': return 'bg-orange-50 border-orange-500 text-orange-800'
      case 'medium': return 'bg-yellow-50 border-yellow-500 text-yellow-800'
      case 'low': return 'bg-blue-50 border-blue-500 text-blue-800'
      default: return 'bg-gray-50 border-gray-500 text-gray-800'
    }
  }

  const getPriorityText = (priority) => {
    switch(priority) {
      case 'urgent': 
        return currentLanguage === 'hi' ? 'तत्काल' :
               currentLanguage === 'gu' ? 'તાત્કાલિક' :
               currentLanguage === 'mr' ? 'तातडी' :
               currentLanguage === 'ta' ? 'உடனடி' : 'Urgent'
      case 'high': 
        return currentLanguage === 'hi' ? 'उच्च' :
               currentLanguage === 'gu' ? 'ઉચ્ચ' :
               currentLanguage === 'mr' ? 'उच्च' :
               currentLanguage === 'ta' ? 'உயர்' : 'High'
      case 'medium': 
        return currentLanguage === 'hi' ? 'मध्यम' :
               currentLanguage === 'gu' ? 'મધ્યમ' :
               currentLanguage === 'mr' ? 'मध्यम' :
               currentLanguage === 'ta' ? 'நடுத்தর' : 'Medium'
      case 'low': 
        return currentLanguage === 'hi' ? 'कम' :
               currentLanguage === 'gu' ? 'ઓછું' :
               currentLanguage === 'mr' ? 'कमी' :
               currentLanguage === 'ta' ? 'குறைந்த' : 'Low'
      default: return priority
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(currentLanguage === 'hi' ? 'hi-IN' : 
                                  currentLanguage === 'gu' ? 'gu-IN' : 
                                  currentLanguage === 'mr' ? 'mr-IN' : 
                                  currentLanguage === 'ta' ? 'ta-IN' : 'en-IN')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-25 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <span className="text-xl">←</span>
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🌤️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-cyan-600 bg-clip-text text-transparent">
                  {currentLanguage === 'hi' ? 'मौसम विश्लेषण और कृषि पूर्वानुमान' :
                   currentLanguage === 'gu' ? 'હવામાન વિશ્લેષણ અને કૃષિ પૂર્વાનુમાન' :
                   currentLanguage === 'mr' ? 'हवामान विश्लेषण आणि शेती अंदाज' :
                   currentLanguage === 'ta' ? 'வானிலை பகுப்பாய்வு மற்றும் விவசாய முன்னறிவிப்பு' :
                   'Weather Analysis & Farming Forecasts'}
                </h1>
                <p className="text-sm text-blue-600">
                  {weatherData?.location.name} • {currentLanguage === 'hi' ? 'वैज्ञानिक कृषि सलाह' :
                                                   currentLanguage === 'gu' ? 'વૈજ્ઞાનિક કૃષિ સલાહ' :
                                                   currentLanguage === 'mr' ? 'वैज्ञानिक शेती सल्ला' :
                                                   currentLanguage === 'ta' ? 'அறிவியல் விவசாய ஆலோசனை' :
                                                   'Scientific Agricultural Advisory'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="7days">
                  {currentLanguage === 'hi' ? '7 दिन' :
                   currentLanguage === 'gu' ? '7 દિવસ' :
                   currentLanguage === 'mr' ? '7 दिवस' :
                   currentLanguage === 'ta' ? '7 நாட்கள்' : '7 Days'}
                </option>
                <option value="14days">
                  {currentLanguage === 'hi' ? '14 दिन' :
                   currentLanguage === 'gu' ? '14 દિવસ' :
                   currentLanguage === 'mr' ? '14 दिवस' :
                   currentLanguage === 'ta' ? '14 நாட்கள்' : '14 Days'}
                </option>
                <option value="monthly">
                  {currentLanguage === 'hi' ? 'मासिक' :
                   currentLanguage === 'gu' ? 'માસિક' :
                   currentLanguage === 'mr' ? 'मासिक' :
                   currentLanguage === 'ta' ? 'மாதாந்திர' : 'Monthly'}
                </option>
              </select>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                {currentLanguage === 'hi' ? 'रिपोर्ट डाउनलोड करें' :
                 currentLanguage === 'gu' ? 'રિપોર્ટ ડાઉનલોડ કરો' :
                 currentLanguage === 'mr' ? 'अहवाल डाऊनलोड करा' :
                 currentLanguage === 'ta' ? 'அறிக்கை பதிவிறக்கம்' :
                 'Download Report'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-600">
              {currentLanguage === 'hi' ? 'मौसम डेटा लोड हो रहा है...' :
               currentLanguage === 'gu' ? 'હવામાન ડેટા લોડ થઈ રહ્યો છે...' :
               currentLanguage === 'mr' ? 'हवामान डेटा लोड होत आहे...' :
               currentLanguage === 'ta' ? 'வானிலை தரவு ஏற்றப்படுகிறது...' :
               'Loading weather data...'}
            </span>
          </div>
        ) : (
          <>
            {/* Current Weather Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Conditions */}
                <div className="lg:col-span-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {currentLanguage === 'hi' ? 'वर्तमान मौसम स्थितियां' :
                     currentLanguage === 'gu' ? 'વર્તમાન હવામાન પરિસ્થિતિઓ' :
                     currentLanguage === 'mr' ? 'सद्य हवामान परिस्थिती' :
                     currentLanguage === 'ta' ? 'தற்போதைய வானிலை நிலைமைகள்' :
                     'Current Weather Conditions'}
                  </h3>
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-2">🌧️</div>
                    <div className="text-4xl font-bold text-blue-600">{weatherData?.current.temperature}°C</div>
                    <div className="text-gray-600 mt-1">{weatherData?.current.condition}</div>
                    <div className="text-sm text-gray-500">
                      {currentLanguage === 'hi' ? `महसूस होता है ${weatherData?.current.feelsLike}°C` :
                       currentLanguage === 'gu' ? `લાગે છે ${weatherData?.current.feelsLike}°C` :
                       currentLanguage === 'mr' ? `वाटते ${weatherData?.current.feelsLike}°C` :
                       currentLanguage === 'ta' ? `உணரப்படுகிறது ${weatherData?.current.feelsLike}°C` :
                       `Feels like ${weatherData?.current.feelsLike}°C`}
                    </div>
                  </div>
                </div>

                {/* Weather Details */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-blue-600 text-2xl mb-2">💧</div>
                    <div className="text-sm text-gray-600">
                      {currentLanguage === 'hi' ? 'आर्द्रता' :
                       currentLanguage === 'gu' ? 'ભેજ' :
                       currentLanguage === 'mr' ? 'आर्द्रता' :
                       currentLanguage === 'ta' ? 'ஈரப்பதம்' : 'Humidity'}
                    </div>
                    <div className="text-lg font-bold">{weatherData?.current.humidity}%</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-green-600 text-2xl mb-2">💨</div>
                    <div className="text-sm text-gray-600">
                      {currentLanguage === 'hi' ? 'हवा की गति' :
                       currentLanguage === 'gu' ? 'પવનની ગતિ' :
                       currentLanguage === 'mr' ? 'वाऱ्याचा वेग' :
                       currentLanguage === 'ta' ? 'காற்றின் வேகம்' : 'Wind Speed'}
                    </div>
                    <div className="text-lg font-bold">{weatherData?.current.windSpeed} km/h</div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-orange-600 text-2xl mb-2">☀️</div>
                    <div className="text-sm text-gray-600">UV Index</div>
                    <div className="text-lg font-bold">{weatherData?.current.uvIndex}</div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-purple-600 text-2xl mb-2">🌡️</div>
                    <div className="text-sm text-gray-600">
                      {currentLanguage === 'hi' ? 'मिट्टी का तापमान' :
                       currentLanguage === 'gu' ? 'માટીનું તાપમાન' :
                       currentLanguage === 'mr' ? 'मातीचे तापमान' :
                       currentLanguage === 'ta' ? 'மண் வெப்பநிலை' : 'Soil Temp'}
                    </div>
                    <div className="text-lg font-bold">{weatherData?.current.soilTemp}°C</div>
                  </div>

                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="text-cyan-600 text-2xl mb-2">🌊</div>
                    <div className="text-sm text-gray-600">
                      {currentLanguage === 'hi' ? '24h बारिश' :
                       currentLanguage === 'gu' ? '24h વરસાદ' :
                       currentLanguage === 'mr' ? '24h पाऊस' :
                       currentLanguage === 'ta' ? '24h மழை' : '24h Rainfall'}
                    </div>
                    <div className="text-lg font-bold">{weatherData?.current.rainfall24h}mm</div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="text-yellow-600 text-2xl mb-2">📏</div>
                    <div className="text-sm text-gray-600">
                      {currentLanguage === 'hi' ? 'दबाव' :
                       currentLanguage === 'gu' ? 'દબાણ' :
                       currentLanguage === 'mr' ? 'दाब' :
                       currentLanguage === 'ta' ? 'அழுत்तம்' : 'Pressure'}
                    </div>
                    <div className="text-lg font-bold">{weatherData?.current.pressure} mb</div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="text-indigo-600 text-2xl mb-2">👁️</div>
                    <div className="text-sm text-gray-600">
                      {currentLanguage === 'hi' ? 'दृश्यता' :
                       currentLanguage === 'gu' ? 'દૃશ્યતા' :
                       currentLanguage === 'mr' ? 'दृश्यता' :
                       currentLanguage === 'ta' ? 'பார்வை' : 'Visibility'}
                    </div>
                    <div className="text-lg font-bold">{weatherData?.current.visibility} km</div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-4">
                    <div className="text-emerald-600 text-2xl mb-2">🍃</div>
                    <div className="text-sm text-gray-600">
                      {currentLanguage === 'hi' ? 'पत्ती की नमी' :
                       currentLanguage === 'gu' ? 'પાંદડાની ભેજ' :
                       currentLanguage === 'mr' ? 'पानाची ओलावा' :
                       currentLanguage === 'ta' ? 'இலை ஈரப்பதம்' : 'Leaf Wetness'}
                    </div>
                    <div className="text-lg font-bold">{weatherData?.current.leafWetness}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Farming Alerts */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                🚨 {currentLanguage === 'hi' ? 'कृषि चेतावनी और सलाह' :
                     currentLanguage === 'gu' ? 'કૃષિ ચેતવણી અને સલાહ' :
                     currentLanguage === 'mr' ? 'शेती इशारा आणि सल्ला' :
                     currentLanguage === 'ta' ? 'விவசாய எச்சரிக்கை மற்றும் ஆலோசனை' :
                     'Agricultural Alerts & Advisory'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmingAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.priority)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{alert.title}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                        {getPriorityText(alert.priority)}
                      </span>
                    </div>
                    <p className="text-sm mb-3 opacity-90">{alert.message}</p>
                    <div className="text-xs opacity-75">
                      {currentLanguage === 'hi' ? 'मान्य तक:' :
                       currentLanguage === 'gu' ? 'માન્ય સુધી:' :
                       currentLanguage === 'mr' ? 'वैध पर्यंत:' :
                       currentLanguage === 'ta' ? 'செல்லுபடியாகும் வரை:' :
                       'Valid until:'} {formatDate(alert.validUntil)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extended Forecast */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {currentLanguage === 'hi' ? '7-दिवसीय विस्तृत पूर्वानुमान' :
                 currentLanguage === 'gu' ? '7-દિવસીય વિસ્તૃત પૂર્વાનુમાન' :
                 currentLanguage === 'mr' ? '7-दिवसाचा विस्तृत अंदाज' :
                 currentLanguage === 'ta' ? '7-நாள் விரிவான முன்னறிவிப்பு' :
                 '7-Day Detailed Forecast'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {weatherData?.forecast.map((day, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="font-semibold text-gray-800 mb-2">{day.day}</div>
                    <div className="text-3xl mb-2">
                      {day.condition.includes('rain') || day.condition.includes('बारिश') ? '🌧️' :
                       day.condition.includes('sunny') || day.condition.includes('धूप') ? '☀️' :
                       day.condition.includes('cloud') || day.condition.includes('बादल') ? '☁️' :
                       day.condition.includes('thunder') || day.condition.includes('बिजली') ? '⛈️' : '🌤️'}
                    </div>
                    <div className="text-sm font-bold mb-1">
                      {day.high}° / {day.low}°
                    </div>
                    <div className="text-xs text-blue-600 mb-2">
                      {day.rainfall}mm
                    </div>
                    <div className="text-xs text-gray-600">
                      {currentLanguage === 'hi' ? 'आर्द्रता' :
                       currentLanguage === 'gu' ? 'ભેજ' :
                       currentLanguage === 'mr' ? 'आर्द्रता' :
                       currentLanguage === 'ta' ? 'ஈரப்பதம்' : 'Humidity'}: {day.humidity}%
                    </div>
                    <div className="text-xs text-gray-600">
                      UV: {day.uvIndex}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      {currentLanguage === 'hi' ? 'मिट्टी' :
                       currentLanguage === 'gu' ? 'માટી' :
                       currentLanguage === 'mr' ? 'माती' :
                       currentLanguage === 'ta' ? 'மண்' : 'Soil'}: {day.soilMoisture}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crop-Specific Advisories */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                🌱 {currentLanguage === 'hi' ? 'फसल-विशिष्ट सलाह' :
                     currentLanguage === 'gu' ? 'પાક-વિશિષ્ટ સલાહ' :
                     currentLanguage === 'mr' ? 'पीक-विशिष्ट सल्ला' :
                     currentLanguage === 'ta' ? 'பயிர்-சார்ந்த ஆலோசனை' :
                     'Crop-Specific Advisory'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cropAdvisories.map((advisory) => (
                  <div key={advisory.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">{advisory.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg text-gray-800">{advisory.crop}</h4>
                            <p className="text-sm text-gray-600">{advisory.stage}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getAlertColor(advisory.priority)}`}>
                            {getPriorityText(advisory.priority)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{advisory.advisory}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {currentLanguage === 'hi' ? 'मासिक मौसम सांख्यिकी (अक्टूबर 2025)' :
                 currentLanguage === 'gu' ? 'માસિક હવામાન આંકડાકીય માહિતી (ઓક્ટોબર 2025)' :
                 currentLanguage === 'mr' ? 'मासिक हवामान आकडेवारी (ऑक्टोबर 2025)' :
                 currentLanguage === 'ta' ? 'மாதாந்திர வானிலை புள்ளிவிவரங்கள் (அக்டோபர் 2025)' :
                 'Monthly Weather Statistics (October 2025)'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-3xl text-blue-600 mb-2">🌡️</div>
                  <div className="text-2xl font-bold text-blue-800">{weatherData?.monthlyStats.avgTemp}°C</div>
                  <div className="text-sm text-blue-600">
                    {currentLanguage === 'hi' ? 'औसत तापमान' :
                     currentLanguage === 'gu' ? 'સરેરાશ તાપમાન' :
                     currentLanguage === 'mr' ? 'सरासरी तापमान' :
                     currentLanguage === 'ta' ? 'சராசரி வெப்பநிலை' :
                     'Average Temperature'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Max: {weatherData?.monthlyStats.maxTemp}°C | Min: {weatherData?.monthlyStats.minTemp}°C
                  </div>
                </div>

                <div className="bg-cyan-50 rounded-lg p-6 text-center">
                  <div className="text-3xl text-cyan-600 mb-2">🌧️</div>
                  <div className="text-2xl font-bold text-cyan-800">{weatherData?.monthlyStats.totalRainfall}mm</div>
                  <div className="text-sm text-cyan-600">
                    {currentLanguage === 'hi' ? 'कुल वर्षा' :
                     currentLanguage === 'gu' ? 'કુલ વરસાદ' :
                     currentLanguage === 'mr' ? 'एकूण पाऊस' :
                     currentLanguage === 'ta' ? 'மொத்த மழை' :
                     'Total Rainfall'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {weatherData?.monthlyStats.rainyDays} {currentLanguage === 'hi' ? 'बारिश के दिन' :
                                                          currentLanguage === 'gu' ? 'વરસાદના દિવસો' :
                                                          currentLanguage === 'mr' ? 'पावसाचे दिवस' :
                                                          currentLanguage === 'ta' ? 'மழை நாட்கள்' :
                                                          'rainy days'}
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6 text-center">
                  <div className="text-3xl text-yellow-600 mb-2">☀️</div>
                  <div className="text-2xl font-bold text-yellow-800">{weatherData?.monthlyStats.sunshineHours}h</div>
                  <div className="text-sm text-yellow-600">
                    {currentLanguage === 'hi' ? 'धूप के घंटे' :
                     currentLanguage === 'gu' ? 'સૂર્યપ્રકાશના કલાકો' :
                     currentLanguage === 'mr' ? 'सूर्यप्रकाशाचे तास' :
                     currentLanguage === 'ta' ? 'சூரிய ஒளி மணிநேரங்கள்' :
                     'Sunshine Hours'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {currentLanguage === 'hi' ? 'प्रतिदिन औसत 6h' :
                     currentLanguage === 'gu' ? 'દરરોજ સરેરાશ 6h' :
                     currentLanguage === 'mr' ? 'दररोज सरासरी 6h' :
                     currentLanguage === 'ta' ? 'தினமும் சராசரி 6h' :
                     'Average 6h daily'}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl text-green-600 mb-2">💧</div>
                  <div className="text-2xl font-bold text-green-800">{weatherData?.monthlyStats.avgHumidity}%</div>
                  <div className="text-sm text-green-600">
                    {currentLanguage === 'hi' ? 'औसत आर्द्रता' :
                     currentLanguage === 'gu' ? 'સરેરાશ ભેજ' :
                     currentLanguage === 'mr' ? 'सरासरी आर्द्रता' :
                     currentLanguage === 'ta' ? 'சராசரி ஈரப்பதம்' :
                     'Average Humidity'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {currentLanguage === 'hi' ? 'फसलों के लिए आदर्श' :
                     currentLanguage === 'gu' ? 'પાક માટે આદર્શ' :
                     currentLanguage === 'mr' ? 'पिकांसाठी आदर्श' :
                     currentLanguage === 'ta' ? 'பயிர்களுக்கு சிறந்த' :
                     'Ideal for crops'}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default WeatherForecast
