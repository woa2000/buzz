'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import type { SessionState, Team } from '@/lib/types';

const teamColors: Record<Team, string> = {
  Alpha: 'bg-red-500',
  Bravo: 'bg-blue-500',
  Charlie: 'bg-green-500',
  Delta: 'bg-yellow-500',
};

export default function HostPage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const playerUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/player` 
    : '';

  useEffect(() => {
    // Create session
    fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create' }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSession(data);
        setLoading(false);
      });

    // Setup SSE
    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'session-update') {
        setSession(message.data);
        
        // Play sound when someone buzzes
        if (message.data.buzzRanking && message.data.buzzRanking.length > 0) {
          const previousLength = session?.buzzRanking?.length || 0;
          if (message.data.buzzRanking.length > previousLength) {
            playBuzzSound();
          }
        }
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const playBuzzSound = () => {
    const audio = new Audio('/buzz.mp3');
    audio.play().catch(() => {
      // Fallback: use beep
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    });
  };

  const startAccepting = () => {
    fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start-accepting' }),
    });
  };

  const resetBuzz = () => {
    fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' }),
    });
  };

  const positionEmojis = ['🥇', '🥈', '🥉', '4️⃣'];
  const positionLabels = ['1º Lugar', '2º Lugar', '3º Lugar', '4º Lugar'];

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-2xl">Iniciando sessão...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-8">
          🎮 Campainha Digital - Game Show
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <QRCodeDisplay url={playerUrl} sessionId={session.sessionId} />

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Grupos Conectados</h3>
            <div className="space-y-3">
              {(['Alpha', 'Bravo', 'Charlie', 'Delta'] as Team[]).map((team) => {
                const teamPlayers = session.players.filter(p => p.team === team);
                const isConnected = teamPlayers.length > 0;
                return (
                  <div
                    key={team}
                    className={`
                      p-3 rounded-lg
                      ${isConnected ? teamColors[team] + ' text-white' : 'bg-gray-200 text-gray-500'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-lg">{team}</div>
                      <span className="text-sm">
                        {isConnected ? `✓ ${teamPlayers.length} jogador${teamPlayers.length > 1 ? 'es' : ''}` : '○ Aguardando'}
                      </span>
                    </div>
                    {teamPlayers.length > 0 && (
                      <div className="ml-2 space-y-1">
                        {teamPlayers.map((player) => (
                          <div key={player.id} className="text-sm opacity-90">
                            • {player.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={startAccepting}
              disabled={session.acceptingAnswers}
              className={`
                px-8 py-4 rounded-lg font-bold text-xl
                ${session.acceptingAnswers 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white'}
              `}
            >
              {session.acceptingAnswers ? '⏳ Aguardando Resposta...' : '▶️ Liberar Respostas'}
            </button>

            <button
              onClick={resetBuzz}
              disabled={session.buzzRanking.length === 0}
              className={`
                px-8 py-4 rounded-lg font-bold text-xl
                ${session.buzzRanking.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'}
              `}
            >
              🔄 Resetar Rodada
            </button>
          </div>

          {session.buzzRanking.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">
                📊 Ranking de Respostas
              </h3>
              {session.buzzRanking.map((buzz, index) => (
                <div
                  key={buzz.playerId}
                  className={`
                    ${teamColors[buzz.team]}
                    text-white p-6 rounded-xl flex items-center justify-between
                    transform transition-all duration-300
                    ${index === 0 ? 'scale-105 shadow-2xl animate-buzz' : 'shadow-lg'}
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-5xl">{positionEmojis[index]}</span>
                    <div>
                      <div className="text-3xl font-bold">{buzz.team}</div>
                      <div className="text-lg opacity-95">{buzz.playerName}</div>
                      <div className="text-sm opacity-90">{positionLabels[index]}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">#{buzz.position}</div>
                    <div className="text-xs opacity-75">
                      {new Date(buzz.timestamp).toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {session.acceptingAnswers && session.buzzRanking.length === 0 && (
            <div className="bg-yellow-100 border-4 border-yellow-500 text-yellow-800 p-8 rounded-xl text-center animate-pulse-fast">
              <div className="text-4xl font-bold">
                ⏱️ Aguardando grupos responderem...
              </div>
            </div>
          )}

          {!session.acceptingAnswers && session.buzzRanking.length === 0 && (
            <div className="bg-gray-100 text-gray-600 p-8 rounded-xl text-center">
              <div className="text-2xl font-bold">
                Clique em "Liberar Respostas" para iniciar
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
