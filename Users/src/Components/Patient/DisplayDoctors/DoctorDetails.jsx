import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePatientContext } from "./PatientContext";
import { web3, setupContract } from "../../Ethereum/Contracts/web3";

const DoctorDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state.doctor;
  const { patientInfo } = usePatientContext();

  const doctorAddress = doctor.metaMaskAccount;
  const patientAddress = patientInfo.metaMaskAccount;

  const PatientInfo = patientInfo.patInfo;
  // console.log(PatientInfo);

  const [showForm, setShowForm] = useState(false);
  const [doctorMeetings, setDoctorMeetings] = useState([]);
  const [patientMeetings, setPatientMeetings] = useState([]);

  useEffect(() => {
    const fetchDoctorMeetings = async () => {
      const contract = await setupContract();
      try {
        const docMeetings = await contract.methods
          .getDoctorMeetings(doctorAddress)
          .call();
        setDoctorMeetings(docMeetings);
        console.log("Doctor Meetings:", docMeetings);
      } catch (error) {
        console.error("Error fetching doctor meetings:", error);
      }
    };

    fetchDoctorMeetings();
  }, [doctorAddress]);

  useEffect(() => {
    const fetchPatientMeetings = async () => {
      const contract = await setupContract();
      try {
        const patMeetings = await contract.methods
          .getPatientMeetings(patientAddress)
          .call();
        setPatientMeetings(patMeetings);
        console.log("Patient Meetings:", patMeetings);
      } catch (error) {
        console.error("Error fetching patient meetings:", error);
      }
    };

    fetchPatientMeetings();
  }, [patientAddress]);

  const AppointmentForm = ({ onSubmit }) => {
    const [meetingDescription, setMeetingDescription] = useState("");
    const [meetingTime, setMeetingTime] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({
        meetingDescription,
        meetingTime: new Date(meetingTime).getTime() / 1000, // Convert to UNIX timestamp
      });
    };

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={meetingDescription}
            onChange={(e) => setMeetingDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Meeting Time:</label>
          <input
            type="datetime-local"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  };

  const handleFormSubmit = async (formData) => {
    const contract = await setupContract();

    try {
      await contract.methods
        .createMeeting(
          patientAddress,
          doctorAddress,
          formData.meetingDescription,
          formData.meetingTime
        )
        .send({ from: patientAddress, gas: 5000000, gasPrice: "20000000000" });
      console.log("Meeting created successfully!");
      // Redirect or show confirmation message after booking
    } catch (error) {
      console.error("Error creating meeting:", error.message);
    }

    console.log("Form Data:", formData);
    setShowForm(false);
  };

  const handleClearAllMeetings = async () => {
    // const contract = await setupContract();
    // try {
    //   await contract.methods.clearAllMeetings().send({ from: patientAddress, gas: 5000000, gasPrice: "20000000000" });
    //   console.log("All meetings cleared successfully!");
    //   // Update state after clearing meetings
    //   setDoctorMeetings([]);
    //   setPatientMeetings([]);
    // } catch (error) {
    //   console.error("Error clearing all meetings:", error);
    // }
  };

  return (
    <>
      <div>
        <h1>
          {doctor.firstName} {doctor.lastName}
        </h1>
        <p>Specialization: {doctor.specialization}</p>
        <p>Experience: {doctor.yearsOfExperience} years</p>
        <p>Email: {doctor.email}</p>
        <p>Address: {doctor.doctorAddress}</p>
        <p>Phone: {doctor.phoneNumber}</p>
        <p>Medical License Number: {doctor.medicalLicenseNumber}</p>
        <p>Date of Birth: {doctor.dateOfBirth}</p>
      </div>

      <button onClick={() => setShowForm(true)}>Book an Appointment</button>

      {showForm && <AppointmentForm onSubmit={handleFormSubmit} />}

      <button onClick={handleClearAllMeetings}>Clear All Meetings</button>

      <h2>Doctor's Meetings</h2>
      <ul>
        {doctorMeetings.map((meeting, index) => (
          <li key={index}>
            <p>Patient Name: {PatientInfo[meeting.patientAddress]?.firstName} {PatientInfo[meeting.patientAddress]?.lastName}</p>
            <p>Meeting Description: {meeting.meetingDescription}</p>
            <p>
              Meeting Time:{" "}
              {new Date(Number(meeting.meetingTime) * 1000).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <h2>Patient's Meetings</h2>
      <ul>
        {patientMeetings.map((meeting, index) => (
          <li key={index}>
            <p>Doctor Name: Dr. {doctor.firstName} {doctor.lastName}</p>
            <p>Meeting Description: {meeting.meetingDescription}</p>
            <p>
              Meeting Time:{" "}
              {new Date(Number(meeting.meetingTime) * 1000).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DoctorDetails;
