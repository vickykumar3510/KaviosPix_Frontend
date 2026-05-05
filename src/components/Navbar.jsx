import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">
          <Link to="/" className="navbar__brand" aria-label="KaviosPix home">
            <span className="navbar__logo" aria-hidden="true" />
            <span className="navbar__brandText">
              <span className="navbar__brandName">KaviosPix</span>
              <span className="navbar__brandTagline">Albums &amp; memories</span>
            </span>
          </Link>

          <div className="navbar__actions">
            <button className="navbar__btn navbar__btn--danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="navbar__spacer" aria-hidden="true" />
    </>
  );
};

export default Navbar;