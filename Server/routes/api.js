const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');


router.post('/register', async (req, res) => {
    const { firstName, lastName, dateOfBirth, email, address, phoneNumber, metaMaskAccount } = req.body;

    try {
        const newPatient = new Patient({
            firstName,
            lastName,
            dateOfBirth,
            email,
            address,
            phoneNumber,
            metaMaskAccount
        });

        const patient = await newPatient.save();
        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;