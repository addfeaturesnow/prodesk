import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContext {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthContext>({ user: null, session: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock user for now to bypass auth
  const mockUser = { id: 'mock-user', email: 'mock@example.com' };
  const mockSession = { user: mockUser };

  return <AuthCtx.Provider value={{ user: mockUser, session: mockSession, loading: false, signOut: async () => {} }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
