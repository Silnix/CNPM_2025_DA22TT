const express = require('express');
const router = express.Router();
const Book = require('../models/BookModel');
const MuonTra = require('../models/MuonTraModel');
const PhieuMuon = require('../models/PhieuMuonModel');
const { normalizeString, levenshtein } = require('../utils/helpers');

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Tìm kiếm sách nâng cao (fuzzy search)
 *     tags:
 *       - Book
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Danh sách sách tìm được
 *       400:
 *         description: Thiếu từ khóa tìm kiếm
 *       500:
 *         description: Lỗi server
 */
// API tìm kiếm sách nâng cao (fuzzy, không dấu, luôn trả về ít nhất 1 kết quả gần nhất)
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query) {
      return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm.' });
    }
    const allBooks = await Book.find();
    // Chuẩn hóa query
    const normQuery = normalizeString(query);
    // Tìm các sách có trường nào gần giống query (không dấu, chữ thường)
    let results = allBooks.filter(book => {
      const fields = [book.ten_sach, book.tac_gia, book.danh_muc].map(x => normalizeString(x || ''));
      return fields.some(field => field.includes(normQuery));
    });
    // Nếu không có kết quả, tìm gần đúng nhất (so sánh độ tương đồng Levenshtein)
    if (results.length === 0 && allBooks.length > 0) {
      // Tìm sách có trường gần giống nhất
      let minDist = Infinity;
      let bestBook = null;
      for (const book of allBooks) {
        const fields = [book.ten_sach, book.tac_gia, book.danh_muc].map(x => normalizeString(x || ''));
        for (const field of fields) {
          const dist = levenshtein(field, normQuery);
          if (dist < minDist) {
            minDist = dist;
            bestBook = book;
          }
        }
      }
      if (bestBook) results = [bestBook];
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi tìm kiếm sách', error: err.message });
  }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Thêm sách mới
 *     tags:
 *       - Book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID:
 *                 type: string
 *               ten_sach:
 *                 type: string
 *               tac_gia:
 *                 type: string
 *               nam_xuat_ban:
 *                 type: number
 *               ngon_ngu:
 *                 type: string
 *               vi_tri:
 *                 type: string
 *               id_nguoi_them:
 *                 type: string
 *               ngay_them:
 *                 type: string
 *               anh_bia:
 *                 type: string
 *               danh_muc:
 *                 type: string
 *               ID_danh_muc:
 *                 type: string
 *               so_luong:
 *                 type: number
 *     responses:
 *       201:
 *         description: Thêm sách thành công
 *       400:
 *         description: Thiếu thông tin bắt buộc
 */
// CRUD Sách
router.post('/', async (req, res) => {
  try {
    const {
      ID, ten_sach, tac_gia, nam_xuat_ban, ngon_ngu, vi_tri, id_nguoi_them, ngay_them, anh_bia, danh_muc, ID_danh_muc, so_luong
    } = req.body;

    // Validate các trường bắt buộc
    if (!ID || !ten_sach || !tac_gia || !ngon_ngu || !danh_muc || !ID_danh_muc || !so_luong) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
    }
    
    // Kiểm tra ID sách đã tồn tại chưa
    const existingBook = await Book.findOne({ ID });
    if (existingBook) {
      return res.status(409).json({ message: 'ID sách đã tồn tại!' });
    }

    // Xử lý trạng thái sách tự động
    let trang_thai = 'Có sẵn';
    if (so_luong <= 0) trang_thai = 'Hết sách';

    // Nếu không có ảnh bìa thì dùng ảnh mặc định
    const anhBia = anh_bia || 'https://res.cloudinary.com/demo/image/upload/v1690000000/default_book_cover.png';

    const book = new Book({
      ID, ten_sach, tac_gia, nam_xuat_ban, ngon_ngu, vi_tri, id_nguoi_them, ngay_them, anh_bia: anhBia, danh_muc, ID_danh_muc, so_luong, trang_thai
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm sách', error: err.message });
  }
});

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Lấy danh sách tất cả sách
 *     tags:
 *       - Book
 *     responses:
 *       200:
 *         description: Danh sách sách
 *       500:
 *         description: Lỗi server
 */
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sách', error: err.message });
  }
});

// API lấy danh sách phiếu mượn của 1 user
router.get('/borrowed/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const phieuList = await PhieuMuon.find({ ID_nguoi_dung: userId });
    res.json(phieuList);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// API lấy tất cả phiếu mượn (cho admin)
router.get('/borrowed', async (req, res) => {
  try {
    const phieuList = await PhieuMuon.find();
    res.json(phieuList);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Lấy thông tin sách theo ID
 *     tags:
 *       - Book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sách
 *     responses:
 *       200:
 *         description: Thông tin sách
 *       404:
 *         description: Không tìm thấy sách
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ ID: req.params.id });
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy sách', error: err.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Cập nhật thông tin sách
 *     tags:
 *       - Book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sách
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_sach:
 *                 type: string
 *               tac_gia:
 *                 type: string
 *               nam_xuat_ban:
 *                 type: number
 *               ngon_ngu:
 *                 type: string
 *               vi_tri:
 *                 type: string
 *               anh_bia:
 *                 type: string
 *               danh_muc:
 *                 type: string
 *               ID_danh_muc:
 *                 type: string
 *               so_luong:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy sách
 *       400:
 *         description: Lỗi dữ liệu
 */
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Tự động cập nhật trạng thái sách dựa trên số lượng
    if (updateData.so_luong !== undefined) {
      updateData.trang_thai = updateData.so_luong > 0 ? 'Có sẵn' : 'Hết sách';
    }
    
    const book = await Book.findOneAndUpdate({ ID: req.params.id }, updateData, { new: true });
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật sách', error: err.message });
  }
});
/**
 * @swagger
 * /api/books/{id}:
 *   patch:
 *     summary: Cập nhật một phần thông tin sách
 *     tags:
 *       - Book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sách
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_sach:
 *                 type: string
 *               tac_gia:
 *                 type: string
 *               nam_xuat_ban:
 *                 type: number
 *               ngon_ngu:
 *                 type: string
 *               vi_tri:
 *                 type: string
 *               anh_bia:
 *                 type: string
 *               danh_muc:
 *                 type: string
 *               ID_danh_muc:
 *                 type: string
 *               so_luong:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy sách
 *       400:
 *         description: Lỗi dữ liệu
 */
