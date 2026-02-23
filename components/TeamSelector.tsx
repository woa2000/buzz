'use client';

import type { Team } from '@/lib/types';

interface TeamSelectorProps {
  onSelectTeam: (team: Team) => void;
  selectedTeam?: Team;
}

const teams: { name: Team; color: string; bgColor: string }[] = [
  { name: 'Alpha', color: 'text-red-700', bgColor: 'bg-red-500 hover:bg-red-600' },
  { name: 'Bravo', color: 'text-blue-700', bgColor: 'bg-blue-500 hover:bg-blue-600' },
  { name: 'Charlie', color: 'text-green-700', bgColor: 'bg-green-500 hover:bg-green-600' },
  { name: 'Delta', color: 'text-yellow-700', bgColor: 'bg-yellow-500 hover:bg-yellow-600' },
];

export default function TeamSelector({ onSelectTeam, selectedTeam }: TeamSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Selecione seu Grupo
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <button
            key={team.name}
            onClick={() => onSelectTeam(team.name)}
            disabled={!!selectedTeam}
            className={`
              ${team.bgColor}
              ${selectedTeam && selectedTeam !== team.name ? 'opacity-50' : ''}
              text-white font-bold py-6 px-8 rounded-xl text-2xl
              transition-all duration-200 transform
              disabled:cursor-not-allowed
              ${!selectedTeam ? 'hover:scale-105 active:scale-95' : ''}
              shadow-lg
            `}
          >
            {team.name}
          </button>
        ))}
      </div>
    </div>
  );
}
