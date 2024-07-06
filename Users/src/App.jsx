import React from 'react';
import { Routes, Route } from 'react-router-dom';
 import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Contact from './Components/Contact';
import SelectRole from './Components/selectrole';
import PatientSignUp from './Components/Patient/patientsignup';
import DoctorSignUp from './Components/Doctor/doctorsignup';
import DoctorViewProfile from './Components/Doctor/Viewprofile';
import PatientDashboard from './Components/Patient/Dashboard';
import PatientViewProfile from './Components/Patient/viewprofile';
import DoctorDashBoard  from './Components/Doctor/Dashboard';
import ViewDoctors from './Components/Patient/ViewDoctors';
import UploadFiles from './Components/Patient/UploadFiles';
import ViewPatients from './Components/Doctor/ViewPatients';
import DocUploadFiles from './Components/Doctor/UploadFiles';
import { PatientProvider } from './Components/PatientContext'; // Import PatientProvider

 import './App.css';

function App() {
  return (
    <PatientProvider>
      <div>
         <Navbar /> 
        <Routes>
          {/* Src Directory */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/selectrole" element={<SelectRole />} />
          
          {/* Patient directory */}
          <Route path="/patient/patientsignup" element={<PatientSignUp />} />
          <Route path="/patient/dashboard/*" element={<PatientDashboard />} />
          <Route path="/patient/viewprofile" element={<PatientViewProfile />} />
          <Route path="/patient/ViewDoctors" element={<ViewDoctors />} />
          <Route path="/patient/UploadFiles" element={<UploadFiles />} />

          {/* Doctor Directory */}
          <Route path="/doctor/doctorsignup" element={<DoctorSignUp />} />
          <Route path="/doctor/viewprofile" element={<DoctorViewProfile />} />
          <Route path="/doctor/dashboard" element={<DoctorDashBoard />} />
          <Route path="/doctor/viewpatients" element={<ViewPatients />} />
          <Route path="/doctor/uploadfiles" element={<DocUploadFiles />} />

        </Routes>
      </div>
    </PatientProvider>
  );
}

export default App;
