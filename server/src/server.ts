import express from 'express';
import cors from 'cors';
import path from 'path';
import { config, validateEnvironment } from './config/environment';
import { upload } from './middleware/upload';
import { healthCheck } from './routes/health';
import { uploadImage } from './routes/upload';
import { sendOfferEmails } from './routes/email';

const app = express();

// Environment validation and logging
validateEnvironment();

// Middleware - Production CORS
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:8080',
    'https://personalized-email-sender.onrender.com',
    /^https:\/\/.*\.lovableproject\.com$/,
    /^https:\/\/.*\.lovable\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get('/health', healthCheck);
app.post('/send-offer-emails', sendOfferEmails);
app.post('/upload', upload.single('image'), uploadImage);

// Serve static uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Static files for production build - serve React app
app.use(express.static(path.join(__dirname, '../../dist'), {
  fallthrough: false,
  index: 'index.html'
}));

// Serve React app για production - catch all route
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/health') && !req.path.startsWith('/send-offer-emails') && !req.path.startsWith('/upload')) {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Start server
app.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📧 Email service ready`);
  console.log(`🏢 ${config.company.name}`);
});