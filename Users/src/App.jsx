import React from 'react';
import { Routes, Route } from 'react-router-dom';
 import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Contact from './Components/Contact';
import SelectRole from './Components/selectrole';
import PatientSignUp from './Components/Patient/patientsignup';
import PatientDashboard from './Components/Patient/Dashboard';
import PatientViewProfile from './Components/Patient/viewprofile';
import ViewDoctors from './Components/Patient/ViewDoctors';
  import DoctorCard from './Components/Patient/DisplayDoctors/DoctorCard';
  import DoctorDetails from './Components/Patient/DisplayDoctors/DoctorDetails';
  import DoctorGrid from './Components/Patient/DisplayDoctors/DoctorGrid';
  import { PatientProvider } from './Components/Patient/DisplayDoctors/PatientContext'; // Import PatientProvider

import UploadFiles from './Components/Patient/UploadFiles';


import DoctorSignUp from './Components/Doctor/doctorsignup';
import DoctorViewProfile from './Components/Doctor/Viewprofile';
import DoctorDashBoard  from './Components/Doctor/Dashboard';
import ViewPatients from './Components/Doctor/ViewPatients';
import DocUploadFiles from './Components/Doctor/UploadFiles';

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

            {/* Display Doctors */}
            <Route path="/patient/displaydoctors/doctorcard" element={<DoctorCard />} />
            <Route path="/patient/displaydoctors/doctordetails/:email" element={<DoctorDetails />} />
            <Route path="/patient/displaydoctors/doctorgrid" element={<DoctorGrid />} />


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
