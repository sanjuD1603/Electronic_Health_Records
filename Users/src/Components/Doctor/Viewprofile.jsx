import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DoctorDashBoard from "./Dashboard";
import '../Css/Doctorviewprofile.css';  // Import the CSS file
import doctorprofile from "../assets/Images/doctor-viewprofile.png";  // Import the new profile image

const DoctorViewProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const metaMaskAccount = location.state?.metaMaskAccount;
    const [formData, setFormData] = useState(null);

    console.log(location.state);
    const formatWalletAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 8)}...${address.slice(-5)}`;
      };
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
            <DoctorDashBoard />
            <div className="profile-container">
                <div className="profile-image" style={{ backgroundImage: `url(${doctorprofile})` }}></div>
                <div className="profile-info">
                    <div className="info-left">
                        <p><strong>First Name:</strong> {formData.firstName}</p>
                        <p><strong>Last Name:</strong> {formData.lastName}</p>
                        <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                    </div>
                    <div className="info-right">
                        <p><strong>Address:</strong> {formData.address}</p>
                        <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
                        <p><strong>MetaMask Account:</strong> {formatWalletAddress(formData.metaMaskAccount)}</p>
                        <p><strong>Medical License Number:</strong> {formData.medicalLicenseNumber}</p>
                        <p><strong>Years of Experience:</strong> {formData.yearsOfExperience}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DoctorViewProfile;
