import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/events.js';
import registrationRoutes from './routes/registrations.js';
import certificateRoutes from './routes/certificates.js';
import paymentRoutes from './routes/payments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/payments', paymentRoutes);

// Root route placeholder
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to EntertainmentHQ API' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 EntertainmentHQ Server running on port ${PORT}`);
});
