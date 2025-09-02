import React from 'react';
import type { StaffMember, ChannelStats } from '../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface StaffTabProps {
  hiredStaff: StaffMember[];
  allStaff: StaffMember[];
  stats: ChannelStats;
  onHireOrUpgrade: (staffId: StaffMember['id']) => void;
}

const StaffCard: React.FC<{
  staff: StaffMember;
  hiredLevel: number;
  money: number;
  onAction: () => void;
}> = ({ staff, hiredLevel, money, onAction }) => {
  const isHired = hiredLevel > 0;
  const isMaxLevel = hiredLevel >= staff.maxLevel;
  const actionText = isHired ? 'Upgrade' : 'Hire';
  const cost = isMaxLevel ? Infinity : staff.cost[hiredLevel];
  const canAfford = money >= cost;
  const weeklySalary = isHired ? staff.salary[hiredLevel - 1] : 0;

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold text-white">{staff.name}</h3>
        <p className="text-gray-400 mt-1 h-12">{staff.description}</p>
        
        <div className="my-4 space-y-2 text-sm">
          <p><span className="font-semibold text-gray-300">Level:</span> {hiredLevel} / {staff.maxLevel}</p>
          {isHired && <p><span className="font-semibold text-gray-300">Weekly Salary:</span> ${weeklySalary.toLocaleString()}</p>}
          <p><span className="font-semibold text-gray-300">Current Effect:</span> {staff.effectDescription(hiredLevel * staff.effect)}</p>
          {!isMaxLevel && <p><span className="font-semibold text-gray-300">Next Level Effect:</span> {staff.effectDescription((hiredLevel + 1) * staff.effect)}</p>}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-700">
        {!isMaxLevel ? (
          <button
            onClick={onAction}
            disabled={!canAfford}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {actionText} for ${cost.toLocaleString()}
          </button>
        ) : (
          <p className="text-center font-bold text-yellow-400 py-3">MAX LEVEL</p>
        )}
      </div>
    </div>
  );
};

export const StaffTab: React.FC<StaffTabProps> = ({ hiredStaff, allStaff, stats, onHireOrUpgrade }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BriefcaseIcon className="w-10 h-10 text-blue-400" />
        <div>
            <h2 className="text-3xl font-bold text-white">Manage Staff</h2>
            <p className="text-gray-400 max-w-2xl">Hire professionals to help run your channel. They require a weekly salary, which will be deducted with your other expenses.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allStaff.map(staffConfig => {
          const hiredVersion = hiredStaff.find(s => s.id === staffConfig.id);
          return (
            <StaffCard
              key={staffConfig.id}
              staff={staffConfig}
              hiredLevel={hiredVersion ? hiredVersion.level : 0}
              money={stats.money}
              onAction={() => onHireOrUpgrade(staffConfig.id)}
            />
          );
        })}
      </div>
    </div>
  );
};
