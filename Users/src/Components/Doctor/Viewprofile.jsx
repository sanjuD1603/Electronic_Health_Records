import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorViewProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const metaMaskAccount = location.state?.metaMaskAccount;
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        setFormData({
            firstName: location.state.doctor["firstName"],
            lastName: location.state.doctor["lastName"],
            dateOfBirth: location.state.doctor["dateOfBirth"],
            email: location.state.doctor["email"],
            address: location.state.doctor["doctorAddress"],
            phoneNumber: location.state.doctor["phoneNumber"],
            metaMaskAccount: location.state.doctor["metaMaskAccount"],
            medicalLicenseNumber: location.state.doctor["medicalLicenseNumber"],
            yearsOfExperience: location.state.doctor["yearsOfExperience"]
        });
    }, [location.state.doctor]);

    if (!formData) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1>Welcome Back, Dr. {formData.firstName}!</h1>
            <p><strong>First Name:</strong> {formData.firstName}</p>
            <p><strong>Last Name:</strong> {formData.lastName}</p>
            <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            {/* <p><strong>Gender:</strong> {formData.gender}</p> */}
            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
            <p><strong>MetaMask Account:</strong> {formData.metaMaskAccount}</p>
            <p><strong>Medical License Number:</strong> {formData.medicalLicenseNumber}</p>
            <p><strong>Years of Experience:</strong> {formData.yearsOfExperience}</p>
        </>
    );
}

export default DoctorViewProfile;
