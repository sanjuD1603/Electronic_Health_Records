import React from 'react';
import { Link } from 'react-router-dom';
import '../Components/Css/Navbar.css';
import logo from '../Components/assets/Images/Navlogo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className='logoimg'>
        <img src={logo} alt="logo" />
      </Link>
      <Link to="/" className="logoname">MED</Link>
      <Link to="/" className="logoname1">ICK</Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
