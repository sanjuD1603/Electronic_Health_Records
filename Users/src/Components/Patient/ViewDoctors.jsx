import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setupContract } from "../Ethereum/Contracts/web3";
import DoctorGrid from "./DisplayDoctors/DoctorGrid";
import "./DisplayDoctors/css/DoctorGrid.css";
import "./DisplayDoctors/css/DoctorCard.css";

const ViewDoctors = () => {
  const location = useLocation();
  // console.log("Location state:", location.state);
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
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
        // console.log("Events: ", events)

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
          console.log("Doctors data:", doctorsData);
        } else {
          console.error("No 'DoctorExists' events found.");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    getDoctors();
  }, []);

  // console.log("Doctors state:", doctors);
  return (
    <div>
      <h1>View Doctors</h1>
      <DoctorGrid doctors={doctors} />
    </div>
  );
};

export default ViewDoctors;
