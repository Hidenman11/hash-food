const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Attempts to connect to the database with a retry mechanism.
 * Designed to be called during server startup before the application starts listening.
 * 
 * @param {number} maxRetries Total number of attempts (default 5)
 * @param {number} delay Delay between attempts in milliseconds (default 5000ms)
 */
const connectWithRetry = async (maxRetries = 5, delay = 5000) => {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        console.error('🚨 Error: DATABASE_URL is missing in your .env file.');
        console.error('   Please ensure e:/Hash food/server/.env exists and contains the connection string.');
        process.exit(1);
    }

    for (let i = 1; i <= maxRetries; i++) {
        try {
            await prisma.$connect();
            console.log('✅ Database connection established successfully.');
            return prisma;
        } catch (error) {
            const target = dbUrl.split('@')[1] || 'Unknown Host';
            console.error(`❌ Database connection attempt ${i}/${maxRetries} failed to: ${target}`);
            console.error(`   Message: ${error.message}`);
            
            if (i === maxRetries) {
                console.error('🚨 Critical: Could not connect to the database.');
                console.error('   Verify that your database is running and the DATABASE_URL in .env is correct.');
                process.exit(1);
            }
            console.log(`⏳ Retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

module.exports = { prisma, connectWithRetry };