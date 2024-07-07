import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDoctorContext } from "./DoctorContext";
import { setupContract } from "../../Ethereum/Contracts/web3";
import DoctorNavbar from "../DoctorNavbar";
import detectEthereumProvider from "@metamask/detect-provider";

const PatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state.patient;
  const { doctorInfo } = useDoctorContext();

  const patientAddress = patient["metaMaskAccount"];
  const doctorAddress = doctorInfo.metaMaskAccount;

  const [doctorMeetings, setDoctorMeetings] = useState([]);
  const [patientLookup, setPatientLookup] = useState({});

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
    fetchDoctorMeetings();
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

    fetchPatients();
  }, []);

  const handleAcceptMeeting = async (meetingIndex) => {
    const contract = await setupContract();
    const provider = await detectEthereumProvider();

    if (provider) {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        const currentAccount = accounts[0];
        console.log("Current account:", currentAccount);
        console.log("Doctor's account:", doctorAddress);
    
        if (currentAccount.toLowerCase() !== doctorAddress.toLowerCase()) {
          console.error("Current account is not the doctor.");
      }
      return;
    }

    try {
      await contract.methods
        .acceptMeeting(meetingIndex)
        .send({ from: doctorAddress, gas: 5000000, gasPrice: "20000000000" });
      console.log("Meeting accepted successfully!");
      fetchDoctorMeetings();
    } catch (error) {
      console.error("Error accepting meeting:", error.message);
      if (error.message.includes('revert')) {
        console.error("Revert reason:", error.message);
      }
    }
  };

  const handleRejectMeeting = async (meetingIndex) => {
    const contract = await setupContract();
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const currentAccount = accounts[0];

    console.log("Current account:", currentAccount);
    console.log("Doctor's account:", doctorAddress);

    if (currentAccount.toLowerCase() !== doctorAddress.toLowerCase()) {
      console.error("Current account is not the doctor.");
      return;
    }

    try {
      await contract.methods
        .rejectMeeting(meetingIndex)
        .send({ from: doctorAddress, gas: 5000000, gasPrice: "20000000000" });
      console.log("Meeting rejected successfully!");
      fetchDoctorMeetings();
    } catch (error) {
      console.error("Error rejecting meeting:", error.message);
      if (error.message.includes('revert')) {
        console.error("Revert reason:", error.message);
      }
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
          <p>Blood Group: {patient["bloodgroup"]}</p>
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
            <th>Accept/Reject</th>
          </tr>
        </thead>
        <tbody>
          {doctorMeetings.map((meeting, index) => (
            <tr key={index}>
              <td>
                {patientLookup[meeting.patientAddress]?.firstName}{" "}
                {patientLookup[meeting.patientAddress]?.lastName}
              </td>
              <td>{meeting.meetingDescription}</td>
              <td>
                {new Date(Number(meeting.meetingTime) * 1000).toLocaleString()}
              </td>
              <td>{meeting.isVerified ? "Accepted" : "Pending"}</td>
              {!meeting.isVerified && (
                <td>
                  <button onClick={() => handleAcceptMeeting(index)}>
                    Accept
                  </button>
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
