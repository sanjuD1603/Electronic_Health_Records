import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import '../../Patient/DisplayDoctors/css/DoctorCard.css';
import '../../Css/DoctorCard.css'

const PatientCard = ({ patient }) => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("From Patient Card", patient);

  const handleClick = () => {
    navigate(`/doctor/displaypatients/patientdetails/${patient.email}`, { state: { patient } });
  };

  return (
    <div className="doctor-card" onClick={handleClick}>
      <h3>{patient.firstName} {patient.lastName}</h3>
      <p>Email: {patient.email}</p>
      <p>Phone Number: {patient.phoneNumber}</p>
      <p>Address: {patient.address}</p>
      <p>Blood Group: {patient.bloodgroup}</p>
      <p>Insurance Provider: {patient.insuranceProvider}</p>
      <p>Policy Number: {patient.policyNumber}</p>
    </div>
  );
};

export default PatientCard;
