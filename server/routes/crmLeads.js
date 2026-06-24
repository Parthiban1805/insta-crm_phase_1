const express = require('express');
const { getLeads, updateLeadStage } = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.route('/')
  .get(getLeads);

router.route('/:id')
  .put(updateLeadStage);

module.exports = router;
