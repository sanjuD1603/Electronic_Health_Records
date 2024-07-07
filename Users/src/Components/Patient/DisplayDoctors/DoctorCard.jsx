import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../Css/DoctorCard.css';
import blueDoctorImage from '../../assets/Images/doctorprofile.png';  // Make sure this path is correct

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate(`/patient/displaydoctors/doctordetails/${doctor.email}`, { state: { doctor } });
  };

  return (
    <div className="doctor-card" onClick={handleClick}>
      <img src={blueDoctorImage} alt="Doctor" />
      <h3>{doctor.firstName} {doctor.lastName}</h3>
      <p>Specialization: {doctor.specialization}</p>
      <p>Experience: {doctor.yearsOfExperience} years</p>
    </div>
  );
};

export default DoctorCard;
