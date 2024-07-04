import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import { PatientContext } from '../PatientContext';
import profileImage from '../assets/profile-placeholder.jpg'; // Update the path to your image
import '../Css/PatientViewProfile.css'; // Import the CSS file

const PatientViewProfile = () => {
  const navigate = useNavigate();
  const { patientDetails, metaMaskAccount } = useContext(PatientContext);

  useEffect(() => {
    console.log("Patient data on mount:", patientDetails, metaMaskAccount);
    if (!patientDetails) {
      console.log("Patient data not found, navigating back to dashboard");
      navigate('/patient/dashboard'); // Navigate to a safe page if patient details are missing
    }
  }, [patientDetails, metaMaskAccount, navigate]);

  if (!patientDetails) {
    return <p>Loading profile data...</p>;
  }

  const getTitle = () => {
    if (patientDetails.gender === "Male") {
      return "Mr.";
    } else if (patientDetails.gender === "Female") {
      return "Mrs.";
    } else {
      return ""; // Handle other genders as needed
    }
  };

  return (
    <>
      <PatientNavbar />
      <div className="profile-container">
        <img src={profileImage} alt="Profile" className="profile-image" />
        <h1>
          Welcome Back, {getTitle()} {patientDetails.firstName}!
        </h1>
        <div className="profile-info">
          <div className="info-left">
            <p>
              <strong>First Name:</strong> {patientDetails.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {patientDetails.lastName}
            </p>
            <p>
              <strong>Date of Birth:</strong> {patientDetails.dateOfBirth}
            </p>
            <p>
              <strong>Email:</strong> {patientDetails.email}
            </p>
            <p>
              <strong>Gender:</strong> {patientDetails.gender}
            </p>
          </div>
          <div className="info-right">
            <p>
              <strong>Address:</strong> {patientDetails.patientAddress}
            </p>
            <p>
              <strong>Phone Number:</strong> {patientDetails.phoneNumber}
            </p>
            <p>
              <strong>Blood Group:</strong> {patientDetails.bloodgroup}
            </p>
            {/* <p>
              <strong>MetaMask Account:</strong> {patientDetails.metaMaskAccount}
            </p> */}
            <p>
              <strong>Insurance Provider:</strong> {patientDetails.insuranceProvider}
            </p>
            <p>
              <strong>Policy Number:</strong> {patientDetails.policyNumber}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientViewProfile;
