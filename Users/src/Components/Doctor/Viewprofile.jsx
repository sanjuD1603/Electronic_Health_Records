import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DoctorViewProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state?.formData;

    // Optional: Handle redirection if formData is not available
    React.useEffect(() => {
        if (!formData) {
            navigate('/Doctor/doctorsignup');
        }
    }, [formData, navigate]);

    // Optional: Handle initial loading state or display if formData is not yet available
    if (!formData) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1>This is Doctor View Profile</h1>
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
}

export default DoctorViewProfile;
