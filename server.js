
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const catalogueRoutes = require('./routes/catalogue');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Music API is running' });
});

app.use('/api', catalogueRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Music API running on port ${PORT}`);
});
