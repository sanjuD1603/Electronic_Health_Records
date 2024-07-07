import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDoctorContext } from "./DoctorContext";
import { setupContract } from "../../Ethereum/Contracts/web3";

const PatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state.patient;
  const { doctorInfo } = useDoctorContext();

  const patientAddress = patient.metaMaskAccount;
  const doctorAddress = doctorInfo.metaMaskAccount;

  console.log(patientAddress);
  console.log(doctorAddress);

  const [showForm, setShowForm] = useState(false);
  const [doctorMeetings, setDoctorMeetings] = useState([]);
  const [patientMeetings, setPatientMeetings] = useState([]);
  const [doctorLookup, setDoctorLookup] = useState({});
  const [patientLookup, setPatientLookup] = useState({});
  const [timeLeft, setTimeLeft] = useState({});
  
};

export default PatientDetails;
