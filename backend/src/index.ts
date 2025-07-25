import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { SyncJob } from './jobs/syncJob';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize sync job
const syncJob = new SyncJob();

// Setup cron job for syncing every 10 minutes
const syncInterval = parseInt(process.env.SYNC_INTERVAL_MINUTES || '10');
cron.schedule(`*/${syncInterval} * * * *`, () => {
  console.log('Running scheduled sync job...');
  syncJob.syncBlocks().catch(console.error);
});

// Start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    // Start initial sync
    console.log('Starting initial sync...');
    syncJob.syncBlocks().catch(console.error);
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Sync job scheduled to run every ${syncInterval} minutes`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 