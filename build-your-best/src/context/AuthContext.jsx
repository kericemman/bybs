import { createContext, useContext, useEffect, useState } from "react";
import { loginAdmin, getMe } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const { data } = await loginAdmin({ email, password });
    localStorage.setItem("token", data.token);
    await fetchAdmin();
  };

  const fetchAdmin = async () => {
    try {
      const { data } = await getMe();
      setAdmin(data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAdmin(null);
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
