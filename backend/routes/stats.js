const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Book = require('../models/BookModel');
const PhieuMuonSach = require('../models/PhieuMuonSachModel');
const MuonTra = require('../models/MuonTraModel');
const DanhMuc = require('../models/DanhMucModel');

/**
 * @swagger
 * /api/stats/overview:
 *   get:
 *     summary: Thống kê tổng quan hệ thống
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Thống kê tổng quan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                 totalBooks:
 *                   type: number
 *                 totalBorrows:
 *                   type: number
 *                 totalCategories:
 *                   type: number
 *       500:
 *         description: Lỗi server
 */
// API thống kê tổng quan
router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ loai: 2 });
    const totalBooks = await Book.countDocuments();
    const totalBorrows = await PhieuMuonSach.countDocuments();
    const totalCategories = await DanhMuc.countDocuments();
    
    res.json({
      totalUsers,
      totalBooks,
      totalBorrows,
      totalCategories
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thống kê tổng quan', error: err.message });
  }
});

/**
 * @swagger
 * /api/stats/registrations:
 *   get:
 *     summary: Thống kê đăng ký theo tháng
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Thống kê đăng ký theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: number
 *                   monthName:
 *                     type: string
 *                   count:
 *                     type: number
 *       500:
 *         description: Lỗi server
 */
// API thống kê đăng ký theo tháng
router.get('/registrations', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0);
      
      const count = await User.countDocuments({
        loai: 2,
        createdAt: { $gte: startDate, $lte: endDate }
      });
      
      monthlyData.push({
        month: month,
        monthName: new Date(currentYear, month - 1).toLocaleString('vi-VN', { month: 'long' }),
        count: count
      });
    }
    
    res.json(monthlyData);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thống kê đăng ký', error: err.message });
  }
});

/**
 * @swagger
 * /api/stats/borrows:
 *   get:
 *     summary: Thống kê mượn sách theo tháng
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Thống kê mượn sách theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: number
 *                   monthName:
 *                     type: string
 *                   count:
 *                     type: number
 *       500:
 *         description: Lỗi server
 */
// API thống kê mượn sách theo tháng
router.get('/borrows', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const phieu = await PhieuMuonSach.find();
    const tra = await MuonTra.find();
    const all = [...phieu, ...tra];
    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const start = new Date(currentYear, month - 1, 1);
      const end = new Date(currentYear, month, 0);
      const count = all.filter(item => {
        if (!item.ngay_muon) return false;
        const ngay = new Date(item.ngay_muon);
        return ngay >= start && ngay <= end;
      }).length;
      monthlyData.push({
        month,
        monthName: start.toLocaleString('vi-VN', { month: 'long' }),
        count
      });
    }
    res.json(monthlyData);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thống kê mượn sách', error: err.message });
  }
});

/**
 * @swagger
 * /api/stats/books-by-category:
 *   get:
 *     summary: Thống kê sách theo danh mục
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: Thống kê sách theo danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                   count:
 *                     type: number
 *       500:
 *         description: Lỗi server
 */
// API thống kê sách theo danh mục
router.get('/books-by-category', async (req, res) => {
  try {
    const books = await Book.find();
    const categoryStats = {};
    
    books.forEach(book => {
      const category = book.danh_muc || 'Không phân loại';
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });
    
    const result = Object.keys(categoryStats).map(category => ({
      category: category,
      count: categoryStats[category]
    }));
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thống kê sách theo danh mục', error: err.message });
  }
});

module.exports = router; 