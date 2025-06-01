import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Load env
dotenv.config();

const app = express();

// Middleware parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handler (simple)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
