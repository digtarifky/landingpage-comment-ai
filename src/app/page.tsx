// src/app/page.tsx
import MessengerSimulator from '@/components/demo/MessengerSimulator';
import { CheckCircle2, ShieldCheck, Zap, DollarSign, Key, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-600 selection:text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 px-4 py-2 text-center text-xs font-medium text-white shadow-inner">
        🚀 Promo Peluncuran Terbatas: Dapatkan Lisensi Seumur Hidup Hanya Rp 149.000 — Tanpa Biaya Bulanan!
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5" /> Khusus Penjual Facebook Marketplace & Toko Online
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight md:leading-snug">
          Balas Chat Calon Pembeli <span className="text-blue-500">10x Lebih Cepat</span>, Closing Penjualan Sekali Klik.
        </h1>
        <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Ekstensi Chrome cerdas yang merekomendasikan draf balasan responsif langsung di Facebook Messenger. Hemat waktu, konsisten jualan, bebas biaya langganan bulanan.
        </p>

        {/* Value Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Lisensi Sekali Beli Seumur Hidup
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> $0 Biaya AI (Mendukung Gemini Gratis)
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> Perlindungan Anti-Blokir Meta
          </span>
        </div>
      </section>

      {/* Live Interactive Simulator Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Coba Demo Interaktif Sekarang</h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Uji bagaimana Comment AI menghasilkan balasan pesan calon pembeli secara instan
          </p>
        </div>
        <MessengerSimulator />
      </section>

      {/* Fitur Utama (Bento Layout) */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-900">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">Didesain Khusus untuk Penjualan Facebook</h2>
          <p className="text-xs md:text-sm text-slate-400 mt-2">
            Seluruh fitur berfokus pada kecepatan merespons tanpa mengorbankan keamanan akun toko Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base mb-2">1-Click Smart Trigger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tombol AI Assist langsung terpasang di samping kotak obrolan Messenger. Menghasilkan draf siap kirim dalam 2 detik.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base mb-2">Model Bring Your Own Key</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gunakan kunci API Google Gemini gratis milik Anda sendiri. Tidak ada potongan biaya langganan bulanan dari kami.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base mb-2">Semi-Otomatis Aman Meta</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Draf ditinjau manual sebelum terkirim dengan simulasi jeda ketik alami, menjauhkan akun Anda dari deteksi bot spam.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center border-t border-slate-900">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Satu Kali Bayar. Milik Anda Selamanya.</h2>
        <p className="text-xs md:text-sm text-slate-400 mb-8 max-w-md mx-auto">
          Tinggalkan biaya langganan bulanan ratusan ribu rupiah. Hemat anggaran operasional toko online Anda.
        </p>

        <div className="max-w-md mx-auto bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-blue-500/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Lifetime Access
          </div>
          <h3 className="text-lg font-bold text-slate-200">Lisensi Tunggal Perangkat</h3>
          <div className="my-6">
            <span className="text-4xl md:text-5xl font-black text-white">Rp 149.000</span>
            <span className="text-xs text-slate-400 block mt-1">Sekali bayar untuk selamanya</span>
          </div>

          <ul className="text-xs text-slate-300 space-y-3 text-left mb-8">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Ekstensi Chrome Comment AI Aktif
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Integrasi Gemini API (Free Tier), OpenAI, & Claude
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Pembaruan Otomatis Selektor DOM Facebook
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Garansi Dukungan Teknis Komunitas
            </li>
          </ul>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30">
            Dapatkan Lisensi Sekarang
          </button>
        </div>
      </section>

      {/* Footer & Disclaimer */}
      <footer className="border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500">
        <p className="max-w-3xl mx-auto leading-relaxed">
          <strong>Pernyataan Hukum:</strong> Comment AI adalah perangkat lunak independen dan tidak berafiliasi, disponsori, atau didukung secara resmi oleh Meta Platforms, Inc. Nama Facebook dan Messenger adalah merek dagang terdaftar milik Meta Platforms, Inc.
        </p>
        <p className="mt-4">© 2026 Comment AI. Seluruh hak cipta dilindungi undang-undang.</p>
      </footer>
    </main>
  );
}