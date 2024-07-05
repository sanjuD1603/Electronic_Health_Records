import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const ViewDoctors = () => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location.state);

  return (
    <div>
      <h1>View Doctors</h1>
      <p>This is the view doctors page. List of available doctors will go here.</p>
    </div>
  );
};

export default ViewDoctors;
