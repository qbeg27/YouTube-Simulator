
import React from 'react';
import type { ChannelStats, Upgrade } from '../types';
import { MONETIZATION_SUBSCRIBERS_REQ, MONETIZATION_WATCH_HOURS_REQ, MAX_CREATIVE_ENERGY, TICKS_PER_WEEK, GAME_TICK_MS, MAX_CHANNEL_STRIKES } from '../constants';
import { UsersIcon } from './icons/UsersIcon';
import { PlayIcon } from './icons/PlayIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { LightningIcon } from './icons/LightningIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface SidebarProps {
  stats: ChannelStats;
  isMonetized: boolean;
  upgrades: Upgrade[];
  onBuyUpgrade: (id: Upgrade['id']) => void;
  onOpenAchievements: () => void;
  onOpenTalents: () => void;
  username: string;
  ticksUntilBill: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string; children?: React.ReactNode }> = ({ icon, label, value, color, children }) => (
    <div className={`bg-gray-800 p-4 rounded-lg flex items-center gap-4 border-l-4 ${color}`}>
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
            <div className="text-sm text-gray-400">{label}</div>
            <div className="text-xl font-bold text-white">{value}</div>
            {children}
        </div>
    </div>
);

const MonetizationProgress: React.FC<{ label: string; current: number; required: number }> = ({ label, current, required }) => {
    const percentage = Math.min((current / required) * 100, 100);
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <span className="text-xs font-semibold text-gray-400">{current.toLocaleString(undefined, {maximumFractionDigits: 0})} / {required.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const UpgradeItem: React.FC<{ upgrade: Upgrade; money: number; onBuy: () => void; }> = ({ upgrade, money, onBuy }) => {
    const isMaxLevel = upgrade.level >= upgrade.maxLevel;
    const cost = isMaxLevel ? 0 : upgrade.cost[upgrade.level];
    const canAfford = money >= cost;

    return (
        <div className="bg-gray-900/50 p-3 rounded-lg flex items-center justify-between gap-2">
            <div>
                <p className="font-semibold text-white">{upgrade.name}</p>
                <p className="text-sm text-gray-400">Level {upgrade.level}</p>
            </div>
            {!isMaxLevel ? (
                <button 
                    onClick={onBuy}
                    disabled={!canAfford}
                    className="text-sm font-bold py-1 px-3 rounded-md transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 text-white"
                >
                    ${cost.toLocaleString()}
                </button>
            ) : (
                <p className="text-sm font-bold text-yellow-400">MAX</p>
            )}
        </div>
    )
}

export const Sidebar: React.FC<SidebarProps> = ({ stats, isMonetized, upgrades, onBuyUpgrade, onOpenAchievements, onOpenTalents, username, ticksUntilBill }) => {
  const energyPercentage = (stats.creativeEnergy / MAX_CREATIVE_ENERGY) * 100;
  const billDueSeconds = (ticksUntilBill * GAME_TICK_MS) / 1000;
  const minutes = Math.floor(billDueSeconds / 60);
  const seconds = Math.floor(billDueSeconds % 60);

  return (
    <aside className="w-64 lg:w-80 flex-shrink-0 bg-gray-800 p-6 flex flex-col gap-8 overflow-y-auto border-r border-gray-700">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Channel Stats</h2>
        <div className="space-y-4">
            <StatCard icon={<UsersIcon />} label="Subscribers" value={stats.subscribers.toLocaleString()} color="border-red-500" />
            <StatCard icon={<PlayIcon />} label="Total Watch Hours" value={stats.totalWatchHours.toLocaleString(undefined, {maximumFractionDigits: 0})} color="border-green-500" />
            <StatCard icon={<DollarSignIcon />} label="Balance" value={`$${stats.money.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="border-yellow-500" />
            <StatCard icon={<LightningIcon />} label="Creative Energy" value={`${stats.creativeEnergy.toFixed(0)} / ${MAX_CREATIVE_ENERGY}`} color="border-purple-500">
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${energyPercentage}%` }}></div>
                </div>
            </StatCard>
            {stats.talentPoints > 0 && 
                <StatCard icon={<BrainCircuitIcon />} label="Talent Points Available" value={`${stats.talentPoints}`} color="border-teal-500" />
            }
        </div>
      </div>
      
      {!isMonetized && (
        <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-center text-white">Monetization Goal</h3>
            <MonetizationProgress label="Subscribers" current={stats.subscribers} required={MONETIZATION_SUBSCRIBERS_REQ} />
            <MonetizationProgress label="Watch Hours" current={stats.totalWatchHours} required={MONETIZATION_WATCH_HOURS_REQ} />
        </div>
      )}

       {stats.channelStrikes > 0 && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-center">
            <h3 className="font-bold">Channel Strikes: {stats.channelStrikes} / {MAX_CHANNEL_STRIKES}</h3>
            <p className="text-xs">3 strikes will result in channel suspension!</p>
        </div>
       )}

      <div>
        <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2"><WrenchIcon/> Studio Upgrades</h2>
        <div className="space-y-3">
            {upgrades.map(upgrade => (
                <UpgradeItem key={upgrade.id} upgrade={upgrade} money={stats.money} onBuy={() => onBuyUpgrade(upgrade.id)} />
            ))}
        </div>
      </div>

       <div className="mt-auto space-y-2">
         <div className="bg-gray-900/50 p-3 rounded-lg flex items-center gap-3 text-sm mb-2">
            <UserCircleIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div>
                <span className="text-gray-400">Playing as: </span>
                <span className="font-bold text-white">{username}</span>
            </div>
         </div>
         <div className="bg-gray-900/50 p-3 rounded-lg flex items-center gap-3 text-sm">
            <CalendarIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div>
                <span className="text-gray-400">Next Bill Due: </span>
                <span className="font-mono font-bold text-white">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </div>
         </div>
        
        <button onClick={onOpenTalents} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-teal-300 font-bold rounded-lg transition-colors relative">
            <BrainCircuitIcon />
            Talents
            {stats.talentPoints > 0 && <span className="absolute top-2 right-2 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span></span>}
        </button>
        
         <button onClick={onOpenAchievements} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-yellow-300 font-bold rounded-lg transition-colors">
            <TrophyIcon />
            Achievements
        </button>
        
        {isMonetized && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg text-center mt-2">
                <h3 className="font-bold text-lg">Channel Monetized!</h3>
                <p className="text-sm">You are now earning from views.</p>
            </div>
        )}
      </div>
    </aside>
  );
};