import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PatientViewProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const metaMaskAccount = location.state?.metaMaskAccount;
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (metaMaskAccount) {
            axios.get('http://localhost:5000/api/registerpatient', {
                params: { metaMaskAccount },
            })
            .then((response) => {
                setFormData(response.data);
            })
            .catch((error) => {
                console.error(error);
                navigate('/Patient/patientsignup');
            });
        } else {
            navigate('/Patient/patientsignup');
        }
    }, [metaMaskAccount, navigate]);

    if (!formData) {
        return <p>Loading profile data...</p>;
    }

    // Determine title based on gender
    const getTitle = () => {
        if (formData.gender === 'Male') {
            return 'Mr.';
        } else if (formData.gender === 'Female') {
            return 'Mrs.';
        } else {
            return ''; // Handle other genders as needed
        }
    };

    return (
        <>
            <h1>Welcome Back, {getTitle()} {formData.firstName}!</h1>
            <p><strong>First Name:</strong> {formData.firstName}</p>
            <p><strong>Last Name:</strong> {formData.lastName}</p>
            <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
            <p><strong>Blood Group:</strong> {formData.bloodGroup}</p>
            <p><strong>MetaMask Account:</strong> {formData.metaMaskAccount}</p>
            <p><strong>Insurance Provider:</strong> {formData.insuranceProvider}</p>
            <p><strong>Policy Number:</strong> {formData.policyNumber}</p>
        </>
    );
};

export default PatientViewProfile;
