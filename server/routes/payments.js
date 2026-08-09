import express from 'express';

const router = express.Router();
const payments = new Map();

router.get('/:paymentId', (req, res) => {
  const payment = payments.get(req.params.paymentId);
  res.json(payment || { id: req.params.paymentId, status: 'pending' });
});

router.post('/:paymentId/confirm', (req, res) => {
  const payment = { id: req.params.paymentId, status: 'confirmed', confirmedAt: new Date().toISOString(), ...req.body };
  payments.set(req.params.paymentId, payment);
  res.json(payment);
});

export default router;
