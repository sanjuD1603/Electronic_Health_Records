import React, { useEffect, useContext } from 'react';
import { Route, Routes, useMatch, useNavigate } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import ViewDoctors from './ViewDoctors';
import UploadFiles from './UploadFiles';
import PatientViewProfile from './viewprofile';
// import { PatientContext } from '../PatientContext';
import { useLocation } from 'react-router-dom';

const PaientDashboard = () => {

  return (
    <>
    <PatientNavbar/>
    </>
  );
};

export default PaientDashboard;
