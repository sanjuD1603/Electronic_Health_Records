import React from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImage from './assets/doctor-icon.png'; 
import patientImage from './assets/patient-icon.png'; 
import './assets/selectrole.css'; 

const SelectRole = () => {
    const navigate = useNavigate();

    const handleDoctorClick = () => {
        navigate('/doctor-signup'); 
    };

    const handlePatientClick = () => {
        navigate('/Paitent/paitentsignup'); 
    };

    return (
        <div className="select-role">
            <h1>⚕️Select Your Role⚕️</h1>
            <div className="role-buttons">
                <button onClick={handleDoctorClick} className="role-button">
                    <img src={doctorImage} alt="Doctor" className="role-image" />
                    <span className='role-text'>Doctor</span>
                </button>
                <button onClick={handlePatientClick} className="role-button">
                    <img src={patientImage} alt="Patient" className="role-image" />
                    <span className='role-text'>Patient</span>
                </button>
            </div>
        </div>
    );
};

export default SelectRole;
