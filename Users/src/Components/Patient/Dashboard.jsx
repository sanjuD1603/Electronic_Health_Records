import React, { useEffect, useContext } from 'react';
import { Route, Routes, useMatch, useNavigate } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import ViewDoctors from './ViewDoctors';
import UploadFiles from './UploadFiles';
import PatientViewProfile from './viewprofile';
import { PatientContext } from '../PatientContext';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  let match = useMatch("/patient/dashboard/*");
  const location = useLocation();
  const navigate = useNavigate();
  const { patientDetails, setPatientDetails, metaMaskAccount, setMetaMaskAccount } = useContext(PatientContext);

  useEffect(() => {
    const metaMaskAccount = location.state?.metaMaskAccount;
    const patient = location.state?.patient;
    if (metaMaskAccount && patient) {
      setMetaMaskAccount(metaMaskAccount);
      setPatientDetails(patient);
    }
  }, [location.state, setMetaMaskAccount, setPatientDetails]);

  useEffect(() => {
    console.log("Checking patient details...");
    if (!patientDetails || !metaMaskAccount) {
      console.log("Details not found");
    } else {
      console.log("Details fetched successfully");
      console.log("metaMaskAccount:", metaMaskAccount);
      console.log("patientDetails:", patientDetails);
    }
  }, [patientDetails, metaMaskAccount]);

  const handleViewProfile = () => {
    console.log("Navigating to view profile with details:", patientDetails, metaMaskAccount);
    if (patientDetails && metaMaskAccount) {
      navigate(`/patient/dashboard/viewprofile`);
    } else {
      console.error("Patient details or MetaMask account is missing.");
    }
  };

  const handleUploadFiles = () => {
    console.log("Navigating to upload files with MetaMask account:", metaMaskAccount);
    if (metaMaskAccount) {
      navigate(`/patient/dashboard/upload`, { state: { metaMaskAccount } });
    } else {
      console.error("MetaMask account is missing.");
    }
  };

  return (
    <div className="dashboard">
      <PatientNavbar />
      <div className="content">
        <nav>
          <ul>
            <li><button onClick={handleViewProfile}>View Profile</button></li>
            <li><a href={`${match.url}/viewdoctors`}>View Doctors</a></li>
            {/* <li><button onClick={handleUploadFiles}>Upload Files</button></li> */}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<h3>Welcome to the Patient Dashboard</h3>} />
          <Route path="viewprofile" element={<PatientViewProfile />} />
          <Route path="viewdoctors" element={<ViewDoctors />} />
          <Route path="upload" element={<UploadFiles />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
