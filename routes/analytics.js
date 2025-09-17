const express = require('express');
const Analytics = require('../models/Analytics');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Track page view
router.post('/track', async (req, res) => {
  try {
    const { page } = req.body;
    
    if (!page) {
      return res.status(400).json({ message: 'Page is required' });
    }

    const today = new Date().toISOString().split('T')[0];
    let analytics = await Analytics.findOne({ page, date: today });
    
    if (analytics) {
      analytics.views += 1;
      analytics.uniqueViews += 1; // In real app, track unique visitors
      await analytics.save();
    } else {
      analytics = new Analytics({
        page,
        views: 1,
        uniqueViews: 1,
        date: today
      });
      await analytics.save();
    }
    
    res.json({
      message: 'Page view tracked',
      analytics: {
        page: analytics.page,
        views: analytics.views,
        uniqueViews: analytics.uniqueViews,
        date: analytics.date
      }
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics data (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page, date, limit = 100 } = req.query;
    
    let query = {};
    if (page) query.page = page;
    if (date) query.date = date;

    const analytics = await Analytics.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics stats (admin only)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await Analytics.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalUniqueViews: { $sum: '$uniqueViews' },
          totalPages: { $addToSet: '$page' }
        }
      }
    ]);

    const result = stats[0] || {
      totalViews: 0,
      totalUniqueViews: 0,
      totalPages: []
    };

    res.json({
      totalViews: result.totalViews,
      totalUniqueViews: result.totalUniqueViews,
      totalPages: result.totalPages.length,
      pages: result.totalPages
    });
  } catch (error) {
    console.error('Get analytics stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get page-specific analytics (admin only)
router.get('/page/:page', authMiddleware, async (req, res) => {
  try {
    const { page } = req.params;
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const analytics = await Analytics.find({
      page,
      date: { $gte: startDate.toISOString().split('T')[0] }
    }).sort({ date: -1 });

    res.json(analytics);
  } catch (error) {
    console.error('Get page analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
