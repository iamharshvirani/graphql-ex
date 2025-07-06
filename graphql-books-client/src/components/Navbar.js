import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Book Library</NavLink>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/books">
                Books
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/add-book">
                Add Book
              </NavLink>
            </li>
          </ul>

          {/* Dark mode toggle */}
          <button className="btn btn-outline-light" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>
    </nav>
  );
}
