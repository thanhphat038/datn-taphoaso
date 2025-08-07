import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads';
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
  const uploadDir = 'public/uploads';
  let filename = file.originalname;
  let filepath = path.join(uploadDir, filename);

  // Nếu file trùng tên tồn tại thì thêm hậu tố để tránh trùng
  let counter = 1;
  while (fs.existsSync(filepath)) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    filename = `${base}-${counter}${ext}`;
    filepath = path.join(uploadDir, filename);
    counter++;
  }

  cb(null, filename);
}
});

// Filter để chỉ chấp nhận file hình ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Route upload hình ảnh
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file nào được upload'
      });
    }

    // Tạo URL đầy đủ cho file đã upload
    const baseUrl = req.protocol + '://' + req.get('host');
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Upload thành công',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload file',
      error: error.message
    });
  }
});

export default router; 