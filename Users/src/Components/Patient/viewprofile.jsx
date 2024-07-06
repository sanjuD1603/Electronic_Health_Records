import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { web3, setupContract } from "../Ethereum/Contracts/web3";

const PatientViewProfile = () => {
  // console.log("Patient view Profile");
  const location = useLocation();
  const navigate = useNavigate();
  // console.log(location.state)
  const metaMaskAccount = location.state?.metaMaskAccount;
  // console.log(metaMaskAccount);
  // console.log(location.state.patient);
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
    } else {

    }
  }, [metaMaskAccount, navigate]);

  if (!formData) {
    return <p>Loading profile data...</p>;
  }

  // Determine title based on gender
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
      <h1>
        Welcome Back, {getTitle()} {formData.firstName}!
      </h1>
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
        <strong>MetaMask Account:</strong> {formData.metaMaskAccount}
      </p>
      <p>
        <strong>Insurance Provider:</strong> {formData.insuranceProvider}
      </p>
      <p>
        <strong>Policy Number:</strong> {formData.policyNumber}
      </p>
    </>
  );
};

export default PatientViewProfile;
