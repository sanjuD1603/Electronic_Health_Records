const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

const accountSchema = new mongoose.Schema({
  address: { type: String, unique: true },
  role: { type: String }
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
const Account = mongoose.model('Account', accountSchema);

app.post('/api/accounts', async (req, res) => {
  const { address, role } = req.body;

  // Validate request body
  if (!address || !role) {
      return res.status(400).json({ error: 'Address and role are required' });
  }

  try {
      // Check if account exists
      let account = await Account.findOne({ address });

      if (!account) {
          // Create new account
          account = new Account({ address, role });
          await account.save();
          return res.status(201).json(account);
      } else {
          // Validate role from database
          if (account.role !== role) {
              return res.status(400).json({ error: 'Role mismatch with existing account' });
          }
          // Update existing account's role
          account.role = role;
          await account.save();
          return res.status(200).json(account);
      }
  } catch (error) {
      // Handle server error
      return res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to handle registration
app.post('/api/registerpatient', async (req, res) => {
  const {metaMaskAccount, email} = req.body;
  
  try {
    
    const existingPatient = await Patient.findOne({
      $or: [{ metaMaskAccount }, { email }]
    });
    
    if (existingPatient) {
      return res.status(400).json({ message: 'User with this MetaMask account or email already exists.' });
    }
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(200).json({ message: 'Registration successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error });
  }
});

app.post('/api/registerdoctor', async (req, res) => {
    const {metaMaskAccount, medicalLicenseNumber} = req.body;
    
    try {
      const existingPatient = await Doctor.findOne({
        $or: [{ metaMaskAccount }, { medicalLicenseNumber }]
      });
      if (existingPatient) {
        return res.status(400).json({ message: 'User with this MetaMask account or email already exists.' });
      }  
      const newDoctor = new Doctor(req.body);
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
