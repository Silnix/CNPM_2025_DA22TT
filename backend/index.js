const express = require('express');
const mongoose = require('mongoose');
const User = require('./UserModel');
const Book = require('./BookModel');
const DanhMuc = require('./DanhMucModel');
const TacGia = require('./TacGiaModel');
const PhieuMuonSach = require('./PhieuMuonSachModel');
const MuonTra = require('./MuonTraModel');
const Support = require('./SupportModel');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 5000;

app.use(cors());

const uri = 'mongodb://localhost:27017/QLTV'; // Đúng tên database chứa collection NGUOIDUNG

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Kết nối MongoDB thành công!');
})
.catch((err) => {
  console.error('Kết nối MongoDB thất bại:', err);
});

app.use(express.json());

// API mẫu
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong từ backend!' });
});

// API đăng nhập
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
  }
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
    }
    // Đăng nhập thành công
    res.json({ 
      message: 'Đăng nhập thành công!', 
      loai_nguoi_dung: user.loai_nguoi_dung,
      user: { username: user.username } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Hàm bỏ dấu tiếng Việt và chuyển về chữ thường
function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd');
}

// API tìm kiếm sách nâng cao (fuzzy, không dấu, luôn trả về ít nhất 1 kết quả gần nhất)
app.get('/api/books/search', async (req, res) => {
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
      function levenshtein(a, b) {
        const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
          for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + cost
            );
          }
        }
        return matrix[a.length][b.length];
      }
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

// CRUD Sách
app.post('/api/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm sách', error: err.message });
  }
});

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sách', error: err.message });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ ID: req.params.id });
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy sách', error: err.message });
  }
});

app.put('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate({ ID: req.params.id }, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật sách', error: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ ID: req.params.id });
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json({ message: 'Đã xóa sách thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa sách', error: err.message });
  }
});

// CRUD Danh mục
app.post('/api/categories', async (req, res) => {
  try {
    const category = new DanhMuc(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm danh mục', error: err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await DanhMuc.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục', error: err.message });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  try {
    const category = await DanhMuc.findOne({ ID_danh_muc: req.params.id });
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh mục', error: err.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const category = await DanhMuc.findOneAndUpdate({ ID_danh_muc: req.params.id }, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật danh mục', error: err.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const category = await DanhMuc.findOneAndDelete({ ID_danh_muc: req.params.id });
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    res.json({ message: 'Đã xóa danh mục thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa danh mục', error: err.message });
  }
});

// CRUD Tác giả
app.post('/api/authors', async (req, res) => {
  try {
    const author = new TacGia(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm tác giả', error: err.message });
  }
});

app.get('/api/authors', async (req, res) => {
  try {
    const authors = await TacGia.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tác giả', error: err.message });
  }
});

app.get('/api/authors/:id', async (req, res) => {
  try {
    const author = await TacGia.findOne({ ID_tac_gia: req.params.id });
    if (!author) return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy tác giả', error: err.message });
  }
});

app.put('/api/authors/:id', async (req, res) => {
  try {
    const author = await TacGia.findOneAndUpdate({ ID_tac_gia: req.params.id }, req.body, { new: true });
    if (!author) return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    res.json(author);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật tác giả', error: err.message });
  }
});

app.delete('/api/authors/:id', async (req, res) => {
  try {
    const author = await TacGia.findOneAndDelete({ ID_tac_gia: req.params.id });
    if (!author) return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    res.json({ message: 'Đã xóa tác giả thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa tác giả', error: err.message });
  }
});

// CRUD Phiếu mượn sách
app.post('/api/borrow-tickets', async (req, res) => {
  try {
    const ticket = new PhieuMuonSach(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm phiếu mượn', error: err.message });
  }
});

app.get('/api/borrow-tickets', async (req, res) => {
  try {
    const tickets = await PhieuMuonSach.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phiếu mượn', error: err.message });
  }
});

app.get('/api/borrow-tickets/:id', async (req, res) => {
  try {
    const ticket = await PhieuMuonSach.findOne({ ID_phieu: req.params.id });
    if (!ticket) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy phiếu mượn', error: err.message });
  }
});

app.put('/api/borrow-tickets/:id', async (req, res) => {
  try {
    const ticket = await PhieuMuonSach.findOneAndUpdate({ ID_phieu: req.params.id }, req.body, { new: true });
    if (!ticket) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật phiếu mượn', error: err.message });
  }
});

app.delete('/api/borrow-tickets/:id', async (req, res) => {
  try {
    const ticket = await PhieuMuonSach.findOneAndDelete({ ID_phieu: req.params.id });
    if (!ticket) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
    res.json({ message: 'Đã xóa phiếu mượn thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa phiếu mượn', error: err.message });
  }
});

// CRUD Mượn trả
app.post('/api/borrow-returns', async (req, res) => {
  try {
    const borrowReturn = new MuonTra(req.body);
    await borrowReturn.save();
    res.status(201).json(borrowReturn);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm mượn trả', error: err.message });
  }
});

app.get('/api/borrow-returns', async (req, res) => {
  try {
    const borrowReturns = await MuonTra.find();
    res.json(borrowReturns);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách mượn trả', error: err.message });
  }
});

app.get('/api/borrow-returns/:id', async (req, res) => {
  try {
    const borrowReturn = await MuonTra.findOne({ ID_muon_tra: req.params.id });
    if (!borrowReturn) return res.status(404).json({ message: 'Không tìm thấy mượn trả' });
    res.json(borrowReturn);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy mượn trả', error: err.message });
  }
});

app.put('/api/borrow-returns/:id', async (req, res) => {
  try {
    const borrowReturn = await MuonTra.findOneAndUpdate({ ID_muon_tra: req.params.id }, req.body, { new: true });
    if (!borrowReturn) return res.status(404).json({ message: 'Không tìm thấy mượn trả' });
    res.json(borrowReturn);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật mượn trả', error: err.message });
  }
});

app.delete('/api/borrow-returns/:id', async (req, res) => {
  try {
    const borrowReturn = await MuonTra.findOneAndDelete({ ID_muon_tra: req.params.id });
    if (!borrowReturn) return res.status(404).json({ message: 'Không tìm thấy mượn trả' });
    res.json({ message: 'Đã xóa mượn trả thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa mượn trả', error: err.message });
  }
});

// API lưu yêu cầu hỗ trợ
app.post('/api/support', async (req, res) => {
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

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QLTV API',
      version: '1.0.0',
      description: 'API quản lý thư viện',
    },
    servers: [
      { url: 'http://localhost:5000' }
    ],
  },
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server backend đang chạy tại http://localhost:${PORT}`);
}); 