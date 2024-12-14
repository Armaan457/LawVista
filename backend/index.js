// Import required modules
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import caseRouter from './routes/case.routes.js';
import authRouter from './routes/auth.routes.js';
import noteBookRouter from './routes/notebook.routes.js';
import chatRouter from './routes/chat.routes.js';
import docRouter from './routes/doc.routes.js';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import Case from './models/case.model.js';
import * as cheerio from 'cheerio';


dotenv.config();

const app = express();

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cors({ origin: true, credentials: true })); // Enable CORS with credentials
app.use(cookieParser()); // Parse cookies
const r2Client = new S3Client({
    region: 'apac',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY, // Replace with your R2 Access Key
        secretAccessKey: process.env.R2_SECRET_KEY, // Replace with your R2 Secret Key
    },
});

const uploadToR2 = async (bucket, key, content, contentType) => {
    const params = {
        Bucket: bucket,
        Key: key,
        Body: content,
        ContentType: contentType,
    };
    await r2Client.send(new PutObjectCommand(params));
    return `R2_ENDPOINT/${key}`; // Replace with your R2 public URL format
};

// Routes
app.use('/api/cases', caseRouter);
app.use("/api/auth", authRouter );
app.use("/api/chat", chatRouter );
app.use("/api/notebook", noteBookRouter );
app.use("/api/doc", docRouter );

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};
connectDB();


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

