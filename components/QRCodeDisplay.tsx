'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  url: string;
  sessionId: string;
}

export default function QRCodeDisplay({ url, sessionId }: QRCodeDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Código da Sessão: <span className="text-blue-600">{sessionId}</span>
      </h3>
      <div className="bg-white p-4 rounded-lg inline-block">
        <QRCodeSVG value={url} size={200} level="H" />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Escaneie para entrar na sessão
      </p>
    </div>
  );
}
