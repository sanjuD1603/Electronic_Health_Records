import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setupContract } from "../Ethereum/Contracts/web3";
import web3 from "web3";
import "../assets/paitentsignup.css";

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

      try {
        const eventName = "PatientExists";
        const events = await contract.getPastEvents(eventName, {
          filter: { metaMaskAccount: formData.metaMaskAccount },
          fromBlock: 0,
          toBlock: 'latest'
        });
        if (events.length > 0) {
          const event = events.find(e => e.returnValues.metaMaskAccount.toLowerCase() === formData.metaMaskAccount.toLowerCase());
          if (event) {
            const returnValues = event.returnValues.patient;
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

    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-2)}`;
  };
  return (
    <>
      <h1>Patient Registration</h1>
      <div id="signup-form">
        <div className="meta-mask-account">
          MetaMask Account: {formatWalletAddress(metaMaskAccount)}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-column">
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
          </div>
          <div className="form-column">
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
          </div>
          <div className="button-57-wrapper">
        <button className="button-57" type="submit">Register</button>
    </div>
        </form>
      </div>
    </>
  );
};

export default PatientSignUp;
