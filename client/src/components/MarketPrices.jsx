import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from '../utils/useTranslation'
import { useNavigate } from 'react-router-dom'

function MarketPrices() {
  const { t, currentLanguage } = useTranslation()
  const navigate = useNavigate()
  
  const [selectedMarket, setSelectedMarket] = useState('all')
  const [selectedCrop, setSelectedCrop] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [priceData, setPriceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('today')
  const [showPriceAlerts, setShowPriceAlerts] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setPriceData([
        {
          id: 1,
          crop: currentLanguage === 'hi' ? 'गेहूं' :
                currentLanguage === 'gu' ? 'ઘઉં' :
                currentLanguage === 'mr' ? 'गहू' :
                currentLanguage === 'ta' ? 'கோதுமை' :
                'Wheat',
          variety: 'HD-2967',
          market: currentLanguage === 'hi' ? 'दिल्ली मंडी' :
                  currentLanguage === 'gu' ? 'દિલ્હી મંડી' :
                  currentLanguage === 'mr' ? 'दिल्ली मंडी' :
                  currentLanguage === 'ta' ? 'দিল্লি মন্ডি' :
                  'Delhi Mandi',
          currentPrice: 2150,
          previousPrice: 2100,
          unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' :
                currentLanguage === 'gu' ? 'પ્રતિ ક્વિંટલ' :
                currentLanguage === 'mr' ? 'प्रती क्विंटल' :
                currentLanguage === 'ta' ? 'প্রতি ক্বিন্টাল' :
                'per quintal',
          change: '+2.4%',
          trend: 'up',
          lastUpdated: '2 min ago'
        },
        {
          id: 2,
          crop: currentLanguage === 'hi' ? 'चावल' :
                currentLanguage === 'gu' ? 'ચોખા' :
                currentLanguage === 'mr' ? 'तांदूळ' :
                currentLanguage === 'ta' ? 'அரிசி' :
                'Rice',
          variety: 'Basmati-1121',
          market: currentLanguage === 'hi' ? 'पंजाब मंडी' :
                  currentLanguage === 'gu' ? 'પંજાબ મંડી' :
                  currentLanguage === 'mr' ? 'पंजाब मंडी' :
                  currentLanguage === 'ta' ? 'পঞ্জাব মন্ডি' :
                  'Punjab Mandi',
          currentPrice: 4800,
          previousPrice: 4950,
          unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' :
                currentLanguage === 'gu' ? 'પ્રતિ ક્વિંટલ' :
                currentLanguage === 'mr' ? 'प्रती क्विंटल' :
                currentLanguage === 'ta' ? 'প্রতি ক্বিন্টাল' :
                'per quintal',
          change: '-3.0%',
          trend: 'down',
          lastUpdated: '5 min ago'
        },
        {
          id: 3,
          crop: currentLanguage === 'hi' ? 'सोयाबीन' :
                currentLanguage === 'gu' ? 'સોયાબીન' :
                currentLanguage === 'mr' ? 'सोयाबीन' :
                currentLanguage === 'ta' ? 'சோयாபீன்' :
                'Soybean',
          variety: 'JS-335',
          market: currentLanguage === 'hi' ? 'इंदौर मंडी' :
                  currentLanguage === 'gu' ? 'ઇંદોર મંડી' :
                  currentLanguage === 'mr' ? 'इंदूर मंडी' :
                  currentLanguage === 'ta' ? 'ইন্দোর মন্ডি' :
                  'Indore Mandi',
          currentPrice: 6200,
          previousPrice: 6180,
          unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' :
                currentLanguage === 'gu' ? 'પ્રતિ ક્વિંટલ' :
                currentLanguage === 'mr' ? 'प्रती क्विंटल' :
                currentLanguage === 'ta' ? 'প্রতি ক্বিন্টাল' :
                'per quintal',
          change: '+0.3%',
          trend: 'up',
          lastUpdated: '1 min ago'
        },
        {
          id: 4,
          crop: currentLanguage === 'hi' ? 'मक्का' :
                currentLanguage === 'gu' ? 'મકાઈ' :
                currentLanguage === 'mr' ? 'मका' :
                currentLanguage === 'ta' ? 'மக்காச்சோळம்' :
                'Maize',
          variety: 'Hybrid',
          market: currentLanguage === 'hi' ? 'हरियाणा मंडी' :
                  currentLanguage === 'gu' ? 'હરિયાણા મંડી' :
                  currentLanguage === 'mr' ? 'हरियाणा मंडी' :
                  currentLanguage === 'ta' ? 'হরিয়াণা মন্ডি' :
                  'Haryana Mandi',
          currentPrice: 1850,
          previousPrice: 1820,
          unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' :
                currentLanguage === 'gu' ? 'પ્રતિ ક્વિંટલ' :
                currentLanguage === 'mr' ? 'प्रती क्विंटल' :
                currentLanguage === 'ta' ? 'প্রতি ক্বিন্টাল' :
                'per quintal',
          change: '+1.6%',
          trend: 'up',
          lastUpdated: '3 min ago'
        },
        {
          id: 5,
          crop: currentLanguage === 'hi' ? 'कपास' :
                currentLanguage === 'gu' ? 'કપાસ' :
                currentLanguage === 'mr' ? 'कापूस' :
                currentLanguage === 'ta' ? 'பருத্তি' :
                'Cotton',
          variety: 'Bt-Cotton',
          market: currentLanguage === 'hi' ? 'गुजरात मंडी' :
                  currentLanguage === 'gu' ? 'ગુજરાત મંડી' :
                  currentLanguage === 'mr' ? 'गुजरात मंडी' :
                  currentLanguage === 'ta' ? 'গুজরাট মন্ডি' :
                  'Gujarat Mandi',
          currentPrice: 7500,
          previousPrice: 7650,
          unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' :
                currentLanguage === 'gu' ? 'પ્રતિ ક્વિંટલ' :
                currentLanguage === 'mr' ? 'प्रती क्विंटल' :
                currentLanguage === 'ta' ? 'প্রতি ক্বিন্টাল' :
                'per quintal',
          change: '-2.0%',
          trend: 'down',
          lastUpdated: '4 min ago'
        },
        {
          id: 6,
          crop: currentLanguage === 'hi' ? 'टमाटर' :
                currentLanguage === 'gu' ? 'ટમેટા' :
                currentLanguage === 'mr' ? 'टोमॅटो' :
                currentLanguage === 'ta' ? 'தக்காளி' :
                'Tomato',
          variety: 'Hybrid',
          market: currentLanguage === 'hi' ? 'नासिक मंडी' :
                  currentLanguage === 'gu' ? 'નાસિક મંડી' :
                  currentLanguage === 'mr' ? 'नाशिक मंडी' :
                  currentLanguage === 'ta' ? 'নাসিক মন্ডি' :
                  'Nashik Mandi',
          currentPrice: 3200,
          previousPrice: 2800,
          unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' :
                currentLanguage === 'gu' ? 'પ્રતિ ક્વિંટલ' :
                currentLanguage === 'mr' ? 'प्रती क्विंटल' :
                currentLanguage === 'ta' ? 'প্রতি ক্বিন্টাল' :
                'per quintal',
          change: '+14.3%',
          trend: 'up',
          lastUpdated: '1 min ago'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [currentLanguage])

  // Filter data based on search and selections
  const filteredData = priceData.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.variety.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMarket = selectedMarket === 'all' || item.market.includes(selectedMarket)
    const matchesCrop = selectedCrop === 'all' || item.crop === selectedCrop
    
    return matchesSearch && matchesMarket && matchesCrop
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('hi-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️'
  }

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
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
                <span className="text-white font-bold text-xl">📊</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">
                  {currentLanguage === 'hi' ? 'बाजार मूल्य' :
                   currentLanguage === 'gu' ? 'બજાર ભાવ' :
                   currentLanguage === 'mr' ? 'बाजार दर' :
                   currentLanguage === 'ta' ? 'சந்தை விலை' :
                   'Market Prices'}
                </h1>
                <p className="text-sm text-green-600">
                  {currentLanguage === 'hi' ? 'लाइव फसल की कीमतें और बाजार रुझान' :
                   currentLanguage === 'gu' ? 'લાઇવ પાક ભાવ અને બજાર વલણ' :
                   currentLanguage === 'mr' ? 'लाइव्ह पिकाचे दर आणि बाजार ट्रेंड' :
                   currentLanguage === 'ta' ? 'நேரடி பயிர் விலை மற்றும் சந்தை போக்கुகड়' :
                   'Live crop prices and market trends'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowPriceAlerts(!showPriceAlerts)}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                title={currentLanguage === 'hi' ? 'मूल्य अलर्ट' :
                       currentLanguage === 'gu' ? 'ભાવ અલર્ટ' :
                       currentLanguage === 'mr' ? 'किंमत अलर्ट' :
                       currentLanguage === 'ta' ? 'விலை எச্চরিक্কै' :
                       'Price Alerts'}
              >
                <span className="text-xl">🔔</span>
              </button>
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                {currentLanguage === 'hi' ? 'डेटा निर্यাত করें' :
                 currentLanguage === 'gu' ? 'ડેટા એક્સપોર્ટ કરો' :
                 currentLanguage === 'mr' ? 'डेटा एক্স্পোর্ট করा' :
                 currentLanguage === 'ta' ? 'தথ্য রप्তानি করুন' :
                 'Export Data'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'hi' ? 'आज के उच्चतम मूल्य' :
                   currentLanguage === 'gu' ? 'આજના સર્વોચ્ચ ભાવ' :
                   currentLanguage === 'mr' ? 'आजचे सर्वোच्च दर' :
                   currentLanguage === 'ta' ? 'இன্রুর সর্বোচ্চ দাম' :
                   'Today\'s Highest'}
                </p>
                <p className="text-2xl font-bold text-green-600">₹7,500</p>
                <p className="text-xs text-gray-500">
                  {currentLanguage === 'hi' ? 'कपास - गुजरात' :
                   currentLanguage === 'gu' ? 'કપાસ - ગુજરાત' :
                   currentLanguage === 'mr' ? 'कापूस - गुजरात' :
                   currentLanguage === 'ta' ? 'பাৱতি - গুজরাত' :
                   'Cotton - Gujarat'}
                </p>
              </div>
              <div className="text-3xl">🔝</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'hi' ? 'सबसे अधिक वृद्ধি' :
                   currentLanguage === 'gu' ? 'સૌથી વધુ વૃદ્ધિ' :
                   currentLanguage === 'mr' ? 'सर्वाधिक वाढ' :
                   currentLanguage === 'ta' ? 'अधিकम् বৃদ্ধি' :
                   'Highest Gain'}
                </p>
                <p className="text-2xl font-bold text-green-600">+14.3%</p>
                <p className="text-xs text-gray-500">
                  {currentLanguage === 'hi' ? 'टमाटर - नासिक' :
                   currentLanguage === 'gu' ? 'ટમેટા - નાસિક' :
                   currentLanguage === 'mr' ? 'टोমॅटो - नाশিক' :
                   currentLanguage === 'ta' ? 'தক্কাளি - নাসিক' :
                   'Tomato - Nashik'}
                </p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'hi' ? 'कुल बाज़ार' :
                   currentLanguage === 'gu' ? 'કુલ બજાર' :
                   currentLanguage === 'mr' ? 'एकूण बाजार' :
                   currentLanguage === 'ta' ? 'মোট বাজার' :
                   'Total Markets'}
                </p>
                <p className="text-2xl font-bold text-blue-600">142</p>
                <p className="text-xs text-gray-500">
                  {currentLanguage === 'hi' ? 'सक্রিয় मंडियां' :
                   currentLanguage === 'gu' ? 'સક્રિય મંડીઓ' :
                   currentLanguage === 'mr' ? 'सक्रिয় मंडी' :
                   currentLanguage === 'ta' ? 'सक्रिয় মন্ডি' :
                   'Active Mandis'}
                </p>
              </div>
              <div className="text-3xl">🏪</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'hi' ? 'अंतिम अपडेट' :
                   currentLanguage === 'gu' ? 'છેલ્લું અપડેટ' :
                   currentLanguage === 'mr' ? 'शेवटचे अपडेট' :
                   currentLanguage === 'ta' ? 'অন্তিম আপডেট' :
                   'Last Update'}
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {currentLanguage === 'hi' ? '२ मिनट' :
                   currentLanguage === 'gu' ? '૨ મિનિટ' :
                   currentLanguage === 'mr' ? '२ मिनिट' :
                   currentLanguage === 'ta' ? '২ मिনિট' :
                   '2 Min'}
                </p>
                <p className="text-xs text-gray-500">
                  {currentLanguage === 'hi' ? 'पहले' :
                   currentLanguage === 'gu' ? 'પહેલા' :
                   currentLanguage === 'mr' ? 'आधी' :
                   currentLanguage === 'ta' ? 'মুন্পু' :
                   'Ago'}
                </p>
              </div>
              <div className="text-3xl">⏰</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === 'hi' ? 'फसल खोजें' :
                 currentLanguage === 'gu' ? 'પાક શોધો' :
                 currentLanguage === 'mr' ? 'पीक शोधा' :
                 currentLanguage === 'ta' ? 'பयिर् তেডুवুম्' :
                 'Search Crop'}
              </label>
              <input
                type="text"
                placeholder={currentLanguage === 'hi' ? 'फसल का नाम...' :
                           currentLanguage === 'gu' ? 'પાકનું નામ...' :
                           currentLanguage === 'mr' ? 'पिकाचे नाव...' :
                           currentLanguage === 'ta' ? 'পയির् পেয়র্...' :
                           'Crop name...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === 'hi' ? 'बाजार चुनें' :
                 currentLanguage === 'gu' ? 'બજાર પસંદ કરો' :
                 currentLanguage === 'mr' ? 'बाजार निवडा' :
                 currentLanguage === 'ta' ? 'সন্তই তের্ন্দেডুক্কवुম্' :
                 'Select Market'}
              </label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">
                  {currentLanguage === 'hi' ? 'सभी बाजार' :
                   currentLanguage === 'gu' ? 'બધા બજાર' :
                   currentLanguage === 'mr' ? 'सर्व बाजार' :
                   currentLanguage === 'ta' ? 'எল্লাম্ সন্তই' :
                   'All Markets'}
                </option>
                <option value="दिल्ली">
                  {currentLanguage === 'hi' ? 'दिल्ली मंडी' :
                   currentLanguage === 'gu' ? 'દિલ્હી મંડી' :
                   currentLanguage === 'mr' ? 'दिल्ली मंडी' :
                   currentLanguage === 'ta' ? 'দিল্লি মন্ডি' :
                   'Delhi Mandi'}
                </option>
                <option value="पंजाब">
                  {currentLanguage === 'hi' ? 'पंजाब मंडी' :
                   currentLanguage === 'gu' ? 'પંજાબ મંડી' :
                   currentLanguage === 'mr' ? 'पंजाब मंडी' :
                   currentLanguage === 'ta' ? 'পঞ্জাব মন্ডি' :
                   'Punjab Mandi'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === 'hi' ? 'फसल प्रकार' :
                 currentLanguage === 'gu' ? 'પાક પ્રકાર' :
                 currentLanguage === 'mr' ? 'पीक प्रकार' :
                 currentLanguage === 'ta' ? 'পযির् প্রকার' :
                 'Crop Type'}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">
                  {currentLanguage === 'hi' ? 'सभी फसलें' :
                   currentLanguage === 'gu' ? 'બધા પાક' :
                   currentLanguage === 'mr' ? 'सर्व पिके' :
                   currentLanguage === 'ta' ? 'எল्लাম् পযির্' :
                   'All Crops'}
                </option>
                <option value="गेहूं">
                  {currentLanguage === 'hi' ? 'गेहूं' :
                   currentLanguage === 'gu' ? 'ઘઉં' :
                   currentLanguage === 'mr' ? 'गहू' :
                   currentLanguage === 'ta' ? 'কোতুমै' :
                   'Wheat'}
                </option>
                <option value="चावल">
                  {currentLanguage === 'hi' ? 'चावल' :
                   currentLanguage === 'gu' ? 'ચોખા' :
                   currentLanguage === 'mr' ? 'तांदूळ' :
                   currentLanguage === 'ta' ? 'অরিসি' :
                   'Rice'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === 'hi' ? 'समय सीमा' :
                 currentLanguage === 'gu' ? 'સમય મર્યાદા' :
                 currentLanguage === 'mr' ? 'काळ मर्यादा' :
                 currentLanguage === 'ta' ? 'கাল সীমা' :
                 'Time Period'}
              </label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="today">
                  {currentLanguage === 'hi' ? 'आज' :
                   currentLanguage === 'gu' ? 'આજ' :
                   currentLanguage === 'mr' ? 'आज' :
                   currentLanguage === 'ta' ? 'ইন্রু' :
                   'Today'}
                </option>
                <option value="week">
                  {currentLanguage === 'hi' ? 'इस सप्ताह' :
                   currentLanguage === 'gu' ? 'આ અઠવાડિયે' :
                   currentLanguage === 'mr' ? 'या आठवड्यात' :
                   currentLanguage === 'ta' ? 'ই ভাদাম়িল্' :
                   'This Week'}
                </option>
                <option value="month">
                  {currentLanguage === 'hi' ? 'इस महीने' :
                   currentLanguage === 'gu' ? 'આ મહિને' :
                   currentLanguage === 'mr' ? 'या महिन्यात' :
                   currentLanguage === 'ta' ? 'ই মासত্তিল্' :
                   'This Month'}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Price Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-bold text-gray-800">
              {currentLanguage === 'hi' ? 'लाइव मार्केट प्राइस' :
               currentLanguage === 'gu' ? 'લાઇવ માર્કેટ ભાવ' :
               currentLanguage === 'mr' ? 'लाइव्ह मार्केट प्राइस' :
               currentLanguage === 'ta' ? 'লাইভ মার্কেট দাম' :
               'Live Market Prices'}
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-600">
                {currentLanguage === 'hi' ? 'डेटा लोड हो रहा है...' :
                 currentLanguage === 'gu' ? 'ડેટા લોડ થઈ રહ્યો છે...' :
                 currentLanguage === 'mr' ? 'डेटा लোड होत आहे...' :
                 currentLanguage === 'ta' ? 'তথ্য লোড হচ্ছে...' :
                 'Loading data...'}
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLanguage === 'hi' ? 'फसल/किस्म' :
                       currentLanguage === 'gu' ? 'પાક/જાત' :
                       currentLanguage === 'mr' ? 'पीक/जात' :
                       currentLanguage === 'ta' ? 'পযির্/জাত' :
                       'Crop/Variety'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLanguage === 'hi' ? 'बाजार' :
                       currentLanguage === 'gu' ? 'બજાર' :
                       currentLanguage === 'mr' ? 'बाजार' :
                       currentLanguage === 'ta' ? 'সন্তै' :
                       'Market'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLanguage === 'hi' ? 'वर्तमान मूल्य' :
                       currentLanguage === 'gu' ? 'વર્તમાન ભાવ' :
                       currentLanguage === 'mr' ? 'सद्यस्थिती किंमत' :
                       currentLanguage === 'ta' ? 'বর্তমান দাম' :
                       'Current Price'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLanguage === 'hi' ? 'परिवर्तन' :
                       currentLanguage === 'gu' ? 'પરિવર્તન' :
                       currentLanguage === 'mr' ? 'बदल' :
                       currentLanguage === 'ta' ? 'মারত্তম্' :
                       'Change'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLanguage === 'hi' ? 'अपडेट समय' :
                       currentLanguage === 'gu' ? 'અપડેટ સમય' :
                       currentLanguage === 'mr' ? 'अपडेट वेळ' :
                       currentLanguage === 'ta' ? 'আপডেট সময়' :
                       'Last Update'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLanguage === 'hi' ? 'कार्रवाई' :
                       currentLanguage === 'gu' ? 'ક્રિયા' :
                       currentLanguage === 'mr' ? 'कार्यवाही' :
                       currentLanguage === 'ta' ? 'कार्য' :
                       'Action'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.crop}</div>
                          <div className="text-sm text-gray-500">{item.variety}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.market}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">
                          {formatPrice(item.currentPrice)}
                        </div>
                        <div className="text-xs text-gray-500">{item.unit}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center text-sm font-medium ${getTrendColor(item.trend)}`}>
                          <span className="mr-1">{getTrendIcon(item.trend)}</span>
                          {item.change}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.lastUpdated}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            {currentLanguage === 'hi' ? 'विवरण' :
                             currentLanguage === 'gu' ? 'વિગત' :
                             currentLanguage === 'mr' ? 'तपशील' :
                             currentLanguage === 'ta' ? 'বিস্তারিত' :
                             'Details'}
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            {currentLanguage === 'hi' ? 'अलर्ट' :
                             currentLanguage === 'gu' ? 'અલર્ટ' :
                             currentLanguage === 'mr' ? 'अलर्ट' :
                             currentLanguage === 'ta' ? 'এচ্চরিক্কै' :
                             'Alert'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {currentLanguage === 'hi' ? 'कोई डेटा नहीं मिला' :
                     currentLanguage === 'gu' ? 'કોઈ ડેટા મળ્યો નથી' :
                     currentLanguage === 'mr' ? 'कोणता डेटा सापडला नाही' :
                     currentLanguage === 'ta' ? 'কোনো ডেটা পাওয়া যায়নি' :
                     'No data found'}
                  </h3>
                  <p className="text-gray-500">
                    {currentLanguage === 'hi' ? 'अपनी खोज या फिल্टر को समायोজित करने का प्रयास करें' :
                     currentLanguage === 'gu' ? 'તમારી શોધ અથવા ફિલ્ટરને સમાયોજિત કરવાનો પ્રયાસ કરો' :
                     currentLanguage === 'mr' ? 'तुमचा शोध किंवा फिल्टर समायोजित करण्याचा प्रयत্न करा' :
                     currentLanguage === 'ta' ? 'আপনার অনুসন্ধান বা ফিল্টার সমন্বয় করার চেষ্টা করুন' :
                     'Try adjusting your search or filters'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Market Analysis Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {currentLanguage === 'hi' ? '📈 मार्केट ट্रেন্ড' :
               currentLanguage === 'gu' ? '📈 માર્કેટ ટ્રેન્ડ' :
               currentLanguage === 'mr' ? '📈 मार्केट ट्रेंड' :
               currentLanguage === 'ta' ? '📈 মার্কেট ট্রেন্ড' :
               '📈 Market Trends'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-green-600 text-xl mr-3">📊</span>
                  <div>
                    <p className="font-medium text-green-800">
                      {currentLanguage === 'hi' ? 'टमाटर की कीमतें बढ़ रही हैं' :
                       currentLanguage === 'gu' ? 'ટમેટાના ભાવ વધી રહ્યા છે' :
                       currentLanguage === 'mr' ? 'टोमॅटोचे दर वाढत आहेत' :
                       currentLanguage === 'ta' ? 'তক্কাळির দাম বাড়ছে' :
                       'Tomato prices are rising'}
                    </p>
                    <p className="text-sm text-green-600">
                      {currentLanguage === 'hi' ? 'मौसमी मांग के कারण' :
                       currentLanguage === 'gu' ? 'મૌસમી માંગને કારણે' :
                       currentLanguage === 'mr' ? 'हंगामी मागणीमुळे' :
                       currentLanguage === 'ta' ? 'মৌসুমী চাহিদার কারণে' :
                       'Due to seasonal demand'}
                    </p>
                  </div>
                </div>
                <span className="text-green-600 font-bold">+14.3%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-red-600 text-xl mr-3">📉</span>
                  <div>
                    <p className="font-medium text-red-800">
                      {currentLanguage === 'hi' ? 'कपास की कীমत में गिरावট' :
                       currentLanguage === 'gu' ? 'કપાસના ભાવમાં ઘટાડો' :
                       currentLanguage === 'mr' ? 'कापसाच्या दरात घट' :
                       currentLanguage === 'ta' ? 'পারুত্তির দামে কমতি' :
                       'Cotton prices declining'}
                    </p>
                    <p className="text-sm text-red-600">
                      {currentLanguage === 'hi' ? 'अधिक आपূर্তি के कारण' :
                       currentLanguage === 'gu' ? 'વધુ પુરવઠાને કારણે' :
                       currentLanguage === 'mr' ? 'जास्त पुरवठ्यामुळे' :
                       currentLanguage === 'ta' ? 'অধিक সরবরাহের কারণে' :
                       'Due to excess supply'}
                    </p>
                  </div>
                </div>
                <span className="text-red-600 font-bold">-2.0%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-blue-600 text-xl mr-3">⚡</span>
                  <div>
                    <p className="font-medium text-blue-800">
                      {currentLanguage === 'hi' ? 'गेহूं की कीमत स্থিर' :
                       currentLanguage === 'gu' ? 'ઘઉંના ભાવ સ્થિર' :
                       currentLanguage === 'mr' ? 'गव्हाचे दर स্थির' :
                       currentLanguage === 'ta' ? 'কোতুমै দাম স্থির' :
                       'Wheat prices stable'}
                    </p>
                    <p className="text-sm text-blue-600">
                      {currentLanguage === 'hi' ? 'सरकारी खरीद के कारण' :
                       currentLanguage === 'gu' ? 'સરકારી ખરીદીને કારણે' :
                       currentLanguage === 'mr' ? 'सरकारी खरेदीमुळे' :
                       currentLanguage === 'ta' ? 'সরকারী ক্রয়ের কারণে' :
                       'Due to government procurement'}
                    </p>
                  </div>
                </div>
                <span className="text-blue-600 font-bold">+2.4%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {currentLanguage === 'hi' ? '🎯 मूল্য সতর্কতা' :
               currentLanguage === 'gu' ? '🎯 ભાવ ચેતવણી' :
               currentLanguage === 'mr' ? '🎯 किंमत चेতावनी' :
               currentLanguage === 'ta' ? '🎯 দাম সতর্কতা' :
               '🎯 Price Alerts'}
            </h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <div className="text-gray-400 text-3xl mb-2">🔔</div>
                <p className="text-gray-600 text-sm">
                  {currentLanguage === 'hi' ? 'कোন मূল्য अलر्ट सেট नहीं हैं' :
                   currentLanguage === 'gu' ? 'કોઈ ભાવ અલર્ટ સેટ નથી' :
                   currentLanguage === 'mr' ? 'कोणतेही किंमत अলর्ট सेट नाहीत' :
                   currentLanguage === 'ta' ? 'কোনো দাম সতর্কতা সেট নেই' :
                   'No price alerts set'}
                </p>
                <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                  {currentLanguage === 'hi' ? 'अलর्ट जোड़ें' :
                   currentLanguage === 'gu' ? 'અલર્ટ ઉમેરો' :
                   currentLanguage === 'mr' ? 'अलर्ट जोडा' :
                   currentLanguage === 'ta' ? 'এলার্ট যোগ করুন' :
                   'Add Alert'}
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  {currentLanguage === 'hi' ? 'अলর্ট कैसे काम করते हैं?' :
                   currentLanguage === 'gu' ? 'અલર્ટ કેવી રીતે કામ કરે છે?' :
                   currentLanguage === 'mr' ? 'अलर्ट कसे काम करतात?' :
                   currentLanguage === 'ta' ? 'এলার্ট কেমন কাজ করে?' :
                   'How do alerts work?'}
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ {currentLanguage === 'hi' ? 'मूল्য লক্ষ্য निर्धारित করें' :
                          currentLanguage === 'gu' ? 'ભાવ લક્ષ્ય નિર્ધારિત કરો' :
                          currentLanguage === 'mr' ? 'किंमत लक্ষ्य ठরवा' :
                          currentLanguage === 'ta' ? 'দাম লক্ষ্য ঠিক করুন' :
                          'Set price targets'}</li>
                  <li>✓ {currentLanguage === 'hi' ? 'স্বয়ংক্রিয় নোটিফিकेशन পান' :
                          currentLanguage === 'gu' ? 'સ્વચાલિત સૂચનાઓ મેળવો' :
                          currentLanguage === 'mr' ? 'स्वयंचलित सूचना मिळवा' :
                          currentLanguage === 'ta' ? 'স্বয়ংক্রিয় বিজ্ঞপ্তি পান' :
                          'Get automatic notifications'}</li>
                  <li>✓ {currentLanguage === 'hi' ? 'बेहतर বিক্রয় করें' :
                          currentLanguage === 'gu' ? 'બહેતર વેચાણ કરો' :
                          currentLanguage === 'mr' ? 'चांगली विक्री करा' :
                          currentLanguage === 'ta' ? 'ভাল বিক্রয় করুন' :
                          'Make better sales'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MarketPrices
