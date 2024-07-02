const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://0.0.0.0:27017/clinic", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define a schema and model
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  patientID: {
    type: Number,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  complaints: {
    type: String,
    required: true
  },
  prescription: {
    type: String,
    required: true
  }
});

const Patient = mongoose.model('Patient', patientSchema);

// Middleware for body parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle form submission
app.post('/submit', (req, res) => {
  const { pname, gender, age, patientID, add, date, comp, presc } = req.body;

  // Check if a patient with the same ID already exists
  Patient.findOne({ patientID })
    .then((existingPatient) => {
      if (existingPatient) {
        // Update the existing patient
        existingPatient.name = pname;
        existingPatient.gender = gender;
        existingPatient.age = age;
        existingPatient.address = add;
        existingPatient.date = date;
        existingPatient.complaints = comp;
        existingPatient.prescription = presc;

        return existingPatient.save();
      } else {
        // Create a new patient
        const newPatient = new Patient({
          name: pname,
          gender,
          age,
          patientID,
          address: add,
          date,
          complaints: comp,
          prescription: presc
        });

        return newPatient.save();
      }
    })
    .then(() => res.send('Patient details saved'))
    .catch((err) => {
      console.error('Error saving patient:', err);
      res.status(500).send('Error saving patient details');
    });
});

// Route to retrieve patient details by name or ID
app.get('/get-patient', (req, res) => {
  const { pname, patientID } = req.query;

  const query = {};
  if (pname) query.name = pname;
  if (patientID) query.patientID = patientID;

  Patient.findOne(query)
    .then((patient) => {
      if (!patient) {
        return res.status(404).send('Patient not found');
      }
      res.json(patient);
    })
    .catch((err) => {
      console.error('Error finding patient:', err);
      res.status(500).send('Error retrieving patient details');
    });
});

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
