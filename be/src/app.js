import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import routes from './routes/index.js';
import { connectDB } from './config/database.js';
import './models/reply.model.js'; // Import Reply model để đảm bảo nó được register

import { globalErrorHandler } from './middlewares/error.middleware.js';
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     message: 'Not Found'
//   });
// });

app.use(globalErrorHandler);

export default app;
