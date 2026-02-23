'use client';

import { useState, useEffect } from 'react';
import type { Team } from '@/lib/types';

interface BuzzButtonProps {
  team: Team;
  onBuzz: () => void;
  disabled: boolean;
  position?: number;
}

const teamColors: Record<Team, { bg: string; pulse: string; text: string }> = {
  Alpha: { bg: 'bg-red-500', pulse: 'bg-red-400', text: 'text-red-700' },
  Bravo: { bg: 'bg-blue-500', pulse: 'bg-blue-400', text: 'text-blue-700' },
  Charlie: { bg: 'bg-green-500', pulse: 'bg-green-400', text: 'text-green-700' },
  Delta: { bg: 'bg-yellow-500', pulse: 'bg-yellow-400', text: 'text-yellow-700' },
};

const positionEmojis: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
  4: '4️⃣',
};

const positionMessages: Record<number, string> = {
  1: '🎉 PRIMEIRO LUGAR! 🎉',
  2: '🥈 Segundo Lugar!',
  3: '🥉 Terceiro Lugar!',
  4: '4️⃣ Quarto Lugar',
};

export default function BuzzButton({ team, onBuzz, disabled, position }: BuzzButtonProps) {
  const [animate, setAnimate] = useState(false);
  const colors = teamColors[team];

  useEffect(() => {
    if (position) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [position]);

  const buttonText = position 
    ? positionMessages[position]
    : disabled 
    ? 'AGUARDE...' 
    : 'BUZZ!';

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
          ${!disabled && !position ? 'hover:scale-105 active:scale-95 animate-pulse-fast' : ''}
          ${disabled && !position ? 'opacity-50 cursor-not-allowed' : ''}
          ${position ? 'cursor-default' : ''}
          w-64 h-64 rounded-full
          text-white font-bold text-2xl
          transition-all duration-200 transform
          shadow-2xl
          flex flex-col items-center justify-center
          gap-2
        `}
      >
        {position && (
          <span className="text-6xl">{positionEmojis[position]}</span>
        )}
        <span className={position ? 'text-xl' : 'text-3xl'}>{buttonText}</span>
      </button>

      {position === 1 && (
        <div className="mt-8 text-2xl font-bold text-green-600 animate-bounce">
          Você foi o mais rápido!
        </div>
      )}
      
      {position && position > 1 && (
        <div className="mt-8 text-xl font-bold text-gray-600">
          Continue tentando na próxima rodada!
        </div>
      )}
    </div>
  );
}
