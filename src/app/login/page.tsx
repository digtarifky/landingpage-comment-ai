'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin, GoogleOAuthProvider, type CredentialResponse } from '@react-oauth/google';
import { MessageSquare, ShieldCheck } from 'lucide-react';

type AuthUser = {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

type AuthResponse = {
  message?: string;
  data?: {
    accessToken?: string;
    exchangeCode?: string;
    user?: AuthUser;
  };
};

type ExtensionMessageResponse = {
  ok?: boolean;
  message?: string;
};

type ChromeExternalRuntime = {
  lastError?: { message?: string };
  sendMessage: (
    extensionId: string,
    message: { type: string; state: string; code: string },
    callback: (response?: ExtensionMessageResponse) => void,
  ) => void;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;

function notifyExtension(state: string, code: string) {
  if (!EXTENSION_ID) throw new Error('NEXT_PUBLIC_EXTENSION_ID belum dikonfigurasi.');

  const runtime = (window as Window & { chrome?: { runtime?: ChromeExternalRuntime } }).chrome?.runtime;
  if (!runtime?.sendMessage) {
    throw new Error('Ekstensi Comment AI tidak ditemukan. Pastikan ekstensi aktif dan sudah di-reload.');
  }

  return new Promise<void>((resolve, reject) => {
    runtime.sendMessage(
      EXTENSION_ID,
      { type: 'COMMENTAI_EXTENSION_AUTH_COMPLETE', state, code },
      (response) => {
        if (runtime.lastError) {
          reject(new Error(runtime.lastError.message || 'Gagal menghubungi ekstensi.'));
        } else if (!response?.ok) {
          reject(new Error(response?.message || 'Ekstensi menolak callback login.'));
        } else {
          resolve();
        }
      },
    );
  });
}

function GoogleSignIn() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleGoogleSuccess(credentialResponse: CredentialResponse) {
    if (!credentialResponse.credential) {
      setErrorMessage('Google tidak mengirim token identitas. Silakan coba lagi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const extensionFlow = new URLSearchParams(window.location.search).get('extensionFlow') === '1';
      const extensionParams = extensionFlow
        ? new URLSearchParams(window.location.hash.slice(1))
        : null;
      const state = extensionParams?.get('state');

      if (extensionFlow && (!EXTENSION_ID || !state)) {
        throw new Error('Callback ekstensi tidak valid. Periksa NEXT_PUBLIC_EXTENSION_ID.');
      }

      const deviceIdentifier =
        extensionParams?.get('deviceIdentifier') ||
        localStorage.getItem('commentai.deviceIdentifier') ||
        crypto.randomUUID();
      localStorage.setItem('commentai.deviceIdentifier', deviceIdentifier);

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken: credentialResponse.credential,
          deviceIdentifier,
          ...(extensionParams?.get('licenseKey')
            ? { licenseKey: extensionParams.get('licenseKey') }
            : {}),
          ...(extensionFlow ? { extensionFlow: true } : {}),
        }),
      });
      const result = (await response.json().catch(() => null)) as AuthResponse | null;

      if (!response.ok) {
        throw new Error(result?.message || 'Login gagal. Silakan coba lagi.');
      }
      if (!result?.data?.accessToken) {
        throw new Error('Backend tidak mengirim access token.');
      }

      localStorage.setItem('commentai.accessToken', result.data.accessToken);
      localStorage.setItem('commentai.user', JSON.stringify(result.data.user || {}));

      if (extensionFlow && state) {
        if (!result.data.exchangeCode) {
          throw new Error('Backend tidak mengirim exchange code untuk ekstensi.');
        }
        await notifyExtension(state, result.data.exchangeCode);
        router.replace('/dashboard?extensionLogin=success');
        return;
      }

      router.replace('/dashboard');
    } catch (error) {
      setErrorMessage(
        error instanceof TypeError
          ? 'Tidak dapat menghubungi Backend di localhost:5000. Pastikan server Backend berjalan.'
          : error instanceof Error
            ? error.message
            : 'Login gagal. Silakan coba lagi.',
      );
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className={isSubmitting ? 'pointer-events-none opacity-50' : ''} aria-busy={isSubmitting}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrorMessage(
            'Google menolak otorisasi. Pastikan Client ID bertipe Web, origin localhost:3000 diizinkan, dan akun terdaftar sebagai penguji jika aplikasi masih Testing.',
          )}
          theme="outline"
          size="large"
          shape="rectangular"
          text="signin_with"
          width="280"
          locale="id"
        />
      </div>
      {isSubmitting && <p role="status" className="mt-4 text-sm text-slate-400">Menghubungkan ke Backend...</p>}
      {errorMessage && (
        <p role="alert" className="mt-4 rounded-md border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {errorMessage}
        </p>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="auth-backdrop relative flex min-h-screen items-center overflow-hidden px-4 py-12 text-slate-100 sm:px-6">
      <div className="auth-light absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
        <section className="max-w-xl">
          <div className="mb-16 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-blue-500 text-white">
              <MessageSquare className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-wide">COMMENT AI</span>
          </div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Asisten penjualan Anda</p>
          <h1 className="max-w-lg text-4xl font-semibold leading-tight sm:text-5xl">
            Percakapan pelanggan, lebih mudah ditangani.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
            Masuk untuk melanjutkan ke dashboard Comment AI dan mengelola pengalaman balas pesan Anda.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm text-slate-300">
            <ShieldCheck className="size-5 text-emerald-300" aria-hidden="true" />
            Login diverifikasi langsung oleh Google dan Backend Comment AI.
          </div>
        </section>

        <section className="border-t border-slate-700/80 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-2">
          <p className="text-sm font-semibold text-sky-300">Selamat datang kembali</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Masuk ke dashboard</h2>
          <p className="mt-2 mb-8 text-sm leading-6 text-slate-400">
            Gunakan akun Google untuk mengamankan sesi Anda.
          </p>

          {GOOGLE_CLIENT_ID ? (
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleSignIn />
            </GoogleOAuthProvider>
          ) : (
            <p role="alert" className="max-w-sm rounded-md border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
              Landingpage perlu OAuth Client ID tipe Web, bukan Client ID Chrome Extension. Izinkan origin http://localhost:3000, lalu isi NEXT_PUBLIC_GOOGLE_CLIENT_ID di Landingpage dan GOOGLE_WEB_CLIENT_ID di Backend. Jika consent screen masih Testing, tambahkan akun Google sebagai test user.
            </p>
          )}
          <p className="mt-6 max-w-sm text-xs leading-5 text-slate-500">
            Dengan masuk, Anda menyetujui pemrosesan token autentikasi oleh server Backend lokal.
          </p>
        </section>
      </div>
    </main>
  );
}