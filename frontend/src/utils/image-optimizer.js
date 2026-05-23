/**
 * Tối ưu hóa đường dẫn ảnh Cloudinary
 * Tự động chèn các cờ tối ưu hóa (f_auto, q_auto) để phục vụ ảnh dưới định dạng Next-Gen (WebP/AVIF)
 * 
 * @param {string} url - Đường dẫn ảnh gốc (Cloudinary)
 * @param {number} width - (Optional) Chiều rộng ảnh muốn resize
 * @param {number} height - (Optional) Chiều cao ảnh muốn resize
 * @returns {string} Đường dẫn ảnh đã tối ưu
 */
export const optimizeCloudinaryUrl = (url, width, height) => {
  if (!url) return '';
  
  // Chỉ tối ưu nếu là link từ Cloudinary
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // Nếu URL đã có tham số biến đổi (upload/...), tránh ghi đè làm hỏng
  if (url.includes('/upload/')) {
    const parts = url.split('/upload/');
    
    // Cờ tối ưu mặc định: f_auto (tự động định dạng WebP/AVIF), q_auto (tự động nén chất lượng)
    let transformations = 'f_auto,q_auto';
    
    // Nếu có truyền kích thước, thêm cờ resize crop
    if (width || height) {
      transformations += ',c_fill'; // Crop fill để giữ tỉ lệ khung hình
      if (width) transformations += `,w_${width}`;
      if (height) transformations += `,h_${height}`;
    }

    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }

  return url;
};
