import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PropsWithChildren } from "react";
import { api, type AuthResponse } from "../lib/api";

type AuthState = {
  token: string;
  user: AuthResponse["user"];
  tenantId?: string;
  role?: AuthResponse["role"];
};

type AuthContextValue = {
  auth: AuthState | null;
  isAuthenticated: boolean;
  signup: (payload: {
    email: string;
    password: string;
    tenantName: string;
  }) => Promise<AuthResponse>;
  login: (payload: { email: string; password: string }) => Promise<AuthResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "nexylomedia-auth";

const persistAuth = (auth: AuthState | null) => {
  if (!auth) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
};

const readPersistedAuth = (): AuthState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthState;
    if (!parsed.token || !parsed.user) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<AuthState | null>(() => readPersistedAuth());

  useEffect(() => {
    persistAuth(auth);
  }, [auth]);

  const handleAuthSuccess = useCallback((response: AuthResponse) => {
    setAuth({
      token: response.token,
      user: response.user,
      tenantId: response.tenantId,
      role: response.role,
    });
  }, []);

  const signup = useCallback<AuthContextValue["signup"]>(
    async (payload) => {
      const result = await api.signup(payload);
      handleAuthSuccess(result);
      return result;
    },
    [handleAuthSuccess],
  );

  const login = useCallback<AuthContextValue["login"]>(
    async (payload) => {
      const result = await api.login(payload);
      handleAuthSuccess(result);
      return result;
    },
    [handleAuthSuccess],
  );

  const logout = useCallback(() => {
    setAuth(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      isAuthenticated: Boolean(auth?.token),
      signup,
      login,
      logout,
    }),
    [auth, signup, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


