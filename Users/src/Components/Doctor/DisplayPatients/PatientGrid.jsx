import React from 'react';
import PatientCard from './PatientCard';
import '../../Patient/DisplayDoctors/css/DoctorGrid.css';

const PatientGrid = ({ patients }) => {
  return (
    <div className="doctor-grid">
      {patients.map((patient, index) => (
        <PatientCard key={index} patient={patient} />
      ))}
    </div>
  );
};

export default PatientGrid;
