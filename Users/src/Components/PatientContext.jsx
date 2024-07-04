import React, { createContext, useState, useEffect } from 'react';

const PatientContext = createContext();

const PatientProvider = ({ children }) => {
  const [patientDetails, setPatientDetails] = useState(() => {
    const savedPatientDetails = localStorage.getItem('patientDetails');
    return savedPatientDetails ? JSON.parse(savedPatientDetails) : null;
  });
  const [metaMaskAccount, setMetaMaskAccount] = useState(() => {
    const savedMetaMaskAccount = localStorage.getItem('metaMaskAccount');
    return savedMetaMaskAccount ? JSON.parse(savedMetaMaskAccount) : null;
  });

  useEffect(() => {
    if (patientDetails) {
      localStorage.setItem('patientDetails', JSON.stringify(patientDetails));
    }
  }, [patientDetails]);

  useEffect(() => {
    if (metaMaskAccount) {
      localStorage.setItem('metaMaskAccount', JSON.stringify(metaMaskAccount));
    }
  }, [metaMaskAccount]);

  return (
    <PatientContext.Provider value={{ patientDetails, setPatientDetails, metaMaskAccount, setMetaMaskAccount }}>
      {children}
    </PatientContext.Provider>
  );
};

export { PatientContext, PatientProvider };
