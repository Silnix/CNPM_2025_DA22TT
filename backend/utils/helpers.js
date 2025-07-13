// Hàm chuẩn hóa chuỗi để tìm kiếm
function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

// Thuật toán Levenshtein để tính khoảng cách giữa hai chuỗi
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Hàm tạo ID mới
function generateNewId(prefix, lastItem) {
  let newId = prefix + '001';
  if (lastItem && lastItem.ID) {
    const num = parseInt(lastItem.ID.replace(prefix, '')) + 1;
    newId = prefix + num.toString().padStart(3, '0');
  }
  return newId;
}

module.exports = {
  normalizeString,
  levenshtein,
  generateNewId
}; 