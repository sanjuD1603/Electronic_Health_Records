import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import detectEthereumProvider from "@metamask/detect-provider";
import doctorImage from "./assets/doctor-icon.png";
import patientImage from "./assets/patient-icon.png";
import { setupContract } from "./Ethereum/Contracts/web3";
import { PatientContext } from './PatientContext';  // Import the context

const SelectRole = () => {
  const navigate = useNavigate();
  const { setPatientDetails, setMetaMaskAccount } = useContext(PatientContext);  // Use the context
  const [localMetaMaskAccount, setLocalMetaMaskAccount] = useState("");

  const connectMetaMask = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      try {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setLocalMetaMaskAccount(account);
        setMetaMaskAccount(account);  // Set the context state
        return account;
      } catch (error) {
        console.error("MetaMask error:", error);
        return null;
      }
    } else {
      console.error("MetaMask not detected.");
      return null;
    }
  };

  const saveAccountToContract = async (account, role) => {
    try {
      const contract = await setupContract();

      const accountInfo = await contract.methods.getAccount(account).call();
      if (accountInfo.isRegistered) {
        if (accountInfo.role === "patient") {
          contract
            .getPastEvents("PatientExists")
            .then(async function (events) {
              if (events.length > 0) {
                const event = events[0];
                const returnValues = event.returnValues;
                setPatientDetails(returnValues.patient);  // Set the context state
                navigate("/patient/dashboard", {
                  state: {
                    metaMaskAccount: account,
                    patient: returnValues.patient,
                  },
                });
              } else {
                navigate("/patient/patientsignup", {
                  state: { metaMaskAccount: account },
                });
              }
            })
            .catch(function (error) {
              console.error(error);
            });
        } else {
          console.log("Redirecting to doctor dashboard");
        }
        return;
      }

      const gasLimit = BigInt(5000000);
      const gasPrice = BigInt("20000000000");

      await contract.methods
        .registerAccount(account, role)
        .send({ from: account, gas: gasLimit, gasPrice: gasPrice });
      console.log("Account registered with role:", role);

      if (role === "patient") {
        navigate("/patient/patientsignup", {
          state: { metaMaskAccount: account },
        });
      } else {
        console.log("Redirecting to doctor signup");
      }
    } catch (error) {
      console.error("Error saving account to contract:", error);
    }
  };

  const handleDoctorClick = async () => {
    const account = await connectMetaMask();
    if (account) {
      saveAccountToContract(account, "doctor");
    }
  };

  const handlePatientClick = async () => {
    const account = await connectMetaMask();
    if (account) {
      saveAccountToContract(account, "patient");
    }
  };

  const disconnectMetaMask = () => {
    console.log("Disconnecting MetaMask account");
    setLocalMetaMaskAccount("");
    if (window.ethereum && window.ethereum.disconnect) {
      window.ethereum.disconnect();
    }
  };

  return (
    <div className="select-role">
      <h1>⚕️ Select Your Role ⚕️</h1>
      <div className="role-buttons">
        <button onClick={handleDoctorClick} className="role-button">
          <img src={doctorImage} alt="Doctor" className="role-image" />
          <span className="role-text">Doctor</span>
        </button>
        <button onClick={handlePatientClick} className="role-button">
          <img src={patientImage} alt="Patient" className="role-image" />
          <span className="role-text">Patient</span>
        </button>
      </div>
      {localMetaMaskAccount && (
        <div>
          <p>Connected MetaMask Account: {localMetaMaskAccount}</p>
          <button
            onClick={disconnectMetaMask}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectRole;
