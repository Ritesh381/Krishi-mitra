import React, { useState, useRef } from 'react'
import { useTranslation } from '../utils/useTranslation'
import { useNavigate } from 'react-router-dom'

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
  const [currentStep, setCurrentStep] = useState(1)
  const resultsRef = useRef(null)

  // Mock crop recommendation data
  const mockCropData = {
    wheat: {
      name: currentLanguage === 'hi' ? 'गेहूं' :
            currentLanguage === 'gu' ? 'ઘઉં' :
            currentLanguage === 'mr' ? 'गहू' :
            currentLanguage === 'ta' ? 'கோதுமை' :
            'Wheat',
      scientific: 'Triticum aestivum',
      suitability: 95,
      season: currentLanguage === 'hi' ? 'रबी (नवंबर-अप्रैल)' :
              currentLanguage === 'gu' ? 'રબી (નવેમ્બર-એપ્રિલ)' :
              currentLanguage === 'mr' ? 'रब्बी (नोव्हेंबर-एप्रिल)' :
              currentLanguage === 'ta' ? 'ரபி (நவம்பர்-ஏப்ரல்)' :
              'Rabi (November-April)',
      duration: currentLanguage === 'hi' ? '120-150 दिन' :
                currentLanguage === 'gu' ? '120-150 દિવસ' :
                currentLanguage === 'mr' ? '120-150 दिवस' :
                currentLanguage === 'ta' ? '120-150 நாட்கள்' :
                '120-150 days',
      expectedYield: currentLanguage === 'hi' ? '25-30 क्विंटल प्रति एकड़' :
                     currentLanguage === 'gu' ? '25-30 ક્વિંટલ પ્રતિ એકર' :
                     currentLanguage === 'mr' ? '25-30 क्विंटल प्रति एकर' :
                     currentLanguage === 'ta' ? '25-30 குவிண்டால் ஒரு ஏக்கருக்கு' :
                     '25-30 quintals per acre',
      marketPrice: currentLanguage === 'hi' ? '₹2,100-2,300 प्रति क्विंटल' :
                   currentLanguage === 'gu' ? '₹2,100-2,300 પ્રતિ ક્વિંટલ' :
                   currentLanguage === 'mr' ? '₹2,100-2,300 प्रति क्विंटल' :
                   currentLanguage === 'ta' ? '₹2,100-2,300 ஒரு குவிண்டாலுக்கு' :
                   '₹2,100-2,300 per quintal',
      profitability: currentLanguage === 'hi' ? 'उच्च' :
                     currentLanguage === 'gu' ? 'ઉચ્ચ' :
                     currentLanguage === 'mr' ? 'उच्च' :
                     currentLanguage === 'ta' ? 'அதிக' :
                     'High',
      waterRequirement: currentLanguage === 'hi' ? 'मध्यम (4-5 सिंचाई)' :
                        currentLanguage === 'gu' ? 'મધ્યમ (4-5 સિંચાઈ)' :
                        currentLanguage === 'mr' ? 'मध्यम (4-5 पाणी पुरवठा)' :
                        currentLanguage === 'ta' ? 'நடுத்தர (4-5 நீர்ப்பாசனம்)' :
                        'Medium (4-5 irrigations)',
      soilType: currentLanguage === 'hi' ? 'दोमट, मिट्टी की मिट्टी' :
                currentLanguage === 'gu' ? 'દોરસ, માટીની માટી' :
                currentLanguage === 'mr' ? 'दोमट, मातीची माती' :
                currentLanguage === 'ta' ? 'களிமண், மண் மண்' :
                'Loamy, Clay soil',
      advantages: [
        currentLanguage === 'hi' ? 'स्थिर बाजार मांग' :
        currentLanguage === 'gu' ? 'સ્થિર બજાર માંગ' :
        currentLanguage === 'mr' ? 'स्थिर बाजार मागणी' :
        currentLanguage === 'ta' ? 'நிலையான சந்தை தேவை' :
        'Stable market demand',
        
        currentLanguage === 'hi' ? 'सरकारी न्यूनतम समर्थन मूल्य' :
        currentLanguage === 'gu' ? 'સરકારી લઘુતમ સમર્થન ભાવ' :
        currentLanguage === 'mr' ? 'सरकारी किमान आधार दर' :
        currentLanguage === 'ta' ? 'அரசு குறைந்தபட்ச ஆதரவு விலை' :
        'Government minimum support price',
        
        currentLanguage === 'hi' ? 'कम निवेश, अच्छा रिटर्न' :
        currentLanguage === 'gu' ? 'ઓછું રોકાણ, સારું રિટર્ન' :
        currentLanguage === 'mr' ? 'कमी गुंतवणूक, चांगला परतावा' :
        currentLanguage === 'ta' ? 'குறைந்த முதலீடு, நல்ல வருமானம்' :
        'Low investment, good returns'
      ],
      requirements: [
        currentLanguage === 'hi' ? 'तापमान: 15-25°C' :
        currentLanguage === 'gu' ? 'તાપમાન: 15-25°C' :
        currentLanguage === 'mr' ? 'तापमान: 15-25°C' :
        currentLanguage === 'ta' ? 'வெப்பநிலை: 15-25°C' :
        'Temperature: 15-25°C',
        
        currentLanguage === 'hi' ? 'वर्षा: 75-100 सेमी' :
        currentLanguage === 'gu' ? 'વરસાદ: 75-100 સેમી' :
        currentLanguage === 'mr' ? 'पाऊस: 75-100 सेमी' :
        currentLanguage === 'ta' ? 'மழைப்பொழிவு: 75-100 செமீ' :
        'Rainfall: 75-100 cm',
        
        currentLanguage === 'hi' ? 'pH स्तर: 6.0-7.5' :
        currentLanguage === 'gu' ? 'pH સ્તર: 6.0-7.5' :
        currentLanguage === 'mr' ? 'pH पातळी: 6.0-7.5' :
        currentLanguage === 'ta' ? 'pH நிலை: 6.0-7.5' :
        'pH level: 6.0-7.5'
      ]
    },
    tomato: {
      name: currentLanguage === 'hi' ? 'टमाटर' :
            currentLanguage === 'gu' ? 'ટામેટાં' :
            currentLanguage === 'mr' ? 'टोमॅटो' :
            currentLanguage === 'ta' ? 'தக்காளி' :
            'Tomato',
      scientific: 'Solanum lycopersicum',
      suitability: 88,
      season: currentLanguage === 'hi' ? 'खरीफ/रबी (साल भर)' :
              currentLanguage === 'gu' ? 'ખરીફ/રબી (વર્ષભર)' :
              currentLanguage === 'mr' ? 'खरीप/रब्बी (वर्षभर)' :
              currentLanguage === 'ta' ? 'கரீப்/ரபி (ஆண்டு முழுவதும்)' :
              'Kharif/Rabi (Year-round)',
      duration: currentLanguage === 'hi' ? '90-120 दिन' :
                currentLanguage === 'gu' ? '90-120 દિવસ' :
                currentLanguage === 'mr' ? '90-120 दिवस' :
                currentLanguage === 'ta' ? '90-120 நாட்கள்' :
                '90-120 days',
      expectedYield: currentLanguage === 'hi' ? '200-300 क्विंटल प्रति एकड़' :
                     currentLanguage === 'gu' ? '200-300 ક્વિંટલ પ્રતિ એકર' :
                     currentLanguage === 'mr' ? '200-300 क्विंटल प्रति एकर' :
                     currentLanguage === 'ta' ? '200-300 குவிண்டால் ஒரு ஏக்கருக்கு' :
                     '200-300 quintals per acre',
      marketPrice: currentLanguage === 'hi' ? '₹800-1,500 प्रति क्विंटल' :
                   currentLanguage === 'gu' ? '₹800-1,500 પ્રતિ ક્વિંટલ' :
                   currentLanguage === 'mr' ? '₹800-1,500 प्रति क्विंटल' :
                   currentLanguage === 'ta' ? '₹800-1,500 ஒரு குவிண்டாலுக்கு' :
                   '₹800-1,500 per quintal',
      profitability: currentLanguage === 'hi' ? 'बहुत अधिक' :
                     currentLanguage === 'gu' ? 'ખૂબ ઉચ્ચ' :
                     currentLanguage === 'mr' ? 'खूप जास्त' :
                     currentLanguage === 'ta' ? 'மிக அதிக' :
                     'Very High',
      waterRequirement: currentLanguage === 'hi' ? 'अधिक (नियमित सिंचाई)' :
                        currentLanguage === 'gu' ? 'વધુ (નિયમિત સિંચાઈ)' :
                        currentLanguage === 'mr' ? 'जास्त (नियमित पाणी पुरवठा)' :
                        currentLanguage === 'ta' ? 'அதிக (வழக்கமான நீர்ப்பாசனம்)' :
                        'High (Regular irrigation)',
      soilType: currentLanguage === 'hi' ? 'दोमट, अच्छी जल निकासी' :
                currentLanguage === 'gu' ? 'દોરસ, સારી પાણીની નિકાસી' :
                currentLanguage === 'mr' ? 'दोमट, चांगली पाणी निचरा' :
                currentLanguage === 'ta' ? 'களிமண், நல்ல நீர் வடிகால்' :
                'Loamy, Well-drained',
      advantages: [
        currentLanguage === 'hi' ? 'उच्च आर्थिक रिटर्न' :
        currentLanguage === 'gu' ? 'ઉચ્ચ આર્થિક રિટર્ન' :
        currentLanguage === 'mr' ? 'उच्च आर्थिक परतावा' :
        currentLanguage === 'ta' ? 'அதிக பொருளாதார வருமானம்' :
        'High economic returns',
        
        currentLanguage === 'hi' ? 'साल भर बाजार उपलब्धता' :
        currentLanguage === 'gu' ? 'વર્ષભર બજાર ઉપલબ્ધતા' :
        currentLanguage === 'mr' ? 'वर्षभर बाजार उपलब्धता' :
        currentLanguage === 'ta' ? 'ஆண்டு முழுவதும் சந்தை கிடைக்கும்' :
        'Year-round market availability',
        
        currentLanguage === 'hi' ? 'मूल्य संवर्धन की संभावना' :
        currentLanguage === 'gu' ? 'મૂલ્ય વર્ધનની શક્યતા' :
        currentLanguage === 'mr' ? 'मूल्य वाढीची शक्यता' :
        currentLanguage === 'ta' ? 'மதிப்பு கூட்டும் வாய்ப்பு' :
        'Value addition potential'
      ],
      requirements: [
        currentLanguage === 'hi' ? 'तापमान: 20-30°C' :
        currentLanguage === 'gu' ? 'તાપમાન: 20-30°C' :
        currentLanguage === 'mr' ? 'तापमान: 20-30°C' :
        currentLanguage === 'ta' ? 'வெப்பநிலை: 20-30°C' :
        'Temperature: 20-30°C',
        
        currentLanguage === 'hi' ? 'आर्द्रता: 60-70%' :
        currentLanguage === 'gu' ? 'ભેજ: 60-70%' :
        currentLanguage === 'mr' ? 'आर्द्रता: 60-70%' :
        currentLanguage === 'ta' ? 'ஈரப்பதம்: 60-70%' :
        'Humidity: 60-70%',
        
        currentLanguage === 'hi' ? 'धूप: 6-8 घंटे प्रतिदिन' :
        currentLanguage === 'gu' ? 'સૂર્યપ્રકાશ: 6-8 કલાક દરરોજ' :
        currentLanguage === 'mr' ? 'सूर्यप्रकाश: 6-8 तास दररोज' :
        currentLanguage === 'ta' ? 'சூரிய ஒளி: 6-8 மணி நேரம் தினமும்' :
        'Sunlight: 6-8 hours daily'
      ]
    }
  }

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle form submission
  const handleSubmit = () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setRecommendations({
        primary: mockCropData.wheat,
        secondary: mockCropData.tomato,
        totalCrops: 2,
        analysisDate: new Date().toLocaleDateString(),
        confidence: 92
      })
      setIsAnalyzing(false)
      
      // Scroll to results after a short delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }, 3000)
  }

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
    setCurrentStep(1)
    setIsAnalyzing(false)
  }

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
                  {currentLanguage === 'hi' ? 'फसल सुझाव' :
                   currentLanguage === 'gu' ? 'પાક સૂચનો' :
                   currentLanguage === 'mr' ? 'पीक सूचना' :
                   currentLanguage === 'ta' ? 'பயிர் பரிந்துரைகள்' :
                   'Crop Suggestions'}
                </h1>
                <p className="text-sm text-green-600">
                  {currentLanguage === 'hi' ? 'AI-संचालित व्यक्तिगत सिफारिशें' :
                   currentLanguage === 'gu' ? 'AI-સંચાલિત વ્યક્તિગત ભલામણો' :
                   currentLanguage === 'mr' ? 'AI-चालित वैयक्तिक शिफारसी' :
                   currentLanguage === 'ta' ? 'AI-இயக்கப்படும் தனிப்பட்ட பரிந்துரைகள்' :
                   'AI-Powered Personalized Recommendations'}
                </p>
              </div>
            </div>
            
            {recommendations && (
              <button 
                onClick={resetForm}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                {currentLanguage === 'hi' ? 'नया विश्लेषण' :
                 currentLanguage === 'gu' ? 'નવું વિશ્લેષણ' :
                 currentLanguage === 'mr' ? 'नवीन विश्लेषण' :
                 currentLanguage === 'ta' ? 'புதிய பகுப்பாய்வு' :
                 'New Analysis'}
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
              {currentLanguage === 'hi' ? 'अपने खेत के लिए सही फसल चुनें' :
               currentLanguage === 'gu' ? 'તમારા ખેતર માટે યોગ્ય પાક પસંદ કરો' :
               currentLanguage === 'mr' ? 'तुमच्या शेतासाठी योग्य पीक निवडा' :
               currentLanguage === 'ta' ? 'உங்கள் பண்ணைக்கு சரியான பயிரைத் தேர்ந்தெடுக்கவும்' :
               'Choose the Right Crop for Your Farm'}
            </h2>
            <p className="text-green-600 max-w-2xl mx-auto">
              {currentLanguage === 'hi' ? 'हमारा AI आपकी मिट्टी, जलवायु, बजट और अनुभव के आधार पर सबसे अच्छी फसलों का सुझाव देगा।' :
               currentLanguage === 'gu' ? 'અમારો AI તમારી માટી, હવામાન, બજેટ અને અનુભવના આધારે શ્રેષ્ઠ પાકોની સૂચના આપશે.' :
               currentLanguage === 'mr' ? 'आमचा AI तुमच्या माती, हवामान, बजेट आणि अनुभवाच्या आधारावर सर्वोत्तम पिकांची सूचना देईल.' :
               currentLanguage === 'ta' ? 'எங்கள் AI உங்கள் மண், காலநிலை, பட்ஜெட் மற்றும் அனुபவத்தின் அடிப்படையில் சிறந்த பயிர்களை பரிந்துரைக்கும்.' :
               'Our AI will suggest the best crops based on your soil, climate, budget, and experience.'}
            </p>
          </div>
        )}

        <div className={`${recommendations ? 'grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]' : 'max-w-4xl mx-auto'}`}>
          {/* Form Section */}
          <div className={`space-y-6 ${recommendations ? 'lg:sticky lg:top-4 lg:h-fit' : ''}`}>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-green-800">
                  {currentLanguage === 'hi' ? '📋 खेत की जानकारी भरें' :
                   currentLanguage === 'gu' ? '📋 ખેતરની માહિતી ભરો' :
                   currentLanguage === 'mr' ? '📋 शेताची माहिती भरा' :
                   currentLanguage === 'ta' ? '📋 பண்ணை தகவலை நிரப்பவும்' :
                   '📋 Fill Farm Details'}
                </h3>
                <div className="text-sm text-green-600">
                  {currentLanguage === 'hi' ? 'चरण' :
                   currentLanguage === 'gu' ? 'પગલું' :
                   currentLanguage === 'mr' ? 'चरण' :
                   currentLanguage === 'ta' ? 'படி' :
                   'Step'} {currentStep}/3
                </div>
              </div>

              {/* Step 1: Basic Information */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {currentLanguage === 'hi' ? '1️⃣ मूल जानकारी' :
                   currentLanguage === 'gu' ? '1️⃣ મૂળ માહિતી' :
                   currentLanguage === 'mr' ? '1️⃣ मूलभूत माहिती' :
                   currentLanguage === 'ta' ? '1️⃣ அடிப்படை தகவல்' :
                   '1️⃣ Basic Information'}
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentLanguage === 'hi' ? 'स्थान (जिला/राज्य)' :
                       currentLanguage === 'gu' ? 'સ્થાન (જિલ્લો/રાજ્ય)' :
                       currentLanguage === 'mr' ? 'स्थान (जिल्हा/राज्य)' :
                       currentLanguage === 'ta' ? 'இருப்பிடம் (மாவட்டம்/மாநிலம்)' :
                       'Location (District/State)'}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder={currentLanguage === 'hi' ? 'जैसे: पुणे, महाराष्ट्र' :
                                  currentLanguage === 'gu' ? 'જેમ કે: પુણે, મહારાષ્ટ્ર' :
                                  currentLanguage === 'mr' ? 'उदा: पुणे, महाराष्ट्र' :
                                  currentLanguage === 'ta' ? 'உதாரணம்: புணே, மகாராஷ்டிரா' :
                                  'e.g., Pune, Maharashtra'}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentLanguage === 'hi' ? 'खेत का आकार' :
                       currentLanguage === 'gu' ? 'ખેતરનું કદ' :
                       currentLanguage === 'mr' ? 'शेताचा आकार' :
                       currentLanguage === 'ta' ? 'பண்ணையின் அளவு' :
                       'Farm Size'}
                    </label>
                    <select
                      value={formData.farmSize}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {currentLanguage === 'hi' ? 'आकार चुनें' :
                         currentLanguage === 'gu' ? 'કદ પસંદ કરો' :
                         currentLanguage === 'mr' ? 'आकार निवडा' :
                         currentLanguage === 'ta' ? 'அளவைத் தேர்ந்தெடுக்கவும்' :
                         'Select Size'}
                      </option>
                      <option value="small">&lt; 2 {currentLanguage === 'hi' ? 'एकड़' : currentLanguage === 'gu' ? 'એકર' : currentLanguage === 'mr' ? 'एकर' : currentLanguage === 'ta' ? 'ஏக்கர்' : 'acres'}</option>
                      <option value="medium">2-10 {currentLanguage === 'hi' ? 'एकड़' : currentLanguage === 'gu' ? 'એકર' : currentLanguage === 'mr' ? 'एकर' : currentLanguage === 'ta' ? 'ஏக்கர்' : 'acres'}</option>
                      <option value="large">&gt; 10 {currentLanguage === 'hi' ? 'एकड़' : currentLanguage === 'gu' ? 'એકર' : currentLanguage === 'mr' ? 'एकर' : currentLanguage === 'ta' ? 'ஏக்கர்' : 'acres'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentLanguage === 'hi' ? 'मिट्टी का प्रकार' :
                       currentLanguage === 'gu' ? 'માટીનો પ્રકાર' :
                       currentLanguage === 'mr' ? 'मातीचा प्रकार' :
                       currentLanguage === 'ta' ? 'மண்ணின் வகை' :
                       'Soil Type'}
                    </label>
                    <select
                      value={formData.soilType}
                      onChange={(e) => handleInputChange('soilType', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {currentLanguage === 'hi' ? 'मिट्टी चुनें' :
                         currentLanguage === 'gu' ? 'માટી પસંદ કરો' :
                         currentLanguage === 'mr' ? 'माती निवडा' :
                         currentLanguage === 'ta' ? 'மண்ணைத் தேர்ந்தெடுக்கவும்' :
                         'Select Soil'}
                      </option>
                      <option value="clay">{currentLanguage === 'hi' ? 'मिट्टी (चिकनी)' : currentLanguage === 'gu' ? 'માટી (ચીકણી)' : currentLanguage === 'mr' ? 'माती (चिकट)' : currentLanguage === 'ta' ? 'களிமண்' : 'Clay'}</option>
                      <option value="loamy">{currentLanguage === 'hi' ? 'दोमट मिट्टी' : currentLanguage === 'gu' ? 'દોરસ માટી' : currentLanguage === 'mr' ? 'दोमट माती' : currentLanguage === 'ta' ? 'செம்மண்' : 'Loamy'}</option>
                      <option value="sandy">{currentLanguage === 'hi' ? 'रेतीली मिट्टी' : currentLanguage === 'gu' ? 'રેતાળ માટી' : currentLanguage === 'mr' ? 'वालुकामय माती' : currentLanguage === 'ta' ? 'மணல் மண்' : 'Sandy'}</option>
                      <option value="black">{currentLanguage === 'hi' ? 'काली मिट्टी' : currentLanguage === 'gu' ? 'કાળી માટી' : currentLanguage === 'mr' ? 'काळी माती' : currentLanguage === 'ta' ? 'கருப்பு மண்' : 'Black Soil'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentLanguage === 'hi' ? 'मौसम/सीजन' :
                       currentLanguage === 'gu' ? 'મૌસમ/સીઝન' :
                       currentLanguage === 'mr' ? 'हंगाम/सीझन' :
                       currentLanguage === 'ta' ? 'பருவம்/சீசன்' :
                       'Season'}
                    </label>
                    <select
                      value={formData.season}
                      onChange={(e) => handleInputChange('season', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {currentLanguage === 'hi' ? 'मौसम चुनें' :
                         currentLanguage === 'gu' ? 'મૌસમ પસંદ કરો' :
                         currentLanguage === 'mr' ? 'हंगाम निवडा' :
                         currentLanguage === 'ta' ? 'பருவத்தைத் தேர்ந்தெடுக்கவும்' :
                         'Select Season'}
                      </option>
                      <option value="kharif">{currentLanguage === 'hi' ? 'खरीफ (जून-अक्टूबर)' : currentLanguage === 'gu' ? 'ખરીફ (જૂન-ઓક્ટોબર)' : currentLanguage === 'mr' ? 'खरीप (जून-ऑक्टोबर)' : currentLanguage === 'ta' ? 'கரீப் (ஜூன்-அக்டோபர்)' : 'Kharif (Jun-Oct)'}</option>
                      <option value="rabi">{currentLanguage === 'hi' ? 'रबी (नवंबर-अप्रैल)' : currentLanguage === 'gu' ? 'રબી (નવેમ્બર-એપ્રિલ)' : currentLanguage === 'mr' ? 'रब्बी (नोव्हेंबर-एप्रिल)' : currentLanguage === 'ta' ? 'ரபி (நவம்பர்-ஏப்ரல்)' : 'Rabi (Nov-Apr)'}</option>
                      <option value="summer">{currentLanguage === 'hi' ? 'गर्मी (अप्रैल-जून)' : currentLanguage === 'gu' ? 'ઉનાળો (એપ્રિલ-જૂન)' : currentLanguage === 'mr' ? 'उन्हाळा (एप्रिल-जून)' : currentLanguage === 'ta' ? 'கோடை (ஏப்ரல்-ஜூன்)' : 'Summer (Apr-Jun)'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Resources */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {currentLanguage === 'hi' ? '2️⃣ संसाधन और बजट' :
                   currentLanguage === 'gu' ? '2️⃣ સંસાધન અને બજેટ' :
                   currentLanguage === 'mr' ? '2️⃣ संसाधन आणि बजेट' :
                   currentLanguage === 'ta' ? '2️⃣ வளங்கள் மற்றும் பட்ஜெட்' :
                   '2️⃣ Resources & Budget'}
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentLanguage === 'hi' ? 'पानी का स्रोत' :
                       currentLanguage === 'gu' ? 'પાણીનો સ્રોત' :
                       currentLanguage === 'mr' ? 'पाण्याचा स्रोत' :
                       currentLanguage === 'ta' ? 'நீர் மூலம்' :
                       'Water Source'}
                    </label>
                    <select
                      value={formData.waterSource}
                      onChange={(e) => handleInputChange('waterSource', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {currentLanguage === 'hi' ? 'स्रोत चुनें' :
                         currentLanguage === 'gu' ? 'સ્રોત પસંદ કરો' :
                         currentLanguage === 'mr' ? 'स्रोत निवडा' :
                         currentLanguage === 'ta' ? 'மூலத்தைத் தேர்ந்தெடுக்கவும்' :
                         'Select Source'}
                      </option>
                      <option value="rain">{currentLanguage === 'hi' ? 'बारिश पर निर्भर' : currentLanguage === 'gu' ? 'વરસાદ પર આધાર' : currentLanguage === 'mr' ? 'पावसावर अवलंबून' : currentLanguage === 'ta' ? 'மழையை நம்பியது' : 'Rain-fed'}</option>
                      <option value="tube-well">{currentLanguage === 'hi' ? 'ट्यूबवेल' : currentLanguage === 'gu' ? 'ટ્યુબવેલ' : currentLanguage === 'mr' ? 'ट्यूबवेल' : currentLanguage === 'ta' ? 'ட்யூப்வெல்' : 'Tube Well'}</option>
                      <option value="canal">{currentLanguage === 'hi' ? 'नहर' : currentLanguage === 'gu' ? 'નહેર' : currentLanguage === 'mr' ? 'कालवा' : currentLanguage === 'ta' ? 'கால்வாய்' : 'Canal'}</option>
                      <option value="river">{currentLanguage === 'hi' ? 'नदी' : currentLanguage === 'gu' ? 'નદી' : currentLanguage === 'mr' ? 'नदी' : currentLanguage === 'ta' ? 'ஆறு' : 'River'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentLanguage === 'hi' ? 'बजट (प्रति एकड़)' :
                       currentLanguage === 'gu' ? 'બજેટ (પ્રતિ એકર)' :
                       currentLanguage === 'mr' ? 'बजेट (प्रति एकर)' :
                       currentLanguage === 'ta' ? 'பட்ஜெட் (ஒரு ஏக்கருக்கு)' :
                       'Budget (Per Acre)'}
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {currentLanguage === 'hi' ? 'बजट चुनें' :
                         currentLanguage === 'gu' ? 'બજેટ પસંદ કરો' :
                         currentLanguage === 'mr' ? 'बजेट निवडा' :
                         currentLanguage === 'ta' ? 'பட்ஜெட்டைத் தேர்ந்தெடுக்கவும்' :
                         'Select Budget'}
                      </option>
                      <option value="low">₹10,000-25,000 ({currentLanguage === 'hi' ? 'कम' : currentLanguage === 'gu' ? 'ઓછું' : currentLanguage === 'mr' ? 'कमी' : currentLanguage === 'ta' ? 'குறைந்த' : 'Low'})</option>
                      <option value="medium">₹25,000-50,000 ({currentLanguage === 'hi' ? 'मध्यम' : currentLanguage === 'gu' ? 'મધ્યમ' : currentLanguage === 'mr' ? 'मध्यम' : currentLanguage === 'ta' ? 'நடுத்தர' : 'Medium'})</option>
                      <option value="high">₹50,000+ ({currentLanguage === 'hi' ? 'उच्च' : currentLanguage === 'gu' ? 'ઉચ્ચ' : currentLanguage === 'mr' ? 'उच्च' : currentLanguage === 'ta' ? 'அதிக' : 'High'})</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Experience & Preferences */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {currentLanguage === 'hi' ? '3️⃣ अनुभव और प्राथमिकताएं' :
                   currentLanguage === 'gu' ? '3️⃣ અનુભવ અને પ્રાથમિકતાઓ' :
                   currentLanguage === 'mr' ? '3️⃣ अनुभव आणि प्राधान्ये' :
                   currentLanguage === 'ta' ? '3️⃣ அனுபவம் மற்றும் முன்னுரிமைகள்' :
                   '3️⃣ Experience & Preferences'}
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentLanguage === 'hi' ? 'कृषि अनुभव' :
                       currentLanguage === 'gu' ? 'કૃષિ અનુભવ' :
                       currentLanguage === 'mr' ? 'कृषी अनुभव' :
                       currentLanguage === 'ta' ? 'விவசாய அனுபவம்' :
                       'Farming Experience'}
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {currentLanguage === 'hi' ? 'अनुभव चुनें' :
                         currentLanguage === 'gu' ? 'અનુભવ પસંદ કરો' :
                         currentLanguage === 'mr' ? 'अनुभव निवडा' :
                         currentLanguage === 'ta' ? 'அனுபவத்தைத் தேர்ந்தெடுக்கவும்' :
                         'Select Experience'}
                      </option>
                      <option value="beginner">{currentLanguage === 'hi' ? 'शुरुआती (0-2 साल)' : currentLanguage === 'gu' ? 'શરૂઆતી (0-2 વર્ષ)' : currentLanguage === 'mr' ? 'सुरुवातीचे (0-2 वर्षे)' : currentLanguage === 'ta' ? 'தொடக்கநிலை (0-2 வருடங்கள்)' : 'Beginner (0-2 years)'}</option>
                      <option value="intermediate">{currentLanguage === 'hi' ? 'मध्यम (3-10 साल)' : currentLanguage === 'gu' ? 'મધ્યમ (3-10 વર્ષ)' : currentLanguage === 'mr' ? 'मध्यम (3-10 वर्षे)' : currentLanguage === 'ta' ? 'நடுத்தர (3-10 வருடங்கள்)' : 'Intermediate (3-10 years)'}</option>
                      <option value="experienced">{currentLanguage === 'hi' ? 'अनुभवी (10+ साल)' : currentLanguage === 'gu' ? 'અનુભવી (10+ વર્ષ)' : currentLanguage === 'mr' ? 'अनुभवी (10+ वर्षे)' : currentLanguage === 'ta' ? 'அனுபவமிக்க (10+ வருடங்கள்)' : 'Experienced (10+ years)'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentLanguage === 'hi' ? 'फसल प्राथमिकता' :
                       currentLanguage === 'gu' ? 'પાક પ્રાથમિકતા' :
                       currentLanguage === 'mr' ? 'पीक प्राधान्य' :
                       currentLanguage === 'ta' ? 'பயிர் முன்னுரிமை' :
                       'Crop Preference'}
                    </label>
                    <select
                      value={formData.preference}
                      onChange={(e) => handleInputChange('preference', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="">
                        {currentLanguage === 'hi' ? 'प्राथमिकता चुनें' :
                         currentLanguage === 'gu' ? 'પ્રાથમિકતા પસંદ કરો' :
                         currentLanguage === 'mr' ? 'प्राधान्य निवडा' :
                         currentLanguage === 'ta' ? 'முன்னுரிமையைத் தேர்ந்தெடுக்கவும்' :
                         'Select Preference'}
                      </option>
                      <option value="cereals">{currentLanguage === 'hi' ? 'अनाज (गेहूं, चावल)' : currentLanguage === 'gu' ? 'અનાજ (ઘઉં, ચોખા)' : currentLanguage === 'mr' ? 'धान्य (गहू, तांदूळ)' : currentLanguage === 'ta' ? 'தானியங்கள் (கோதுமை, அரிசி)' : 'Cereals (Wheat, Rice)'}</option>
                      <option value="vegetables">{currentLanguage === 'hi' ? 'सब्जियां' : currentLanguage === 'gu' ? 'શાકભાજી' : currentLanguage === 'mr' ? 'भाज्या' : currentLanguage === 'ta' ? 'காய்கறிகள்' : 'Vegetables'}</option>
                      <option value="fruits">{currentLanguage === 'hi' ? 'फल' : currentLanguage === 'gu' ? 'ફળ' : currentLanguage === 'mr' ? 'फळे' : currentLanguage === 'ta' ? 'பழங்கள்' : 'Fruits'}</option>
                      <option value="cash-crops">{currentLanguage === 'hi' ? 'नकदी फसलें' : currentLanguage === 'gu' ? 'રોકડ પાક' : currentLanguage === 'mr' ? 'रोकड पिके' : currentLanguage === 'ta' ? 'பண பயிர்கள்' : 'Cash Crops'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={!formData.location || !formData.farmSize || !formData.soilType || !formData.season || isAnalyzing}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    (!formData.location || !formData.farmSize || !formData.soilType || !formData.season || isAnalyzing)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-3"></div>
                      {currentLanguage === 'hi' ? '🔬 AI विश्लेषण चल रहा है...' :
                       currentLanguage === 'gu' ? '🔬 AI વિશ્લેષણ ચાલી રહ્યું છે...' :
                       currentLanguage === 'mr' ? '🔬 AI विश्लेषण सुरू आहे...' :
                       currentLanguage === 'ta' ? '🔬 AI பகுப்பாய்வு நடக்கிறது...' :
                       '🔬 AI Analysis in Progress...'}
                    </div>
                  ) : (
                    <>
                      🌱 {currentLanguage === 'hi' ? 'फसल सुझाव प्राप्त करें' :
                           currentLanguage === 'gu' ? 'પાક સૂચન મેળવો' :
                           currentLanguage === 'mr' ? 'पीक सूचना मिळवा' :
                           currentLanguage === 'ta' ? 'பயிர் பரிந்துரைகளைப் பெறுங்கள்' :
                           'Get Crop Recommendations'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            {!recommendations && (
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                  💡 {currentLanguage === 'hi' ? 'सटीक सुझावों के लिए टिप्स' :
                       currentLanguage === 'gu' ? 'સચોટ સૂચનો માટે ટિપ્સ' :
                       currentLanguage === 'mr' ? 'अचूक सूचनांसाठी टिप्स' :
                       currentLanguage === 'ta' ? 'துல்லியமான பரிந்துரைகளுக்கான குறிப்புகள்' :
                       'Tips for Accurate Suggestions'}
                </h4>
                <ul className="space-y-2 text-blue-700 text-sm">
                  <li>✓ {currentLanguage === 'hi' ? 'सभी जानकारी सटीक रूप से भरें' :
                          currentLanguage === 'gu' ? 'બધી માહિતી સચોટ રીતે ભરો' :
                          currentLanguage === 'mr' ? 'सर्व माहिती अचूकपणे भरा' :
                          currentLanguage === 'ta' ? 'அனைத்து தகவலையும் துல்லியமாக நிரப்பவும்' :
                          'Fill all information accurately'}</li>
                  <li>✓ {currentLanguage === 'hi' ? 'मिट्टी की जांच कराई हो तो बेहतर' :
                          currentLanguage === 'gu' ? 'માટીની તપાસ કરાવી હોય તો વધુ સારું' :
                          currentLanguage === 'mr' ? 'मातीची तपासणी केली असेल तर चांगले' :
                          currentLanguage === 'ta' ? 'மண் பரிசோதனை செய்திருந்தால் நல்லது' :
                          'Soil testing done would be better'}</li>
                  <li>✓ {currentLanguage === 'hi' ? 'स्थानीय बाजार की कीमतें जांचें' :
                          currentLanguage === 'gu' ? 'સ્થાનિક બજારના ભાવો તપાસો' :
                          currentLanguage === 'mr' ? 'स्थानिक बाजाराच्या किमती तपासा' :
                          currentLanguage === 'ta' ? 'உள்ளூர் சந்தை விலைகளைச் சரிபார்க்கவும்' :
                          'Check local market prices'}</li>
                  <li>✓ {currentLanguage === 'hi' ? 'पानी की उपलब्धता सुनिश्चित करें' :
                          currentLanguage === 'gu' ? 'પાણીની ઉપલબ્ધતા સુનિશ્ચિત કરો' :
                          currentLanguage === 'mr' ? 'पाण्याची उपलब्धता सुनिश्चित करा' :
                          currentLanguage === 'ta' ? 'நீர் கிடைப்பதை உறுதிப்படுத்தவும்' :
                          'Ensure water availability'}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className={`space-y-6 ${recommendations ? 'overflow-y-auto lg:max-h-[calc(100vh-200px)] pr-2' : ''}`} ref={resultsRef}>
            {recommendations && (
              <>
                {/* Analysis Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-green-800">
                      {currentLanguage === 'hi' ? '🎯 विश्लेषण परिणाम' :
                       currentLanguage === 'gu' ? '🎯 વિશ્લેષણ પરિણામ' :
                       currentLanguage === 'mr' ? '🎯 विश्लेषण परिणाम' :
                       currentLanguage === 'ta' ? '🎯 பகுப்பாய்வு முடிவுகள்' :
                       '🎯 Analysis Results'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600">
                        {currentLanguage === 'hi' ? 'सटीकता:' :
                         currentLanguage === 'gu' ? 'સચોટતા:' :
                         currentLanguage === 'mr' ? 'अचूकता:' :
                         currentLanguage === 'ta' ? 'துல்லியம்:' :
                         'Accuracy:'}
                      </span>
                      <span className="font-bold text-green-700">{recommendations.confidence}%</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">{recommendations.totalCrops}</div>
                      <div className="text-sm text-green-600">
                        {currentLanguage === 'hi' ? 'सुझाई गई फसलें' :
                         currentLanguage === 'gu' ? 'સૂચવેલ પાક' :
                         currentLanguage === 'mr' ? 'सुचवलेली पिके' :
                         currentLanguage === 'ta' ? 'பரிந்துரைக்கப்பட்ட பயிர்கள்' :
                         'Recommended Crops'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">{formData.farmSize || 'N/A'}</div>
                      <div className="text-sm text-blue-600">
                        {currentLanguage === 'hi' ? 'खेत का आकार' :
                         currentLanguage === 'gu' ? 'ખેતરનું કદ' :
                         currentLanguage === 'mr' ? 'शेताचा आकार' :
                         currentLanguage === 'ta' ? 'பண்ணையின் அளவு' :
                         'Farm Size'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700">{formData.season || 'N/A'}</div>
                      <div className="text-sm text-purple-600">
                        {currentLanguage === 'hi' ? 'चयनित मौसम' :
                         currentLanguage === 'gu' ? 'પસંદ કરેલ મૌસમ' :
                         currentLanguage === 'mr' ? 'निवडलेला हंगाम' :
                         currentLanguage === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட பருவம்' :
                         'Selected Season'}
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    {currentLanguage === 'hi' ? 'विश्लेषण दिनांक:' :
                     currentLanguage === 'gu' ? 'વિશ્લેષણ તારીખ:' :
                     currentLanguage === 'mr' ? 'विश्लेषण दिनांक:' :
                     currentLanguage === 'ta' ? 'பகुप्পाय्वு தिगתি:' :
                     'Analysis Date:'} {recommendations.analysisDate}
                  </div>
                </div>

                {/* Primary Recommendation */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold flex items-center">
                      🏆 {currentLanguage === 'hi' ? 'सर्वश्रेष्ठ सिफारिश' :
                           currentLanguage === 'gu' ? 'શ્રેષ્ઠ ભલામણ' :
                           currentLanguage === 'mr' ? 'सर्वोत्तम शिफारस' :
                           currentLanguage === 'ta' ? 'சிறந்த பরிந்துरை' :
                           'Top Recommendation'}
                    </h3>
                    <div className="bg-white/20 rounded-full px-3 py-1">
                      <span className="text-sm font-semibold">{recommendations.primary.suitability}% {currentLanguage === 'hi' ? 'उपयुक्त' : currentLanguage === 'gu' ? 'યોગ્ય' : currentLanguage === 'mr' ? 'योग्य' : currentLanguage === 'ta' ? 'பொருத्तमান' : 'Match'}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-3xl font-bold mb-2">{recommendations.primary.name}</h4>
                      <p className="text-green-100 text-sm mb-4">{recommendations.primary.scientific}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className="w-4 h-4 bg-white/30 rounded mr-2">🗓️</span>
                          <span>{recommendations.primary.season}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-4 h-4 bg-white/30 rounded mr-2">⏱️</span>
                          <span>{recommendations.primary.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-4 h-4 bg-white/30 rounded mr-2">📈</span>
                          <span>{recommendations.primary.expectedYield}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4">
                      <h5 className="font-semibold mb-3">
                        {currentLanguage === 'hi' ? '💰 आर्थिक जानकारी' :
                         currentLanguage === 'gu' ? '💰 આર્થિક માહિતી' :
                         currentLanguage === 'mr' ? '💰 आर्थिक माहिती' :
                         currentLanguage === 'ta' ? '💰 பொருளாதार তথ্য' :
                         '💰 Economic Information'}
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{currentLanguage === 'hi' ? 'बाजार मूल्य:' : currentLanguage === 'gu' ? 'બજાર મૂલ્ય:' : currentLanguage === 'mr' ? 'बाजार दर:' : currentLanguage === 'ta' ? 'சந্தै मूल्य:' : 'Market Price:'}</span>
                          <span className="font-semibold">{recommendations.primary.marketPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{currentLanguage === 'hi' ? 'लाभप्रदता:' : currentLanguage === 'gu' ? 'નફાકારકતા:' : currentLanguage === 'mr' ? 'नफा:' : currentLanguage === 'ta' ? 'लाभकारীता:' : 'Profitability:'}</span>
                          <span className="font-semibold">{recommendations.primary.profitability}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{currentLanguage === 'hi' ? 'पानी की आवश्यकता:' : currentLanguage === 'gu' ? 'પાણીની જરૂર:' : currentLanguage === 'mr' ? 'पाण्याची गरज:' : currentLanguage === 'ta' ? 'நीর् आवश्यकता:' : 'Water Need:'}</span>
                          <span className="font-semibold">{recommendations.primary.waterRequirement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis - Primary Crop */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-green-800 mb-6">
                    {currentLanguage === 'hi' ? '📊 विस्तृत विश्लेषण: ' :
                     currentLanguage === 'gu' ? '📊 વિસ્તૃત વિશ્લેષણ: ' :
                     currentLanguage === 'mr' ? '📊 तपशीलवार विश्लेषण: ' :
                     currentLanguage === 'ta' ? '📊 विस्तृत विश्लेषण: ' :
                     '📊 Detailed Analysis: '}{recommendations.primary.name}
                  </h3>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Advantages */}
                    <div>
                      <h4 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                        ✅ {currentLanguage === 'hi' ? 'मुख्य लाभ' :
                            currentLanguage === 'gu' ? 'મુખ્ય ફાયદા' :
                            currentLanguage === 'mr' ? 'मुख्य फायदे' :
                            currentLanguage === 'ta' ? 'मुख्य लाभ' :
                            'Key Advantages'}
                      </h4>
                      <ul className="space-y-3">
                        {recommendations.primary.advantages.map((advantage, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="text-green-500 mt-1">💚</span>
                            <span className="text-gray-700">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                        📋 {currentLanguage === 'hi' ? 'आवश्यकताएं' :
                            currentLanguage === 'gu' ? 'આવશ્યકતાઓ' :
                            currentLanguage === 'mr' ? 'आवश्यकता' :
                            currentLanguage === 'ta' ? 'आवश्यकताएं' :
                            'Requirements'}
                      </h4>
                      <ul className="space-y-3">
                        {recommendations.primary.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="text-blue-500 mt-1">📌</span>
                            <span className="text-gray-700">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">
                      {currentLanguage === 'hi' ? '🌱 मिट्टी की उपयुक्तता:' :
                       currentLanguage === 'gu' ? '🌱 માટીની યોગ્યતા:' :
                       currentLanguage === 'mr' ? '🌱 मातीची योग्यता:' :
                       currentLanguage === 'ta' ? '🌱 மண்णின் उपयुक्तता:' :
                       '🌱 Soil Suitability:'}
                    </h5>
                    <p className="text-green-700">{recommendations.primary.soilType}</p>
                  </div>
                </div>

                {/* Secondary Recommendation */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-400">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    🥈 {currentLanguage === 'hi' ? 'वैकल्पिक सिफारिश' :
                        currentLanguage === 'gu' ? 'વૈકલ્પિક ભલામણ' :
                        currentLanguage === 'mr' ? 'पर्यायी शिफारस' :
                        currentLanguage === 'ta' ? 'மாற्ष्ट्रिक परिन्तुरै' :
                        'Alternative Recommendation'}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">{recommendations.secondary.name}</h4>
                      <p className="text-gray-500 text-sm">{recommendations.secondary.scientific}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{currentLanguage === 'hi' ? 'उपयुक्तता' : currentLanguage === 'gu' ? 'યોગ્યતા' : currentLanguage === 'mr' ? 'योग्यता' : currentLanguage === 'ta' ? 'उपयुक्तता' : 'Suitability'}</div>
                      <div className="text-xl font-bold text-orange-600">{recommendations.secondary.suitability}%</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{currentLanguage === 'hi' ? 'अवधि:' : currentLanguage === 'gu' ? 'અવધિ:' : currentLanguage === 'mr' ? 'कालावधी:' : currentLanguage === 'ta' ? 'काлावधि:' : 'Duration:'}</span>
                      <div className="font-semibold">{recommendations.secondary.duration}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">{currentLanguage === 'hi' ? 'उत्पादन:' : currentLanguage === 'gu' ? 'ઉત્પાદન:' : currentLanguage === 'mr' ? 'उत्पादन:' : currentLanguage === 'ta' ? 'उत्पादन:' : 'Yield:'}</span>
                      <div className="font-semibold">{recommendations.secondary.expectedYield}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">{currentLanguage === 'hi' ? 'लाभप्रदता:' : currentLanguage === 'gu' ? 'નફાકારકતા:' : currentLanguage === 'mr' ? 'नफाकारकता:' : currentLanguage === 'ta' ? 'लाभकारकता:' : 'Profitability:'}</span>
                      <div className="font-semibold">{recommendations.secondary.profitability}</div>
                    </div>
                  </div>
                </div>

                {/* Seasonal Planting Calendar */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-purple-800 mb-6">
                    📅 {currentLanguage === 'hi' ? 'बुआई कैलेंडर' :
                        currentLanguage === 'gu' ? 'વાવણી કૅલેન્ડર' :
                        currentLanguage === 'mr' ? 'पेरणी कॅलेंडर' :
                        currentLanguage === 'ta' ? 'விതै कैलेंडर' :
                        'Planting Calendar'}
                  </h3>

                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { month: currentLanguage === 'hi' ? 'नवंबर' : currentLanguage === 'gu' ? 'નવેમ્બર' : currentLanguage === 'mr' ? 'नोव्हेंबर' : currentLanguage === 'ta' ? 'நவம்பர்' : 'November', activity: currentLanguage === 'hi' ? 'बुआई' : currentLanguage === 'gu' ? 'વાવણી' : currentLanguage === 'mr' ? 'पेरणी' : currentLanguage === 'ta' ? 'விதைப্பு' : 'Sowing', status: 'optimal' },
                      { month: currentLanguage === 'hi' ? 'दिसंबर' : currentLanguage === 'gu' ? 'ડિસેમ્બર' : currentLanguage === 'mr' ? 'डिसेंबर' : currentLanguage === 'ta' ? 'டிசம्बर' : 'December', activity: currentLanguage === 'hi' ? 'प्रारंभिक देखभाल' : currentLanguage === 'gu' ? 'પ્રારંભિક સંભાળ' : currentLanguage === 'mr' ? 'प्रारंभिक काळजी' : currentLanguage === 'ta' ? 'प্রাথমিक যত्न' : 'Early Care', status: 'good' },
                      { month: currentLanguage === 'hi' ? 'मार्च' : currentLanguage === 'gu' ? 'માર્ચ' : currentLanguage === 'mr' ? 'मार्च' : currentLanguage === 'ta' ? 'மার्च' : 'March', activity: currentLanguage === 'hi' ? 'कटाई' : currentLanguage === 'gu' ? 'કાપણી' : currentLanguage === 'mr' ? 'कापणी' : currentLanguage === 'ta' ? 'அறুவடை' : 'Harvesting', status: 'optimal' },
                      { month: currentLanguage === 'hi' ? 'अप्रैल' : currentLanguage === 'gu' ? 'એપ્રિલ' : currentLanguage === 'mr' ? 'एप्रिल' : currentLanguage === 'ta' ? 'ஏப्रिল' : 'April', activity: currentLanguage === 'hi' ? 'बाजार में बेचना' : currentLanguage === 'gu' ? 'બજારમાં વેચાણ' : currentLanguage === 'mr' ? 'बाजारात विक्री' : currentLanguage === 'ta' ? 'சந্தैयில் विक्रী' : 'Market Sale', status: 'good' }
                    ].map((item, index) => (
                      <div key={index} className={`p-4 rounded-lg text-center ${
                        item.status === 'optimal' ? 'bg-green-100 border-2 border-green-300' : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <div className="font-bold text-lg">{item.month}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.activity}</div>
                        <div className={`text-xs mt-2 px-2 py-1 rounded ${
                          item.status === 'optimal' ? 'bg-green-200 text-green-700' : 'bg-blue-200 text-blue-700'
                        }`}>
                          {item.status === 'optimal' ? (currentLanguage === 'hi' ? 'श्रेष्ठ समय' : currentLanguage === 'gu' ? 'શ્રેષ્ઠ સમય' : currentLanguage === 'mr' ? 'श्रेष्ठ वेळ' : currentLanguage === 'ta' ? 'श्रेष्ठ समय' : 'Optimal Time') : (currentLanguage === 'hi' ? 'अच्छा समय' : currentLanguage === 'gu' ? 'સારો સમય' : currentLanguage === 'mr' ? 'चांगला वेळ' : currentLanguage === 'ta' ? 'நল्ल समय' : 'Good Time')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-gradient-to-t from-green-50 via-emerald-25 to-transparent pt-4">
                  <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold">
                    {currentLanguage === 'hi' ? '💾 रिपोर्ट सेव करें' :
                     currentLanguage === 'gu' ? '💾 રિપોર્ટ સેવ કરો' :
                     currentLanguage === 'mr' ? '💾 अहवाल सेव्ह करा' :
                     currentLanguage === 'ta' ? '💾 அறிக्कै সেभ करुঙ্গল' :
                     '💾 Save Report'}
                  </button>
                  
                  <button className="flex-1 border-2 border-green-600 text-green-700 py-3 rounded-lg hover:bg-green-50 transition-all duration-300 font-semibold">
                    {currentLanguage === 'hi' ? '📤 विशेषज्ञ से साझा करें' :
                     currentLanguage === 'gu' ? '📤 નિષ્ણાત સાથે શેર કરો' :
                     currentLanguage === 'mr' ? '📤 तज्ञांसोबत शेअर करा' :
                     currentLanguage === 'ta' ? '📤 विशेषज्ञের সাথে শেयার করুন' :
                     '📤 Share with Expert'}
                  </button>
                  
                  <button onClick={resetForm} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold">
                    {currentLanguage === 'hi' ? '🔄 नया विश्लेषण' :
                     currentLanguage === 'gu' ? '🔄 નવું વિશ્લેષણ' :
                     currentLanguage === 'mr' ? '🔄 नवीन विश्लेषण' :
                     currentLanguage === 'ta' ? '🔄 புधিয় विश्लेषण' :
                     '🔄 New Analysis'}
                  </button>
                </div>
              </>
            )}

            {!recommendations && !isAnalyzing && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  {currentLanguage === 'hi' ? '🤖 हमारा AI कैसे काम करता है' :
                   currentLanguage === 'gu' ? '🤖 અમારો AI કેવી રીતે કામ કરે છે' :
                   currentLanguage === 'mr' ? '🤖 आमचा AI कसा काम करतो' :
                   currentLanguage === 'ta' ? '🤖 எங्गള் AI எপ्पडি वेळै করतु' :
                   '🤖 How Our AI Works'}
                </h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start space-x-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">1</span>
                    <div>
                      <h4 className="font-semibold">
                        {currentLanguage === 'hi' ? 'डेटा विश्लेषण' :
                         currentLanguage === 'gu' ? 'ડેટા વિશ્લેષણ' :
                         currentLanguage === 'mr' ? 'डेटा विश्लेषण' :
                         currentLanguage === 'ta' ? 'डেটा विश्लेषण' :
                         'Data Analysis'}
                      </h4>
                      <p className="text-sm">
                        {currentLanguage === 'hi' ? 'आपकी मिट्टी, जलवायु, और स्थानीय परिस्थितियों का विश्लेषण करता है।' :
                         currentLanguage === 'gu' ? 'તમારી માટી, હવામાન અને સ્થાનિક પરિસ્થિતિઓનું વિશ્લેષણ કરે છે.' :
                         currentLanguage === 'mr' ? 'तुमची माती, हवामान आणि स्थानिक परिस्थितींचे विश्लेषण करतो.' :
                         currentLanguage === 'ta' ? 'উমার মাটি, হাওয়া আর স্থানीয় পরিস্থিতির বিশ্লেষণ করে।' :
                         'Analyzes your soil, climate, and local conditions.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">2</span>
                    <div>
                      <h4 className="font-semibold">
                        {currentLanguage === 'hi' ? 'बाजार अनुसंधान' :
                         currentLanguage === 'gu' ? 'બજાર સંશોધન' :
                         currentLanguage === 'mr' ? 'बाजार संशोधन' :
                         currentLanguage === 'ta' ? 'बाजार अनुसंधান' :
                         'Market Research'}
                      </h4>
                      <p className="text-sm">
                        {currentLanguage === 'hi' ? 'वर्तमान बाजार कीमतों और मांग का विश्लेषण करता है।' :
                         currentLanguage === 'gu' ? 'વર્તમાન બજાર ભાવ અને માંગનું વિશ્લેષણ કરે છે.' :
                         currentLanguage === 'mr' ? 'सध्याच्या बाजार किमती आणि मागणीचे विश्लेषण करतो.' :
                         currentLanguage === 'ta' ? 'বর্তমান বাজার দাম আর চাহিদার বিশ্লেষণ করে।' :
                         'Analyzes current market prices and demand trends.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">3</span>
                    <div>
                      <h4 className="font-semibold">
                        {currentLanguage === 'hi' ? 'व्यक्तिगत सुझाव' :
                         currentLanguage === 'gu' ? 'વ્યક્તિગત સૂચનો' :
                         currentLanguage === 'mr' ? 'वैयक्तिक सूचना' :
                         currentLanguage === 'ta' ? 'व्यक्तिगत सुझाव' :
                         'Personalized Suggestions'}
                      </h4>
                      <p className="text-sm">
                        {currentLanguage === 'hi' ? 'आपके बजट और अनुभव के अनुसार सबसे अच्छी फसलों का सुझाव देता है।' :
                         currentLanguage === 'gu' ? 'તમારા બજેટ અને અનુભવ અનુસાર શ્રેષ્ઠ પાકોની સૂચના આપે છે.' :
                         currentLanguage === 'mr' ? 'तुमच्या बजेट आणि अनुभवानुसार सर्वोत्तम पिकांची सूचना देतो.' :
                         currentLanguage === 'ta' ? 'তোমার বাজেট আর অভিজ্ঞতা অনুসারে সেরা ফসলের সুপারিশ দেয়।' :
                         'Recommends best crops based on your budget and experience.'}
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
