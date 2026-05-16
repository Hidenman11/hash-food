import { prisma } from "./prisma.js";

export async function connectWithRetry(maxRetries = 5, delayMs = 5000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$connect();
      console.log("Database connection established.");
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Database connection attempt ${attempt} failed:`, message);
      if (attempt === maxRetries) {
        console.error("Maximum connection retries reached.");
        throw error;
      }
      console.log(`Retrying in ${delayMs / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
