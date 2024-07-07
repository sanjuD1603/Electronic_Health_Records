import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PatientNavbar from "./PatientNavbar";
import profileImage from '../assets/profile-placeholder.jpg'; // Ensure this path is correct
import '../Css/PatientViewProfile.css'

const PatientViewProfile = () => {
  // console.log("Patient view Profile");
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state)
  const metaMaskAccount = location.state?.metaMaskAccount;
  const [formData, setFormData] = useState(null);



  useEffect(() => {
    setFormData({
      firstName: location.state.patient["0"],
      lastName: location.state.patient["1"],
      email: location.state.patient["3"],
      dateOfBirth: location.state.patient["2"],
      gender: location.state.patient["4"],
      address: location.state.patient["5"],
      phoneNumber: location.state.patient["6"],
      bloodGroup: location.state.patient["7"],
      metaMaskAccount: location.state.patient["8"],
      insuranceProvider: location.state.patient["9"],
      policyNumber: location.state.patient["10"],
    });
  }, [location.state.patient]);

  useEffect(() => {
    if (!metaMaskAccount) {
      navigate("/Patient/patientsignup");
    }
  }, [metaMaskAccount, navigate]);

  if (!formData) {
    return <p>Loading profile data...</p>;
  }

  const getTitle = () => {
    if (formData.gender === "Male") {
      return "Mr.";
    } else if (formData.gender === "Female") {
      return "Mrs.";
    } else {
      return ""; // Handle other genders as needed
    }
  };

  return (
    <>
      <PatientNavbar />
      <div className="profile-container">
        <div className="profile-image" style={{ backgroundImage: `url(${profileImage})` }}></div>
        <h1>
          Welcome Back, {getTitle()} {formData.firstName}!
        </h1>
        <div className="profile-info">
          <div className="info-left">
            <p>
              <strong>First Name:</strong> {formData.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {formData.lastName}
            </p>
            <p>
              <strong>Date of Birth:</strong> {formData.dateOfBirth}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Gender:</strong> {formData.gender}
            </p>
          </div>
          <div className="info-right">
            <p>
              <strong>Address:</strong> {formData.address}
            </p>
            <p>
              <strong>Phone Number:</strong> {formData.phoneNumber}
            </p>
            <p>
              <strong>Blood Group:</strong> {formData.bloodGroup}
            </p>
            <p>
              <strong>Insurance Provider:</strong> {formData.insuranceProvider}
            </p>
            <p>
              <strong>Policy Number:</strong> {formData.policyNumber}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientViewProfile;
