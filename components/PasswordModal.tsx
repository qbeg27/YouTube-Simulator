
import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onSubmit }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[101] p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 relative border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <XIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform duration-200 transform hover:scale-105"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};
