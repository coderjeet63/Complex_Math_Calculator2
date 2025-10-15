// controllers/solutionController.js
const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const Solution = require('../models/Solution');

// --- Helper function to read template files ---
const readTemplate = async (fileName) => {
    try {
        const filePath = path.join(__dirname, '..', 'templates', fileName);
        return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error reading template ${fileName}:`, error);
        throw new Error('Could not load calculation template.');
    }
};

// --- Solver for Pythagorean Theorem ---
const solvePythagorean = async (inputs) => {
    const { a, b } = inputs;
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
        throw new Error('Invalid inputs for Pythagorean theorem. Sides must be positive numbers.');
    }

    const aSquared = a * a;
    const bSquared = b * b;
    const cSquared = aSquared + bSquared;
    const c = Math.sqrt(cSquared).toFixed(2);

    const htmlContent = await readTemplate('template1.html');
    const $ = cheerio.load(htmlContent);

    $('#problem-statement-value').text(`Find the hypotenuse 'c' of a right-angled triangle given the other two sides a = ${a} and b = ${b}.`);
    
    // Step 1
    $('#var-a-1').text(a);
    $('#var-b-1').text(b);

    // Step 2
    $('#var-a-2').text(a);
    $('#var-b-2').text(b);
    $('#val-a-squared').text(aSquared);
    $('#val-b-squared').text(bSquared);

    // Step 3
    $('#val-c-squared').text(cSquared);

    // Step 4
    $('#val-c-final').text(c);
    
    $('.final-answer-box .value').text(c);

    return $.html();
};

// --- Solver for Compound Interest Rate ---
const solveCompoundInterest = async (inputs) => {
    const { principal, amount, time } = inputs;
    if (isNaN(principal) || isNaN(amount) || isNaN(time) || principal <= 0 || amount <= 0 || time <= 0) {
        throw new Error('Invalid inputs for compound interest. All values must be positive numbers.');
    }
    
    const ratio = amount / principal;
    const timeInverse = 1 / time;
    const rateFactor = Math.pow(ratio, timeInverse);
    const rate = (100 * (rateFactor - 1)).toFixed(2);

    const htmlContent = await readTemplate('template2.html');
    const $ = cheerio.load(htmlContent);

    $('#problem-statement-value').text(`₹${principal} amounts to ₹${amount} in ${time} years at a certain rate of compound interest. Find the rate of interest.`);

    // Step 1
    $('#val-a').text(amount);
    $('#val-p-1').text(principal);
    $('#val-t-1').text(time);
    
    // Step 2
    $('#val-a-2').text(amount);
    $('#val-p-2').text(principal);
    $('#val-ratio').text(ratio.toFixed(4));
    
    // Step 3
    $('#val-time-inverse').text(timeInverse.toFixed(2));
    $('#val-rate-factor').text(rateFactor.toFixed(4));
    
    // Step 4
    $('#val-rate-decimal').text((rateFactor - 1).toFixed(4));
    $('#val-rate-final').text(rate);
    
    $('.final-answer-box .value').text(`${rate}%`);

    return $.html();
};


// --- Main Controller Functions ---
exports.solveProblem = async (req, res) => {
    const { problemType, inputs } = req.body;

    try {
        let solutionHtml;
        if (problemType === 'pythagorean') {
            solutionHtml = await solvePythagorean(inputs);
        } else if (problemType === 'compoundInterest') {
            solutionHtml = await solveCompoundInterest(inputs);
        } else {
            return res.status(400).json({ msg: 'Invalid problem type specified.' });
        }

        // Save to database
        const newSolution = new Solution({
            problemType,
            inputs,
            solutionHtml,
        });
        await newSolution.save();
        
        res.json({ solutionHtml });

    } catch (error) {
        console.error('Error solving problem:', error.message);
        res.status(500).send(error.message);
    }
};

exports.getSolutions = async (req, res) => {
    try {
        const solutions = await Solution.find().sort({ createdAt: -1 });
        res.json(solutions);
    } catch (error) {
        console.error('Error fetching history:', error.message);
        res.status(500).send('Server Error');
    }
};
