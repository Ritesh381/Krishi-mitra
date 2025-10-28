import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from '../utils/useTranslation'
import { useNavigate } from 'react-router-dom'

function IrrigationPlanner() {
  const { t, currentLanguage } = useTranslation()
  const navigate = useNavigate()
  
  const [selectedField, setSelectedField] = useState('field1')
  const [selectedCrop, setSelectedCrop] = useState('wheat')
  const [irrigationSchedules, setIrrigationSchedules] = useState([])
  const [soilMoisture, setSoilMoisture] = useState(45)
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [waterUsageData, setWaterUsageData] = useState({})
  const [recommendations, setRecommendations] = useState([])

  // Mock data initialization
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      // Set mock irrigation schedules
      setIrrigationSchedules([
        {
          id: 1,
          field: currentLanguage === 'hi' ? 'खेत 1 - गेहूं' :
                 currentLanguage === 'gu' ? 'ખેત 1 - ઘઉં' :
                 currentLanguage === 'mr' ? 'शेत 1 - गहू' :
                 currentLanguage === 'ta' ? 'வயல் 1 - கோதுமை' :
                 'Field 1 - Wheat',
          nextIrrigation: '2025-10-29 06:00',
          duration: 45,
          waterAmount: 150,
          method: currentLanguage === 'hi' ? 'ड्रिप सिस्टम' :
                  currentLanguage === 'gu' ? 'ડ્રિપ સિસ્ટમ' :
                  currentLanguage === 'mr' ? 'ड्रिप सिस्टम' :
                  currentLanguage === 'ta' ? 'டிரிப் சிஸ்டம்' :
                  'Drip System',
          status: 'scheduled',
          soilMoisture: 42,
          cropStage: currentLanguage === 'hi' ? 'फूल आना' :
                     currentLanguage === 'gu' ? 'ફૂલ આવવું' :
                     currentLanguage === 'mr' ? 'फुले येणे' :
                     currentLanguage === 'ta' ? 'பூக்கும் நிலை' :
                     'Flowering'
        },
        {
          id: 2,
          field: currentLanguage === 'hi' ? 'खेत 2 - टमाटर' :
                 currentLanguage === 'gu' ? 'ખેત 2 - ટમેટા' :
                 currentLanguage === 'mr' ? 'शेत 2 - टोमॅटो' :
                 currentLanguage === 'ta' ? 'வயல் 2 - தக்காளி' :
                 'Field 2 - Tomato',
          nextIrrigation: '2025-10-29 07:30',
          duration: 30,
          waterAmount: 200,
          method: currentLanguage === 'hi' ? 'स्प्रिंकलर' :
                  currentLanguage === 'gu' ? 'સ્પ્રિંકલર' :
                  currentLanguage === 'mr' ? 'स्प्रिंकलर' :
                  currentLanguage === 'ta' ? 'ஸ்ப்ரிங்க்லர்' :
                  'Sprinkler',
          status: 'active',
          soilMoisture: 65,
          cropStage: currentLanguage === 'hi' ? 'फल लगना' :
                     currentLanguage === 'gu' ? 'ફળ લાગવું' :
                     currentLanguage === 'mr' ? 'फळे लागणे' :
                     currentLanguage === 'ta' ? 'பழம் பிடிக்கும் நிலை' :
                     'Fruiting'
        },
        {
          id: 3,
          field: currentLanguage === 'hi' ? 'खेत 3 - मक्का' :
                 currentLanguage === 'gu' ? 'ખેત 3 - મકાઈ' :
                 currentLanguage === 'mr' ? 'शेत 3 - मका' :
                 currentLanguage === 'ta' ? 'வயல் 3 - மக்காச்சோளம்' :
                 'Field 3 - Maize',
          nextIrrigation: '2025-10-30 05:45',
          duration: 60,
          waterAmount: 180,
          method: currentLanguage === 'hi' ? 'फ्लड सिस्टम' :
                  currentLanguage === 'gu' ? 'ફ્લડ સિસ્ટમ' :
                  currentLanguage === 'mr' ? 'फ्लड सिस्टम' :
                  currentLanguage === 'ta' ? 'ஃப்லட் சிஸ்டம்' :
                  'Flood System',
          status: 'completed',
          soilMoisture: 78,
          cropStage: currentLanguage === 'hi' ? 'वृद्धि अवस्था' :
                     currentLanguage === 'gu' ? 'વૃદ્ધિ અવસ્થા' :
                     currentLanguage === 'mr' ? 'वाढ अवस्था' :
                     currentLanguage === 'ta' ? 'வளர்ச்சி நிலை' :
                     'Growth Stage'
        }
      ])

      // Set mock weather data
      setWeatherData({
        temperature: 28,
        humidity: 65,
        rainfall: 0,
        windSpeed: 12,
        forecast: [
          { 
            day: currentLanguage === 'hi' ? 'आज' : 
                 currentLanguage === 'gu' ? 'આજ' : 
                 currentLanguage === 'mr' ? 'आज' : 
                 currentLanguage === 'ta' ? 'இன்று' : 'Today', 
            rain: 0, temp: 28 
          },
          { 
            day: currentLanguage === 'hi' ? 'कल' : 
                 currentLanguage === 'gu' ? 'કાલે' : 
                 currentLanguage === 'mr' ? 'उद्या' : 
                 currentLanguage === 'ta' ? 'நாளை' : 'Tomorrow', 
            rain: 15, temp: 26 
          },
          { 
            day: currentLanguage === 'hi' ? 'परसों' : 
                 currentLanguage === 'gu' ? 'પરસો' : 
                 currentLanguage === 'mr' ? 'परवा' : 
                 currentLanguage === 'ta' ? 'நாளை மறுநாள்' : 'Day After', 
            rain: 8, temp: 27 
          }
        ]
      })

      // Set water usage data
      setWaterUsageData({
        today: 450,
        thisWeek: 2800,
        thisMonth: 12000,
        efficiency: 85
      })

      // Set recommendations
      setRecommendations([
        {
          id: 1,
          type: 'urgent',
          title: currentLanguage === 'hi' ? 'मिट्टी की नमी कम है' :
                 currentLanguage === 'gu' ? 'માટીની ભેજ ઓછી છે' :
                 currentLanguage === 'mr' ? 'मातीची ओलावा कमी आहे' :
                 currentLanguage === 'ta' ? 'மண் ஈரப்பதம் குறைவு' :
                 'Low Soil Moisture',
          message: currentLanguage === 'hi' ? 'खेत 1 में तुरंत सिंचाई की जरूरत है' :
                   currentLanguage === 'gu' ? 'ખેત 1 માં તુરંત સિંચાઈની જરૂર છે' :
                   currentLanguage === 'mr' ? 'शेत 1 मध्ये तातडीने पाणी पाजणी गरजेचे आहे' :
                   currentLanguage === 'ta' ? 'வயல் 1 இல் உடனே நீர்ப்பாசனம் தேவை' :
                   'Field 1 needs immediate irrigation',
          time: '5 min ago'
        },
        {
          id: 2,
          type: 'weather',
          title: currentLanguage === 'hi' ? 'बारिश की संभावना' :
                 currentLanguage === 'gu' ? 'વરસાદની શક્યતા' :
                 currentLanguage === 'mr' ? 'पावसाची शक्यता' :
                 currentLanguage === 'ta' ? 'மழையின் சாத்தியம்' :
                 'Rain Forecast',
          message: currentLanguage === 'hi' ? 'कल 15mm बारिश हो सकती है, सिंचाई को स्थगित करें' :
                   currentLanguage === 'gu' ? 'કાલે 15mm વરસાદ થઈ શકે છે, સિંચાઈ મુલતવી રાખો' :
                   currentLanguage === 'mr' ? 'उद्या 15mm पाऊस पडू शकतो, सिंचन पुढे ढकला' :
                   currentLanguage === 'ta' ? 'நாளை 15mm மழை பெய்யலாம், நீர்ப்பாசனத்தை ஒத்திவைக்கவும்' :
                   'Tomorrow 15mm rain expected, postpone irrigation',
          time: '10 min ago'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [currentLanguage])

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'active': 
        return currentLanguage === 'hi' ? 'चालू' :
               currentLanguage === 'gu' ? 'ચાલુ' :
               currentLanguage === 'mr' ? 'चालू' :
               currentLanguage === 'ta' ? 'செயலில்' : 'Active'
      case 'scheduled': 
        return currentLanguage === 'hi' ? 'निर्धारित' :
               currentLanguage === 'gu' ? 'નિર્ધારિત' :
               currentLanguage === 'mr' ? 'निर्धारित' :
               currentLanguage === 'ta' ? 'திட்டமிடப்பட்ட' : 'Scheduled'
      case 'completed': 
        return currentLanguage === 'hi' ? 'पूर्ण' :
               currentLanguage === 'gu' ? 'પૂર્ણ' :
               currentLanguage === 'mr' ? 'पूर्ण' :
               currentLanguage === 'ta' ? 'முடிந்தது' : 'Completed'
      default: return status
    }
  }

  const getMoistureColor = (moisture) => {
    if (moisture < 30) return 'text-red-600'
    if (moisture < 50) return 'text-orange-600'
    return 'text-green-600'
  }

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return currentLanguage === 'hi' ? `आज ${date.toLocaleTimeString('hi-IN', {hour: '2-digit', minute: '2-digit'})}` :
             currentLanguage === 'gu' ? `આજ ${date.toLocaleTimeString('gu-IN', {hour: '2-digit', minute: '2-digit'})}` :
             currentLanguage === 'mr' ? `आज ${date.toLocaleTimeString('mr-IN', {hour: '2-digit', minute: '2-digit'})}` :
             currentLanguage === 'ta' ? `இன்று ${date.toLocaleTimeString('ta-IN', {hour: '2-digit', minute: '2-digit'})}` :
             `Today ${date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return currentLanguage === 'hi' ? `कल ${date.toLocaleTimeString('hi-IN', {hour: '2-digit', minute: '2-digit'})}` :
             currentLanguage === 'gu' ? `કાલે ${date.toLocaleTimeString('gu-IN', {hour: '2-digit', minute: '2-digit'})}` :
             currentLanguage === 'mr' ? `उद्या ${date.toLocaleTimeString('mr-IN', {hour: '2-digit', minute: '2-digit'})}` :
             currentLanguage === 'ta' ? `நாளை ${date.toLocaleTimeString('ta-IN', {hour: '2-digit', minute: '2-digit'})}` :
             `Tomorrow ${date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}`
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-25 to-emerald-50">
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">💧</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-green-600 bg-clip-text text-transparent">
                  {currentLanguage === 'hi' ? 'सिंचाई योजनाकार' :
                   currentLanguage === 'gu' ? 'સિંચાઈ આયોજક' :
                   currentLanguage === 'mr' ? 'सिंचन नियोजक' :
                   currentLanguage === 'ta' ? 'நீர்ப்பாசன திட்டமிடுபவர்' :
                   'Irrigation Planner'}
                </h1>
                <p className="text-sm text-blue-600">
                  {currentLanguage === 'hi' ? 'स्मार्ट सिंचाई निर्धारण फसल की जरूरतों के आधार पर' :
                   currentLanguage === 'gu' ? 'સ્માર્ટ સિંચાઈ શેડ્યૂલિંગ પાકની જરૂરિયાતોના આધારે' :
                   currentLanguage === 'mr' ? 'स्मार्ट सिंचन शेड्यूलिंग पिकाच्या गरजेनुसार' :
                   currentLanguage === 'ta' ? 'பயிரின் தேவைகளின் அடிப்படையில் ஸ்மார்ட் நீர்ப்பாசன திட்டமிடல்' :
                   'Smart irrigation scheduling based on crop needs'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                {currentLanguage === 'hi' ? '+ नया शेड्यूल' :
                 currentLanguage === 'gu' ? '+ નવું શેડ્યૂલ' :
                 currentLanguage === 'mr' ? '+ नवीन शेड्यूल' :
                 currentLanguage === 'ta' ? '+ புதிய கால அட்டவணை' :
                 '+ New Schedule'}
              </button>
              <button className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200 transition-colors">
                <span className="text-xl">⚙️</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'hi' ? 'मिट्टी की नमी' :
                   currentLanguage === 'gu' ? 'માટીની ભેજ' :
                   currentLanguage === 'mr' ? 'मातीची ओलावा' :
                   currentLanguage === 'ta' ? 'மண் ஈரப்பதம்' :
                   'Soil Moisture'}
                </p>
                <p className={`text-2xl font-bold ${getMoistureColor(soilMoisture)}`}>{soilMoisture}%</p>
                <p className="text-xs text-gray-500">
                  {currentLanguage === 'hi' ? 'औसत स्तर' :
                   currentLanguage === 'gu' ? 'સરેરાશ સ્તર' :
                   currentLanguage === 'mr' ? 'सरासरी पातळी' :
                   currentLanguage === 'ta' ? 'சராசரி நிலை' :
                   'Average Level'}
                </p>
              </div>
              <div className="text-3xl">💧</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'hi' ? 'आज का पानी उपयोग' :
                   currentLanguage === 'gu' ? 'આજનો પાણી વપરાશ' :
                   currentLanguage === 'mr' ? 'आजचा पाण्याचा वापर' :
                   currentLanguage === 'ta' ? 'இன்றைய நீர் பயன்பாடு' :
                   'Today\'s Water Usage'}
                </p>
                <p className="text-2xl font-bold text-blue-600">{waterUsageData.today}L</p>
                <p className="text-xs text-gray-500">
                  {currentLanguage === 'hi' ? '3 खेत में' :
                   currentLanguage === 'gu' ? '3 ખેતમાં' :
                   currentLanguage === 'mr' ? '3 शेतात' :
                   currentLanguage === 'ta' ? '3 வயல்களில்' :
                   'Across 3 fields'}
                </p>
              </div>
              <div className="text-3xl">🚿</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'hi' ? 'दक्षता स्कोर' :
                   currentLanguage === 'gu' ? 'કાર્યક્ષમતા સ્કોર' :
                   currentLanguage === 'mr' ? 'कार्यक्षमता गुण' :
                   currentLanguage === 'ta' ? 'செயல்திறன் மதிப்பெண்' :
                   'Efficiency Score'}
                </p>
                <p className="text-2xl font-bold text-green-600">{waterUsageData.efficiency}%</p>
                <p className="text-xs text-gray-500">
                  {currentLanguage === 'hi' ? 'पिछले सप्ताह से +5%' :
                   currentLanguage === 'gu' ? 'છેલ્લા અઠવાડિયાથી +5%' :
                   currentLanguage === 'mr' ? 'गेल्या आठवड्यापासून +5%' :
                   currentLanguage === 'ta' ? 'கடந்த வாரத்திலிருந்து +5%' :
                   '+5% from last week'}
                </p>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'hi' ? 'अगली सिंचाई' :
                   currentLanguage === 'gu' ? 'આગામી સિંચાઈ' :
                   currentLanguage === 'mr' ? 'पुढील सिंचन' :
                   currentLanguage === 'ta' ? 'அடுத்த நீர்ப்பாசனம்' :
                   'Next Irrigation'}
                </p>
                <p className="text-2xl font-bold text-orange-600">06:00</p>
                <p className="text-xs text-gray-500">
                  {currentLanguage === 'hi' ? 'आज सुबह' :
                   currentLanguage === 'gu' ? 'આજે સવારે' :
                   currentLanguage === 'mr' ? 'आज सकाळी' :
                   currentLanguage === 'ta' ? 'இன்று காலை' :
                   'This Morning'}
                </p>
              </div>
              <div className="text-3xl">⏰</div>
            </div>
          </div>
        </div>

        {/* Weather & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Weather Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              🌤️ {currentLanguage === 'hi' ? 'मौसम की जानकारी' :
                   currentLanguage === 'gu' ? 'હવામાન માહિતી' :
                   currentLanguage === 'mr' ? 'हवामान माहिती' :
                   currentLanguage === 'ta' ? 'வானிலை தகவல்' :
                   'Weather Info'}
            </h3>
            {weatherData && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'तापमान' :
                     currentLanguage === 'gu' ? 'તાપમાન' :
                     currentLanguage === 'mr' ? 'तापमान' :
                     currentLanguage === 'ta' ? 'வெப்பநிலை' :
                     'Temperature'}
                  </span>
                  <span className="font-bold">{weatherData.temperature}°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'आर्द्रता' :
                     currentLanguage === 'gu' ? 'ભેજ' :
                     currentLanguage === 'mr' ? 'आर्द्रता' :
                     currentLanguage === 'ta' ? 'ஈரப்பதம்' :
                     'Humidity'}
                  </span>
                  <span className="font-bold">{weatherData.humidity}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'हवा की गति' :
                     currentLanguage === 'gu' ? 'પવનની ગતિ' :
                     currentLanguage === 'mr' ? 'वाऱ्याचा वेग' :
                     currentLanguage === 'ta' ? 'காற்றின் வேகம்' :
                     'Wind Speed'}
                  </span>
                  <span className="font-bold">{weatherData.windSpeed} km/h</span>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold mb-2">
                    {currentLanguage === 'hi' ? '3-दिन का पूर्वानुमान' :
                     currentLanguage === 'gu' ? '3-દિવસનો પૂર્વાનુમાન' :
                     currentLanguage === 'mr' ? '3-दिवसाचा अंदाज' :
                     currentLanguage === 'ta' ? '3-நாள் முன்னறிவிப்பு' :
                     '3-Day Forecast'}
                  </h4>
                  <div className="space-y-2">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{day.day}</span>
                        <span>{day.temp}°C</span>
                        <span className="text-blue-600">{day.rain}mm</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              💡 {currentLanguage === 'hi' ? 'स्मार्ट सुझाव' :
                   currentLanguage === 'gu' ? 'સ્માર્ટ ભલામણ' :
                   currentLanguage === 'mr' ? 'स्मार्ट शिफारस' :
                   currentLanguage === 'ta' ? 'ஸ்மார்ட் பரிந்துரைகள்' :
                   'Smart Recommendations'}
            </h3>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'urgent' ? 'border-red-500 bg-red-50' : 
                  rec.type === 'weather' ? 'border-blue-500 bg-blue-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-semibold ${
                        rec.type === 'urgent' ? 'text-red-800' : 
                        rec.type === 'weather' ? 'text-blue-800' :
                        'text-green-800'
                      }`}>
                        {rec.title}
                      </h4>
                      <p className="text-gray-700 text-sm mt-1">{rec.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">{rec.time}</span>
                  </div>
                </div>
              ))}
              
              <div className="text-center py-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  {currentLanguage === 'hi' ? 'सभी सुझाव देखें' :
                   currentLanguage === 'gu' ? 'બધી ભલામણ જુઓ' :
                   currentLanguage === 'mr' ? 'सर्व शिफारस पहा' :
                   currentLanguage === 'ta' ? 'அனைத்து பரிந்துரைகளையும் பார்க்கவும்' :
                   'View All Recommendations'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Irrigation Schedules */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-bold text-gray-800">
              {currentLanguage === 'hi' ? 'सिंचाई कार्यक्रम' :
               currentLanguage === 'gu' ? 'સિંચાઈ કાર્યક્રમ' :
               currentLanguage === 'mr' ? 'सिंचन कार्यक्रम' :
               currentLanguage === 'ta' ? 'நீர்ப்பாசன கால அட்டவணைகள்' :
               'Irrigation Schedules'}
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-600">
                {currentLanguage === 'hi' ? 'शेड्यूल लोड हो रहा है...' :
                 currentLanguage === 'gu' ? 'શેડ્યૂલ લોડ થઈ રહ્યો છે...' :
                 currentLanguage === 'mr' ? 'शेड्यूल लोड होत आहे...' :
                 currentLanguage === 'ta' ? 'கால அட்டவணை ஏற்றப்படுகிறது...' :
                 'Loading schedules...'}
              </span>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {irrigationSchedules.map((schedule) => (
                <div key={schedule.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        schedule.status === 'active' ? 'bg-green-100 text-green-600' :
                        schedule.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        💧
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{schedule.field}</h4>
                        <p className="text-sm text-gray-500">{schedule.cropStage}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}>
                      {getStatusText(schedule.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        {currentLanguage === 'hi' ? 'समय' :
                         currentLanguage === 'gu' ? 'સમય' :
                         currentLanguage === 'mr' ? 'वेळ' :
                         currentLanguage === 'ta' ? 'நேரம்' :
                         'Time'}
                      </p>
                      <p className="text-sm font-medium">{formatDateTime(schedule.nextIrrigation)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        {currentLanguage === 'hi' ? 'अवधि' :
                         currentLanguage === 'gu' ? 'અવધિ' :
                         currentLanguage === 'mr' ? 'कालावधी' :
                         currentLanguage === 'ta' ? 'கால அளவு' :
                         'Duration'}
                      </p>
                      <p className="text-sm font-medium">{schedule.duration} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        {currentLanguage === 'hi' ? 'पानी की मात्रा' :
                         currentLanguage === 'gu' ? 'પાણીનું પ્રમાણ' :
                         currentLanguage === 'mr' ? 'पाण्याचे प्रमाण' :
                         currentLanguage === 'ta' ? 'நீரின் அளவு' :
                         'Water Amount'}
                      </p>
                      <p className="text-sm font-medium">{schedule.waterAmount}L</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        {currentLanguage === 'hi' ? 'पद्धति' :
                         currentLanguage === 'gu' ? 'પદ્ધતિ' :
                         currentLanguage === 'mr' ? 'पद्धत' :
                         currentLanguage === 'ta' ? 'முறை' :
                         'Method'}
                      </p>
                      <p className="text-sm font-medium">{schedule.method}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        {currentLanguage === 'hi' ? 'मिट्टी की नमी' :
                         currentLanguage === 'gu' ? 'માટીની ભેજ' :
                         currentLanguage === 'mr' ? 'मातीची ओलावा' :
                         currentLanguage === 'ta' ? 'மண் ஈரப்பதம்' :
                         'Soil Moisture'}
                      </p>
                      <p className={`text-sm font-medium ${getMoistureColor(schedule.soilMoisture)}`}>
                        {schedule.soilMoisture}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      {currentLanguage === 'hi' ? 'संपादित करें' :
                       currentLanguage === 'gu' ? 'સંપાદન કરો' :
                       currentLanguage === 'mr' ? 'संपादन करा' :
                       currentLanguage === 'ta' ? 'திருத்து' :
                       'Edit'}
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm">
                      {currentLanguage === 'hi' ? 'अभी शुरू करें' :
                       currentLanguage === 'gu' ? 'હમણાં શરૂ કરો' :
                       currentLanguage === 'mr' ? 'आता सुरू करा' :
                       currentLanguage === 'ta' ? 'இப்போது தொடங்கு' :
                       'Start Now'}
                    </button>
                    <button className="text-orange-600 hover:text-orange-800 text-sm">
                      {currentLanguage === 'hi' ? 'स्थगित करें' :
                       currentLanguage === 'gu' ? 'મુલતવી રાખો' :
                       currentLanguage === 'mr' ? 'पुढे ढकला' :
                       currentLanguage === 'ta' ? 'ஒத்திவைக்கவும்' :
                       'Postpone'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Crop Water Requirements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            {currentLanguage === 'hi' ? 'फसल जल आवश्यकता' :
             currentLanguage === 'gu' ? 'પાક પાણી આવશ્યકતા' :
             currentLanguage === 'mr' ? 'पीक पाणी गरज' :
             currentLanguage === 'ta' ? 'பயிர் நீர் தேவைகள்' :
             'Crop Water Requirements'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🌾</span>
                <div>
                  <h4 className="font-semibold">
                    {currentLanguage === 'hi' ? 'गेहूं' :
                     currentLanguage === 'gu' ? 'ઘઉં' :
                     currentLanguage === 'mr' ? 'गहू' :
                     currentLanguage === 'ta' ? 'கோதுமை' :
                     'Wheat'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {currentLanguage === 'hi' ? 'फूल आने का समय' :
                     currentLanguage === 'gu' ? 'ફૂલ આવવાનો સમય' :
                     currentLanguage === 'mr' ? 'फुले येण्याची वेळ' :
                     currentLanguage === 'ta' ? 'பூக்கும் நிலை' :
                     'Flowering Stage'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'दैनिक आवश्यकता' :
                     currentLanguage === 'gu' ? 'દૈનિક જરૂર' :
                     currentLanguage === 'mr' ? 'दैनिक गरज' :
                     currentLanguage === 'ta' ? 'தினசரி தேவை' :
                     'Daily Need'}
                  </span>
                  <span className="font-medium">4-5mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'सिंचाई का अंतराल' :
                     currentLanguage === 'gu' ? 'સિંચાઈનો ગાળો' :
                     currentLanguage === 'mr' ? 'सिंचनाचा कालावधी' :
                     currentLanguage === 'ta' ? 'நீர்ப்பாசன இடைவெளி' :
                     'Irrigation Interval'}
                  </span>
                  <span className="font-medium">7-10 
                    {currentLanguage === 'hi' ? ' दिन' :
                     currentLanguage === 'gu' ? ' દિવસ' :
                     currentLanguage === 'mr' ? ' दिवस' :
                     currentLanguage === 'ta' ? ' நாட்கள்' :
                     ' days'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'पानी की मात्रा' :
                     currentLanguage === 'gu' ? 'પાણીનું પ્રમાણ' :
                     currentLanguage === 'mr' ? 'पाण्याचे प्रमाण' :
                     currentLanguage === 'ta' ? 'நீரின் அளவு' :
                     'Water Amount'}
                  </span>
                  <span className="font-medium">40-50mm</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🍅</span>
                <div>
                  <h4 className="font-semibold">
                    {currentLanguage === 'hi' ? 'टमाटर' :
                     currentLanguage === 'gu' ? 'ટમેટા' :
                     currentLanguage === 'mr' ? 'टोमॅटो' :
                     currentLanguage === 'ta' ? 'தக்காளி' :
                     'Tomato'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {currentLanguage === 'hi' ? 'फल धरने का समय' :
                     currentLanguage === 'gu' ? 'ફળ લાગવાનો સમય' :
                     currentLanguage === 'mr' ? 'फळे धरण्याची वेळ' :
                     currentLanguage === 'ta' ? 'பழம் பிடிக்கும் நிலை' :
                     'Fruiting Stage'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'दैनिक आवश्यकता' :
                     currentLanguage === 'gu' ? 'દૈનિક જરૂર' :
                     currentLanguage === 'mr' ? 'दैनिक गरज' :
                     currentLanguage === 'ta' ? 'தினசரி தேவை' :
                     'Daily Need'}
                  </span>
                  <span className="font-medium">6-8mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'सिंचाई का अंतराल' :
                     currentLanguage === 'gu' ? 'સિંચાઈનો ગાળો' :
                     currentLanguage === 'mr' ? 'सिंचनाचा कालावधी' :
                     currentLanguage === 'ta' ? 'நீர்ப்பாசன இடைவெளி' :
                     'Irrigation Interval'}
                  </span>
                  <span className="font-medium">2-3 
                    {currentLanguage === 'hi' ? ' दिन' :
                     currentLanguage === 'gu' ? ' દિવસ' :
                     currentLanguage === 'mr' ? ' दिवस' :
                     currentLanguage === 'ta' ? ' நாட்கள்' :
                     ' days'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'पानी की मात्रा' :
                     currentLanguage === 'gu' ? 'પાણીનું પ્રમાણ' :
                     currentLanguage === 'mr' ? 'पाण्याचे प्रमाण' :
                     currentLanguage === 'ta' ? 'நீரின் அளவு' :
                     'Water Amount'}
                  </span>
                  <span className="font-medium">15-20mm</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🌽</span>
                <div>
                  <h4 className="font-semibold">
                    {currentLanguage === 'hi' ? 'मक्का' :
                     currentLanguage === 'gu' ? 'મકાઈ' :
                     currentLanguage === 'mr' ? 'मका' :
                     currentLanguage === 'ta' ? 'மக்காச்சோளம்' :
                     'Maize'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {currentLanguage === 'hi' ? 'वृद्धि का समय' :
                     currentLanguage === 'gu' ? 'વૃદ્ધિનો સમય' :
                     currentLanguage === 'mr' ? 'वाढीची वेळ' :
                     currentLanguage === 'ta' ? 'வளர்ச்சி நிலை' :
                     'Growth Stage'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'दैनिक आवश्यकता' :
                     currentLanguage === 'gu' ? 'દૈનિક જરૂર' :
                     currentLanguage === 'mr' ? 'दैनिक गरज' :
                     currentLanguage === 'ta' ? 'தினசரி தேவை' :
                     'Daily Need'}
                  </span>
                  <span className="font-medium">5-6mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'सिंचाई का अंतराल' :
                     currentLanguage === 'gu' ? 'સિંચાઈનો ગાળો' :
                     currentLanguage === 'mr' ? 'सिंचनाचा कालावधी' :
                     currentLanguage === 'ta' ? 'நீர்ப்பாசன இடைவெளி' :
                     'Irrigation Interval'}
                  </span>
                  <span className="font-medium">5-7 
                    {currentLanguage === 'hi' ? ' दिन' :
                     currentLanguage === 'gu' ? ' દિવસ' :
                     currentLanguage === 'mr' ? ' दिवस' :
                     currentLanguage === 'ta' ? ' நாட்கள்' :
                     ' days'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLanguage === 'hi' ? 'पानी की मात्रा' :
                     currentLanguage === 'gu' ? 'પાણીનું પ્રમાણ' :
                     currentLanguage === 'mr' ? 'पाण्याचे प्रमाण' :
                     currentLanguage === 'ta' ? 'நீரின் அளவு' :
                     'Water Amount'}
                  </span>
                  <span className="font-medium">30-35mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default IrrigationPlanner
