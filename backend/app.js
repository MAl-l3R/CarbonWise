const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = 3000;

const { GoogleGenerativeAI } = require('@google/generative-ai');

// -------------------------------------------------
// MIDDLEWARE
// -------------------------------------------------
app.use(cors());

// IMPORTANT: Increase request size limits to handle large base64 payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// -------------------------------------------------
// Initialize Gemini AI model
// -------------------------------------------------
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn('Warning: API_KEY for Gemini AI is missing in the .env file');
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const model2 = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// -------------------------------------------------
// Test route
// -------------------------------------------------
app.get('/', (req, res) => {
  res.send('Welcome to CarbonWise!');
});

// -------------------------------------------------
// Delay function
// -------------------------------------------------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// -------------------------------------------------
// Calculate carbon footprint route
// -------------------------------------------------
app.post('/calculate-carbon-footprint', async (req, res) => {
  try {
    const { product_name, ...details } = req.body;
    if (!product_name) {
      return res.status(400).json({ error: 'Product is required in the request body' });
    }

    let prompt = `Give me an estimate of the carbon footprint of my ${product_name}.`;
    const additionalInfo = Object.entries(details)
      .filter(([_, value]) => value !== null && value !== '')
      .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
      .join(', ');

    if (additionalInfo) {
      prompt += ` These are all the information I can provide: ${additionalInfo}.`;
    }
    prompt += ` Just tell me the estimated numerical value in the "X kg CO2e" format, without any explanation. If there is a range then give me the average.`;

    const results = [];
    const numberRegex = /([\d.]+)\s*kg CO2e/;

    // Example repeated calls
    for (let i = 0; i < 3; i++) {
      const result = await model.generateContent(prompt, {
        temperature: 0.2,
        max_tokens: 20,
      });
      const match = result.response.text().match(numberRegex);
      if (match && match[1]) {
        results.push(parseFloat(match[1]));
      }
      if (i < 2) await sleep(1000);
    }

    if (results.length === 0) {
      return res.status(500).json({ error: 'Failed to parse carbon footprint values from the responses' });
    }

    const average = Math.round(results.reduce((sum, val) => sum + val, 0) / results.length);
    res.status(200).json({ footprint: `${average} kg CO2e`, values: results, prompt: prompt });
  } catch (error) {
    console.error('Error calculating carbon footprint:', error);
    res.status(500).json({ error: 'Failed to calculate carbon footprint', details: error.message });
  }
});

// -------------------------------------------------
// Reduce carbon footprint route
// -------------------------------------------------
app.post('/reduce-carbon-footprint', async (req, res) => {
  try {
    let prompt;
    if (!req.body || !req.body.product_name) {
      prompt = `How to reduce my carbon footprint? Provide practical tips in about 200 words, keeping them concise but informative.`;
    } else {
      const { product_name, ...details } = req.body;
      prompt = `How to reduce the carbon footprint from my ${product_name}?`;
      const additionalInfo = Object.entries(details)
        .filter(([_, value]) => value !== null && value !== '')
        .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
        .join(', ');
      if (additionalInfo) {
        prompt += ` These are all the information I can provide: ${additionalInfo}.`;
      }
      prompt += ` Provide practical tips in about 200 words, keeping them concise but informative.`;
    }

    const result = await model.generateContent(prompt, {
      temperature: 0.7,
      max_tokens: 200,
    });

    res.status(200).json({ tips: result.response.text(), prompt: prompt });
  } catch (error) {
    console.log('Error getting tips for reducing carbon footprint:', error);
    res.status(500).json({ error: 'Failed to get tips for reducing carbon footprint', details: error.message });
  }
});

// -------------------------------------------------
// Detect Objects route (Google Vision API)
// -------------------------------------------------
app.post('/detect-objects', async (req, res) => {
  try {
    if (!req.body || !req.body.base64Image) {
      return res.status(400).json({
        success: false,
        message: 'Missing base64Image in the request body',
      });
    }

    const base64Image = req.body.base64Image;
    const visionApiKey = process.env.VISION_API_KEY; // from .env

    if (!visionApiKey) {
      return res.status(500).json({
        success: false,
        message: 'Google Vision API Key not found in server .env',
      });
    }

    // Prepare request for Vision
    const requestData = {
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: 'OBJECT_LOCALIZATION', maxResults: 10 }],
        },
      ],
    };

    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    const responseJson = await response.json();

    if (
      responseJson.responses &&
      responseJson.responses[0]?.localizedObjectAnnotations?.length > 0
    ) {
      const detectedNames = responseJson.responses[0].localizedObjectAnnotations
        .map((obj) => obj.name)
        .join(', ');

      return res.status(200).json({
        success: true,
        objects: detectedNames,
      });
    } else {
      return res.status(200).json({
        success: true,
        objects: 'No objects detected. Try another image.',
      });
    }
  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while analyzing the image',
      details: error.message,
    });
  }
});

// -------------------------------------------------
// Start the server
// -------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
