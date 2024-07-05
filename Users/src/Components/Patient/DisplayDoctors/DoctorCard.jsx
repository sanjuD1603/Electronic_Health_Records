import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // console.log(doctor);

  const handleClick = () => {
    navigate(`/patient/displaydoctors/doctordetails/${doctor.email}`, { state: { doctor } });
  };

  return (
    <div className="doctor-card" onClick={handleClick}>
      <h3>{doctor.firstName} {doctor.lastName}</h3>
      <p>Specialization: {doctor.specialization}</p>
      <p>Experience: {doctor.yearsOfExperience} years</p>
    </div>
  );
};

export default DoctorCard;
