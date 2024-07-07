import React, { createContext, useContext, useState, useEffect } from 'react';

const DoctorContext = createContext();

export const useDoctorContext = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
  const [doctorInfo, setDoctorInfo] = useState(() => {
    const savedDoctorInfo = localStorage.getItem('doctorInfo');
    return savedDoctorInfo ? JSON.parse(savedDoctorInfo) : {};
  });

  const [clearSwitch, setClearSwitch] = useState(true); // Default to true

  useEffect(() => {
    if (clearSwitch) {
      localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));
    } else {
      // setDoctorInfo({});
      localStorage.removeItem('doctorInfo');
    }
  }, [doctorInfo, clearSwitch]);

  return (
    <DoctorContext.Provider value={{ doctorInfo, setDoctorInfo, setClearSwitch }}>
      {children}
    </DoctorContext.Provider>
  );
};

// Example component to toggle the clearSwitch
const ToggleClearSwitch = () => {
  const { setClearSwitch } = useDoctorContext();

  const toggleSwitch = () => {
    setClearSwitch(prevState => !prevState);
  };

  return (
    <button onClick={toggleSwitch}>
      Toggle Clear Switch
    </button>
  );
};

// Use ToggleClearSwitch in your application to toggle the boolean switch
