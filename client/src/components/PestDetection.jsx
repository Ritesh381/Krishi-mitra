import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from '../utils/useTranslation'
import { useNavigate } from 'react-router-dom'

function PestDetection() {
  const { t, currentLanguage } = useTranslation()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // API Configuration
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api'

  // Text-to-Speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window && currentLanguage === 'hi') {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      setIsSpeaking(true)
      
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Configure for Hindi
      utterance.lang = 'hi-IN'
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1
      
      // Handle speech end
      utterance.onend = () => {
        setIsSpeaking(false)
      }
      
      utterance.onerror = () => {
        setIsSpeaking(false)
      }
      
      // Find Hindi voice if available
      const voices = window.speechSynthesis.getVoices()
      const hindiVoice = voices.find(voice => 
        voice.lang === 'hi-IN' || voice.lang === 'hi'
      )
      
      if (hindiVoice) {
        utterance.voice = hindiVoice
      }
      
      window.speechSynthesis.speak(utterance)
    }
  }

  // Stop speech function
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // Format text to remove unwanted characters
  const formatText = (text) => {
    if (!text) return text
    
    return text
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/[.,;:]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/\//g, ' ') // Replace forward slashes with spaces
      .replace(/-+/g, '') // Remove dashes
      .replace(/"/g, '') // Remove quotation marks
  }

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  // Process uploaded file
  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage({
          url: e.target.result,
          file: file
        })
        setAnalysisResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    } else {
      setError(currentLanguage === 'hi' ? 'कृपया केवल image फाइल अपलोड करें' :
                currentLanguage === 'gu' ? 'કૃપા કરીને ફક્ત image ફાઇલ અપલોડ કરો' :
                currentLanguage === 'mr' ? 'कृपया फक्त image फाइल अपलोड करा' :
                currentLanguage === 'ta' ? 'தயவு செய்து image फাइল மட்டும் பதிவேற்றவும்' :
                'Please upload only image files')
    }
  }

  // Parse AI response
  const parseAnalysisResponse = (analysisText) => {
    try {
      const textResponse = typeof analysisText === 'string' ? analysisText : 
                          typeof analysisText === 'object' ? JSON.stringify(analysisText) : 
                          String(analysisText)

      console.log('Raw AI Response:', textResponse)

      const sections = {
        problem: '',
        symptoms: '',
        solution: ''
      }

      // Try different patterns to extract sections
      const problemPatterns = [
        /\*\*1\.\s*What is Wrong with Your Plant\?\*\*\s*(.*?)(?=\*\*2\.|$)/is,
        /1\.\s*What is Wrong with Your Plant\?\s*(.*?)(?=2\.|$)/is,
        /What is Wrong with Your Plant\?\s*(.*?)(?=Why I Think So|$)/is
      ]

      const symptomsPatterns = [
        /\*\*2\.\s*Why I Think So \(Looking at the Photo\)\*\*\s*(.*?)(?=\*\*3\.|$)/is,
        /2\.\s*Why I Think So.*?\s*(.*?)(?=3\.|$)/is,
        /Why I Think So.*?\s*(.*?)(?=Simple, Cheap Fix|$)/is
      ]

      const solutionPatterns = [
        /\*\*3\.\s*Simple, Cheap Fix\*\*\s*(.*?)$/is,
        /3\.\s*Simple, Cheap Fix\s*(.*?)$/is,
        /Simple, Cheap Fix\s*(.*?)$/is
      ]

      // Try to extract each section
      for (let pattern of problemPatterns) {
        const match = textResponse.match(pattern)
        if (match) {
          sections.problem = match[1].trim()
          break
        }
      }

      for (let pattern of symptomsPatterns) {
        const match = textResponse.match(pattern)
        if (match) {
          sections.symptoms = match[1].trim()
          break
        }
      }

      for (let pattern of solutionPatterns) {
        const match = textResponse.match(pattern)
        if (match) {
          sections.solution = match[1].trim()
          break
        }
      }

      // If sections are empty, try to extract from the full text
      if (!sections.problem && !sections.symptoms && !sections.solution) {
        sections.problem = currentLanguage === 'hi' ? 'पौधे की समस्या की पहचान' :
                          currentLanguage === 'gu' ? 'છોડની સમસ્યાની ઓળખ' :
                          currentLanguage === 'mr' ? 'वनस्पतीच्या समस्येची ओळख' :
                          currentLanguage === 'ta' ? 'தாவர समस्याची ओळख' :
                          'Plant Problem Identification'
        sections.symptoms = textResponse.substring(0, 200) + '...'
        sections.solution = textResponse.length > 200 ? textResponse.substring(200) : textResponse
      }

      const result = {
        name: formatText(sections.problem) || (currentLanguage === 'hi' ? 'पौधे की समस्या' :
                                   currentLanguage === 'gu' ? 'છોડની સમસ્યા' :
                                   currentLanguage === 'mr' ? 'वनस्पतीची समस्या' :
                                   currentLanguage === 'ta' ? 'தாவர समस्या' :
                                   'Plant Problem'),
        confidence: 90,
        severity: currentLanguage === 'hi' ? 'मध्यम' :
                  currentLanguage === 'gu' ? 'મધ્યમ' :
                  currentLanguage === 'mr' ? 'मध्यम' :
                  currentLanguage === 'ta' ? 'நடுत्तर' :
                  'Medium',
        description: formatText(sections.problem) || formatText(sections.symptoms),
        symptoms: [formatText(sections.symptoms) || textResponse.substring(0, 150)],
        solution: formatText(sections.solution) || textResponse,
        rawResponse: textResponse
      }

      return result
    } catch (error) {
      console.error('Error parsing analysis response:', error)
      return {
        name: currentLanguage === 'hi' ? 'विश्लेषण त्रुटि' :
              currentLanguage === 'gu' ? 'વિશ્લેષણ ભૂલ' :
              currentLanguage === 'mr' ? 'विश्लेषण त्रुटी' :
              currentLanguage === 'ta' ? 'पगुप्पायवु पिळै' :
              'Analysis Error',
        confidence: 0,
        severity: 'Unknown',
        description: currentLanguage === 'hi' ? 'परिणाम का विश्लेषण नहीं हो सका' :
                     currentLanguage === 'gu' ? 'પરિણામનું વિશ્લેષણ કરી શકાયું નથી' :
                     currentLanguage === 'mr' ? 'परिणामाचे विश्लेषण करू शकले नाही' :
                     currentLanguage === 'ta' ? 'முडिवुকाळ विश्लेषण कर सकाय नाहীं' :
                     'Could not analyze results',
        symptoms: [currentLanguage === 'hi' ? 'अज्ञात लक्षण' :
                   currentLanguage === 'gu' ? 'અજાણ લક્ષણો' :
                   currentLanguage === 'mr' ? 'अज्ञात लक्षणे' :
                   currentLanguage === 'ta' ? 'अज्ञात लक्षण' :
                   'Unknown symptoms'],
        solution: analysisText || 'No analysis available',
        rawResponse: analysisText
      }
    }
  }

  // Analyze image using backend API
  const analyzeImage = async () => {
    if (!uploadedImage || !uploadedImage.file) {
      setError(currentLanguage === 'hi' ? 'कृपया पहले एक image अपलोड करें' :
                currentLanguage === 'gu' ? 'કૃપા કરીને પહેલા એક image અપલોડ કરો' :
                currentLanguage === 'mr' ? 'कृपया आधी एक image अपलोड करा' :
                currentLanguage === 'ta' ? 'தयवु செய्து মুধল् एक image পधिवেर्रवুম्' :
                'Please upload an image first')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      console.log('Sending request to:', `${API_BASE_URL}/plant/analyze`)
      
      const formData = new FormData()
      formData.append('image', uploadedImage.file)

      const response = await fetch(`${API_BASE_URL}/plant/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('API Response data:', data)
      
      if (data.analysis) {
        const parsedResult = parseAnalysisResponse(data.analysis)
        setAnalysisResult(parsedResult)
        
        // Speak the result if language is Hindi
        if (currentLanguage === 'hi') {
          const speechText = `${parsedResult.name}. ${parsedResult.description}. ${parsedResult.solution}`
          setTimeout(() => {
            speakText(speechText)
          }, 1000) // Small delay to let UI update
        }
      } else {
        throw new Error('No analysis data received from server')
      }

    } catch (error) {
      console.error('Analysis failed:', error)
      
      let errorMessage = error.message
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = currentLanguage === 'hi' ? 'सर्वर से कनेक्शन नहीं हो सका। कृपया जांचें कि सर्वर चल रहा है।' :
                      currentLanguage === 'gu' ? 'સર્વર સાથે કનેક્શન નથી થઈ શકતું. કૃપા કરીને ચકાસો કે સર્વર ચાલી રહ્યું છે.' :
                      currentLanguage === 'mr' ? 'सर्व्हरशी कनेक्शन झाले नाही. कृपया तपासा की सर्व्हर चालू आहे.' :
                      currentLanguage === 'ta' ? 'সার্ভারের সাথে সংযোগ হয়নি। সার্ভার চালু আছে কিনা পরীক্ষা করুন।' :
                      'Cannot connect to server. Please check if the server is running.'
      }
      
      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Reset function
  const resetAnalysis = () => {
    stopSpeech() // Stop any ongoing speech
    setUploadedImage(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      const loadVoices = () => {
        window.speechSynthesis.getVoices()
      }
      
      loadVoices()
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [])

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
                <span className="text-white font-bold text-xl">🔍</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">
                  {currentLanguage === 'hi' ? 'कीट पहचान' :
                   currentLanguage === 'gu' ? 'કીડા પહેચાન' :
                   currentLanguage === 'mr' ? 'कीड ओळख' :
                   currentLanguage === 'ta' ? 'பூச्चि कण्डरिदल्' :
                   'Pest Detection'}
                </h1>
                <p className="text-sm text-green-600">
                  {currentLanguage === 'hi' ? 'AI-संचालित फसल निदान' :
                   currentLanguage === 'gu' ? 'AI-સંચાલિત પાક નિદાન' :
                   currentLanguage === 'mr' ? 'AI-चालित पीक निदान' :
                   currentLanguage === 'ta' ? 'AI-இयक्कप्पडुम् பयிर् नोय् কण্ডরিदல्' :
                   'AI-Powered Crop Diagnosis'}
                </p>
              </div>
            </div>
            
            {analysisResult && (
              <div className="flex items-center space-x-3">
                {/* Voice Control Buttons for Hindi */}
                {currentLanguage === 'hi' && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        const speechText = `${analysisResult.name}. ${analysisResult.description}. ${analysisResult.solution}`
                        speakText(speechText)
                      }}
                      disabled={isSpeaking}
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors disabled:opacity-50"
                      title="आवाज में सुनें"
                    >
                      <span className="text-xl">{isSpeaking ? '🔊' : '🔇'}</span>
                    </button>
                    {isSpeaking && (
                      <button 
                        onClick={stopSpeech}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                        title="आवाज बंद करें"
                      >
                        <span className="text-xl">⏹️</span>
                      </button>
                    )}
                  </div>
                )}
                
                <button 
                  onClick={resetAnalysis}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  {currentLanguage === 'hi' ? 'नया स्कैन' :
                   currentLanguage === 'gu' ? 'નવું સ્કેન' :
                   currentLanguage === 'mr' ? 'नवीन स्कॅन' :
                   currentLanguage === 'ta' ? 'புதिয় स्कैन्' :
                   'New Scan'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!uploadedImage && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              {currentLanguage === 'hi' ? 'अपनी फसल की फोटो अपलोड करें' :
               currentLanguage === 'gu' ? 'તમારા પાકનો ફોટો અપલોડ કરો' :
               currentLanguage === 'mr' ? 'तुमच्या पिकाचा फोटो अपलोड करा' :
               currentLanguage === 'ta' ? 'உங்கள் பயிர்-இன் புকैप्पडम् পতिवের्रवুम्' :
               'Upload Your Crop Photo'}
            </h2>
            <p className="text-green-600 max-w-2xl mx-auto">
              {currentLanguage === 'hi' ? 'हमारा AI तुरंत कीटों की पहचान करेगा और उपचार सुझाएगा। सर्वोत्तम परिणामों के लिए स्पष्ट, अच्छी रोशनी वाली तस्वीर लें।' :
               currentLanguage === 'gu' ? 'અમારો AI તુરંત કીડાઓની પહેચાણ કરશે અને સારવારની સૂચના આપશે. શ્રેષ્ઠ પરિણામો માટે સ્પષ્ટ, સારી પ્રકાશવાળી તસવીર લો.' :
               currentLanguage === 'mr' ? 'आमचा AI तत्काळ कीडांची ओळख करेल आणि उपचाराची सूचना देईल. सर्वोत्तम परिणामांसाठी स्पष्ट, चांगल्या प्रकाशातील फोटो घ्या.' :
               currentLanguage === 'ta' ? 'எங்கள் AI உடनडियाग पूच्चिकरै কण্ডরিन্দু চিকিৎসैয়ै পরিন্দুরैক্কুম्. चिरन्द मुडिवुकाळुक्कु তेळিবान, नल्ल বেळিচ্চত্दিল् পুকैप্পडম্ এডুক্কবুম্.' :
               'Our AI will instantly identify pests and suggest treatments. Take a clear, well-lit photo for best results.'}
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <div>
                <h4 className="text-red-800 font-semibold">
                  {currentLanguage === 'hi' ? 'त्रुटि' :
                   currentLanguage === 'gu' ? 'ભૂલ' :
                   currentLanguage === 'mr' ? 'त्रुटী' :
                   currentLanguage === 'ta' ? 'पिळै' :
                   'Error'}
                </h4>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className={`${analysisResult ? 'grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]' : 'grid lg:grid-cols-2 gap-8'}`}>
          {/* Left Side - Upload Section */}
          <div className={`space-y-6 ${analysisResult ? 'lg:sticky lg:top-4 lg:h-fit' : ''}`}>
            {!uploadedImage ? (
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-green-300 bg-white/50 hover:bg-white/70'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl text-green-600">📸</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  {currentLanguage === 'hi' ? 'फोटो खींचें या अपलोड करें' :
                   currentLanguage === 'gu' ? 'ફોટો લો અથવા અપલોડ કરો' :
                   currentLanguage === 'mr' ? 'फोटो काढा किंवा अपलोड करा' :
                   currentLanguage === 'ta' ? 'புകैप্পডম् এডুক্কवुम् अल्लदु পধिவের্র্বুম्' :
                   'Take Photo or Upload'}
                </h3>
                
                <p className="text-green-600 mb-6">
                  {currentLanguage === 'hi' ? 'फाइलों को यहाँ खींचें या ब्राउज़ करें' :
                   currentLanguage === 'gu' ? 'ફાઇલોને અહીં ખેંચો અથવા બ્રાઉઝ કરો' :
                   currentLanguage === 'mr' ? 'फाइल्स येथे ओढा किंवा ब्राउझ करा' :
                   currentLanguage === 'ta' ? 'கோপ্পুকłै ইঙ্গে ইঝুক্কবুম् অল্লদু উলাবुক' :
                   'Drag files here or browse'}
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    📁 {currentLanguage === 'hi' ? 'गैलरी से चुनें' :
                         currentLanguage === 'gu' ? 'ગેલેરીમાંથી પસંદ કરો' :
                         currentLanguage === 'mr' ? 'गॅलरीतून निवडा' :
                         currentLanguage === 'ta' ? 'গেলরিয়িলিরুন্দু তের্ন্দেডুক্কবুম্' :
                         'Choose from Gallery'}
                  </button>
                  
                  <button
                    onClick={() => {
                      fileInputRef.current?.click()
                    }}
                    className="border-2 border-green-600 text-green-700 px-6 py-3 rounded-lg hover:bg-green-50 transition-all duration-300 font-semibold"
                  >
                    📷 {currentLanguage === 'hi' ? 'कैमरा खोलें' :
                         currentLanguage === 'gu' ? 'કેમેરા ખોલો' :
                         currentLanguage === 'mr' ? 'कॅमेरा उघडा' :
                         currentLanguage === 'ta' ? 'কেমরাবै তিরক্কবুম্' :
                         'Open Camera'}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="mt-6 text-sm text-green-500">
                  <p>{currentLanguage === 'hi' ? 'समर्थित फाइल: JPG, PNG, WEBP (अधिकतम 10MB)' :
                      currentLanguage === 'gu' ? 'સપોર્ટેડ ફાઇલો: JPG, PNG, WEBP (મહત્તમ 10MB)' :
                      currentLanguage === 'mr' ? 'समर्थित फाइल: JPG, PNG, WEBP (कमाल 10MB)' :
                      currentLanguage === 'ta' ? 'आधरিক્কপ্পট্ট কোপ্পুকাळ্: JPG, PNG, WEBP (অধিকপক্ষম্ 10MB)' :
                      'Supported files: JPG, PNG, WEBP (Max 10MB)'}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  {currentLanguage === 'hi' ? 'अपलोड की गई तस्वीर' :
                   currentLanguage === 'gu' ? 'અપલોડ થયેલી તસવીર' :
                   currentLanguage === 'mr' ? 'अपलोड केलेला फोटो' :
                   currentLanguage === 'ta' ? 'পধিবের্র্प্পট্ট পডম্' :
                   'Uploaded Image'}
                </h3>
                
                <div className="relative">
                  <img
                    src={uploadedImage.url}
                    alt="Uploaded crop"
                    className="w-full h-64 object-cover rounded-xl border-2 border-green-100"
                  />
                  
                  {!isAnalyzing && !analysisResult && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                      <button
                        onClick={analyzeImage}
                        className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        🔍 {currentLanguage === 'hi' ? 'विश्लेषण शुरू करें' :
                             currentLanguage === 'gu' ? 'વિશ્લેષણ શરૂ કરો' :
                             currentLanguage === 'mr' ? 'विश्लेषण सुरू करा' :
                             currentLanguage === 'ta' ? 'পকুপ্পায়্বै তোডাঙ্গবুম্' :
                             'Start Analysis'}
                      </button>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center text-white">
                      <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mb-4"></div>
                      <p className="text-lg font-semibold">
                        {currentLanguage === 'hi' ? '🔬 AI विश्लेषण चल रहा है...' :
                         currentLanguage === 'gu' ? '🔬 AI વિશ્લેષણ ચાલી રહ્યું છે...' :
                         currentLanguage === 'mr' ? '🔬 AI विश्लेषण सुरू आहे...' :
                         currentLanguage === 'ta' ? '🔬 AI পকুপ্পায়্বু নডক্কিরাদু...' :
                         '🔬 AI Analysis in Progress...'}
                      </p>
                      <p className="text-sm mt-2 opacity-80">
                        {currentLanguage === 'hi' ? 'कृपया प्रतीक्षा करें...' :
                         currentLanguage === 'gu' ? 'કૃપા કરીને રાહ જુઓ...' :
                         currentLanguage === 'mr' ? 'कृपया प्रतीक्षा करा...' :
                         currentLanguage === 'ta' ? 'তয়বুসে কাঝিয়া করুন্...' :
                         'Please wait...'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={resetAnalysis}
                    className="flex-1 border-2 border-green-600 text-green-700 py-2 rounded-lg hover:bg-green-50 transition-all duration-300"
                  >
                    {currentLanguage === 'hi' ? 'नई तस्वीर' :
                     currentLanguage === 'gu' ? 'નવી તસવીર' :
                     currentLanguage === 'mr' ? 'नवीन फोटो' :
                     currentLanguage === 'ta' ? 'পুধিয় পडম্' :
                     'New Image'}
                  </button>
                  
                  {!isAnalyzing && !analysisResult && (
                    <button
                      onClick={analyzeImage}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      {currentLanguage === 'hi' ? 'विश्लेषण करें' :
                       currentLanguage === 'gu' ? 'વિશ્લેષણ કરો' :
                       currentLanguage === 'mr' ? 'विश्लेषण करा' :
                       currentLanguage === 'ta' ? 'পকুপ্পায়্বু করুন্' :
                       'Analyze'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tips Section - Show when no results */}
            {!analysisResult && (
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                  💡 {currentLanguage === 'hi' ? 'बेहतर परिणामों के लिए सुझाव' :
                       currentLanguage === 'gu' ? 'બેહતર પરિણામો માટે સૂચનો' :
                       currentLanguage === 'mr' ? 'चांगल्या परिणामांसाठी सूचना' :
                       currentLanguage === 'ta' ? 'চিরন্দ মুডিবুকাळুক্কু সুঝাবে' :
                       'Tips for Better Results'}
                </h4>
                <ul className="space-y-2 text-blue-700 text-sm">
                  <li>✓ {currentLanguage === 'hi' ? 'स्पष्ट, उच्च गुणवत्ता वाली छवि का उपयोग करें' :
                          currentLanguage === 'gu' ? 'સ્પષ્ટ, ઉચ્ચ ગુણવત્તાવાળી છબીનો ઉપયોગ કરો' :
                          currentLanguage === 'mr' ? 'स्पष्ट, उच्च गुणवत्तेची प्रतिमा वापरा' :
                          currentLanguage === 'ta' ? 'তেळিবান, উচ্চ গুণবত্তা বাळী ছবির কা উপয়োগ করেন্' :
                          'Use clear, high-quality images'}</li>
                  <li>✓ {currentLanguage === 'hi' ? 'प्राकृतिक प्रकाश में फोटो लें' :
                          currentLanguage === 'gu' ? 'પ્રાકૃતિક પ્રકાશમાં ફોટો લો' :
                          currentLanguage === 'mr' ? 'नैसर्गिक प्रकाशात फोटो काढा' :
                          currentLanguage === 'ta' ? 'ইয়র্কै প্রকাশমী ফোটো লো' :
                          'Take photos in natural light'}</li>
                  <li>✓ {currentLanguage === 'hi' ? 'प्रभावित क्षेत्र पर फोकस करें' :
                          currentLanguage === 'gu' ? 'પ્રભાવિત વિસ્તાર પર ફોકસ કરો' :
                          currentLanguage === 'mr' ? 'प्रभावित क्षेत्रावर फोकस करा' :
                          currentLanguage === 'ta' ? 'প্রভাবিত ক্ষেত্র পর ফোকস করো' :
                          'Focus on affected areas'}</li>
                  <li>✓ {currentLanguage === 'hi' ? 'कई कोणों से तस्वीरें लें' :
                          currentLanguage === 'gu' ? 'ઘણા કોણોથી તસવીરો લો' :
                          currentLanguage === 'mr' ? 'अनेक कोनातून फोटो काढा' :
                          currentLanguage === 'ta' ? 'পলা কোণাঙ্গুळীল উপর ফোটো লো' :
                          'Capture from multiple angles'}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Right Side - Results Section */}
          <div className={`space-y-6 ${analysisResult ? 'overflow-y-auto lg:max-h-[calc(100vh-200px)] pr-2' : ''}`}>
            {analysisResult ? (
              <>
                {/* Detection Results */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-green-800">
                      {currentLanguage === 'hi' ? '🎯 पहचान परिणाम' :
                       currentLanguage === 'gu' ? '🎯 પહેચાણ પરિણામ' :
                       currentLanguage === 'mr' ? '🎯 ओळख परिणाम' :
                       currentLanguage === 'ta' ? '🎯 অডয়াळত্ পরিণাম' :
                       '🎯 Detection Results'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600">
                        {currentLanguage === 'hi' ? 'विश्वसनीयता:' :
                         currentLanguage === 'gu' ? 'વિશ્વસનીયતા:' :
                         currentLanguage === 'mr' ? 'विश्वसनीयता:' :
                         currentLanguage === 'ta' ? 'বিশ্বসনীয়তা:' :
                         'Confidence:'}
                      </span>
                      <span className="font-bold text-green-700">{analysisResult.confidence}%</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-orange-400 pl-4 mb-6">
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">{analysisResult.name}</h4>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        analysisResult.severity === 'High' || analysisResult.severity === 'उच्च' ? 'bg-red-100 text-red-700' :
                        analysisResult.severity === 'Medium' || analysisResult.severity === 'मध्यम' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {currentLanguage === 'hi' ? 'गंभीरता:' :
                         currentLanguage === 'gu' ? 'ગંભીરતા:' :
                         currentLanguage === 'mr' ? 'गंभीरता:' :
                         currentLanguage === 'ta' ? 'গম্ভীরতা:' :
                         'Severity:'} {analysisResult.severity}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">
                      {currentLanguage === 'hi' ? 'समस्या का विवरण:' :
                       currentLanguage === 'gu' ? 'સમસ્યાનું વિવરણ:' :
                       currentLanguage === 'mr' ? 'समस्येचे वर्णन:' :
                       currentLanguage === 'ta' ? 'সমস্যার বিবরণ:' :
                       'Problem Description:'}
                    </h5>
                    <p className="text-gray-700">{analysisResult.description}</p>
                  </div>
                </div>

                {/* Symptoms */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                    ⚠️ {currentLanguage === 'hi' ? 'देखे गए लक्षण' :
                        currentLanguage === 'gu' ? 'જોવામાં આવેલા લક્ષણો' :
                        currentLanguage === 'mr' ? 'पाहिलेली लक्षणे' :
                        currentLanguage === 'ta' ? 'দেখা গেছে লক্ষণ' :
                        'Observed Symptoms'}
                  </h3>
                  <ul className="space-y-3">
                    {analysisResult.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="text-gray-700">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment Solution */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center">
                    💊 {currentLanguage === 'hi' ? 'सरल और सस्ता उपचार' :
                        currentLanguage === 'gu' ? 'સરળ અને સસ્તો ઉપચાર' :
                        currentLanguage === 'mr' ? 'सोपा आणि स्वस्त उपचार' :
                        currentLanguage === 'ta' ? 'সরল আর সস্তা উপচার' :
                        'Simple & Cheap Treatment'}
                  </h3>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="prose prose-green max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {analysisResult.solution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-gradient-to-t from-green-50 via-emerald-25 to-transparent pt-4">
                  <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold">
                    {currentLanguage === 'hi' ? '📋 रिपोर्ट सेव करें' :
                     currentLanguage === 'gu' ? '📋 રિપોર્ટ સેવ કરો' :
                     currentLanguage === 'mr' ? '📋 रिपोर्ट सेव्ह करा' :
                     currentLanguage === 'ta' ? '📋 রিপোর্ট সেভ করুন' :
                     '📋 Save Report'}
                  </button>
                  
                  <button className="flex-1 border-2 border-green-600 text-green-700 py-3 rounded-lg hover:bg-green-50 transition-all duration-300 font-semibold">
                    {currentLanguage === 'hi' ? '📤 विशेषज्ञ से साझा करें' :
                     currentLanguage === 'gu' ? '📤 નિષ્ણાત સાથે શેર કરો' :
                     currentLanguage === 'mr' ? '📤 तज्ञांसोबत शेअर करा' :
                     currentLanguage === 'ta' ? '📤 নিপুণাংসহ শেয়ার করা' :
                     '📤 Share with Expert'}
                  </button>
                </div>
              </>
            ) : (
              !uploadedImage && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-green-800 mb-4">
                    {currentLanguage === 'hi' ? '🔬 हमारा AI कैसे काम करता है' :
                     currentLanguage === 'gu' ? '🔬 અમારો AI કેવી રીતે કામ કરે છે' :
                     currentLanguage === 'mr' ? '🔬 आमचा AI कसा काम करतो' :
                     currentLanguage === 'ta' ? '🔬 এঙ্গাळ AI এপপডি ভেলै করতু' :
                     '🔬 How Our AI Works'}
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start space-x-3">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">1</span>
                      <div>
                        <h4 className="font-semibold">
                          {currentLanguage === 'hi' ? 'छवि विश्लेषण' :
                           currentLanguage === 'gu' ? 'છબી વિશ્લેષણ' :
                           currentLanguage === 'mr' ? 'प्रतिमा विश्लेषण' :
                           currentLanguage === 'ta' ? 'ছবি বিশ্লেষণ' :
                           'Image Analysis'}
                        </h4>
                        <p className="text-sm">
                          {currentLanguage === 'hi' ? 'आपकी फसल की तस्वीर का विस्तृत विश्लेषण करता है।' :
                           currentLanguage === 'gu' ? 'તમારા પાકની તસવીરનું વિસ્તૃત વિશ્લેષણ કરે છે.' :
                           currentLanguage === 'mr' ? 'तुमच्या पिकाच्या फोटोचे तपशीलवार विश्लेषण करतो।' :
                           currentLanguage === 'ta' ? 'তোমার ফসলের ছবির বিস্তৃত বিশ্লেষণ করে।' :
                           'Performs detailed analysis of your crop photo.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">2</span>
                      <div>
                        <h4 className="font-semibold">
                          {currentLanguage === 'hi' ? 'समस्या पहचान' :
                           currentLanguage === 'gu' ? 'સમસ્યા ઓળખ' :
                           currentLanguage === 'mr' ? 'समस्या ओळख' :
                           currentLanguage === 'ta' ? 'সমস্যা ওলख' :
                           'Problem Identification'}
                        </h4>
                        <p className="text-sm">
                          {currentLanguage === 'hi' ? 'फसल की समस्याओं और कीटों की सटीक पहचान करता है।' :
                           currentLanguage === 'gu' ? 'પાકની સમસ્યાઓ અને કીડાઓની ચોક્કસ ઓળખ કરે છે.' :
                           currentLanguage === 'mr' ? 'पिकातील समस्या आणि किडांची अचूक ओळख करतो।' :
                           currentLanguage === 'ta' ? 'ফসলের সমস্যা আর কীটার সঠিক ওলख করে।' :
                           'Accurately identifies crop problems and pests.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">3</span>
                      <div>
                        <h4 className="font-semibold">
                          {currentLanguage === 'hi' ? 'सरल उपचार सुझाव' :
                           currentLanguage === 'gu' ? 'સરળ ઉપચાર સૂચન' :
                           currentLanguage === 'mr' ? 'सोपे उपचार सूचना' :
                           currentLanguage === 'ta' ? 'সরল উপচার সুঝাভ' :
                           'Simple Treatment Suggestions'}
                        </h4>
                        <p className="text-sm">
                          {currentLanguage === 'hi' ? 'सस्ते और आसान तरीकों से इलाज के सुझाव देता है।' :
                           currentLanguage === 'gu' ? 'સસ્તી અને સરળ પદ્ધતિઓથી સારવારની સૂચના આપે છે.' :
                           currentLanguage === 'mr' ? 'स्वस्त आणि सोप्या पद्धतींनी उपचाराच्या सूचना देतो।' :
                           currentLanguage === 'ta' ? 'সস্তা আর সহজ উপায়ে চিকিৎসার সুপারিশ দেয়।' :
                           'Provides affordable and easy treatment recommendations.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
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
        
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #10b981 #f1f5f9;
        }
      `}</style>
    </div>
  )
}

export default PestDetection
