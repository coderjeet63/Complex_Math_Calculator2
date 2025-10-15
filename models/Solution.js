// models/Solution.js
const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
  problemType: {
    type: String,
    required: true,
    enum: ['pythagorean', 'compoundInterest']
  },
  inputs: {
    type: Object,
    required: true,
  },
  solutionHtml: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Solution', SolutionSchema);
