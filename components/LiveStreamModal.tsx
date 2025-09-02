import React, { useState, useEffect, useRef, useCallback } from 'react';
import { XIcon } from './icons/XIcon';
import { FAKE_USERNAMES, STREAM_DURATION_SECONDS, MAX_HYPE, STREAM_EVENT_BASE_CHANCE, STREAM_TROLL_BASE_CHANCE, STREAM_NORMAL_COMMENT_CHANCE, HYPE_DECAY_RATE, HYPE_GAIN_SUCCESSFUL_BAN, HYPE_LOSS_WRONG_BAN, HYPE_GAIN_GOOD_ANSWER, HYPE_LOSS_BAD_ANSWER, HYPE_LOSS_MISSED_ANSWER, HYPE_GAIN_FIX_ISSUE, HYPE_LOSS_MISSED_FIX, VIEWERS_LOSS_WRONG_BAN, VIEWERS_GAIN_GOOD_ANSWER, VIEWERS_LOSS_BAD_ANSWER, VIEWERS_LOSS_MISSED_FIX, HYPE_MOMENT_DONATION_BOOST, HYPE_MOMENT_SUBSCRIBER_BOOST, TROLL_MESSAGES, NORMAL_CHAT_MESSAGES, STREAM_EVENTS_CONFIG } from '../constants';
import type { ChatMessage, StreamEvent } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { FireIcon } from './icons/FireIcon';
import { WrenchScrewdriverIcon } from './icons/WrenchScrewdriverIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';


interface LiveStreamModalProps {
  onClose: () => void;
  onStreamEnd: (donations: number, newSubscribers: number) => void;
  subscriberCount: number;
}

type StreamStatus = 'setup' | 'live' | 'summary';

const EventIcon: React.FC<{type: StreamEvent['type']}> = ({ type }) => {
    switch (type) {
        case 'QUESTION': return <AlertTriangleIcon className="w-10 h-10 text-blue-400" />;
        case 'TECHNICAL_ISSUE': return <WrenchScrewdriverIcon className="w-10 h-10 text-yellow-400" />;
        case 'RAID': return <UsersIcon className="w-10 h-10 text-purple-400" />;
        default: return null;
    }
};

