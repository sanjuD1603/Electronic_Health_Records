import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setupContract } from "../Ethereum/Contracts/web3";
import DoctorNavbar from "./DoctorNavbar";

const DoctorDashBoard = () => {
    return (
        <>
            <DoctorNavbar />
            <h1>Scheduled Consultant meetings</h1>
        </>
    );
}

export default DoctorDashBoard;
