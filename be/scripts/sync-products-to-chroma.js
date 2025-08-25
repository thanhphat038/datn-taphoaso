#!/usr/bin/env node

import mongoose from 'mongoose';
import { MONGODB_URI } from '../src/config/index.js';
import chromaService from '../src/services/ai/chroma.service.js';
import embeddingService from '../src/services/ai/embedding.service.js';
import Product from '../src/models/product.model.js';
import Category from '../src/models/category.model.js';

// Kết nối MongoDB
async function connectMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
}

// Lấy thông tin category
async function getCategoryName(categoryId) {
  try {
    const category = await Category.findById(categoryId);
    return category ? category.name : 'Unknown';
  } catch (error) {
    console.warn(`⚠️ Could not fetch category ${categoryId}:`, error.message);
    return 'Unknown';
  }
}

// Tạo text content cho sản phẩm
function createProductText(product, categoryName) {
  const parts = [
    `Tên sản phẩm: ${product.name}`,
    `Danh mục: ${categoryName}`,
    `Giá: ${product.price.toLocaleString('vi-VN')} VNĐ`,
    `Giá gốc: ${product.original_price.toLocaleString('vi-VN')} VNĐ`,
    `Tồn kho: ${product.in_stock} sản phẩm`,
    `Trạng thái: ${product.status}`,
  ];

  if (product.description) {
    parts.push(`Mô tả: ${product.description}`);
  }

  if (product.rating && product.rating.rate > 0) {
    parts.push(`Đánh giá: ${product.rating.rate}/5 (${product.rating.count} lượt)`);
  }

  return parts.join('. ');
}

// Sync sản phẩm vào ChromaDB
async function syncProductsToChroma() {
  try {
    // Kiểm tra ChromaDB
    if (!await chromaService.isAvailable()) {
      console.error('❌ ChromaDB không khả dụng. Hãy đảm bảo ChromaDB đang chạy.');
      return false;
    }

    console.log('🔄 Bắt đầu sync sản phẩm vào ChromaDB...');
    
    // Xóa collection cũ nếu tồn tại để tránh dimension mismatch
    try {
      console.log('🗑️ Xóa collection cũ nếu tồn tại...');
      await chromaService.client.deleteCollection({ name: 'taphoaso_knowledge_base' });
      console.log('✅ Đã xóa collection cũ');
      
      // Đợi một chút để ChromaDB xử lý xong
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.log('ℹ️ Collection cũ không tồn tại hoặc đã được xóa');
    }

    // Lấy tất cả sản phẩm từ MongoDB
    const products = await Product.find({ status: 'active' }).populate('category_id');
    console.log(`📦 Tìm thấy ${products.length} sản phẩm active`);

    if (products.length === 0) {
      console.log('ℹ️ Không có sản phẩm nào để sync');
      return true;
    }

    // Chuẩn bị dữ liệu cho ChromaDB
    const ids = [];
    const documents = [];
    const metadatas = [];
    const texts = [];

    for (const product of products) {
      const categoryName = await getCategoryName(product.category_id);
      const productText = createProductText(product, categoryName);
      
      ids.push(product._id.toString());
      documents.push(productText);
      metadatas.push({
        product_id: product._id.toString(),
        name: product.name,
        category: categoryName,
        price: product.price,
        status: product.status,
        type: 'product'
      });
      texts.push(productText);
    }

    console.log('🔍 Đang tạo embeddings...');
    
    // Tạo embeddings cho tất cả sản phẩm
    const embeddings = await embeddingService.embedBatch(texts);
    
    if (embeddings.length !== texts.length) {
      console.warn('⚠️ Số lượng embeddings không khớp với số sản phẩm');
    }

    console.log('💾 Đang upsert vào ChromaDB...');
    
    // Tạo collection mới với tên khác để tránh conflict
    const collectionName = `taphoaso_kb_${Date.now()}`;
    console.log(`🔧 Tạo collection mới: ${collectionName}`);
    
    let result;
    try {
      const collection = await chromaService.client.createCollection({
        name: collectionName,
        metadata: {
          description: 'Knowledge base for TapHoaSo products and information',
          created_at: new Date().toISOString()
        }
      });
      console.log('✅ Đã tạo collection mới');
      
      // Upsert trực tiếp vào collection
      await collection.upsert({ ids, documents, metadatas, embeddings });
      result = { count: ids.length };
      
      // Cập nhật default collection name
      chromaService.defaultCollectionName = collectionName;
      
    } catch (error) {
      console.log('❌ Lỗi khi tạo collection:', error.message);
      throw error;
    }

    console.log(`✅ Sync thành công ${result.count} sản phẩm vào ChromaDB`);
    
    // Test query trực tiếp vào collection mới
    console.log('🧪 Testing query...');
    try {
      const testCollection = await chromaService.client.getCollection({ name: collectionName });
      const testQuery = await testCollection.query({
        queryTexts: ['sữa tươi'],
        nResults: 3
      });
      
      if (testQuery.documents && testQuery.documents[0].length > 0) {
        console.log('✅ Query test thành công! ChromaDB đã có dữ liệu.');
        console.log(`📊 Tìm thấy ${testQuery.documents[0].length} kết quả cho "sữa tươi"`);
      } else {
        console.log('⚠️ Query test không trả về kết quả');
      }
    } catch (error) {
      console.log('⚠️ Query test thất bại:', error.message);
    }

    return true;

  } catch (error) {
    console.error('❌ Lỗi khi sync sản phẩm:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Bắt đầu script sync sản phẩm vào ChromaDB...\n');

  // Kết nối MongoDB
  const mongoConnected = await connectMongoDB();
  if (!mongoConnected) {
    console.error('❌ Không thể kết nối MongoDB. Dừng script.');
    process.exit(1);
  }

  // Sync sản phẩm
  const syncSuccess = await syncProductsToChroma();
  
  if (syncSuccess) {
    console.log('\n🎉 Script hoàn thành thành công!');
  } else {
    console.log('\n💥 Script thất bại!');
    process.exit(1);
  }

  // Đóng kết nối
  await mongoose.connection.close();
  console.log('👋 Đã đóng kết nối MongoDB');
  process.exit(0);
}

// Xử lý lỗi
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Chạy script
main().catch(error => {
  console.error('❌ Main function error:', error);
  process.exit(1);
});
