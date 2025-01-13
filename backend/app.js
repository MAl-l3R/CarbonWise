const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = 3000;

const { GoogleGenerativeAI } = require('@google/generative-ai');

app.use(cors())
app.use(express.json()); // Parse JSON requests

// Initialize Gemini AI model
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY is missing in the .env file');
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const model2 = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

app.get('/', (req, res) => {
  res.send('Welcome to CarbonWise!');
});

// Delay function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Calculate carbon footprint
app.post('/calculate-carbon-footprint', async (req, res) => {
  try {
    if (!req.body || !req.body.product) {
      return res.status(400).json({ error: 'Product is required in the request body' });
    }

    const prompt = `Give me an estimate of the carbon footprint of my ${req.body.product}. Just tell me the estimated numerical value in the "X kg CO2e" format, without any explanation. If there is a range then give me the average.`;

    const results = [];
    const numberRegex = /([\d.]+)\s*kg CO2e/; // Regex to extract the numerical value

    for (let i = 0; i < 3; i++) {
      const result = await model.generateContent(prompt, {
        temperature: 0.2, // Low randomness for precise and consistent responses
        max_tokens: 20,   // Limit the output length to ensure brevity
      });

      // Extract numerical value from the response
      const match = result.response.text().match(numberRegex);
      if (match && match[1]) {
        results.push(parseFloat(match[1]));
      }

      // Delay of 2 seconds between requests
      if (i < 2) await sleep(2000);
    }

    if (results.length === 0) {
      return res.status(500).json({ error: 'Failed to parse carbon footprint values from the responses' });
    }

    // Calculate the average
    const average = Math.round(results.reduce((sum, val) => sum + val, 0) / results.length);
    

    // Respond with the average value
    res.status(200).json({ footprint: `${average} kg CO2e`, values: results });
  } catch (error) {
    console.error('Error calculating carbon footprint:', error);
    res.status(500).json({ error: 'Failed to calculate carbon footprint', details: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
