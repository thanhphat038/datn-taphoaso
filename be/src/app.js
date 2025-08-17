import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { connectDB } from './config/database.js';
import './models/reply.model.js'; // Import Reply model để đảm bảo nó được register
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { 
  securityHeaders, 
  corsOptions, 
  requestLogger, 
  errorHandler, 
  sanitizeInput,
  apiRateLimiter
} from './middlewares/security.middleware.js';
import { validateConfig } from './config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Validate all configurations before starting server
try {
  validateConfig();
  console.log('🚀 Configuration validation passed, starting server...');
} catch (error) {
  console.error('💥 Server startup failed due to configuration error:');
  console.error(error.message);
  console.error('\n📋 Please check your .env file and ensure all required variables are set.');
  console.error('📖 See TOKEN_CONFIG_README.md for configuration details.');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(compression());
app.use(requestLogger);
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Input sanitization
app.use(sanitizeInput);

// Rate limiting
app.use('/api', apiRateLimiter);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// Global error handler
app.use(globalErrorHandler);

export default app;
