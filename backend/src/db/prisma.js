import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

/**
 * Prisma Client Singleton
 * Replaces Java's DatabaseUtil.getDataSource() pattern
 */
let prisma;
let connection;

const client = async () => {
    if (!prisma) {
        if (!connection) {
            connection = (async () => {
                try {
                    prisma = new PrismaClient({
                        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
                    });
                    await prisma.$connect();
                    logger.info('Database connected');
                    return prisma;
                } catch (error) {
                    logger.error('Database connection failed:', error);
                    prisma = null;
                    connection = null;
                    throw error;
                }
            })();
        }
        await connection;
    }
    return prisma;
};

const disconnect = async () => {
    if (prisma) {
        await prisma.$disconnect();
        logger.info('Database disconnected');
    }
};

export { client, disconnect };
