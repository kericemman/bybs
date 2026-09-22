import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { changeAdminPassword, getMe, loginAdmin, logoutAdmin } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setAdmin(null);
    setLoading(false);
    logoutAdmin().catch(() => {});
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
    setAdmin(data);
    return data;
  }, []);

  const changePassword = useCallback(async (payload) => {
    const { data } = await changeAdminPassword(payload);
    setAdmin(data);
    return data;
  }, []);

  useEffect(() => {
    localStorage.removeItem("token");
    fetchAdmin();
  }, [fetchAdmin]);

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
