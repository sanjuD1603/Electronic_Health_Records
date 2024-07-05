import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setupContract } from "../Ethereum/Contracts/web3";
import web3 from "web3";
const PatientSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({ web3: null, contract: null });
  const [metaMaskAccount, setMetaMaskAccount] = useState(
    location.state?.metaMaskAccount || "Failed to Fetch Wallet Address"
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    gender: "",
    patientAddress: "",
    phoneNumber: "",
    bloodgroup: "",
    metaMaskAccount: metaMaskAccount,
    insuranceProvider: "",
    policyNumber: "",
  });

  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       const { web3, contract } = await setupContract();
  //       setState({ web3, contract });
  //     } catch (error) {
  //       console.error("Error initializing contract:", error);
  //     }
  //   };
  //   initialize();
  // }, []);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      metaMaskAccount,
    }));
  }, [metaMaskAccount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeBlood = (event) => {
    setFormData({
      ...formData,
      bloodgroup: event.target.value,
    });
  };

  useEffect(() => {
    const { contract } = state;
    if (contract) {
      const fetchPatientData = async () => {
        try {
          const data = await contract.methods
            .getPatient(formData.metaMaskAccount)
            .call();
          console.log("Fetched Data Using getPatient():", data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchPatientData();
    }
  }, [state, formData.metaMaskAccount]);

  useEffect(() => {
    const { contract } = state;
    if (contract) {
      const fetchEmail = async () => {
        try {
          const data = await contract.methods
            .getEmailByMetaMask(formData.metaMaskAccount)
            .call();
          console.log("Fetched Data using getEmailByMetaMask():", data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchEmail();
    }
  }, [state, formData.metaMaskAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.metaMaskAccount ||
      formData.metaMaskAccount === "Failed to Fetch Wallet Address"
    ) {
      alert("MetaMask account not connected.");
      return;
    }

    try {
      // const { web3, contract } = state;
      const contract = await setupContract();
      if (!contract) {
        throw new Error("Contract not initialized.");
      }

      const metaMaskAccount = web3.utils.toChecksumAddress(
        formData.metaMaskAccount
      );

      const transaction = await contract.methods
        .registerPatient(
          formData.firstName,
          formData.lastName,
          formData.dateOfBirth,
          formData.email,
          formData.gender,
          formData.patientAddress,
          formData.phoneNumber,
          formData.bloodgroup,
          metaMaskAccount,
          formData.insuranceProvider,
          formData.policyNumber
        )
        .send({
          from: metaMaskAccount,
          gas: 5000000,
          gasPrice: "20000000000",
        });

      console.log("Transaction hash:", transaction.transactionHash);

      try {
        const eventName = "PatientExists";
        const events = await contract.getPastEvents(eventName, {
          filter: { metaMaskAccount: formData.metaMaskAccount },
          fromBlock: 0,
          toBlock: 'latest'
        });
        console.log(events);
        if (events.length > 0) {
          const event = events.find(e => e.returnValues.metaMaskAccount.toLowerCase() === formData.metaMaskAccount.toLowerCase());
          console.log(event);
          if (event) {
            const returnValues = event.returnValues.patient;
            console.log("viewprofile");
            navigate("/patient/Dashboard", {
              state: {
                metaMaskAccount: formData.metaMaskAccount,
                patient: returnValues,
              },
            });
          } else {
            console.error(`No matching '${eventName}' event found for account:`, formData.metaMaskAccount);
          }
        } else {
          console.error(`No '${eventName}' event found.`);
        }
      } catch (error) {
        console.error(`Error fetching '${eventName}' events:`, error.message);
      }

    // navigate('/Doctor/Viewprofile', { state: { formData } });
} catch (error) {
    setError(error.response?.data?.message || 'Registration error.');
    console.error("Registration error:", error.message);
}
  };

  return (
    <>
      <h1>Patient Registration</h1>
      <div id="signup-form">
        <form onSubmit={handleSubmit}>
          {metaMaskAccount && (
            <div>
              MetaMask Account: {metaMaskAccount}
              <br />
            </div>
          )}
          <label>
            First Name
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Last Name
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Date of Birth
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Address
            <input
              type="text"
              name="patientAddress"
              value={formData.patientAddress}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Phone Number
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Select Gender
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Please Select your Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <br />
          <label>
            Select Blood Group
            <select
              id="bloodGroup"
              name="bloodgroup"
              value={formData.bloodgroup}
              onChange={handleChangeBlood}
              required
            >
              <option value="" disabled>
                Select your blood group
              </option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </label>
          <br />
          <label>
            Insurance Provider
            <input
              type="text"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Policy Number
            <input
              type="text"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default PatientSignUp;
