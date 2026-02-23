'use client';

import { useState, useEffect } from 'react';
import type { Team } from '@/lib/types';

interface BuzzButtonProps {
  team: Team;
  onBuzz: () => void;
  disabled: boolean;
  winner: boolean;
}

const teamColors: Record<Team, { bg: string; pulse: string; text: string }> = {
  Alpha: { bg: 'bg-red-500', pulse: 'bg-red-400', text: 'text-red-700' },
  Bravo: { bg: 'bg-blue-500', pulse: 'bg-blue-400', text: 'text-blue-700' },
  Charlie: { bg: 'bg-green-500', pulse: 'bg-green-400', text: 'text-green-700' },
  Delta: { bg: 'bg-yellow-500', pulse: 'bg-yellow-400', text: 'text-yellow-700' },
};

export default function BuzzButton({ team, onBuzz, disabled, winner }: BuzzButtonProps) {
  const [animate, setAnimate] = useState(false);
  const colors = teamColors[team];

  useEffect(() => {
    if (winner) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className={`text-4xl font-bold mb-8 ${colors.text}`}>
        Grupo {team}
      </h2>
      
      <button
        onClick={onBuzz}
        disabled={disabled}
        className={`
          ${colors.bg}
          ${animate ? 'animate-buzz' : ''}
          ${!disabled && !winner ? 'hover:scale-105 active:scale-95 animate-pulse-fast' : ''}
          ${disabled && !winner ? 'opacity-50 cursor-not-allowed' : ''}
          w-64 h-64 rounded-full
          text-white font-bold text-3xl
          transition-all duration-200 transform
          shadow-2xl
          flex items-center justify-center
        `}
      >
        {winner ? '🎉 VOCÊ FOI O MAIS RÁPIDO! 🎉' : disabled ? 'AGUARDE...' : 'BUZZ!'}
      </button>

      {winner && (
        <div className="mt-8 text-2xl font-bold text-green-600 animate-bounce">
          Responda a pergunta!
        </div>
      )}
    </div>
  );
}
