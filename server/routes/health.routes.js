import express from 'express';

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
