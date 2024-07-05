import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DocUploadFiles = () => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.state);
    return(
        <>
            <h1>This is patient upload .jsx</h1>
        </>
    )

}

export default DocUploadFiles;