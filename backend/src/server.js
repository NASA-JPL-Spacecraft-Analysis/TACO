import dotenv from 'dotenv';
import app from './app.js';

import { client, disconnect } from './db/prisma.js';
import { logger } from './utils/logger.js';

// load environment variables
dotenv.config();

// Initialize database connection
client();

const PORT = process.env.PORT || 3000;

// graceful shutdowns
process.on('SIGINT', async () => {
    logger.info('Received SIGINT, shutting down gracefully...');
    await disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, shutting down gracefully...');
    await disconnect();
    process.exit(0);
});

// start server
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    logger.info(`Health check available at http://localhost:${PORT}/health`);
    logger.info(`API base path: http://localhost:${PORT}/api`);
});
