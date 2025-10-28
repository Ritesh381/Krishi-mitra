import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../utils/useTranslation'
import { useAuth } from '../context/AuthContext'

function Signup() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [location, setLocation] = useState('')
  const [farmSize, setFarmSize] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const handleLoginRedirect = () => {
    navigate('/login')
  }
  const handleHomeRedirect = () => {
    navigate('/landing')
  }
  const { register } = useAuth()

  const handleDashboardRedirect = async (e) =>{
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await register({ name, email, password, location, farmSize })
      setLoading(false)
      navigate('/dashboard')
    } catch (err) {
      setError(err.data?.message || err.message || 'Network error')
      setLoading(false)
    }
  }

  useEffect(()=>{
    window.scrollTo(0,0);
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-lime-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Main Signup Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-100/50 p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-2xl">🌾</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent mb-2">
              {t('joinKrishiMitra')}
            </h1>
            <p className="text-green-600">
              {t('createAccount')}
            </p>
          </div>

          {/* Social Signup */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-green-200 rounded-xl hover:bg-green-50 transition-all duration-300 group">
              <span className="mr-3 text-lg">🔍</span>
              <span className="text-green-700 font-medium group-hover:text-green-800">{t('signUpWithGoogle')}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-green-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-green-600">{t('orSignUpEmail')}</span>
            </div>
          </div>

          {/* Signup Form */}
          <form className="space-y-6" onSubmit={handleDashboardRedirect}>
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">
                  {t('fullName')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                  placeholder={t('enterFullName')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">
                  {t('phoneNumber')}
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-800 mb-2">
                {t('emailAddress')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                placeholder="farmer@example.com"
                required
              />
            </div>

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">
                  {t('password')}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 pr-12"
                    placeholder={t('createPassword')}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-600 transition-colors"
                  >
                    👁️
                  </button>
                </div>
              </div>

              <div>
              </div>
            </div>

            {/* Farm Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">
                  {t('location')}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e)=>setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none transition-all duration-300"
                  placeholder={t('locationPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">
                  {t('farmSize')}
                </label>
                <select value={farmSize} onChange={(e)=>setFarmSize(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none transition-all duration-300">
                  <option value="">{t('selectFarmSize')}</option>
                  <option value="small">{t('smallFarm')}</option>
                  <option value="medium">{t('mediumFarm')}</option>
                  <option value="large">{t('largeFarm')}</option>
                </select>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r cursor-pointer from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-60"
            >
              <span className="mr-2">🌱</span>
              {loading ? 'Creating...' : t('createAccountBtn')}
            </button>

            {error && (
              <div className="text-red-600 text-sm text-center mt-2">{error}</div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-green-600">
              {t('alreadyHaveAccount')}{' '}
              <button className="font-semibold text-green-700 hover:text-green-800 cursor-pointer transition-colors"
                onClick={handleLoginRedirect}>
                {t('signInHere')}
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button className="text-green-600 hover:text-green-800 cursor-pointer font-medium transition-colors flex items-center justify-center mx-auto"
            onClick={handleHomeRedirect}>
            <span className="mr-2">←</span>
            {t('backToHome')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Signup
