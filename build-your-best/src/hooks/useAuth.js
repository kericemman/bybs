import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("http://localhost:5002/api/auth/me", {
          credentials: "include"
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Auth check failed");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  // 🚫 NO JSX — pure JS
  return React.createElement(
    AuthContext.Provider,
    { value: { user, setUser, loading } },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
