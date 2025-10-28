import React, { useState, useEffect } from 'react'
import { useTranslation } from '../utils/useTranslation'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const { t, currentLanguage } = useTranslation()
  const [isVisible, setIsVisible] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isVoicePlaying, setIsVoicePlaying] = useState(false)
  const [hasVoicePlayed, setHasVoicePlayed] = useState(false)
  const navigate = useNavigate()

  const handleSignupRedirect = () => {
    navigate('/signup')
  }
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
    
    // Loading effect
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)
    
    return () => clearTimeout(loadingTimer)
  }, [])

  // Voice feature for non-English languages (currently only Hindi)
  useEffect(() => {
    if (!isLoading && !hasVoicePlayed && currentLanguage === 'hi') {
      // Wait a bit after loading completes to start voice
      const voiceTimer = setTimeout(() => {
        playWelcomeVoice()
      }, 1000)
      
      return () => clearTimeout(voiceTimer)
    }
  }, [isLoading, currentLanguage, hasVoicePlayed])

  const playWelcomeVoice = () => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel()
      
      const hindiScript = `
        नमस्कार किसान भाइयों और बहनों। 
        आपका स्वागत है कृषि मित्र में। 
        कृषि मित्र एक स्मार्ट फार्मिंग ऐप है जो आपकी खेती में मदद करता है। 
        
        हमारा ऐप आपको देता है:
        एआई से फसल की सलाह, 
        कीट की पहचान फोटो खींचकर, 
        मौसम की जानकारी, 
        और बाज़ार के भाव। 
        
        सब कुछ हिंदी में, आपकी अपनी भाषा में। 
        
        अगर आप इस ऐप को इस्तेमाल करना चाहते हैं, 
        तो स्क्रीन के ऊपर दाईं तरफ हरे बटन पर क्लिक करें। 
        वहाँ लिखा है "शुरू करें"। 
        
        धन्यवाद। आपकी खेती, हमारी प्राथमिकता।
      `
      
      const utterance = new SpeechSynthesisUtterance(hindiScript.trim())
      
      // Configure voice settings
      utterance.lang = 'hi-IN' // Hindi language
      utterance.rate = 0.8 // Slightly slower for better understanding
      utterance.pitch = 1.0 // Normal pitch
      utterance.volume = 0.8 // Slightly lower volume
      
      // Event listeners
      utterance.onstart = () => {
        setIsVoicePlaying(true)
        console.log('Voice started playing')
      }
      
      utterance.onend = () => {
        setIsVoicePlaying(false)
        setHasVoicePlayed(true)
        console.log('Voice finished playing')
      }
      
      utterance.onerror = (event) => {
        setIsVoicePlaying(false)
        console.log('Voice error:', event.error)
      }
      
      // Try to set Hindi voice if available
      const voices = window.speechSynthesis.getVoices()
      const hindiVoice = voices.find(voice => 
        voice.lang.includes('hi') || 
        voice.name.includes('Hindi') || 
        voice.name.includes('हिंदी')
      )
      
      if (hindiVoice) {
        utterance.voice = hindiVoice
      }
      
      // Speak
      window.speechSynthesis.speak(utterance)
    } else {
      console.log('Speech synthesis not supported')
    }
  }

  const stopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsVoicePlaying(false)
    }
  }

  const replayVoice = () => {
    if (currentLanguage === 'hi') {
      setHasVoicePlayed(false)
      playWelcomeVoice()
    }
  }

  // Rest of your existing useEffect for animations
  useEffect(() => {
    if (!isLoading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(prev => ({
                ...prev,
                [entry.target.id]: true
              }))
            }
          })
        },
        { threshold: 0.1 }
      )

      document.querySelectorAll('[data-animate]').forEach((el) => {
        observer.observe(el)
      })

      return () => observer.disconnect()
    }
  }, [isLoading])

  // Your existing feature arrays and stats
  const features = [
    {
      icon: "🗣️",
      title: t('voiceChat'),
      description: t('voiceChatDesc'),
      benefit: t('voiceChatBenefit')
    },
    {
      icon: "🌾", 
      title: t('smartCrop'),
      description: t('smartCropDesc'),
      benefit: t('smartCropBenefit')
    },
    {
      icon: "🐛",
      title: t('pestDetection'),
      description: t('pestDetectionDesc'),
      benefit: t('pestDetectionBenefit')
    },
    {
      icon: "💧",
      title: t('irrigation'),
      description: t('irrigationDesc'),
      benefit: t('irrigationBenefit')
    }
  ]

  const stats = [
    { number: "40%", label: t('yieldPrevented') },
    { number: "5+", label: t('localLanguages') },
    { number: "24/7", label: t('aiSupport') },
    { number: "1000+", label: t('farmersHelped') }
  ]

  // Loading Screen (same as before)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-lime-50 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-emerald-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-lime-400 rounded-full animate-pulse delay-2000"></div>
        </div>

        {/* Main Loading Content */}
        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-2xl animate-bounce">
              <span className="text-white font-bold text-4xl">🌾</span>
            </div>
          </div>

          {/* App Name */}
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-800 via-emerald-700 to-green-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            {t('appName')}
          </h1>

          {/* Loading Text */}
          <p className="text-xl text-green-700 mb-8 animate-fade-in-delay">
            {currentLanguage === 'hi' ? 'आपके कृषि साथी को तैयार कर रहे हैं...' :
             currentLanguage === 'gu' ? 'તમારા કૃષિ સાથીને તૈયાર કરી રહ્યા છીએ...' :
             currentLanguage === 'mr' ? 'तुमच्या शेती साथीदाराला तयार करत आहे...' :
             currentLanguage === 'ta' ? 'உங்கள் விவசாய துணையை தயார் செய்கிறோம்...' :
             'Preparing your farming companion...'}
          </p>

          {/* Loading Spinner */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce delay-200"></div>
          </div>

          {/* Loading Progress Messages */}
          <div className="mt-8 text-green-600">
            <div className="animate-pulse">
              <p className="text-sm">🌱 Loading smart crop suggestions...</p>
            </div>
          </div>
        </div>

        {/* Loading Styles */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }
          .animate-fade-in-delay {
            animation: fade-in 0.8s ease-out 0.3s forwards;
            opacity: 0;
          }
          .delay-100 {
            animation-delay: 0.1s;
          }
          .delay-200 {
            animation-delay: 0.2s;
          }
          .delay-1000 {
            animation-delay: 1s;
          }
          .delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-lime-50">
      {/* Voice Control Panel - Only show for Hindi */}
      {currentLanguage === 'hi' && (
        <div className="fixed top-20 right-4 z-40 flex flex-col gap-2">
          {isVoicePlaying && (
            <button
              onClick={stopVoice}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 animate-pulse"
              title="आवाज़ बंद करें"
            >
              <span className="text-lg">🔇</span>
            </button>
          )}
          
          {hasVoicePlayed && !isVoicePlaying && (
            <button
              onClick={replayVoice}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
              title="दोबारा सुनें"
            >
              <span className="text-lg">🔊</span>
            </button>
          )}
          
          {isVoicePlaying && (
            <div className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
              🎤 सुन रहे हैं...
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌾</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">
                {t('appName')}
              </span>
            </div>
            
            {/* Enhanced Get Started Button with Animation for Hindi */}
            <button className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold ${
              currentLanguage === 'hi' && hasVoicePlayed ? 'animate-pulse ring-4 ring-green-300' : ''
            }`} onClick={handleSignupRedirect}>
              {t('getStarted')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" id="hero" data-animate>
            <div className={`transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-800 via-emerald-700 to-green-600 bg-clip-text text-transparent mb-6 leading-tight animate-slide-in">
                {t('appName')}
                <span className="block text-3xl md:text-4xl mt-2 text-green-700">
                  {t('tagline')}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-green-600 max-w-4xl mx-auto mb-8 leading-relaxed animate-slide-in-delay">
                {t('heroDescription')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-in-delay-2">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden" onClick={handleSignupRedirect}>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center">
                    {t('startFarming')}
                  </span>
                </button>
                
                <button className="group px-8 py-4 border-2 border-green-600 text-green-700 rounded-xl text-lg font-semibold hover:bg-green-50 transition-all duration-300 flex items-center">
                  <span className="mr-2">▶️</span>
                  {t('watchDemo')}
                </button>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-in-delay-3">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white/60 rounded-xl backdrop-blur-sm border border-green-100">
                    <div className="text-2xl md:text-3xl font-bold text-green-700 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50" id="problem" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 delay-200 ${isVisible.problem ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                {t('challengeTitle')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('challengeSubtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🌱", title: t('wrongCrop'), desc: t('wrongCropDesc') },
                { icon: "🐛", title: t('pestAttacks'), desc: t('pestAttacksDesc') },
                { icon: "💧", title: t('poorIrrigation'), desc: t('poorIrrigationDesc') },
                { icon: "📱", title: t('digitalBarrier'), desc: t('digitalBarrierDesc') }
              ].map((problem, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-400 hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl mb-4">{problem.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{problem.title}</h3>
                  <p className="text-gray-600">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16" id="solution" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 delay-300 ${isVisible.solution ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent mb-6">
                {t('solutionTitle')}
              </h2>
              <p className="text-xl text-green-600 max-w-3xl mx-auto">
                {t('solutionSubtitle')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-green-100">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {feature.description}
                    </p>
                    <div className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block">
                      {feature.benefit}
                    </div>
                  </div>
                ))}
              </div>

              {/* Demo Mockup */}
              <div className="relative">
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-700">
                          🎤 {currentLanguage === 'hi' ? '"मेरी फसल में कीड़े लगे हैं"' :
                              currentLanguage === 'gu' ? '"મારા પાકમાં કીડાઓ લાગ્યા છે"' :
                              currentLanguage === 'mr' ? '"माझ्या पिकावर कीड लागले आहेत"' :
                              currentLanguage === 'ta' ? '"எனது பயிரில் பூச்சி தாக்குதல் உள்ளது"' :
                              '"My crops have pest attack"'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">📸 Photo uploaded...</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-700">🤖 Detected: Aphids. Treatment: Neem oil spray recommended.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-green-900 to-emerald-900 text-white" id="how-it-works" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 delay-400 ${isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t('howItWorks')}
              </h2>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                {t('howItWorksSubtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: t('step1Title'), desc: t('step1Desc'), icon: "🗣️" },
                { step: "2", title: t('step2Title'), desc: t('step2Desc'), icon: "🧠" },
                { step: "3", title: t('step3Title'), desc: t('step3Desc'), icon: "✅" }
              ].map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-green-700 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-green-100 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16" id="benefits" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 delay-500 ${isVisible.benefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent mb-6">
                {t('whyChoose')}
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: t('increaseYield'),
                  description: t('increaseYieldDesc'),
                  icon: "📈",
                  color: "from-green-500 to-emerald-600"
                },
                {
                  title: t('saveTime'),
                  description: t('saveTimeDesc'),
                  icon: "💰",
                  color: "from-emerald-500 to-teal-600"
                },
                {
                  title: t('expertAdvice'),
                  description: t('expertAdviceDesc'),
                  icon: "🕒",
                  color: "from-teal-500 to-cyan-600"
                }
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-green-100"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-4 group-hover:text-green-900 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600" id="cta" data-animate>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 delay-600 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              {t('ctaSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative px-8 py-4 bg-white text-green-700 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden" onClick={handleSignupRedirect}>
                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  {t('startTrial')}
                  <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
              
              <button className="px-8 py-4 border-2 border-white text-white rounded-xl text-lg font-semibold hover:bg-white hover:text-green-700 transition-all duration-300">
                {t('contactSupport')}
              </button>
            </div>

            <p className="text-green-100 text-sm mt-6">
              ✓ No credit card required  ✓ 7-day free trial  ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">🌾</span>
                </div>
                <span className="text-3xl font-bold">{t('appName')}</span>
              </div>
              <p className="text-green-200 leading-relaxed mb-4">
                {t('footerTagline')}
              </p>
              <div className="flex space-x-4">
                {['📧', '📱', '🌐'].map((icon, index) => (
                  <div key={index} className="w-10 h-10 bg-green-800 rounded-lg flex items-center justify-center hover:bg-green-700 cursor-pointer transition-colors duration-300">
                    <span className="text-lg">{icon}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">{t('features')}</h3>
              <ul className="space-y-2 text-green-200">
                <li>{t('voiceChatShort')}</li>
                <li>{t('pestDetectionShort')}</li>
                <li>{t('cropSuggestions')}</li>
                <li>{t('irrigationAlerts')}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">{t('support')}</h3>
              <ul className="space-y-2 text-green-200">
                <li>{t('helpCenter')}</li>
                <li>{t('videoTutorials')}</li>
                <li>{t('community')}</li>
                <li>{t('contactUs')}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-green-800 mt-12 pt-8 text-center text-green-300">
            <p>{t('copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Additional Animations */}
      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.8s ease-out forwards;
        }
        .animate-slide-in-delay {
          animation: slide-in 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-slide-in-delay-2 {
          animation: slide-in 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
        .animate-slide-in-delay-3 {
          animation: slide-in 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

export default LandingPage
