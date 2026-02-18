// Guarded Supabase client: provide a synchronous proxy that records chained calls
// and replays them against the real Supabase client once it's loaded. This keeps
// existing callsites (`supabase.from(...).select(...)`, `supabase.auth.signInWithPassword(...)`) unchanged.
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let _real: any = null;
let _loading: Promise<any> | null = null;

function ensureLoaded() {
  if (_real) return Promise.resolve(_real);
  if (_loading) return _loading;
  if (!SUPABASE_URL) return Promise.reject(new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to enable Supabase features.'));

  _loading = import('@supabase/supabase-js').then((mod) => {
    const { createClient } = mod as any;
    _real = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    return _real;
  });

  return _loading;
}

function createThenableProxy(callChain: Array<{ prop: string | symbol; args: any[] }> = []): any {
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === 'then') {
        // When awaited, load the real client and replay the call chain.
        return (resolve: any, reject: any) => {
          ensureLoaded().then((real) => {
            try {
              let obj: any = real;
              for (const step of callChain) {
                const fn = obj[step.prop];
                if (typeof fn === 'function') {
                  obj = fn.apply(obj, step.args);
                } else {
                  obj = obj[step.prop];
                }
              }
              if (obj && typeof obj.then === 'function') {
                obj.then(resolve, reject);
              } else {
                resolve(obj);
              }
            } catch (err) {
              reject(err);
            }
          }).catch(reject);
        };
      }

      // Support property access chaining (e.g., supabase.auth)
      return (...args: any[]) => {
        const next = callChain.concat([{ prop, args }]);
        return createThenableProxy(next);
      };
    }
  };

  const proxyTarget = () => {};
  return new Proxy(proxyTarget, handler);
}

export const supabase = createThenableProxy();