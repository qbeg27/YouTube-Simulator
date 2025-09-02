import React, { useState } from 'react';
import type { User } from '../types';
import * as api from '../services/api';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3 || password.length < 4) {
      setError("Username must be at least 3 characters and password at least 4.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const user = isLoginView
        ? await api.login(username, password)
        : await api.register(username, password);
      onLoginSuccess(user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-[100] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white tracking-wider mb-2">
                <span className="text-red-500">You</span>Tube Simulator
            </h1>
            <p className="text-gray-400">Your journey to stardom awaits.</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white text-center mb-6">{isLoginView ? 'Login to your Account' : 'Create a New Account'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        placeholder="Enter your username"
                        disabled={loading}
                    />
                 </div>
                 <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        placeholder="Enter your password"
                        disabled={loading}
                    />
                 </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                 <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-600 disabled:cursor-wait"
                >
                    {loading ? 'Processing...' : (isLoginView ? 'Login' : 'Register')}
                </button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-6">
                {isLoginView ? "Don't have an account?" : "Already have an account?"}
                <button onClick={toggleView} className="font-semibold text-red-400 hover:text-red-300 ml-1">
                    {isLoginView ? 'Sign Up' : 'Sign In'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};
