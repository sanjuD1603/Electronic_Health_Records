import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Css/UploadFiles.css'; // Import the CSS file
import PatientNavbar from "./PatientNavbar";
const UploadFiles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // console.log(location.state);

  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [metaMaskAccount, setMetaMaskAccount] = useState(() => {
    const savedMetaMaskAccount = localStorage.getItem('metaMaskAccount');
    return savedMetaMaskAccount ? JSON.parse(savedMetaMaskAccount) : '';
  });

  useEffect(() => {
    if (!metaMaskAccount) {
      // Fetch MetaMask account number from the backend if not available in localStorage
      const fetchMetaMaskAccount = async () => {
        try {
          const response = await axios.get('YOUR_BACKEND_ENDPOINT_TO_FETCH_METAMASK_ACCOUNT');
          const account = response.data.metaMaskAccount;
          setMetaMaskAccount(account);
          localStorage.setItem('metaMaskAccount', JSON.stringify(account));
          console.log('MetaMask Account fetched from backend:', account);
        } catch (error) {
          console.error('Error fetching MetaMask account:', error);
        }
      };

      fetchMetaMaskAccount();
    } else {
      console.log('MetaMask Account from localStorage:', metaMaskAccount);
    }
  }, [metaMaskAccount]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log('File selected:', selectedFile);
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log('Starting file upload...');
    console.log('MetaMask Account:', metaMaskAccount);

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
      name: 'Image',
      keyvalues: {
        metamaskAddress: metaMaskAccount
      }
    });
    data.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0
    });
    data.append('pinataOptions', pinataOptions);

    setUploadStatus((prevStatus) => [
      ...prevStatus,
      { fileName: file.name, progress: 0, status: 'uploading' }
    ]);

    try {
      const response = await axios.post(url, data, {
        maxContentLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          'pinata_api_key': 'e2285bd92dba86b2dd4e',
          'pinata_secret_api_key': 'a679b0643792e26fbc9eeb0be80fb9c2cddebc7892d3487f260d354acd630fbd',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
          setUploadStatus((prevStatus) =>
            prevStatus.map((status) =>
              status.fileName === file.name ? { ...status, progress: percentCompleted } : status
            )
          );
        }
      });

      console.log('File upload response:', response.data);
      setUploadStatus((prevStatus) =>
        prevStatus.map((status) =>
          status.fileName === file.name ? { ...status, status: 'success' } : status
        )
      );
    } catch (error) {
      console.error('Error during file upload:', error.response ? error.response.data : error.message);
      setUploadStatus((prevStatus) =>
        prevStatus.map((status) =>
          status.fileName === file.name ? { ...status, status: 'error' } : status
        )
      );
    }
  };

  return (
    <>
   <PatientNavbar/>
    <div className="upload-container">
      <div className="file-upload-box">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <div className="upload-status">
        {uploadStatus.map((status, index) => (
          <div key={index} className="file-status-box">
            <div className="file-info">
              <span>{status.fileName}</span>
              <span>{status.progress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-bar-inner ${status.status}`}
                style={{ width: `${status.progress}%` }}
              ></div>
            </div>
            {status.status === 'error' && (
              <button onClick={handleUpload}>Try Again</button>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
   
  );
};

export default UploadFiles;
