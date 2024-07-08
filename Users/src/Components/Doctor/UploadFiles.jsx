import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import DoctorNavbar from "./DoctorNavbar";
import '../Css/UploadFiles.css'; // Import the CSS file

const DocUploadFiles = () => {
  const location = useLocation();
  const { patientAddress } = location.state;

  const [doctorName, setDoctorName] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [retrievedFiles, setRetrievedFiles] = useState([]);

  console.log("Patient Address:", patientAddress);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log('File selected:', selectedFile);
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("File is not selected");
      return;
    }

    if (!doctorName) {
      console.log("Doctor name is not entered");
      return;
    }

    console.log('Starting file upload...');
    console.log('Doctor Name:', doctorName);
    console.log('Patient MetaMask Account:', patientAddress);

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
      name: 'Medical Document',
      keyvalues: {
        doctorName: doctorName,
        patientAddress: patientAddress
      }
    });
    console.log('Metadata to be uploaded:', metadata);
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
          'Content-Type': `multipart/form-data`,
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

  const handleRetrieve = async () => {
    try {
      const url = `https://api.pinata.cloud/data/pinList?status=pinned&metadata[keyvalues][patientAddress]={"value":"${patientAddress}","op":"eq"}`;
      console.log('Retrieving with URL:', url);
      const response = await axios.get(url, {
        headers: {
          'pinata_api_key': 'e2285bd92dba86b2dd4e',
          'pinata_secret_api_key': 'a679b0643792e26fbc9eeb0be80fb9c2cddebc7892d3487f260d354acd630fbd',
        },
      });

      console.log('Retrieve response:', response.data);

      const files = response.data.rows.map((row) => ({
        ipfsHash: row.ipfs_pin_hash,
        uploaderName: row.metadata.keyvalues.doctorName || 'Unknown'
      }));

      setRetrievedFiles(files);
      console.log('Retrieved files:', files);
    } catch (error) {
      console.error('Error retrieving files:', error);
    }
  };

  return (
    <>
      <DoctorNavbar />
      <div className="upload-container">
        <div className="file-upload-box">
          <p>Patient Address: {patientAddress}</p>
          <input 
            type="text" 
            placeholder="Enter Doctor's Name" 
            value={doctorName} 
            onChange={(e) => setDoctorName(e.target.value)} 
          />
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
          <button onClick={handleRetrieve}>Retrieve</button>
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
        <div className="retrieved-files">
          {retrievedFiles.map((file, index) => (
            <div key={index} className="file-card" onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${file.ipfsHash}`, '_blank')}>
              <img src={`https://gateway.pinata.cloud/ipfs/${file.ipfsHash}`} alt={`File ${index + 1}`} />
              <p>Uploaded by: {file.uploaderName}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DocUploadFiles;
