import React, { createContext, useContext, useState, useEffect } from 'react';

const PatientContext = createContext();

export const usePatientContext = () => useContext(PatientContext);

export const PatientProvider = ({ children }) => {
  const [patientInfo, setPatientInfo] = useState(() => {
    const savedPatientInfo = localStorage.getItem('patientInfo');
    return savedPatientInfo ? JSON.parse(savedPatientInfo) : {};
  });

  useEffect(() => {
    localStorage.setItem('patientInfo', JSON.stringify(patientInfo));
  }, [patientInfo]);

  return (
    <PatientContext.Provider value={{ patientInfo, setPatientInfo }}>
      {children}
    </PatientContext.Provider>
  );
};
