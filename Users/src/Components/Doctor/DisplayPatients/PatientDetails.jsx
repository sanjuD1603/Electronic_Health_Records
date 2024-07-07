import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDoctorContext } from "./DoctorContext";
import { setupContract } from "../../Ethereum/Contracts/web3";
import DoctorNavbar from "../DoctorNavbar";

const PatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state.patient;
  const { doctorInfo } = useDoctorContext();

  console.log(patient);

  const patientAddress = patient["metaMaskAccount"];
  const doctorAddress = doctorInfo.metaMaskAccount;

  console.log(patientAddress);
  console.log(doctorAddress);

  const [showForm, setShowForm] = useState(false);
  const [doctorMeetings, setDoctorMeetings] = useState([]);
  const [patientMeetings, setPatientMeetings] = useState([]);
  const [doctorLookup, setDoctorLookup] = useState({});
  const [patientLookup, setPatientLookup] = useState({});
  const [timeLeft, setTimeLeft] = useState({});

  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-2)}`;
  };

  const fetchDoctorMeetings = async () => {
    const contract = await setupContract();
    try {
      const docMeetings = await contract.methods
        .getDoctorMeetings(doctorAddress)
        .call();
      setDoctorMeetings(docMeetings);
    } catch (error) {
      console.error("Error fetching doctor meetings:", error);
    }
  };

  useEffect(() => {
    fetchDoctorMeetings(); // Initial fetch

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorAddress]);


  useEffect(() => {
    const fetchPatients = async () => {
      const contract = await setupContract();
      try {
        const events = await contract.getPastEvents("PatientExists", {
          fromBlock: 0,
          toBlock: "latest",
        });
        const patientData = {};
        events.forEach((event) => {
          const patientInfo = event.returnValues;
          patientData[patientInfo.metaMaskAccount] = patientInfo;
        });
        setPatientLookup(patientData);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients(); // Initial fetch

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleAcceptMeeting = async (index) => {
    const contract = await setupContract();
    // const meetingId = patientMeetings[index].id; // Assuming `id` is the unique identifier
    console.log("Attempting to accept meeting with ID:", index);

    try {
      await contract.methods
        .acceptMeeting(index) // Pass meeting index to Solidity function
        .send({ from: patientAddress, gas: 5000000, gasPrice: "20000000000" });
      console.log("Meeting accepted successfully!");
      // Update state after accepting meeting
      fetchDoctorMeetings();
      fetchPatientMeetings();
    } catch (error) {
      console.error("Error accepting meeting:", error);
    }
  };

  const handleRejectMeeting = async (index) => {
    const contract = await setupContract();
    const meetingId = patientMeetings[index].id; // Assuming `id` is the unique identifier

    try {
      await contract.methods
        .rejectMeeting(index) // Pass meeting index to Solidity function
        .send({ from: patientAddress, gas: 5000000, gasPrice: "20000000000" });
      console.log("Meeting rejected successfully!");
      // Update state after rejecting meeting
      fetchDoctorMeetings();
      fetchPatientMeetings();
    } catch (error) {
      console.error("Error rejecting meeting:", error.message);
    }
  };
  

  return (
    <>
    {/* <DoctorNavbar /> */}

    <div className="container">
        <div className="doctor-details">
          <h1>
            {patient["firstName"]} {patient["lastName"]}
          </h1>
          <p>Email: {patient["email"]}</p>
          <p>Address: {patient["address"]}</p>
          <p>Gender: {patient["gender"]}</p> 
          <p>Phone: {patient["phoneNumber"]}</p>
          <p>Date of Birth: {patient["dateOfBirth"]}</p>
          <p>BloodGroup: {patient["bloodgroup"]}</p>
          <p>Wallet Address: {formatWalletAddress(patient["metaMaskAccount"])}</p> 
          <p>Insurance Provider: {patient["insuranceProvider"]}</p>
          <p>Policy Number: {patient["policyNumber"]}</p>
        </div>
    </div>    
      <h2>Doctor's Meetings</h2>
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Meeting Description</th>
            <th>Meeting Time</th>
            <th>Status</th>
            <th>Accept/ Reject</th>
          </tr>
        </thead>
        <tbody>
          {doctorMeetings.map((meeting, index) => (
            <tr key={index}>
              <td>
                {patientLookup[meeting.patientAddress].patient?.firstName}{" "}
                {patientLookup[meeting.patientAddress].patient?.lastName}
              </td>
              <td>{meeting.meetingDescription}</td>
              <td>
                {" "}
                {new Date(Number(meeting.meetingTime) * 1000).toLocaleString()}
              </td>
              <td>{meeting.isVerified ? "Accepted" : "Pending"}</td>
              {!meeting.isVerified && (
                <td>
                  {" "}
                  <button onClick={() => handleAcceptMeeting(index)}>
                    Accept
                  </button>{" "}
                  {" ---- "}
                  <button onClick={() => handleRejectMeeting(index)}>
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PatientDetails;
