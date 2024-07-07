import React, { useEffect, useState } from "react";
import PatientNavbar from "./PatientNavbar";
import { useNavigate, useLocation } from "react-router-dom";
import { setupContract } from "../Ethereum/Contracts/web3";
import DoctorGrid from "./DisplayDoctors/DoctorGrid";
import { usePatientContext } from "./DisplayDoctors/PatientContext";
import "./DisplayDoctors/css/DoctorGrid.css";
// import "../ /DisplayDoctors/css/DoctorCard.css";
import "../Css/DoctorCard.css"

const ViewDoctors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setPatientInfo } = usePatientContext(); // Use context to set patient info
  const [doctors, setDoctors] = useState([]);
console.log(location.state)
  useEffect(() => {
    const metaMaskAccount = location.state.metaMaskAccount;
    const patInfo = location.state.patient;

    // Save the MetaMaskAccount and patInfo in the context
    const setpatInfo = setPatientInfo({ metaMaskAccount, patInfo });

    const getDoctors = async () => {
      try {
        const contract = await setupContract();
        if (!contract) {
          alert("Error deploying contract");
          return;
        }

        const events = await contract.getPastEvents("DoctorExists", {
          fromBlock: 0,
          toBlock: "latest",
        });

        if (events.length > 0) {
          const doctorsData = events.map(event => ({
            firstName: event.returnValues.doctor["firstName"],
            lastName: event.returnValues.doctor["lastName"],
            dateOfBirth: event.returnValues.doctor["dateOfBirth"],
            email: event.returnValues.doctor["email"],
            doctorAddress: event.returnValues.doctor["doctorAddress"],
            phoneNumber: event.returnValues.doctor["phoneNumber"],
            metaMaskAccount: event.returnValues.doctor["metaMaskAccount"],
            specialization: event.returnValues.doctor["specialization"],
            medicalLicenseNumber: event.returnValues.doctor["medicalLicenseNumber"],
            yearsOfExperience: event.returnValues.doctor["yearsOfExperience"]
          }));
          setDoctors(doctorsData);
        } else {
          console.error("No 'DoctorExists' events found.");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    getDoctors();
  }, [location.state, setPatientInfo]);

  return (
    <div>
      <PatientNavbar/>
      <h1>View Doctors</h1>
      <DoctorGrid doctors={doctors} />
    </div>
  );
};

export default ViewDoctors;
