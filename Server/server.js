const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(bodyParser.json());

// MongoDB connection

const db_url = process.env.MONGO_URI || 'mongodb://localhost:27017/ehr';
mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Patient Schema and Model
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

const Patient = mongoose.model('PatientInfo', patientSchema);
const Doctor = mongoose.model('DoctorInfo',doctorSchema);

// API endpoint to handle registration
app.post('/api/registerpatient', async (req, res) => {
  const patientData = req.body;
  const newPatient = new Patient(patientData);

  try {
    await newPatient.save();
    res.status(200).json({ message: 'Registration successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error });
  }
});

app.post('/api/registerdoctor', async (req, res) => {
    const doctorData = req.body;
    const newDoctor = new Doctor(doctorData);
  
    try {
      await newDoctor.save();
      res.status(200).json({ message: 'Registration successful!' });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed.', error });
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
