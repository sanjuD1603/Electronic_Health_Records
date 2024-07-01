const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    email: String,
    address: String,
    phoneNumber: String,
    metaMaskAccount: String,
    specialization: String,
    medicalLicenseNumber: String,
    yearsOfExperience: String,
});

const Doctor = mongoose.model('DoctorInfo', doctorSchema);
module.exports = Doctor;