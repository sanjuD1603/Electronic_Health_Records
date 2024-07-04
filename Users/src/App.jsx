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
import { PatientProvider } from './Components/PatientContext'; // Import PatientProvider

import './App.css';

function App() {
  return (
    <PatientProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/selectrole" element={<SelectRole />} />
          <Route path="/patient/patientsignup" element={<PatientSignUp />} />
          <Route path="/doctor/doctorsignup" element={<DoctorSignUp />} />
          <Route path="/doctor/viewprofile" element={<DoctorViewProfile />} />
          <Route path="/patient/dashboard/*" element={<PatientDashboard />} />
          <Route path="/patient/dashboard/viewprofile" element={<PatientViewProfile />} />
        
        </Routes>
      </div>
    </PatientProvider>
  );
}

export default App;