export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({ onClose, onStreamEnd, subscriberCount }) => {
    const [status, setStatus] = useState<StreamStatus>('setup');
    const [title, setTitle] = useState('');
    const [timeLeft, setTimeLeft] = useState(STREAM_DURATION_SECONDS);
    const [liveViewers, setLiveViewers] = useState(0);
    const [totalDonations, setTotalDonations] = useState(0);
    const [newSubscribers, setNewSubscribers] = useState(0);
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [hype, setHype] = useState(0);
    const [activeEvent, setActiveEvent] = useState<StreamEvent | null>(null);
    const [eventTimeLeft, setEventTimeLeft] = useState(0);
    
    const chatContainerRef = useRef<HTMLDivElement>(null);
    // Fix: `useRef` without an initial value will be `undefined`. The generic type must include `undefined`.
    // Fix: Initialize useRef with null and update type to fix "Expected 1 arguments, but got 0" error.
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const addChatMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
        setChat(c => [...c.slice(-20), { ...message, id: `${Date.now()}-${Math.random()}` }]);
    }, []);

    const handleEventFailure = useCallback(() => {
        if (!activeEvent) return;
        switch(activeEvent.type) {
            case 'QUESTION':
                addChatMessage({ type: 'SYSTEM', username: 'System', text: "You missed a viewer's question! They're getting bored." });
                setHype(h => Math.max(0, h - HYPE_LOSS_MISSED_ANSWER));
                break;
            case 'TECHNICAL_ISSUE':
                addChatMessage({ type: 'SYSTEM', username: 'System', text: "You didn't fix the lag! Viewers are leaving." });
                setHype(h => Math.max(0, h - HYPE_LOSS_MISSED_FIX));
                setLiveViewers(v => Math.floor(v * (1 - VIEWERS_LOSS_MISSED_FIX)));
                break;
        }
        setActiveEvent(null);
    }, [activeEvent, addChatMessage]);

    // Main Game Loop for the Stream
    useEffect(() => {
        if (status !== 'live') return;

        const baseViewers = Math.max(10, Math.floor(subscriberCount * (0.05 + Math.random() * 0.05)));
        setLiveViewers(baseViewers);
        addChatMessage({ type: 'SYSTEM', username: 'System', text: `Stream started! Welcome everyone!` });

        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => prev - 1);
            setHype(h => Math.max(0, h - HYPE_DECAY_RATE));
            setLiveViewers(v => Math.max(0, v + Math.floor(Math.random() * 4 - 2)));
            
            // Handle active event timer
            if (activeEvent) {
                setEventTimeLeft(t => {
                    if (t <= 1) {
                        handleEventFailure();
                        return 0;
                    }
                    return t - 1;
                });
            } else {
                 // Spawn new event
                if (Math.random() < STREAM_EVENT_BASE_CHANCE) {
                    const newEvent = {...STREAM_EVENTS_CONFIG[Math.floor(Math.random() * STREAM_EVENTS_CONFIG.length)], id: `evt-${Date.now()}`};
                    setActiveEvent(newEvent);
                    setEventTimeLeft(newEvent.duration);
                    if (newEvent.type === 'RAID') {
                        addChatMessage({ type: 'SYSTEM', username: 'System', text: newEvent.description});
                        setLiveViewers(v => v + 500);
                        setTimeout(() => setActiveEvent(null), newEvent.duration * 1000);
                    }
                }
            }
            
            // Spawn chat messages
            if (Math.random() < STREAM_TROLL_BASE_CHANCE) {
                addChatMessage({ type: 'SPAM', username: FAKE_USERNAMES[Math.floor(Math.random() * FAKE_USERNAMES.length)], text: TROLL_MESSAGES[Math.floor(Math.random() * TROLL_MESSAGES.length)] });
            }
            if (Math.random() < STREAM_NORMAL_COMMENT_CHANCE) {
                 addChatMessage({ type: 'NORMAL', username: FAKE_USERNAMES[Math.floor(Math.random() * FAKE_USERNAMES.length)], text: NORMAL_CHAT_MESSAGES[Math.floor(Math.random() * NORMAL_CHAT_MESSAGES.length)] });
            }

            // Spontaneous donations and subs
            if (Math.random() < 0.05 + hype / 2000) {
                const amount = parseFloat((Math.random() * 20 + 1).toFixed(2));
                setTotalDonations(d => d + amount);
                addChatMessage({type: 'DONATION', username: 'System', text: `${FAKE_USERNAMES[Math.floor(Math.random() * FAKE_USERNAMES.length)]} donated $${amount.toFixed(2)}!`, amount})
            }
            if (Math.random() < 0.02 + hype / 1000) {
                setNewSubscribers(s => s + 1);
            }

        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [status, subscriberCount, addChatMessage, activeEvent, handleEventFailure]);

    useEffect(() => {
        if (timeLeft <= 0 && status === 'live') {
            setStatus('summary');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [timeLeft, status]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat]);

    const startStream = () => { if (title.trim().length > 3) { setStatus('live'); } };
    const finishStream = () => { onStreamEnd(totalDonations, newSubscribers); };

    const handleBanUser = (message: ChatMessage) => {
        if (message.type === 'SPAM') {
            addChatMessage({ type: 'SYSTEM', username: 'Moderator', text: `Successfully banned ${message.username}.` });
            setHype(h => Math.min(MAX_HYPE, h + HYPE_GAIN_SUCCESSFUL_BAN));
        } else {
            addChatMessage({ type: 'SYSTEM', username: 'Moderator', text: `${message.username} was a real fan! Oops.` });
            setHype(h => Math.max(0, h - HYPE_LOSS_WRONG_BAN));
            setLiveViewers(v => Math.floor(v * (1 - VIEWERS_LOSS_WRONG_BAN)));
        }
        setChat(c => c.filter(m => m.id !== message.id));
    };

    const handleEventAction = (choice?: any) => {
        if (!activeEvent) return;
        switch (activeEvent.type) {
            case 'QUESTION':
                if (choice.isCorrect) {
                    setHype(h => Math.min(MAX_HYPE, h + HYPE_GAIN_GOOD_ANSWER));
                    setLiveViewers(v => Math.floor(v * (1 + VIEWERS_GAIN_GOOD_ANSWER)));
                    addChatMessage({ type: 'SYSTEM', username: 'System', text: 'Great answer! The chat loves it.'});
                } else {
                    setHype(h => Math.max(0, h - HYPE_LOSS_BAD_ANSWER));
                    setLiveViewers(v => Math.floor(v * (1 - VIEWERS_LOSS_BAD_ANSWER)));
                    addChatMessage({ type: 'SYSTEM', username: 'System', text: 'That was not a popular answer.'});
                }
                break;
            case 'TECHNICAL_ISSUE':
                setHype(h => Math.min(MAX_HYPE, h + HYPE_GAIN_FIX_ISSUE));
                 addChatMessage({ type: 'SYSTEM', username: 'System', text: 'Technical issue resolved! Good job.'});
                break;
        }
        setActiveEvent(null);
    };

    const handleHypeMoment = () => {
        if (hype < MAX_HYPE) return;
        setHype(0);
        setTotalDonations(d => d + HYPE_MOMENT_DONATION_BOOST);
        setNewSubscribers(s => s + HYPE_MOMENT_SUBSCRIBER_BOOST);
        addChatMessage({ type: 'SYSTEM', username: 'System', text: `HYPE MOMENT! You shouted out the chat! Donations and subs are pouring in!`});
    }

    const renderContent = () => {
        switch(status) {
            case 'setup': return (
                <div className="p-6">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><XIcon /></button>
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">Go Live</h2>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500" placeholder="Enter your stream title..." />
                    <button onClick={startStream} disabled={title.trim().length <= 3} className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-600">Start Streaming</button>
                </div>
            );
            case 'live': return (
                <div className="flex flex-col h-full bg-gray-900">
                     <div className="flex-shrink-0 flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
                         <div>
                            <h3 className="font-bold text-white truncate max-w-xs">{title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1.5 text-red-400 font-bold"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>LIVE</div>
                                <div className="flex items-center gap-1.5"><UsersIcon className="w-4 h-4" />{liveViewers.toLocaleString()}</div>
                            </div>
                         </div>
                         <div className="text-center">
                             <div className="text-sm text-gray-400">Time Left</div>
                             <div className="font-mono text-lg font-bold text-white">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                         </div>
                     </div>
                     <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                         <div className="w-2/3 bg-black rounded-lg flex items-center justify-center text-gray-500 relative overflow-hidden">
                             <span className="z-0">STREAM PREVIEW</span>
                             {activeEvent && activeEvent.type !== 'RAID' && (
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 p-6 flex flex-col items-center justify-center text-center animate-fade-in">
                                    <EventIcon type={activeEvent.type} />
                                    <h3 className="text-2xl font-bold mt-4 text-white">{activeEvent.title}</h3>
                                    <p className="text-gray-300 mt-2">{activeEvent.description}</p>
                                    <div className="absolute top-2 right-2 text-lg font-mono bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">{eventTimeLeft}</div>
                                    <div className="mt-6 w-full max-w-sm space-y-3">
                                        {activeEvent.type === 'QUESTION' && activeEvent.choices?.map(choice => (
                                            <button key={choice.text} onClick={() => handleEventAction(choice)} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">{choice.text}</button>
                                        ))}
                                        {activeEvent.type === 'TECHNICAL_ISSUE' && (
                                            <button onClick={handleEventAction} className="w-full p-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-bold">FIX IT!</button>
                                        )}
                                    </div>
                                </div>
                             )}
                         </div>
                         <div className="w-1/3 flex flex-col bg-gray-800/50 rounded-lg">
                            <h4 className="font-semibold p-3 text-center text-white border-b border-gray-700">Live Chat</h4>
                            <div ref={chatContainerRef} className="flex-1 space-y-2 p-3 overflow-y-auto text-sm">
                                {chat.map(msg => (
                                    <div key={msg.id} className="group relative pr-4">
                                        {msg.type === 'SYSTEM' && <p className="text-gray-400 italic">{msg.text}</p>}
                                        {msg.type === 'DONATION' && <p className="text-green-400 font-bold bg-green-500/10 p-1 rounded">{msg.text}</p>}
                                        {(msg.type === 'NORMAL' || msg.type === 'SPAM') && (
                                            <p><span className="font-bold text-blue-300 pr-1.5">{msg.username}:</span><span className="text-gray-200 break-words">{msg.text}</span></p>
                                        )}
                                         <button onClick={() => handleBanUser(msg)} className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/80 hover:bg-red-600 rounded p-0.5"><ShieldCheckIcon className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                         </div>
                     </div>
                     <div className="flex-shrink-0 p-4 bg-gray-800 border-t border-gray-700">
                         <div className="flex items-center gap-4">
                            <button onClick={handleHypeMoment} disabled={hype < MAX_HYPE} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg disabled:bg-gray-600 transition-colors">
                                <FireIcon /> HYPE MOMENT
                            </button>
                            <div className="flex-1 bg-gray-900 rounded-full h-6 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold z-10">HYPE {Math.floor(hype)}/{MAX_HYPE}</div>
                                <div className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-500" style={{width: `${hype}%`}}></div>
                            </div>
                         </div>
                     </div>
                </div>
            );
            case 'summary': return (
                <div className="text-center p-6">
                    <h2 className="text-3xl font-bold mb-4 text-white">Stream Summary</h2>
                    <div className="space-y-4 my-8">
                        <div className="bg-gray-700 p-4 rounded-lg"><p className="text-lg text-gray-300">Total Donations</p><p className="text-4xl font-bold text-green-400">${totalDonations.toFixed(2)}</p></div>
                        <div className="bg-gray-700 p-4 rounded-lg"><p className="text-lg text-gray-300">New Subscribers</p><p className="text-4xl font-bold text-red-400">+{newSubscribers.toLocaleString()}</p></div>
                    </div>
                    <button onClick={finishStream} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg">Return to Studio</button>
                </div>
            );
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[90] p-4 animate-fade-in">
            <div className={`bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl border border-purple-500 overflow-hidden flex flex-col ${status === 'live' ? 'h-[80vh]' : 'max-w-md'}`}>
                {renderContent()}
            </div>
        </div>
    )
};