import React from 'react';
import DoctorCard from './DoctorCard';
// import 'DoctorGrid.css';
import './css/DoctorGrid.css';
import { useNavigate, useLocation } from 'react-router-dom';
import PatientNavbar from '../PatientNavbar';
const DoctorGrid = ({ doctors }) => {
  
  return (
    <>
    <PatientNavbar/>
    <div className="doctor-grid">
      {doctors.map((doctor, index) => (
        <DoctorCard key={index} doctor={doctor} />
      ))}
    </div>
    </>

  );
};

export default DoctorGrid;
