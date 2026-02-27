import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { authQueryKey, fetchSession } from '../lib/auth-query';

const RETURN_TO_LABELS = {
  pxel: 'Pxel',
  'expense-tracker': 'Expense Tracker',
};

function getReturnTo(search) {
  const params = new URLSearchParams(search);
  return params.get('returnTo') || '';
}

function getRedirectUrl(returnTo) {
  if (returnTo === 'pxel') return '/pxel';
  if (returnTo === 'expense-tracker') return '/expense-tracker/dashboard';
  return '/';
}

export default function SignIn({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: authQueryKey,
    queryFn: fetchSession,
  });

  const search = history.location.search;
  const returnTo = getReturnTo(search);
  const appLabel = returnTo ? (RETURN_TO_LABELS[returnTo] || returnTo) : null;

  // If already signed in, redirect to returnTo app or /
  useEffect(() => {
    if (sessionLoading) return;
    if (session) {
      window.location.href = getRedirectUrl(returnTo);
      return;
    }
    // If not signed in and no returnTo, send user to portfolio to pick an app
    if (!returnTo) {
      window.location.href = '/';
    }
  }, [session, sessionLoading, returnTo]);

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      window.location.href = getRedirectUrl(returnTo);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signInMutation.mutate({ email, password });
  };

  // Don't show form while loading session, when already signed in (redirecting), or when no returnTo (redirecting to /)
  if (sessionLoading || session || !returnTo) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-slate-200 dark:border-gray-800 p-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-8 text-center">
            {appLabel}
          </h1>
          <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Sign in</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Enter your email and password to continue.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            {signInMutation.error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                {signInMutation.error.message}
              </div>
            )}
            <button
              type="submit"
              disabled={signInMutation.isPending}
              className="w-full h-12 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-slate-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {signInMutation.isPending ? (
                <>
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
