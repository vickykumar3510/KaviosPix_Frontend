import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        padding: "15px",
        background: "#ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "black",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        KaviosPix
      </Link>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Navbar;