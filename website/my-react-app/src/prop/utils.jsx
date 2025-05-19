
/**
 * Các utility functions dùng chung 
 */

/**
 * Chuyển đổi đường dẫn ảnh thành URL đầy đủ để hiển thị
 * imagePath - Đường dẫn ảnh từ server
 * @returns URL đầy đủ hoặc null nếu không có ảnh
 */
export function getFullImageUrl(imagePath) {
  if (!imagePath) {
    return null;
  }
  
  // Nếu đã là URL đầy đủ (có http), giữ nguyên
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const SERVER_URL = 'http://localhost:8000';
  
  // Xử lý trường hợp đường dẫn có dấu / ở đầu
  let formattedPath = imagePath;
  if (imagePath.startsWith('/')) {
    // Nếu đã có dấu "/" ở đầu path, không thêm dấu "/" nữa
    return SERVER_URL + formattedPath;
  } else {
    // Nếu chưa có dấu "/" ở đầu path, thêm dấu "/"
    return SERVER_URL + '/' + formattedPath;
  }
}

/**
 * Format thời gian từ giây sang định dạng mm:ss
 * @param {number} seconds - Thời gian tính bằng giây
 * @returns {string} - Chuỗi thời gian định dạng mm:ss
 */
export function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Thêm các utility functions khác tại đây khi cần