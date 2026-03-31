import { getToken, clearTokenAndRedirect } from "./auth";

const BASE_URL = "http://localhost:3000";

export const api = async (endpoint, method = "GET", body) => {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 || res.status === 403) {
    clearTokenAndRedirect();
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
};

export const uploadImageApi = async (albumId, formData) => {
  const token = getToken();

  const res = await fetch(`${BASE_URL}/albums/${albumId}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (res.status === 401 || res.status === 403) {
    clearTokenAndRedirect();
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Upload failed.");
  }

  return data;
};