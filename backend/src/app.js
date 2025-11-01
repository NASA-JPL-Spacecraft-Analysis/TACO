import express from 'express';
import cors from 'cors';

import { errorHandler } from './api/middleware/error.js';
import testbedRoutes from './api/testbeds/testbed.routes.js';
import itemRoutes from './api/items/item.routes.js';
import userRoutes from './api/users/user.routes.js';

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/users', userRoutes);
app.use('/api', testbedRoutes);
app.use('/api', itemRoutes);

// health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// error handling (must be last)
app.use(errorHandler);

export default app;
