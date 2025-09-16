require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const gameRoutes = require('./routes/gameRoutes');

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', gameRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
