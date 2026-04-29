import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAuthToken, getMe, login, register, setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(Boolean(getAuthToken()));

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getMe();
        setUser(profile);
      } catch {
        setAuthToken(null);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const signIn = async (credentials) => {
    const response = await login(credentials);
    setAuthToken(response.access_token);
    setToken(response.access_token);
    const profile = await getMe();
    setUser(profile);
    return profile;
  };

  const signUp = async (payload) => {
    await register(payload);
    return signIn({ email: payload.email, password: payload.password });
  };

  const signOut = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user && token),
      loading,
      signIn,
      signOut,
      signUp,
      user,
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
}
