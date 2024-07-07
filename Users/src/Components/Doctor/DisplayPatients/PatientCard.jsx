import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../Css/paitentcard.css';
import paitentprofile from '../../assets/profile-placeholder.jpg';

const PatientCard = ({ patient }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate(`/doctor/displaypatients/patientdetails/${patient.email}`, { state: { patient } });
  };

  return (
    <div className="doctor-card" onClick={handleClick}>
      <img src={paitentprofile} alt="paitent" />
      <h3>{patient.firstName} {patient.lastName}</h3>
      <p><strong>Email:</strong> {patient.email}</p>
      <p><strong>Phone Number:</strong> {patient.phoneNumber}</p>
      <p><strong>Address:</strong> {patient.address}</p>
      <p><strong>Blood Group:</strong> {patient.bloodgroup}</p>
      <p><strong>Insurance Provider:</strong> {patient.insuranceProvider}</p>
      <p><strong>Policy Number:</strong> {patient.policyNumber}</p>
    </div>
  );
};

export default PatientCard;
