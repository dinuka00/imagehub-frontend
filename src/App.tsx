import React, { useState, useEffect } from 'react';
import { Images } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';
import { login, register, logout, getStoredAuth } from './utils/auth';
import { User, LoginCredentials, RegisterCredentials } from './types/auth';

type AuthMode = 'login' | 'register';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored authentication on app load
    const { token, user: storedUser } = getStoredAuth();
    if (token && storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await login(credentials);
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await register(credentials);
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setError(null);
  };

  const switchAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setError(null);
  };

  // Show dashboard if user is authenticated
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Show authentication forms
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Images className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Image Hub</h1>
          <p className="text-gray-600">Your personal visual gallery</p>
        </div>

        {/* Auth Forms */}
        {authMode === 'login' ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => switchAuthMode('register')}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => switchAuthMode('login')}
            isLoading={isLoading}
            error={error}
          />
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Image Hub. Secure image management platform.</p>
        </div>
      </div>
    </div>
  );
}

export default App;