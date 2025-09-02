import React from 'react';
import type { Sponsorship } from '../types';
import { DollarSignIcon } from './icons/DollarSignIcon';

interface SponsorshipModalProps {
  sponsorship: Sponsorship;
  onAccept: () => void;
  onDecline: () => void;
  finalOffer: number;
}

export const SponsorshipModal: React.FC<SponsorshipModalProps> = ({ sponsorship, onAccept, onDecline, finalOffer }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-8 relative border border-yellow-500 text-center">
        <div className="mx-auto bg-yellow-500/20 text-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <DollarSignIcon className="w-8 h-8"/>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Sponsorship Offer!</h2>
        <p className="text-gray-400 mb-6">
            <span className="font-bold text-white">{sponsorship.brand}</span> wants to sponsor you!
        </p>
        
        <div className="bg-gray-900/50 p-6 rounded-lg mb-8">
            <p className="text-lg text-gray-300">Offer Amount</p>
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                ${finalOffer.toLocaleString()}
            </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onDecline}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Accept Deal
          </button>
        </div>
      </div>
    </div>
  );
};
