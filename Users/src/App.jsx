import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import Home from './Components/Home.jsx';
import Contact from './Components/Contact.jsx';
import SelectRole from './Components/selectrole.jsx';
import PatientSignUp from './Components/Patient/patientsignup.jsx'; // Corrected import path for PatientSignUp
import DoctorSignUp from './Components/Doctor/doctorsignup.jsx'; // Corrected import path for DoctorSignUp
import DoctorViewProfile from './Components/Doctor/Viewprofile.jsx';
import PatientViewProfile from './Components/Patient/viewprofile.jsx';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/selectrole" element={<SelectRole />} />
        <Route path="/Patient/patientsignup" element={<PatientSignUp />} />
        <Route path="/Doctor/doctorsignup" element={<DoctorSignUp />} />
        <Route path="/Doctor/Viewprofile" element={<DoctorViewProfile />} />
        <Route path="/Patient/viewprofile" element={<PatientViewProfile />} />
      </Routes>
    </div>
  );
}

export default App;
