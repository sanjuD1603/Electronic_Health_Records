import { react } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewPatients = () => {
    const location = useLocation();
    const navigate = useNavigate();

    console.log(location.state);

    return (
        <>
            <h1>View Patients</h1> 
        </>
    )
};

export default ViewPatients;