router.patch('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    // Tự động cập nhật trạng thái sách dựa trên số lượng nếu có
    if (updateData.so_luong !== undefined) {
      updateData.trang_thai = updateData.so_luong > 0 ? 'Có sẵn' : 'Hết sách';
    }
    const book = await Book.findOneAndUpdate({ ID: req.params.id }, updateData, { new: true });
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật sách', error: err.message });
  }
});
/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Xóa sách
 *     tags:
 *       - Book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sách
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy sách
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ ID: req.params.id });
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json({ message: 'Đã xóa sách thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa sách', error: err.message });
  }
});

/**
 * @swagger
 * /api/books/{id}/available:
 *   get:
 *     summary: Kiểm tra số lượng sách có sẵn
 *     tags:
 *       - Book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sách
 *     responses:
 *       200:
 *         description: Thông tin sách và số lượng có sẵn
 *       404:
 *         description: Không tìm thấy sách
 *       500:
 *         description: Lỗi server
 */
router.get('/:id/available', async (req, res) => {
  try {
    const book = await Book.findOne({ ID: req.params.id });
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });

    // Đếm số phiếu mượn chưa trả (trạng thái 'Đang mượn')
    const so_luong_dang_muon = await MuonTra.countDocuments({
      ID_sach: req.params.id,
      trang_thai: { $ne: 'Đã trả' } // Chỉ tính các phiếu chưa trả
    });
    const so_luong_thuc_te = book.so_luong - so_luong_dang_muon;
    res.json({ ...book.toObject(), so_luong_thuc_te });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy sách', error: err.message });
  }
});

// Hàm sinh ID phiếu mượn mới
async function generatePhieuId() {
  const last = await PhieuMuon.findOne().sort({ ID_phieu: -1 });
  if (!last) return 'PM001';
  const num = parseInt(last.ID_phieu.replace('PM', '')) + 1;
  return 'PM' + num.toString().padStart(3, '0');
}

// API mượn sách
router.post('/borrow', async (req, res) => {
  try {
    const { ID_nguoi_dung, ID_sach } = req.body;
    if (!ID_nguoi_dung || !ID_sach) return res.status(400).json({ message: 'Thiếu thông tin!' });

    // Lấy thông tin sách
    const book = await Book.findOne({ ID: ID_sach });
    if (!book || book.so_luong <= 0) return res.status(400).json({ message: 'Sách không còn!' });

    // Sinh ID phiếu mượn mới
    const ID_phieu = await generatePhieuId();

    // Ngày mượn và ngày trả dự kiến
    const ngay_muon = new Date();
    const ngay_tra_du_kien = new Date(ngay_muon.getTime() + 14*24*60*60*1000);

    // Tạo phiếu mượn
    const phieu = new PhieuMuon({
      ID_phieu,
      ID_nguoi_dung,
      ngay_muon: ngay_muon.toISOString().slice(0,10),
      ngay_tra_du_kien: ngay_tra_du_kien.toISOString().slice(0,10),
      trang_thai: 'Đang mượn',
      sach_muon: {
        ID: book.ID,
        ten_sach: book.ten_sach,
        tac_gia: book.tac_gia
      }
    });
    await phieu.save();

    // Giảm số lượng sách
    book.so_luong -= 1;
    await book.save();

    res.status(201).json(phieu);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// API yêu cầu trả sách (user gửi yêu cầu)
router.put('/return-request/:phieuId', async (req, res) => {
  try {
    const { phieuId } = req.params;
    const phieu = await PhieuMuon.findOne({ ID_phieu: phieuId });
    if (!phieu) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn!' });
    if (phieu.trang_thai !== 'Đang mượn') return res.status(400).json({ message: 'Phiếu đã trả hoặc không hợp lệ!' });

    phieu.trang_thai = 'Chờ xác nhận trả';
    await phieu.save();

    res.json({ message: 'Đã gửi yêu cầu trả sách, vui lòng chờ admin xác nhận!', phieu });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Sửa API xác nhận trả sách chỉ cho phép khi trạng thái là 'Chờ xác nhận trả'
router.put('/return/:phieuId', async (req, res) => {
  try {
    const { phieuId } = req.params;
    const phieu = await PhieuMuon.findOne({ ID_phieu: phieuId });
    if (!phieu) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn!' });
    if (phieu.trang_thai !== 'Chờ xác nhận trả') return res.status(400).json({ message: 'Chỉ xác nhận phiếu đang chờ xác nhận trả!' });

    phieu.trang_thai = 'Đã trả';
    phieu.ngay_tra = new Date().toISOString().slice(0,10);
    await phieu.save();

    // Tăng lại số lượng sách
    const book = await Book.findOne({ ID: phieu.sach_muon.ID });
    if (book) {
      book.so_luong += 1;
      await book.save();
    }

    res.json({ message: 'Xác nhận trả sách thành công!', phieu });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router; 