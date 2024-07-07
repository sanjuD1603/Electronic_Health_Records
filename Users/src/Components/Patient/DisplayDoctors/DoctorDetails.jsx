import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePatientContext } from "./PatientContext";
import { setupContract } from "../../Ethereum/Contracts/web3";

const DoctorDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state.doctor;
  const { patientInfo } = usePatientContext();

  const doctorAddress = doctor.metaMaskAccount;
  const patientAddress = patientInfo.metaMaskAccount;

  const [showForm, setShowForm] = useState(false);
  const [doctorMeetings, setDoctorMeetings] = useState([]);
  const [patientMeetings, setPatientMeetings] = useState([]);
  const [doctorLookup, setDoctorLookup] = useState({});
  const [patientLookup, setPatientLookup] = useState({});
  const [timeLeft, setTimeLeft] = useState({});

  // Function to fetch doctor's meetings
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
  }, [doctorAddress]); // Update on doctorAddress change

  useEffect(() => {
    const fetchPatientMeetings = async () => {
      const contract = await setupContract();
      try {
        const patMeetings = await contract.methods
          .getPatientMeetings(patientAddress)
          .call();
        setPatientMeetings(patMeetings);
      } catch (error) {
        console.error("Error fetching patient meetings:", error);
      }
    };

    fetchPatientMeetings(); // Initial fetch

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientAddress]); // Update on patientAddress change

  useEffect(() => {
    const fetchDoctors = async () => {
      const contract = await setupContract();
      try {
        const events = await contract.getPastEvents("DoctorExists", {
          fromBlock: 0,
          toBlock: "latest",
        });
        const doctorData = {};
        events.forEach((event) => {
          const doctorInfo = event.returnValues;
          doctorData[doctorInfo.metaMaskAccount] = doctorInfo;
        });
        setDoctorLookup(doctorData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors(); // Initial fetch

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once on component mount

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
  }, []); // Only fetch once on component mount

  const calculateTimeLeft = (meetingTime) => {
    const now = new Date();
    const timeLeftInSeconds = meetingTime - Math.floor(now.getTime() / 1000);
    const hours = Math.floor(timeLeftInSeconds / 3600);
    const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
    return { hours, minutes };
  };

  useEffect(() => {
    const updateTimes = () => {
      const newTimeLeft = patientMeetings.reduce((acc, meeting) => {
        if (meeting.isVerified) {
          acc[meeting.id] = calculateTimeLeft(meeting.meetingTime);
        }
        return acc;
      }, {});
      setTimeLeft(newTimeLeft);
    };

    updateTimes();
    const intervalId = setInterval(updateTimes, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [patientMeetings]);

  const AppointmentForm = ({ onSubmit }) => {
    const [meetingDescription, setMeetingDescription] = useState("");
    const [meetingTime, setMeetingTime] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = {
        meetingDescription,
        meetingTime: new Date(meetingTime).getTime() / 1000, // Convert to UNIX timestamp
      };

      const contract = await setupContract();

      try {
        await contract.methods
          .createMeeting(
            patientAddress,
            doctorAddress,
            formData.meetingDescription,
            formData.meetingTime,
            false
          )
          .send({ from: patientAddress, gas: 5000000, gasPrice: "20000000000" });
        console.log("Meeting created successfully!");

        // Refresh meetings data after booking
        fetchDoctorMeetings();
        fetchPatientMeetings();
      } catch (error) {
        console.error("Error creating meeting:", error.message);
      }

      setShowForm(false);
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

  const handleClearAllMeetings = async () => {
    const contract = await setupContract();
    try {
      await contract.methods
        .clearAllMeetings()
        .send({ from: patientAddress, gas: 5000000, gasPrice: "20000000000" });
      console.log("All meetings cleared successfully!");
      // Update state after clearing meetings
      setDoctorMeetings([]);
      setPatientMeetings([]);
    } catch (error) {
      console.error("Error clearing all meetings:", error);
    }
  };

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

      {showForm && <AppointmentForm onSubmit={AppointmentForm} />}

      <button onClick={handleClearAllMeetings}>Clear All Meetings</button>

      <h2>Doctor's Meetings</h2>
      <ul>
        {doctorMeetings.map((meeting, index) => (
          <li key={index}>
            <p>
              Patient Name: {patientLookup[meeting.patientAddress]?.firstName}{" "}
              {patientLookup[meeting.patientAddress]?.lastName}
            </p>
            <p>Meeting Description: {meeting.meetingDescription}</p>
            <p>
              Meeting Time:{" "}
              {new Date(Number(meeting.meetingTime) * 1000).toLocaleString()}
            </p>
            <p>Status: {meeting.isVerified ? "Accepted" : "Pending"}</p>
            {!meeting.isVerified && (
              <>
                <button onClick={() => handleAcceptMeeting(index)}>Accept</button>
                <button onClick={() => handleRejectMeeting(index)}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Patient's Meetings</h2>
      <ul>
        {patientMeetings.map((meeting, index) => (
          <li key={index}>
            <p>
              Doctor Name: Dr.{" "}
              {doctorLookup[meeting.doctorAddress]?.firstName}{" "}
              {doctorLookup[meeting.doctorAddress]?.lastName}
            </p>
            <p>Meeting Description: {meeting.meetingDescription}</p>
            <p>
              Meeting Time:{" "}
              {new Date(Number(meeting.meetingTime) * 1000).toLocaleString()}
            </p>
            <p>Status: {meeting.isVerified ? "Accepted" : "Pending"}</p>
            {meeting.isVerified && (
              <p>
                Time Left: {timeLeft[meeting.id]?.hours} hours{" "}
                {timeLeft[meeting.id]?.minutes} minutes
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default DoctorDetails;
