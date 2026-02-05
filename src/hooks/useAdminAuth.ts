import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_SESSION_KEY = "admin_authenticated";
const SESSION_DURATION = 1000 * 60 * 60; // 1 hour

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
    if (sessionData) {
      const { timestamp } = JSON.parse(sessionData);
      if (Date.now() - timestamp < SESSION_DURATION) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin", {
        body: { password },
      });

      if (error) throw error;

      if (data?.success) {
        localStorage.setItem(
          ADMIN_SESSION_KEY,
          JSON.stringify({ timestamp: Date.now() })
        );
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, verifyPassword, logout };
}
