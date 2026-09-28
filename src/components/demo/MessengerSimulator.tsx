// src/components/demo/MessengerSimulator.tsx
'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, MessageSquare, ArrowRight } from 'lucide-react';

const PRESET_MESSAGES = [
  'Halo kak, gamis warna mocca ukuran L masih ready? Harganya berapa ya?',
  'Bisa COD gak min? Lokasi pengirimannya dari mana?',
  'Kalau beli 3 pcs dapet diskon potongan harga gak kak?',
];

export default function MessengerSimulator() {
  const [selectedMessage, setSelectedMessage] = useState(PRESET_MESSAGES[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [tone, setTone] = useState<'Sales Closing' | 'Ramah & Santai' | 'Formal'>('Sales Closing');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentScenario = customMessage.trim() !== '' ? customMessage : selectedMessage;

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMessage('');
    setReply('');

    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioText: currentScenario,
          tone: tone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Terjadi kesalahan saat memproses.');
      } else {
        setReply(data.reply);
      }
    } catch {
      setErrorMessage('Koneksi bermasalah. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!reply) return;
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
      {/* Header Bar Tiruan Messenger */}
      <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
            FB
          </div>
          <div>
            <h4 className="font-semibold text-sm">Simulasi Interaksi Messenger</h4>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Comment AI Aktif (Semi-Otomatis)
            </p>
          </div>
        </div>
        <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full font-medium">
          Live Interactive Sandbox
        </span>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        {/* Kolom Kiri: Pilihan Skenario Chat Calon Pembeli */}
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              1. Pilih Skenario Pesan Masuk
            </label>
            <div className="space-y-2">
              {PRESET_MESSAGES.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setCustomMessage('');
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all border ${
                    selectedMessage === msg && customMessage === ''
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 inline mr-2 text-blue-400" />
                  &quot;{msg}&quot;
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Atau Ketik Pertanyaan Sendiri:
            </label>
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Contoh: Ongkir ke Surabaya berapa min?"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              2. Pilih Gaya Komunikasi (Tone)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Sales Closing', 'Ramah & Santai', 'Formal'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`py-2 text-center rounded-lg text-xs font-medium border transition-all ${
                    tone === t
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Menghasilkan Rekomendasi...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Hasilkan Balasan AI Seketika
              </>
            )}
          </button>
        </div>

        {/* Kolom Kanan: Preview Gelembung Chat Interaktif */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Pratinjau Percakapan Nyata
            </span>

            {/* Bubble Chat Pembeli */}
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                CS
              </div>
              <div className="bg-slate-800 text-slate-200 text-xs p-3 rounded-2xl rounded-tl-none max-w-[85%] border border-slate-700/50">
                {currentScenario}
              </div>
            </div>

            {/* Bubble Chat Balasan AI */}
            {reply && (
              <div className="flex gap-2.5 items-start justify-end">
                <div className="bg-blue-600 text-white text-xs p-3.5 rounded-2xl rounded-tr-none max-w-[85%] shadow-md">
                  {reply}
                </div>
              </div>
            )}

            {/* Pesan Galat / Limit */}
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 text-center">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Action Footer */}
          {reply && (
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Siap disisipkan ke Facebook</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Tersalin' : 'Salin Teks'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}