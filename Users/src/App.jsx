import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import Home from './Components/Home.jsx';
import Contact from './Components/Contact.jsx';
import SelectRole from './Components/selectrole.jsx';
import PatientSignUp from './Components/Paitent/patientsignup.jsx'; // Corrected import path
import DoctorSignUp from './Components/Doctor/doctorsignup.jsx';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/selectrole" element={<SelectRole />} />
        <Route path="/Patient/patientsignup" element={<PatientSignUp />} /> {/* Corrected path */}
        <Route path="/Doctor/doctorsignup" element={<DoctorSignUp />} />
      </Routes>
    </div>
  );
}

export default App;
