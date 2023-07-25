import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const NavBar = ({ isAuthenticated, username }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        <div className="home-nav">Home</div>
      </Link>
      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <Link to="/problems" className="nav-link">
              Problems
            </Link>
            <Link to="/leaderboard" className="nav-link">
              Leaderboard
            </Link>
            {/* TODO: Add profile link */}
            <Link to={`/*`} className="nav-link">
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
