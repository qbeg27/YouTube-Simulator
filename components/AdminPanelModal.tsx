
import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { LightningIcon } from './icons/LightningIcon';

interface AdminPanelModalProps {
  onClose: () => void;
  onAdminAction: (action: string, value: number | string) => void;
}

const AdminActionInput: React.FC<{
    label: string;
    buttonText: string;
    action: string;
    onAction: (action: string, value: number) => void;
}> = ({ label, buttonText, action, onAction }) => {
    const [value, setValue] = useState(1000);

    const handleAction = () => {
        if (value > 0) {
            onAction(action, value);
        }
    };
    
    return (
        <div className="flex items-center gap-2">
            <label className="text-gray-300 flex-shrink-0">{label}:</label>
            <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 text-white"
            />
            <button onClick={handleAction} className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm">
                <PlusCircleIcon className="w-4 h-4" />
                {buttonText}
            </button>
        </div>
    );
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ onClose, onAdminAction }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[101] p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 relative border border-red-500 flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <XIcon />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-red-400 text-center">-= ADMIN PANEL =-</h2>

                <div className="overflow-y-auto pr-2 space-y-4">
                    <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                        <h3 className="text-lg font-semibold text-white">Modify Stats</h3>
                        <AdminActionInput label="Subscribers" buttonText="Add" action="add_subs" onAction={onAdminAction} />
                        <AdminActionInput label="Money" buttonText="Add" action="add_money" onAction={onAdminAction} />
                        <AdminActionInput label="Talent Points" buttonText="Add" action="add_talent" onAction={onAdminAction} />
                        <AdminActionInput label="Viral Boosts" buttonText="Add" action="add_boosts" onAction={onAdminAction} />
                    </div>

                    <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                        <h3 className="text-lg font-semibold text-white">Trigger Actions</h3>
                         <button onClick={() => onAdminAction('max_energy', 0)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg">
                            <LightningIcon className="w-5 h-5"/>
                            Maximize Creative Energy
                        </button>
                        <button onClick={() => onAdminAction('reset_collab', 0)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
                            Reset Collab Cooldown
                        </button>
                         <button onClick={() => onAdminAction('trigger_event', 0)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg">
                            Trigger Random Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
