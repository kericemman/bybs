import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loginAdmin, getMe } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAdmin(null);
    setLoading(false);
  }, []);

  const fetchAdmin = useCallback(async () => {
    try {
      const { data } = await getMe();
      setAdmin(data);
      return data;
    } catch {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const { data } = await loginAdmin({ email, password });
    localStorage.setItem("token", data.token);
    return fetchAdmin();
  }, [fetchAdmin]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchAdmin();
    } else {
      setLoading(false);
    }
  }, [fetchAdmin]);

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
