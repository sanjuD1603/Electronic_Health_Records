import React, { createContext, useContext, useState, useEffect } from 'react';

const DoctorContext = createContext();

export const useDoctorContext = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
  const [doctorInfo, setDoctorInfo] = useState(() => {
    const savedDoctorInfo = localStorage.getItem('doctorInfo');
    return savedDoctorInfo ? JSON.parse(savedDoctorInfo) : {};
  });

  useEffect(() => {
    localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));
  }, [doctorInfo]);

  return (
    <DoctorContext.Provider value={{ doctorInfo, setDoctorInfo }}>
      {children}
    </DoctorContext.Provider>
  );
};
