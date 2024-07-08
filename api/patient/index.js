const express = require('express');
const router = express.Router();
const Patient = require('./patientModel'); // Assuming this is correctly defined

// Route to handle form submission (POST)
router.post('/submit', (req, res) => {
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

// Route to retrieve patient details by name or ID (GET)
router.get('/get-patient', (req, res) => {
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

module.exports = router;
