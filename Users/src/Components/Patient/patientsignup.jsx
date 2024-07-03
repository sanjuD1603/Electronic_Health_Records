import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import patientInfo from "../Ethereum/Contracts/patientInfo.json";
import axios from "axios";
import Web3 from "web3";

const PatientSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [metaMaskAccount, setMetaMaskAccount] = useState(
    location.state?.metaMaskAccount || "Failed to Fetch Wallet Address"
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    gender: "",
    address: "",
    phoneNumber: "",
    bloodgroup: "",
    metaMaskAccount: "",
    insuranceProvider: "",
    policyNumber: "",
  });

  useEffect(() => {
    const fetchAccount = async () => {
      if (metaMaskAccount === "Failed to Fetch Wallet Address") {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/accounts"
          );
          setMetaMaskAccount(
            response.data.account || "Failed to Fetch Wallet Address"
          );
        } catch (error) {
          console.error("Error fetching MetaMask account:", error);
        }
      }
    };
    fetchAccount();
  }, [metaMaskAccount]);

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

  // const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     if (!formData.metaMaskAccount || formData.metaMaskAccount === 'Failed to Fetch Wallet Address') {
  //         alert("MetaMask account not connected.");
  //         return;
  //     }

  //     try {
  //         const response = await axios.post('http://localhost:5000/api/registerpatient', formData);

  //         if (response.status === 200 || response.status === 201) {
  //             alert("Registration successful!");
  //             navigate('/Patient/viewprofile', { state: { metaMaskAccount: formData.metaMaskAccount } });
  //         } else {
  //             alert(response.data.message || 'Registration failed.');
  //             console.error("Registration failed.", response.data);
  //         }
  //     } catch (error) {
  //         alert(error.response?.data?.message || 'Registration error.');
  //         console.error("Registration error:", error);
  //     }
  // };

  // Initialize Web3

  const [state, setState] = useState({ web3: null, contract: null });
  const [data, setData] = useState("");

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");

    async function setupContract() {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = patientInfo.networks[networkId];
      const contract = new web3.eth.Contract(
        patientInfo.abi,
        deployedNetwork && deployedNetwork.address
      );
      console.log(contract.address);
      setState({ web3: web3, contract: contract });
      contract
        .getPastEvents("PatientExists")
        .then(function (events) {
          // Process the retrieved events
          console.log(events);
          if (events.length > 0) {
            const event = events[0];
            const returnValues = event.returnValues.patient;
            navigate("/Patient/viewprofile", {
              state: {
                metaMaskAccount: formData.metaMaskAccount,
                patient: returnValues,
              },
            });
          }
        })
        .catch(function (error) {
          // Handle errors
          console.error(error);
        });
    }

    if (provider) {
      setupContract();
    }
  }, []);

  useEffect(() => {
    const { contract } = state;

    async function readData() {
      try {
        if (contract) {
          const metaMaskAccount = formData.metaMaskAccount;
          const data = await contract.methods
            .getPatient(metaMaskAccount)
            .call();
          console.log("Fetched Data Using getPatient():", data); // Print data to console
          setData(data); // Set data in component state if needed
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error as per your application needs
      }
    }

    readData();
  }, [state]);

  useEffect(() => {
    const { contract } = state;

    async function getEmail() {
      try {
        if (contract) {
          const metaMaskAccount = formData.metaMaskAccount;
          const data = await contract.methods
            .getEmailByMetaMask(metaMaskAccount)
            .call();
          console.log("Fetched Data using getEmailByMetaMask():", data); // Print data to console
          setData(data); // Set data in component state if needed
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error as per your application needs
      }
    }

    getEmail();
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { web3, contract } = state; // Destructure contract from state

    if (
      !formData.metaMaskAccount ||
      formData.metaMaskAccount === "Failed to Fetch Wallet Address"
    ) {
      alert("MetaMask account not connected.");
      return;
    }

    try {
      if (!contract) {
        throw new Error("Contract not initialized.");
      }

      // Validate and format MetaMask account address
      const metaMaskAccount = web3.utils.toChecksumAddress(
        formData.metaMaskAccount
      );
      console.log(metaMaskAccount);

      // Example: Convert numbers to BigInt
      const gasLimit = BigInt(5000000);
      const gasPrice = BigInt("20000000000");

      // Call the smart contract function
      const transaction = await contract.methods
        .registerPatient(
          formData.firstName,
          formData.lastName,
          formData.dateOfBirth,
          formData.email,
          formData.gender,
          formData.address,
          formData.phoneNumber,
          formData.bloodgroup,
          metaMaskAccount, // Use formatted address here
          formData.insuranceProvider,
          formData.policyNumber
        )
        .send({
          from: "0x49C65495f011b51a56583Ac1509dc879abE6D226",
          gas: gasLimit,
          gasPrice: gasPrice,
        });

      console.log("Transaction hash:", transaction.transactionHash);

      // Handle successful registration
      alert("Registration successful!");
      // Example navigation if using react-router-dom
      // navigate('/Patient/viewprofile', { state: { metaMaskAccount: formData.metaMaskAccount } });
    } catch (error) {
      // Handle errors
      alert(error.message || "Registration error.");
      console.error("Registration error:", error);
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
              name="address"
              value={formData.address}
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
