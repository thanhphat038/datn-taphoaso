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

// Route để serve ảnh với base64 encoding
router.get('/base64/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    console.log('Base64 request received for filename:', filename);
    console.log('Decoded filename:', decodeURIComponent(filename));
    
    const filepath = path.join('public/uploads', decodeURIComponent(filename));
    console.log('Full filepath:', filepath);
    
    if (!fs.existsSync(filepath)) {
      console.log('File not found:', filepath);
      return res.status(404).json({
        success: false,
        message: 'Image not found',
        filename: filename,
        filepath: filepath
      });
    }

    console.log('File exists, converting to base64...');
    // Read file and convert to base64
    const fileBuffer = fs.readFileSync(filepath);
    const base64String = fileBuffer.toString('base64');
    
    // Get file extension to determine MIME type
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    const mimeType = mimeTypes[ext] || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64String}`;
    
    console.log('Base64 conversion successful, sending response...');
    res.json({
      success: true,
      data: dataUrl,
      filename: filename,
      mimeType: mimeType
    });
  } catch (error) {
    console.error('Error serving base64 image:', error);
    res.status(500).json({
      success: false,
      message: 'Error serving image',
      error: error.message
    });
  }
});

// Route để serve ảnh với CORS headers
router.get('/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join('public/uploads', filename);
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (fs.existsSync(filepath)) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
    res.sendFile(path.resolve(filepath));
  } else {
    res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }
});

// Route để serve ảnh từ uploads folder
router.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join('public/uploads', filename);
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (fs.existsSync(filepath)) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
    res.sendFile(path.resolve(filepath));
  } else {
    res.status(404).json({
      success: false,
      message: 'Image not found'
    });
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

    console.log('File uploaded successfully:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      url: fileUrl
    });

    res.json({
      success: true,
      message: 'Upload thành công',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload file',
      error: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File quá lớn. Kích thước tối đa là 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Lỗi upload file: ' + error.message
    });
  }
  
  if (error.message === 'Chỉ chấp nhận file hình ảnh!') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  console.error('Upload route error:', error);
  res.status(500).json({
    success: false,
    message: 'Lỗi server khi upload file'
  });
});

export default router; 