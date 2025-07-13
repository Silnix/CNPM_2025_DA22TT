/**
 * Các hàm tiện ích cho hệ thống quản lý thư viện
 */

/**
 * Tạo ID mới dựa trên prefix và document cuối cùng
 * @param {string} prefix - Prefix cho ID (VD: 'U' cho User, 'B' cho Book)
 * @param {Object} lastDoc - Document cuối cùng trong collection
 * @returns {string} ID mới
 */
const generateNewId = (prefix, lastDoc) => {
  if (!lastDoc || !lastDoc.ID) {
    return `${prefix}001`;
  }
  
  const lastId = lastDoc.ID;
  const numberPart = lastId.replace(prefix, '');
  const nextNumber = parseInt(numberPart) + 1;
  return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
};

/**
 * Chuẩn hóa chuỗi để tìm kiếm (loại bỏ dấu, chuyển về chữ thường)
 * @param {string} str - Chuỗi cần chuẩn hóa
 * @returns {string} Chuỗi đã chuẩn hóa
 */
const normalizeString = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/[^a-z0-9\s]/g, '') // Chỉ giữ chữ cái, số và khoảng trắng
    .trim();
};

/**
 * Tính khoảng cách Levenshtein giữa hai chuỗi
 * @param {string} str1 - Chuỗi thứ nhất
 * @param {string} str2 - Chuỗi thứ hai
 * @returns {number} Khoảng cách Levenshtein
 */
const levenshtein = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

/**
 * Tạo ngày hiện tại theo định dạng DD/MM/YYYY
 * @returns {string} Ngày hiện tại
 */
const getCurrentDate = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Tạo ngày trong tương lai (mặc định 14 ngày)
 * @param {number} days - Số ngày cộng thêm
 * @returns {string} Ngày trong tương lai
 */
const getFutureDate = (days = 14) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Kiểm tra xem một chuỗi có phải là email hợp lệ không
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} True nếu email hợp lệ
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra xem một chuỗi có phải là số điện thoại hợp lệ không
 * @param {string} phone - Số điện thoại cần kiểm tra
 * @returns {boolean} True nếu số điện thoại hợp lệ
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

module.exports = {
  generateNewId,
  normalizeString,
  levenshtein,
  getCurrentDate,
  getFutureDate,
  isValidEmail,
  isValidPhone
}; 