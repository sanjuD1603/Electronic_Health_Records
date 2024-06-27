const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    email: String,
    gender: String,
    address: String,
    phoneNumber: String,
    bloodgroup: String,
    metaMaskAccount: String,
    insuranceProvider: String,
    policyNumber: String
});


module.exports = mongoose.model('Patient', PatientSchema);
