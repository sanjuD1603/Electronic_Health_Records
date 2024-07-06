import React from 'react';
import DoctorCard from './DoctorCard';
// import 'DoctorGrid.css';
import './css/DoctorGrid.css';
import { useNavigate, useLocation } from 'react-router-dom';

const DoctorGrid = ({ doctors }) => {
  
  return (
    <div className="doctor-grid">
      {doctors.map((doctor, index) => (
        <DoctorCard key={index} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorGrid;
