'use client';

import { useEffect, useState } from 'react';
import TeamSelector from '@/components/TeamSelector';
import BuzzButton from '@/components/BuzzButton';
import type { SessionState, Team } from '@/lib/types';

export default function PlayerPage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerId, setPlayerId] = useState<string>('');

  useEffect(() => {
    // Setup SSE
    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'session-update') {
        setSession(message.data);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleSelectTeam = async (team: Team, name: string) => {
    setSelectedTeam(team);
    setPlayerName(name);
    
    const response = await fetch('/api/buzz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team, name, action: 'join' }),
    });

    const result = await response.json();
    if (result.success && result.player) {
      setPlayerId(result.player.id);
    }
  };

  const handleBuzz = async () => {
    if (!selectedTeam || !playerId || !session?.acceptingAnswers) return;

    const response = await fetch('/api/buzz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, action: 'buzz' }),
    });

    const result = await response.json();
    
    if (result.success) {
      // Play success sound
      playSuccessSound();
    }
  };

  const playSuccessSound = () => {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
  };

  const myBuzz = session?.buzzRanking.find(b => b.playerId === playerId);
  const myPosition = myBuzz?.position;
  const hasNotBuzzed = playerId && session && session.buzzRanking.length > 0 && !myBuzz;

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl">Conectando...</div>
      </div>
    );
  }

  const canBuzz = session.acceptingAnswers && !myBuzz;
  const alreadyBuzzed = !!myBuzz;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🎮 Campainha Digital
        </h1>

        {!selectedTeam ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <TeamSelector onSelectTeam={handleSelectTeam} selectedTeam={selectedTeam ?? undefined} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <BuzzButton
              team={selectedTeam}
              onBuzz={handleBuzz}
              disabled={!canBuzz}
              position={myPosition}
            />

            {!session.acceptingAnswers && session.buzzRanking.length === 0 && (
              <div className="mt-8 text-center text-gray-600">
                <p className="text-xl">Aguarde o apresentador liberar as respostas...</p>
              </div>
            )}

            {session.buzzRanking.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                  📊 Ranking
                </h3>
                <div className="space-y-2">
                  {session.buzzRanking.map((buzz, index) => (
                    <div
                      key={buzz.playerId}
                      className={`
                        p-4 rounded-lg flex items-center justify-between
                        ${buzz.playerId === playerId 
                          ? 'bg-green-100 border-2 border-green-500' 
                          : 'bg-gray-100'}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '4️⃣'}
                        </span>
                        <div>
                          <div className={`text-xl font-bold ${buzz.playerId === playerId ? 'text-green-700' : 'text-gray-800'}`}>
                            {buzz.team} - {buzz.playerName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {buzz.playerId === playerId ? 'Você!' : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-700">
                        #{buzz.position}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasNotBuzzed && session.acceptingAnswers && (
              <div className="mt-6 text-center">
                <p className="text-xl text-red-600 font-bold animate-pulse">
                  ⚠️ Outros grupos já responderam! Seja rápido!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
