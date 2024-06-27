import React from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImage from '../assets/doctor-icon.png'; // Adjust the path to your image
import patientImage from '../assets/patient-icon.png'; // Adjust the path to your image
import '../assets/selectrole.css'; // Make sure to create and include your CSS file

const SelectRole = () => {
    const history = useNavigate();

    const handleDoctorClick = () => {
        history.push('/doctor-signup'); // Adjust the path as needed
    };

    const handlePatientClick = () => {
        history.push('/patient-signup'); // Adjust the path as needed
    };

    return (
        <div className="select-role">
            <h1>Select Your Role</h1>
            <div className="role-buttons">
                <button onClick={handleDoctorClick} className="role-button">
                    <img src={doctorImage} alt="Doctor" className="role-image" />
                    <span>Doctor</span>
                </button>
                <button onClick={handlePatientClick} className="role-button">
                    <img src={patientImage} alt="Patient" className="role-image" />
                    <span>Patient</span>
                </button>
            </div>
        </div>
    );
};

export default SelectRole;
