import React from 'react';
import { Link } from 'react-router-dom';
import '../Components/Css/Navbar.css';
import logo from '../Components/assets/Images/Navlogo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logoimg">
        <img src={logo} alt="logo" />
        <div className="logoname-container">
          <div className="logoname">
            <span className="med">MED</span>
            <span className="ick">ICK</span>
          </div>
        </div>
      </Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
