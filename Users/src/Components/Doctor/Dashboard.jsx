import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DoctorDashBoard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const metaMaskAccount = location.state?.metaMaskAccount;
    const docInfo = location.state?.doctor;
    // const [formData, setFormData] = useState(null);

    const gotoViewProfile = async() => {
        navigate('/Doctor/viewprofile', {
            state: {
                metaMaskAccount: metaMaskAccount,
                doctor: docInfo
            }
        })
    }

    const gotoViewPatients = async() => {
        navigate('/Doctor/ViewPatients', {
            state: {
                metaMaskAccount: metaMaskAccount,
                doctor: docInfo
            }
        })
    }

    const gotoUploadFile = async() => {
        navigate('/Doctor/UploadFiles', {
            state: {
                metaMaskAccount: metaMaskAccount,
                doctor: docInfo
            }
        })
    }


    
    // useEffect(() => {
    //     setFormData({
    //         firstName: location.state.doctor["firstName"],
    //         lastName: location.state.doctor["lastName"],
    //         dateOfBirth: location.state.doctor["dateOfBirth"],
    //         email: location.state.doctor["email"],
    //         address: location.state.doctor["doctorAddress"],
    //         phoneNumber: location.state.doctor["phoneNumber"],
    //         metaMaskAccount: location.state.doctor["metaMaskAccount"],
    //         medicalLicenseNumber: location.state.doctor["medicalLicenseNumber"],
    //         yearsOfExperience: location.state.doctor["yearsOfExperience"]
    //     });
    // }, [location.state.doctor]);

    // if (!formData) {
    //     return <p>Loading...</p>;
    // }

    return (
        <>

            <button onClick={gotoViewProfile}>ViewProfile</button>
            <button onClick={gotoViewPatients}>ViewPatients</button>
            <button onClick={gotoUploadFile}>Upload Files</button>
        </>
    );
}

export default DoctorDashBoard;
