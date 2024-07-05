import React, { useEffect, useContext } from 'react';
import { Route, Routes, useMatch, useNavigate } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import ViewDoctors from './ViewDoctors';
import UploadFiles from './UploadFiles';
import PatientViewProfile from './viewprofile';
// import { PatientContext } from '../PatientContext';
import { useLocation } from 'react-router-dom';

const PaientDashboard = () => {
  const location = useLocation();
    const navigate = useNavigate();
    const metaMaskAccount = location.state?.metaMaskAccount;
    const patInfo = location.state?.patient;
    // const [formData, setFormData] = useState(null);

    const gotoViewProfile = async() => {
        navigate('/Patient/viewprofile', {
            state: {
                metaMaskAccount: metaMaskAccount,
                patient: patInfo
            }
        })
    }

    const gotoViewDoctors = async() => {
      navigate('/Patient/ViewDoctors', {
          state: {
              metaMaskAccount: metaMaskAccount,
              patient: patInfo
          }
      })
  }

  const gotoUploadFile = async() => {
    navigate('/Patient/UploadFiles', {
      state: {
          metaMaskAccount: metaMaskAccount,
          patient: patInfo
      }
  })
  }


  return (
    <>
       <button onClick={gotoViewProfile}>ViewProfile</button>
       <button onClick={gotoViewDoctors}>ViewDoctors</button>
       <button onClick={gotoUploadFile}>UploadFile</button>
    </>
  );
};

export default PaientDashboard;
