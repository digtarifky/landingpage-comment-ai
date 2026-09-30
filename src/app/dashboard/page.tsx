'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MessageSquare, ShieldCheck } from 'lucide-react';

type DashboardUser = {
  name?: string | null;
  email?: string | null;
};

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function getStoredUser(): DashboardUser {
  try {
    return JSON.parse(localStorage.getItem('commentai.user') || '{}');
  } catch {
    return {};
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const accessToken = isHydrated ? localStorage.getItem('commentai.accessToken') : null;
  const user = isHydrated ? getStoredUser() : null;

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login');
    }
  }, [accessToken, isHydrated, router]);

  function handleLogout() {
    localStorage.removeItem('commentai.accessToken');
    localStorage.removeItem('commentai.user');
    router.replace('/login');
  }

  if (!isHydrated || !accessToken) {
    return <main className="min-h-screen bg-slate-950" aria-label="Memuat dashboard" />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-blue-500 text-white">
            <MessageSquare className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold tracking-wide">COMMENT AI</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-700 px-3 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Keluar
        </button>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <p className="text-sm font-medium text-sky-300">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Selamat datang{user?.name ? `, ${user.name}` : ''}.
        </h1>
        <p className="mt-3 text-sm text-slate-400">Anda berhasil masuk ke Comment AI.</p>
        <div className="mt-10 flex max-w-xl items-start gap-4 border-t border-slate-800 py-6">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-300" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Sesi Google terhubung</h2>
            <p className="mt-1 text-sm text-slate-400">{user?.email || 'Akun Google'}</p>
          </div>
        </div>
      </section>
    </main>
  );
}