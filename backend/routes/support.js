const express = require('express');
const router = express.Router();
const Support = require('../models/SupportModel');

/**
 * @swagger
 * /api/support:
 *   post:
 *     summary: Gửi yêu cầu hỗ trợ
 *     tags:
 *       - Support
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gửi yêu cầu hỗ trợ thành công
 *       400:
 *         description: Thiếu tiêu đề hoặc nội dung
 *       500:
 *         description: Lỗi server
 */
// API lưu yêu cầu hỗ trợ
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Thiếu tiêu đề hoặc nội dung!' });
    }
    const support = new Support({ title, content });
    await support.save();
    res.status(201).json({ message: 'Gửi yêu cầu hỗ trợ thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

/**
 * @swagger
 * /api/support:
 *   get:
 *     summary: Lấy danh sách yêu cầu hỗ trợ
 *     tags:
 *       - Support
 *     responses:
 *       200:
 *         description: Danh sách yêu cầu hỗ trợ
 *       500:
 *         description: Lỗi server
 */
// API lấy danh sách support
router.get('/', async (req, res) => {
  try {
    const supports = await Support.find().sort({ created_at: -1 });
    res.json(supports);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách support', error: err.message });
  }
});

module.exports = router; 