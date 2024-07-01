const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const Patient = require('./models/patient');
const Doctor = require('./models/doctor')
const Account = require('./models/accounts');

const app = express();
const port = process.env.PORT || 5000;
const db_url = process.env.MONGO_URI || 'mongodb://localhost:27017/ehr';

// Middleware
app.use(cors());
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection

mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true,});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.post('/api/accounts', async (req, res) => {
  const { address, role } = req.body;
  console.log(req.body);

  // Validate request body
  if (!address || !role) {
      return res.status(400).json({ error: 'Address and role are required' });
  }
  
  try {
      // Check if account exists
      let account = await Account.findOne({ address });
      console.log("// Check if account exists", account);
      if (!account) {
          // Create new account
          account = new Account({ address, role });
          await account.save();
          console.log("201***********************************************************************", res.status(201));
          return res.status(201).json(account);
      } else {
          // Validate role from database
          if (account.role !== role) {
              console.log("400***********************************************************************", res.status(400));
              return res.status(400).json({ error: 'Role mismatch with existing account' });
          }
          // Return a specific code when account is found
          console.log("200***********************************************************************", res.status(200));
          return res.status(200).json({ message: 'Account already exists', account });
      }
  } catch (error) {
      // Handle server error
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/accounts', async (req, res) => {
  try {
      const accounts = await Account.find();
      if (accounts.length > 0) {
          res.json({ account: accounts[0].address });
      } else {
          res.status(404).json({ message: 'No accounts found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
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

app.get('/api/registerpatient', async (req, res) => {
  const { metaMaskAccount } = req.query; // Destructure the query parameter
  try {
      console.log(metaMaskAccount);
      const patient = await Patient.findOne({ metaMaskAccount });
      if (!patient) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(patient);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
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

  app.get('/api/registerdoctor', async (req, res) => {
    const { metaMaskAccount } = req.query; // Destructure the query parameter
    try {
        console.log(metaMaskAccount);
        const doctor = await Doctor.findOne({ metaMaskAccount });
        if (!doctor) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
