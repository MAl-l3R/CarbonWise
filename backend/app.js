const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// -------------------------------------------------
// MIDDLEWARE
// -------------------------------------------------
app.use(cors());

// IMPORTANT: Increase request size limits to handle large base64 payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// -------------------------------------------------
// Test route
// -------------------------------------------------
app.get('/', (req, res) => {
  res.send('Welcome to CarbonWise!');
});

// -------------------------------------------------
// Start the server
// -------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
