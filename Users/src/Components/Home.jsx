import React from 'react';
import { Link } from 'react-router-dom';
import '../Components/Css/Home.css';
import doctorPatientImage from '../Components/assets/Images/doctorPatientImage.png'; // Adjust the path as necessary

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Health Record System</h1>
        <p>
          Medick is a secure blockchain-based platform for storage of highly sensitive and critical data related to patients that is shared among multiple facilities and agencies for effective diagnosis and treatment.
        </p>
        <Link to="./selectrole">
          <button className="button-57">Get Started!!..</button>
        </Link>
      </div>
      <div className="home-image">
        <img src={doctorPatientImage} alt="Doctor and Patient" />
      </div>
    </div>
  );
}

export default Home;
