import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DoctorNavbar from "./DoctorNavbar";

const DocUploadFiles = () => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.state);
    return(
        <>
            <DoctorNavbar />
            <h1>This is patient upload .jsx</h1>
        </>
    )

}

export default DocUploadFiles;