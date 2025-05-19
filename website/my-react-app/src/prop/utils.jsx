/**
 * Chuyển đổi đường dẫn ảnh thành URL đầy đủ để hiển thị
 * 
 * imagePath - Đường dẫn ảnh từ server
 * defaultImage ảnh mặc định nếu không có đường dẫn
 * return URL đầy đủ, ảnh mặc định hoặc null
 */
export function getFullImageUrl(imagePath, defaultImage = null) {
  if (!imagePath) {
    return defaultImage;
  }
  
  // Nếu đã là URL đầy đủ, giữ nguyên
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const SERVER_URL = 'http://localhost:8000';
  
  // Xử lý trường hợp đường dẫn có dấu / ở đầu
  if (imagePath.startsWith('/')) {
    // Nếu đã có dấu "/" ở đầu path, không thêm dấu "/" nữa
    return SERVER_URL + imagePath;
  } else {
    // Nếu chưa có dấu "/" ở đầu path, thêm dấu "/"
    return SERVER_URL + '/' + imagePath;
  }
}

/**
 * Format thời gian từ giây sang định dạng mm:ss
 * seconds - thời gian tính bằng giây
 * return chuỗi thời gian định dạng mm:ss
 */
export function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

