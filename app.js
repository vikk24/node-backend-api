const express = require('express');
const cors = require('cors');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// ✅ SIMPLE & WORKING (DEV MODE)
app.use(cors());

// ✅ IMPORTANT: handle preflight manually
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running 🚀');
});

// routes
const userRoutes = require('./src/routes/userRoutes');
app.use('/users', userRoutes);

// error handler
const { errorHandler } = require('./src/middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});