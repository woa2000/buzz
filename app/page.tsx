import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            🎮 Campainha Digital
          </h1>
          <p className="text-2xl text-white/90">
            Sistema de Game Show para Competições em Grupo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link
            href="/host"
            className="bg-white rounded-2xl shadow-2xl p-12 hover:scale-105 transition-transform duration-200 cursor-pointer group"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎪</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors">
                Apresentador
              </h2>
              <p className="text-gray-600 text-lg">
                Controle a sessão, libere perguntas e veja quem responde primeiro
              </p>
            </div>
          </Link>

          <Link
            href="/player"
            className="bg-white rounded-2xl shadow-2xl p-12 hover:scale-105 transition-transform duration-200 cursor-pointer group"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                Participante
              </h2>
              <p className="text-gray-600 text-lg">
                Escolha seu grupo e seja o mais rápido a apertar o buzzer!
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">Como usar:</h3>
          <ol className="space-y-2 text-lg">
            <li>1. Apresentador inicia uma nova sessão</li>
            <li>2. Participantes escaneia o QR Code ou acessam a página</li>
            <li>3. Cada grupo escolhe seu nome (Alpha, Bravo, Charlie ou Delta)</li>
            <li>4. Apresentador libera as respostas</li>
            <li>5. Primeiro grupo a apertar o botão responde a pergunta!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
