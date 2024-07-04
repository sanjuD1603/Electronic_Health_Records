import React from 'react';
import { Link } from 'react-router-dom';
import '../../Components/Css/Navbar1.css';
import logo from '../../Components/assets/Images/Navlogo.png';

const PatientNavbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logoimg">
        <img src={logo} alt="logo" />
      </Link>
      <Link to="/" className="logoname">MED</Link>
      <Link to="/" className="logoname1">ICK</Link>
      <ul className="nav-links">
        <li><Link to="/patient/dashboard/viewprofile">View Profile</Link></li>
        <li><Link to="/patient/dashboard/viewdoctors">View Doctors</Link></li>
        <li><Link to="/patient/dashboard/upload">Upload Files</Link></li>
      </ul>
      <Link to="/" className="button-57">Logout</Link> {/* Added Home button */}
    </nav>
  );
};

export default PatientNavbar;
