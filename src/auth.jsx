import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("token");

export const isTokenValid = () => {
  const token = getToken();

  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    if (!exp) return false;
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

export const clearTokenAndRedirect = () => {
  localStorage.removeItem("token");

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};