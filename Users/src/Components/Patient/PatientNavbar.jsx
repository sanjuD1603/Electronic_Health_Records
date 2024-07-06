import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../Components/Css/Navbar1.css';
import logo from '../../Components/assets/Images/Navlogo.png';

const PatientNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const metaMaskAccount = location.state?.metaMaskAccount;
  const patInfo = location.state?.patient;

  const gotoViewProfile = async() => {
    navigate('/patient/viewprofile', {
      state: {
        metaMaskAccount: metaMaskAccount,
        patient: patInfo
      }
    });
  };

  const gotoViewDoctors = async() => {
    navigate('/patient/viewdoctors', {
      state: {
        metaMaskAccount: metaMaskAccount,
        patient: patInfo
      }
    });
  };

  const gotoUploadFile = async() => {
    navigate('/patient/uploadfiles', {
      state: {
        metaMaskAccount: metaMaskAccount,
        patient: patInfo
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
        <li><button className="button-2" onClick={gotoViewDoctors}>View Doctors</button></li>
        <li><button className="button-2" onClick={gotoUploadFile}>Upload Files</button></li>
      </ul>
      <Link to="/" className="button-5">Logout</Link>
    </nav>
  );
};

export default PatientNavbar;
