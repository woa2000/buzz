'use client';

import { useState } from 'react';
import type { Team } from '@/lib/types';

interface TeamSelectorProps {
  onSelectTeam: (team: Team, name: string) => void;
  selectedTeam?: Team;
}

const teams: { name: Team; color: string; bgColor: string }[] = [
  { name: 'Alpha', color: 'text-red-700', bgColor: 'bg-red-500 hover:bg-red-600' },
  { name: 'Bravo', color: 'text-blue-700', bgColor: 'bg-blue-500 hover:bg-blue-600' },
  { name: 'Charlie', color: 'text-green-700', bgColor: 'bg-green-500 hover:bg-green-600' },
  { name: 'Delta', color: 'text-yellow-700', bgColor: 'bg-yellow-500 hover:bg-yellow-600' },
];

export default function TeamSelector({ onSelectTeam, selectedTeam }: TeamSelectorProps) {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleTeamClick = (team: Team) => {
    if (playerName.trim().length < 2) {
      setError('Por favor, digite seu nome (mínimo 2 caracteres)');
      return;
    }
    setError('');
    onSelectTeam(team, playerName.trim());
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Identificação
      </h2>
      
      <div className="space-y-2">
        <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
          Seu Nome
        </label>
        <input
          type="text"
          id="playerName"
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
            setError('');
          }}
          disabled={!!selectedTeam}
          placeholder="Digite seu nome"
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        />
        {error && (
          <p className="text-red-600 text-sm font-medium">{error}</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
          Selecione seu Grupo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <button
              key={team.name}
              onClick={() => handleTeamClick(team.name)}
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
    </div>
  );
}
