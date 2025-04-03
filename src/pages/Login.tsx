import  { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to sign in: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`mx-auto h-12 w-12 ${isAdmin ? 'bg-secondary-600' : 'bg-primary-600'} rounded-md flex items-center justify-center text-white text-xl font-bold`}>
          NT
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {isAdmin ? 'Administrator Login' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`${isAdmin ? 'bg-secondary-50 border border-secondary-100' : 'bg-white'} py-8 px-4 shadow sm:rounded-lg sm:px-10`}>
          {/* User Type Tabs */}
          <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button
              className={`flex-1 text-center py-2 ${!isAdmin ? 'bg-primary-600 text-white' : 'text-gray-600 bg-white'}`}
              onClick={() => setIsAdmin(false)}
            >
              Client Login
            </button>
            <button
              className={`flex-1 text-center py-2 ${isAdmin ? 'bg-secondary-600 text-white' : 'text-gray-600 bg-white'}`}
              onClick={() => setIsAdmin(true)}
            >
              Admin Login
            </button>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {isAdmin && (
              <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-700">
                Administrator accounts have access to sensitive information and controls.
                Please ensure you are authorized to access this area.
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center btn py-2 ${isAdmin ? 'bg-secondary-600 hover:bg-secondary-700 text-white' : 'btn-primary'}`}
              >
                {loading ? 'Signing in...' : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    {isAdmin ? 'Admin Sign In' : 'Sign in'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
 