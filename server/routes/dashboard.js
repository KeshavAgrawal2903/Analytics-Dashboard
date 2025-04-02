const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all dashboard routes
router.use(authenticateToken);

// Get analytics overview
router.get('/analytics', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        total_visits,
        unique_users,
        avg_session_time,
        revenue,
        conversion_rate,
        updated_at
       FROM analytics_data 
       WHERE user_id = $1 
       ORDER BY updated_at DESC 
       LIMIT 1`,
      [req.user.id]
    );

    res.json(rows[0] || {
      total_visits: 0,
      unique_users: 0,
      avg_session_time: '0',
      revenue: 0,
      conversion_rate: 0
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get popular pages
router.get('/popular-pages', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT path, visits, last_visit 
       FROM page_visits 
       WHERE user_id = $1 
       ORDER BY visits DESC 
       LIMIT 10`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Popular pages fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get orders with pagination and filters
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, region } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM orders WHERE user_id = $1';
    const queryParams = [req.user.id];
    let paramCount = 2;

    if (status) {
      query += ` AND status = $${paramCount}`;
      queryParams.push(status);
      paramCount++;
    }

    if (region) {
      query += ` AND region = $${paramCount}`;
      queryParams.push(region);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    const { rows } = await pool.query(query, queryParams);

    // Get total count for pagination
    const countQuery = await pool.query(
      'SELECT COUNT(*) FROM orders WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      orders: rows,
      total: parseInt(countQuery.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countQuery.rows[0].count) / limit)
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get regional sales data
router.get('/regional-sales', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        region,
        COUNT(*) as order_count,
        SUM(amount) as total_revenue,
        AVG(amount) as avg_order_value
       FROM orders 
       WHERE user_id = $1 
       GROUP BY region 
       ORDER BY total_revenue DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Regional sales fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get payment methods breakdown
router.get('/payment-methods', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        payment_method,
        COUNT(*) as usage_count,
        SUM(amount) as total_amount
       FROM orders 
       WHERE user_id = $1 
       GROUP BY payment_method 
       ORDER BY usage_count DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Payment methods fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update analytics data
router.post('/analytics/update', async (req, res) => {
  try {
    const { total_visits, unique_users, avg_session_time, revenue, conversion_rate } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO analytics_data 
        (user_id, total_visits, unique_users, avg_session_time, revenue, conversion_rate) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [req.user.id, total_visits, unique_users, avg_session_time, revenue, conversion_rate]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Analytics update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Record page visit
router.post('/page-visit', async (req, res) => {
  try {
    const { path } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO page_visits (user_id, path, visits) 
       VALUES ($1, $2, 1) 
       ON CONFLICT (user_id, path) 
       DO UPDATE SET 
         visits = page_visits.visits + 1,
         last_visit = CURRENT_TIMESTAMP 
       RETURNING *`,
      [req.user.id, path]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Page visit record error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
