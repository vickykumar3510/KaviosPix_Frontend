import React from "react";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "https://kaviospix-backend-m6eg.onrender.com/auth/google";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>KaviosPix</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;