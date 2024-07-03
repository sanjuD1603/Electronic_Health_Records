import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImage from './assets/doctor-icon.png'; 
import patientImage from './assets/patient-icon.png'; 
import detectEthereumProvider from '@metamask/detect-provider';
// import { useState } from 'react';
import axios from 'axios';
//import './assets/selectrole.css'; 

const SelectRole = () => {
    const navigate = useNavigate();
    const [metaMaskAccount, setMetaMaskAccount] = useState('');

    const connectMetaMask = async () => {
        const provider = await detectEthereumProvider();

        if (provider) {
            try {
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                setMetaMaskAccount(account);
                console.log("MetaMask Account:", account);
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

    const saveAccountToDB = async (account, role) => {
        try {
            const response = await axios.post('http://localhost:5000/api/accounts', { address: account, role });
            console.log(response.status);
            if (response.status === 201) {
                console.log('Account created:', response.data);
                if (role === 'doctor') {
                    await navigate('/Doctor/doctorsignup', { state: { metaMaskAccount: account } });
                } else {
                    await navigate('/Patient/patientsignup', { state: { metaMaskAccount: account } });
                }
            } else if (response.status === 200) {
                console.log('Account exists, redirecting to profile:', response.data);
                if (role === 'doctor') {
                    await navigate('/Doctor/Viewprofile', { state: { metaMaskAccount: account } });
                } else {
                    await navigate('/Patient/viewprofile', { state: { metaMaskAccount: account } });
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert('Address and role are required.');
            } else if (error.response && error.response.status === 500) {
                alert('Internal server error. Please try again later.');
            } else {
                console.error('Error saving account to DB:', error);
            }
        }
    };
    

    const handleDoctorClick = async() => {
        const account = await connectMetaMask();
        if(account){
            saveAccountToDB(account, 'doctor');
        }
    };

    const handlePatientClick = async() => {
        const account = await connectMetaMask();
        if(account){
            saveAccountToDB(account, 'patient');
        } 
    };

    const disconnectMetaMask = () => {
        console.log("Disconnecting MetaMask account");
        setMetaMaskAccount('');
        if (window.ethereum && window.ethereum.disconnect) {
            window.ethereum.disconnect();
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
            {metaMaskAccount && (
                <div>
                    <p>Connected MetaMask Account: {metaMaskAccount}</p>
                    <button onClick={disconnectMetaMask} style={{ backgroundColor: 'red', color: 'white' }}>
                        Disconnect Wallet
                    </button>
                </div>
            )}
        </div>
    );
};

export default SelectRole;
