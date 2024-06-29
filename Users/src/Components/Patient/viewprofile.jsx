import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PatientViewProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state?.formData;

    
    if (!formData) {
        useEffect(() => {
            if (!formData) {
                navigate('/Patient/patientsignup');
            }
        }, [formData, navigate]);
        return <p>No profile data available</p>;
    }

    
    return (
        <>
            <h1>Welcome Back, {formData.firstName}!</h1>
            <p><strong>First Name:</strong> {formData.firstName}</p>
            <p><strong>Last Name:</strong> {formData.lastName}</p>
            <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
            <p><strong>Blood Group:</strong> {formData.bloodgroup}</p>
            <p><strong>MetaMask Account:</strong> {formData.metaMaskAccount}</p>
            <p><strong>Insurance Provider:</strong> {formData.insuranceProvider}</p>
            <p><strong>Policy Number:</strong> {formData.policyNumber}</p>
        </>
    );
};

export default PatientViewProfile;
