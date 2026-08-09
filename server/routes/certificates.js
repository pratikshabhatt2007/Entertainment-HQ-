import express from 'express';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Sample initial certificates generator / database simulation
const initialCertificates = [
  {
    id: 'cert-101',
    certificate_code: 'ES-CERT-2025-88391',
    event_id: 'evt-1',
    event_title: 'Full-Stack Web Development Bootcamp 2025',
    category: 'Workshops',
    issue_date: '2025-06-15',
    xp_earned: 250,
    skills: ['React', 'Node.js', 'Express', 'TailwindCSS'],
    credential_url: 'https://eventsphere.org/verify/ES-CERT-2025-88391',
    status: 'verified',
    issuer: 'EventSphere Academy & Tech Alliance'
  },
  {
    id: 'cert-102',
    certificate_code: 'ES-CERT-2025-44912',
    event_id: 'evt-2',
    event_title: 'AI & Machine Learning Innovation Hackathon',
    category: 'Hackathons',
    issue_date: '2025-07-20',
    xp_earned: 400,
    skills: ['Python', 'TensorFlow', 'LLMs', 'Prompt Engineering'],
    credential_url: 'https://eventsphere.org/verify/ES-CERT-2025-44912',
    status: 'verified',
    issuer: 'Global AI Foundation'
  },
  {
    id: 'cert-103',
    certificate_code: 'ES-CERT-2025-11029',
    event_id: 'evt-3',
    event_title: 'Cloud Architecture & DevOps Summit',
    category: 'Tech Talks',
    issue_date: '2025-08-02',
    xp_earned: 150,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    credential_url: 'https://eventsphere.org/verify/ES-CERT-2025-11029',
    status: 'verified',
    issuer: 'Cloud Native Community'
  }
];

// GET /api/certificates - Fetch user's certificates and gamified stats
router.get('/', protect, (req, res) => {
  try {
    const user = req.user;
    
    // Compute total stats
    const totalCerts = initialCertificates.length;
    const totalXP = initialCertificates.reduce((acc, c) => acc + c.xp_earned, 0);
    const level = Math.floor(totalXP / 300) + 1;
    const nextLevelXP = level * 300;
    
    const badges = [
      { id: 'b1', name: 'First Step', desc: 'Participate in your 1st event', icon: '🚀', unlocked: true },
      { id: 'b2', name: 'Code Samurai', desc: 'Complete a Developer Workshop', icon: '⚡', unlocked: true },
      { id: 'b3', name: 'Hackathon Hero', desc: 'Earn a Hackathon Certificate', icon: '🏆', unlocked: true },
      { id: 'b4', name: 'Streak Master', desc: 'Attend 3 consecutive events', icon: '🔥', unlocked: true },
      { id: 'b5', name: 'Grandmaster', desc: 'Earn 1,500 Total XP', icon: '👑', unlocked: false }
    ];

    res.json({
      success: true,
      user_stats: {
        user_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Attendee',
        level,
        total_xp: totalXP,
        next_level_xp: nextLevelXP,
        certificates_count: totalCerts,
        streak_days: 4,
        rank: level >= 4 ? 'Tech Pioneer' : level >= 3 ? 'Event Master' : 'Rising Contender'
      },
      badges,
      certificates: initialCertificates
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Failed to fetch certificates.' });
  }
});

// POST /api/certificates/claim - Claim certificate for completed event
router.post('/claim', protect, (req, res) => {
  try {
    const { event_title, category, xp } = req.body;
    const newCert = {
      id: `cert-${Date.now()}`,
      certificate_code: `ES-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      event_id: `evt-${Date.now()}`,
      event_title: event_title || 'Completed Event',
      category: category || 'Workshops',
      issue_date: new Date().toISOString().split('T')[0],
      xp_earned: xp || 200,
      skills: ['Participation', 'Certificate Earned'],
      credential_url: `https://eventsphere.org/verify/ES-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'verified',
      issuer: 'EventSphere Certification Board'
    };

    initialCertificates.unshift(newCert);

    res.json({
      success: true,
      message: `Congratulations! You claimed your certificate for "${newCert.event_title}" and earned +${newCert.xp_earned} XP!`,
      certificate: newCert
    });
  } catch (error) {
    console.error('Error claiming certificate:', error);
    res.status(500).json({ message: 'Failed to claim certificate.' });
  }
});

export default router;
