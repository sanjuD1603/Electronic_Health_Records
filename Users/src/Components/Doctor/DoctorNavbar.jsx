import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../Components/Css/Navbar1.css';
import logo from '../../Components/assets/Images/Navlogo.png';

const DoctorNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const metaMaskAccount = location.state?.metaMaskAccount;
  const docInfo = location.state?.doctor;

  const gotoViewProfile = async() => {
    navigate('/Doctor/viewprofile', {
      state: {
        metaMaskAccount: metaMaskAccount,
        doctor: docInfo
      }
    });
  };

  const gotoViewPatients = async() => {
    navigate('/Doctor/viewpatients', {
      state: {
        metaMaskAccount: metaMaskAccount,
        doctor: docInfo
      }
    });
  };

  const gotoUploadFile = async() => {
    navigate('/Doctor/uploadfiles', {
      state: {
        metaMaskAccount: metaMaskAccount,
        doctor: docInfo
      }
    });
  };

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
        <li><button className="button-2" onClick={gotoViewProfile}>View Profile</button></li>
        <li><button className="button-2" onClick={gotoViewPatients}>View Patients</button></li>
        <li><button className="button-2" onClick={gotoUploadFile}>Upload Files</button></li>
      </ul>
      <Link to="/" className="button-5">Logout</Link>
    </nav>
  );
};

export default DoctorNavbar;
