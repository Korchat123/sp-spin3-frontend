import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    setError('')
    setIsLoading(true)

    const result = await login(email, password)

    setIsLoading(false)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-[#EEEEEE] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm">

        <div className="mb-8 text-center">
          <h1 className="text-[24px] font-bold text-black">Serious Punch</h1>
          <p className="text-[13px] text-gray-500 mt-1">Owner Dashboard</p>
        </div>

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@spc.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-400"
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-500 font-medium">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 bg-[#DC5F00] text-white rounded-lg text-[14px] font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

        </div>
      </div>
    </div>
  )
}
