import React from "react";
import "./Login.css";

const Login = () => {
  const handleLogin = () => {
    const backendBase =
      import.meta.env.VITE_BACKEND_URL ||
      "https://kaviospix-backend-m6eg.onrender.com";

    window.location.href = `${backendBase}/auth/google`;
  };

  return (
    <div className="login">
      <main className="loginCard" aria-label="Login">
        <div className="brandRow">
          <span className="photosIcon" aria-hidden="true" />
          <span className="brandName">KaviosPix</span>
        </div>

        <h1 className="headline">Welcome to KaviosPix</h1>

        <button className="googleBtn" onClick={handleLogin}>
          <span className="googleBtn__icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="18" height="18">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.67 1.22 9.15 3.61l6.84-6.84C35.93 2.44 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.07 6.27C12.55 13.26 17.83 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.64-.15-3.22-.43-4.74H24v9h12.65c-.55 2.96-2.2 5.47-4.68 7.16l7.18 5.58c4.2-3.88 6.35-9.6 6.35-17z"
              />
              <path
                fill="#FBBC05"
                d="M10.63 28.03a14.5 14.5 0 0 1 0-8.06l-8.07-6.27a24.03 24.03 0 0 0 0 20.6l8.07-6.27z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.47 0 11.93-2.13 15.9-5.78l-7.18-5.58c-2 1.35-4.55 2.16-8.72 2.16-6.17 0-11.45-3.76-13.37-9.02l-8.07 6.27C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
          </span>
          Continue with Google
        </button>

        <p className="finePrint">
          By signing in, you agree to our{" "}
          <a className="finePrint__link" href="#">
            Terms &amp; Privacy Policy.
          </a>
        </p>
      </main>
    </div>
  );
};

export default Login;