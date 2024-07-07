import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setupContract } from "../Ethereum/Contracts/web3";
import { useDoctorContext } from "./DisplayPatients/DoctorContext";
import "../Patient/DisplayDoctors/css/DoctorGrid.css";
import '../Css/DoctorCard.css'
import DoctorNavbar from "./DoctorNavbar";
import PatientGrid from "./DisplayPatients/PatientGrid";

const ViewPatients = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setDoctorInfo } = useDoctorContext(); 
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const metaMaskAccount = location.state.metaMaskAccount;
    const docInfo = location.state.doctor;

    // Save the MetaMaskAccount and docInfo in the context
    setDoctorInfo({ metaMaskAccount, docInfo });

    const getPatients = async () => {
      try {
        const contract = await setupContract();
        if (!contract) {
          alert("Error deploying contract");
          return;
        }
        const events = await contract.getPastEvents("PatientExists", {
          fromBlock: 0,
          toBlock: "latest",
        });

        console.log("Return Values", events);
        if (events.length > 0) {
          const patientsData = await Promise.all(events.map(async (event) => {
            const patientAddress = event.returnValues.patient[8];
            const meetings = await contract.methods.getPatientMeetings(patientAddress).call();
            // Filter meetings by doctor address
            const relevantMeetings = meetings.filter(meeting => meeting.doctorAddress.toLowerCase() === metaMaskAccount.toLowerCase());
            if (relevantMeetings.length > 0) {
              return {
                firstName: event.returnValues.patient[0],
                lastName: event.returnValues.patient[1],
                dateOfBirth: event.returnValues.patient[2],
                email: event.returnValues.patient[3],
                gender: event.returnValues.patient[4],
                address: event.returnValues.patient[5],
                phoneNumber: event.returnValues.patient[6],
                bloodgroup: event.returnValues.patient[7],
                metaMaskAccount: event.returnValues.patient[8],
                insuranceProvider: event.returnValues.patient[9],
                policyNumber: event.returnValues.patient[10],
                meetings: relevantMeetings
              };
            } else {
              return null;
            }
          }));

          const filteredPatientsData = patientsData.filter(patient => patient !== null);
          setPatients(filteredPatientsData);
          console.log("Patients Data after setting state:", filteredPatientsData);
        } else {
          console.error("No 'PatientExists' events found.");
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    getPatients();
  }, [location.state, setDoctorInfo]);

  useEffect(() => {
    // Debugging state update
    console.log("Patients state updated:", patients);
  }, [patients]);

  return (
    <div>
      <DoctorNavbar />
      <h1>View Patients</h1>
      <PatientGrid patients={patients} />
    </div>
  );
};

export default ViewPatients;
