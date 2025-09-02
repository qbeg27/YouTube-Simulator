import React from 'react';
import type { GameEvent } from '../types';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface EventModalProps {
  event: GameEvent;
  onChoice: (eventId: string, choiceId: string) => void;
}

const eventTypeStyles = {
    positive: {
        iconColor: 'text-green-400',
        borderColor: 'border-green-500',
        gradient: 'from-green-500/20 to-gray-800'
    },
    negative: {
        iconColor: 'text-red-400',
        borderColor: 'border-red-500',
        gradient: 'from-red-500/20 to-gray-800'
    },
    neutral: {
        iconColor: 'text-blue-400',
        borderColor: 'border-blue-500',
        gradient: 'from-blue-500/20 to-gray-800'
    }
}

export const EventModal: React.FC<EventModalProps> = ({ event, onChoice }) => {
    const styles = eventTypeStyles[event.type] || eventTypeStyles.neutral;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[80] p-4">
            <div className={`bg-gray-800 bg-gradient-to-t ${styles.gradient} rounded-lg shadow-2xl w-full max-w-lg p-8 relative border-t-4 ${styles.borderColor} text-center`}>
                <div className={`mx-auto bg-gray-900/50 ${styles.iconColor} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    <AlertTriangleIcon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-white">{event.title}</h2>
                <p className="text-gray-300 mb-8">{event.description}</p>

                <div className="space-y-4">
                    {event.choices.map(choice => (
                        <button
                            key={choice.id}
                            onClick={() => onChoice(event.id, choice.id)}
                            className="group relative w-full bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 text-left"
                        >
                            <p>{choice.text}</p>
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-max max-w-xs scale-0 group-hover:scale-100 transition-transform origin-bottom
                             bg-gray-900 text-gray-300 text-xs font-normal px-3 py-2 rounded-md shadow-lg border border-gray-700">
                                {choice.description}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
