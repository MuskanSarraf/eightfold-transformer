const express = require('express');
const cors = require('cors');
const profileRoutes = require('./src/routes/profileRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});