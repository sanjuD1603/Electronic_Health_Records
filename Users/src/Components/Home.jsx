import React from 'react';
import { Link } from 'react-router-dom';
// import '../CSS/Home.css';
// import SelectRole from './selectrole';


const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Health Record System</h1>
        <p>
          Medick  is a secure blockchain-based platform for storage of highly sensitive and critical data related to patients that is shared among multiple facilities and agencies for effective diagnosis and treatment.
        </p>
        <Link to="./selectrole">
          <button className="signup-button">Get Started!!..</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
