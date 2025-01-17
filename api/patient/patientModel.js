const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  patientID: { type: Number, required: true, unique: true },
  address: { type: String, required: true },
  date: { type: Date, required: true },
  complaints: { type: String, required: true },
  prescription: { type: String, required: true }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
