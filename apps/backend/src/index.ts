import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { lightPollutionRouter } from './routes/light-pollution.routes';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env['PORT'] ?? 3000;
const MONGO_URI = process.env['MONGO_URI'] ?? 'mongodb://localhost:27017/i165';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/light-pollution', lightPollutionRouter);

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('[backend] Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`[backend] Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err: unknown) => {
        console.error('[backend] MongoDB connection error:', err);
        process.exit(1);
    });
