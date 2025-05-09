import axios from "axios";
import { useAuthStore } from "../utils/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { api, API_URL } from "../pages/login/services/api";

export interface BackendUser {
  id: string;
  email?: string;
  name?: string;
  social_medias: {
    provider: string;
    provider_id: string;
  }[];
}

export const loginWithTikTok = () => {
  const loginUrl = `${API_URL}/auth/login/tiktok`;
  const redirectUri = encodeURIComponent(window.location.origin);
  window.location.href = `${loginUrl}?redirect_uri=${redirectUri}`;
};

export const loginWithInstagram = () => {
  const loginUrl = `${API_URL}/auth/login/instagram`;
  const redirectUri = encodeURIComponent(window.location.origin);
  window.location.href = `${loginUrl}?redirect_uri=${redirectUri}`;
};

export const loginWithGoogle = () => {
  const loginUrl = `${API_URL}/auth/login/google`;
  const redirectUri = encodeURIComponent(window.location.origin);
  window.location.href = `${loginUrl}?redirect_uri=${redirectUri}`;
};

export const logout = async () => {
  // Get clearUser directly from the store state instead of using the hook
  const clearUser = useAuthStore.getState().clearUser;
  try {
    await api.delete("/auth/logout");
    clearUser();
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    // Optionally clear user even if API call fails
    clearUser();
    throw error;
  }
};

export const useAuthCheck = () => {
  const { setUser, clearUser } = useAuthStore();

  return useQuery({
    queryKey: ["authStatus"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/auth/status", {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        if (typeof data === "string" && data.includes("<!DOCTYPE html>")) {
          console.log(
            "Detectada página de consentimiento de ngrok, redirigiendo..."
          );

          window.location.href = `${API_URL}/auth/status`;

          clearUser();
          return null;
        }

        setUser(data);
        return data;
      } catch (error: unknown) {
        console.error(
          "Auth error details:",
          axios.isAxiosError(error) ? error.response : error
        );
        if (axios.isAxiosError(error)) {
          console.error("Error status:", error.response?.status);
          console.error("Error data:", error.response?.data);
        }
        clearUser();
        return null;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isLoading: loading, refetch: refreshAuth } = useAuthCheck();

  return {
    user,
    loading,
    isAuthenticated,
    loginWithTikTok,
    loginWithInstagram,
    loginWithGoogle,
    logout,
    refreshAuth,
  };
};
