import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import detectEthereumProvider from "@metamask/detect-provider";
import doctorImage from "./assets/doctor-icon.png";
import patientImage from "./assets/patient-icon.png";
import { setupContract } from "./Ethereum/Contracts/web3";

const SelectRole = () => {
  const navigate = useNavigate();
  const [metaMaskAccount, setMetaMaskAccount] = useState("");

  const connectMetaMask = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      try {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setMetaMaskAccount(account);
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

      // Check if account is already registered
      const accountInfo = await contract.methods.getAccount(account).call();
      if (accountInfo.isRegistered) {
        console.log("Account already has a registered role:", accountInfo.role);

        // Redirect based on role
        if (accountInfo.role === "patient") {
          navigate("/Patient/viewprofile", {
            state: {
              metaMaskAccount: account,
            },
          });
        } else {
          // Redirect to another page for different roles (doctor)
          // navigate("/Doctor/dashboard");
          console.log("Redirecting to doctor dashboard");
        }
        return;
      }
      const gasLimit = BigInt(5000000);
      const gasPrice = BigInt("20000000000");

      // Register the account with role in the contract
      await contract.methods
        .registerAccount(account, role)
        .send({ from: account, gas: gasLimit, gasPrice: gasPrice });
      console.log("Account registered with role:", role);

      // Redirect based on role after registration
      if (role === "patient") {
        navigate("/Patient/patientsignup", {
          state: {
            metaMaskAccount: account,
          },
        });
      } else {
        // Redirect to another page for different roles (doctor)
        // navigate("/Doctor/doctorsignup");
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
    setMetaMaskAccount("");
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
      {metaMaskAccount && (
        <div>
          <p>Connected MetaMask Account: {metaMaskAccount}</p>
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
