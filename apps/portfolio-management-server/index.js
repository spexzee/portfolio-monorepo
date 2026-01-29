require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
const projectRoutes = require('./routes/project.routes');
const technologyRoutes = require('./routes/technology.routes');
const commonRoutes = require('./routes/common.routes');
const experienceRoutes = require('./routes/experience.routes');
const configRoutes = require('./routes/config.routes');
const imagekitRoutes = require('./routes/imagekit.routes');
const authRoutes = require('./routes/auth.routes');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/tech', technologyRoutes);
app.use('/api/common', commonRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/config', configRoutes);
app.use('/api/imagekit', imagekitRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to Portfolio Backend');
});

// Connect to DB
connectDB();

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless
module.exports = app;
