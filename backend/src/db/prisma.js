import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

let prisma;

/**
 * Returns a singleton PrismaClient instance.
 *
 * This function ensures that only one PrismaClient is created during
 * the application's lifetime. PrismaClient internally manages a connection
 * pool to the database. Calling this function multiple times returns
 * the same client instance, preventing excess connections.
 *
 * Usage:
 * const prisma = client();
 * const users = await prisma.user.findMany();
 *
 * @returns {PrismaClient} The singleton PrismaClient instance.
 */
const client = () => {
    if (!prisma) {
        prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
        });
        logger.info('Prisma client initialized');
    }
    return prisma;
};

const disconnect = async () => {
    if (prisma) {
        await prisma.$disconnect();
        logger.info('Database disconnected');
        prisma = null;
    }
};

export { client, disconnect };
