import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import Home from './Components/Home.jsx';
import Contact from './Components/Contact.jsx';
import SelectRole from './Components/selectrole.jsx';
<<<<<<< HEAD
import PatientSignUp from './Components/Patient/patientsignup.jsx';
=======
import PatientSignUp from './Components/Paitent/patientsignup.jsx';


>>>>>>> 152fc9a66d7cc50ad540c2768044597917385e5c
import DoctorSignUp from './Components/Doctor/doctorsignup.jsx';
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
<<<<<<< HEAD
        <Route path="/Patient/patientsignup" element={<PatientSignUp />} />
        <Route path="/Doctor/doctorsignup" element={<DoctorSignUp />} />
        <Route path="/Doctor/Viewprofile" element={<DoctorViewProfile />} />
        <Route path="/Patient/viewprofile" element={<PatientViewProfile />} />
=======

        <Route path="/Paitent/paitentsignup" element={<PatientSignUp />} />

        <Route path="/Paitent/patientsignup" element={<PatientSignUp />} />
        <Route path="/Doctor/doctorsignup" element={<DoctorSignUp />} />

>>>>>>> 152fc9a66d7cc50ad540c2768044597917385e5c
      </Routes>
    </div>
  );
}

export default App;
