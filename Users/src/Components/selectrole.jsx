import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import detectEthereumProvider from "@metamask/detect-provider";
import doctorImage from "./assets/doctor-icon.png";
import patientImage from "./assets/patient-icon.png";
import { setupContract } from "./Ethereum/Contracts/web3"; // Import web3 instance and setupContract function
import '../Components/assets/selectrole.css';

const SelectRole = () => {
  const navigate = useNavigate();
  const [metaMaskAccount, setMetaMaskAccount] = useState("");
  const [state, setState] = useState({ web3: null, contract: null });

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
        alert("Failed to connect MetaMask. Please try again.");
        return null;
      }
    } else {
      console.error("MetaMask not detected.");
      alert("MetaMask not detected. Please install MetaMask and try again.");
      return null;
    }
  };

  const registerAndRedirect = async (contract, account, role) => {
    try {
      const transaction = await contract.methods
        .registerAccount(account, role)
        .send({
          from: account,
          gas: 5000000,
          gasPrice: "20000000000",
        });
      console.log(
        "Account Created successfully at: ",
        transaction.transactionHash
      );
      if (role === "patient") {
        navigate("/Patient/patientsignup", {
          state: {
            metaMaskAccount: account,
          },
        });
      } else {
        navigate("/Doctor/doctorsignup", {
          state: {
            metaMaskAccount: account,
          },
        });
      }
    } catch (error) {
      if (error.message.includes("Account already has a role registered")) {
        alert("Account already has a role registered");
      } else {
        console.error("Error saving account to contract:", error.message);
        alert("Error saving account to contract. Please try again.");
      }
    }
  };

  const fetchAndNavigateBasedOnRole = async (contract, account, role) => {
    try {
      const eventName = role === "patient" ? "PatientExists" : "DoctorExists";
      const events = await contract.getPastEvents(eventName, {
        filter: { metaMaskAccount: account },
        fromBlock: 0,
        toBlock: "latest",
      });

      if (events.length > 0) {
        const event = events.find(
          (e) =>
            e.returnValues.metaMaskAccount.toLowerCase() ===
            account.toLowerCase()
        );
        if (event) {
          const returnValues = event.returnValues[role];
          navigate(`/${role === "patient" ? "Patient" : "Doctor"}/Dashboard`, {
            state: {
              metaMaskAccount: account,
              [role]: returnValues,
            },
          });
        } else {
          console.error(
            `No matching '${eventName}' event found for account:`,
            account
          );
        }
      } else {
        console.error(`No '${eventName}' event found.`);
      }
    } catch (error) {
      console.error(`Error fetching '${eventName}' events:`, error.message);
    }
  };

  const saveAccountToContract = async (account, role) => {
    try {
      const contract = await setupContract();
      if (!contract) {
        throw new Error("Contract not initialized.");
      }

      const accountInfo = await contract.methods.getAccount(account).call();
      if (accountInfo.isRegistered) {
        alert(`Account already has a registered role: ${accountInfo.role}`);
        const hasInfo = await contract.methods.hasPersonalInfo(account).call();
        if (!hasInfo) {
          alert("Account does not have personal information stored.");
          if (role === "patient") {
            navigate("/Patient/patientsignup", {
              state: {
                metaMaskAccount: account,
              },
            });
          } else {
            navigate("/Doctor/doctorsignup", {
              state: {
                metaMaskAccount: account,
              },
            });
          }
          return;
        }
        contract.events.AccountExists({
          filter: { metaMaskAccount: account },
        });

        await fetchAndNavigateBasedOnRole(contract, account, accountInfo.role);
      } else {
        await registerAndRedirect(contract, account, role);
      }
    } catch (error) {
      console.error("Error saving account to contract:", error.message);
      alert("Error saving account to contract. Please try again.");
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
