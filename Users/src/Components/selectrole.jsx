import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImage from './assets/doctor-icon.png'; 
import patientImage from './assets/patient-icon.png'; 
import './assets/selectrole.css'; 

const SelectRole = () => {
    const navigate = useNavigate();
    const [metaMaskAccount, setMetaMaskAccount] = useState(null);

    const connectMetaMask = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                setMetaMaskAccount(account);
                return account;
            } catch (error) {
                console.error("MetaMask error:", error);
                return null;
            }
        } else {
            console.error("MetaMask not detected.");
            return null;
        }
    };


    const handlePatientClick = () => {
        navigate('/Paitent/paitentsignup'); 

    const handleDoctorClick = async () => {
        const account = await connectMetaMask();
        if (account) {
            navigate('/Doctor/doctorsignup', { state: { metaMaskAccount: account } });
        }
    };

    const handlePatientClick = async () => {
        const account = await connectMetaMask();
        if (account) {
            navigate('/Patient/patientsignup', { state: { metaMaskAccount: account } });
        }

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

}
export default SelectRole;
