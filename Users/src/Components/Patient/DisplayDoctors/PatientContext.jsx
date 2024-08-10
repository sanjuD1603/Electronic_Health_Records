import React, { createContext, useContext, useState, useEffect } from "react";

const PatientContext = createContext();

export const usePatientContext = () => useContext(PatientContext);

export const PatientProvider = ({ children }) => {
  const [patientInfo, setPatientInfo] = useState(() => {
    const savedPatientInfo = localStorage.getItem("patientInfo");
    return savedPatientInfo ? JSON.parse(savedPatientInfo) : {};
  });

  const [clearSwitch, setClearSwitch] = useState(true); // Default to true

  useEffect(() => {
    if (clearSwitch) {
      localStorage.setItem("patientInfo", JSON.stringify(patientInfo));
    } else {
      setPatientInfo({});
      localStorage.removeItem("patientInfo");
    }
  }, [patientInfo, clearSwitch]);

  return (
    <PatientContext.Provider
      value={{ patientInfo, setPatientInfo, setClearSwitch }}
    >
      {children}
    </PatientContext.Provider>
  );
};

// Example component to toggle the clearSwitch
const ToggleClearSwitch = () => {
  const { setClearSwitch } = usePatientContext();

  const toggleSwitch = () => {
    setClearSwitch((prevState) => !prevState);
  };

  return <button onClick={toggleSwitch}>Toggle Clear Switch</button>;
};

// Use ToggleClearSwitch in your application to toggle the boolean switch
