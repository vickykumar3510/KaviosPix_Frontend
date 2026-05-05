import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Album from "./pages/Album";
import { isTokenValid } from "./auth";

const ProtectedRoute = ({ children }) => {
  return isTokenValid() ? children : <Navigate to="/login" replace />;
};

function App() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/");
      navigate("/", { replace: true });
    }

    setCheckingAuth(false);
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          fontSize: "16px",
          color: "#202124",
        }}
        role="status"
        aria-live="polite"
      >
        Loading…
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isTokenValid() ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/album/:id"
        element={
          <ProtectedRoute>
            <Album />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;