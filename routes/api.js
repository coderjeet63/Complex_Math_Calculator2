// routes/api.js
const express = require('express');
const router = express.Router();
const { solveProblem, getSolutions } = require('../controllers/solutionController');


router.post('/', solveProblem);


router.get('/history', getSolutions);


module.exports = router;

