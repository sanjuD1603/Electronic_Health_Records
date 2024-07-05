import React from 'react';
import { useLocation } from 'react-router-dom';

const DoctorDetails = () => {
  const location = useLocation();
  const doctor = location.state.doctor;

  return (
    <>
    <div>
        <h1>{doctor.firstName} {doctor.lastName}</h1>
        <p>Specialization: {doctor.specialization}</p>
        <p>Experience: {doctor.yearsOfExperience} years</p>
        <p>Email: {doctor.email}</p>
        <p>Address: {doctor.doctorAddress}</p>
        <p>Phone: {doctor.phoneNumber}</p>
        <p>MetaMask Account: {doctor.metaMaskAccount}</p>
        <p>Medical License Number: {doctor.medicalLicenseNumber}</p>
        <p>Date of Birth: {doctor.dateOfBirth}</p>
      </div>

      <button>Book an Appointment</button>
    </>
  );
};

export default DoctorDetails;
