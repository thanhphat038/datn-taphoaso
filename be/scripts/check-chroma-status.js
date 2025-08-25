#!/usr/bin/env node

import mongoose from 'mongoose';
import { MONGODB_URI } from '../src/config/index.js';
import chromaService from '../src/services/ai/chroma.service.js';
import embeddingService from '../src/services/ai/embedding.service.js';
import Product from '../src/models/product.model.js';

// Kiểm tra trạng thái ChromaDB
async function checkChromaStatus() {
  console.log('🔍 Kiểm tra trạng thái ChromaDB...');
  
  try {
    const isAvailable = await chromaService.isAvailable();
    if (isAvailable) {
      console.log('✅ ChromaDB đang hoạt động');
      
      // Test collection
      const collection = await chromaService.getOrCreateCollection('taphoaso_knowledge_base', {
        description: 'Knowledge base for TapHoaSo products and information',
        created_at: new Date().toISOString()
      });
      const count = await collection.count();
      console.log(`📊 Số documents trong collection: ${count}`);
      
      return true;
    } else {
      console.log('❌ ChromaDB không khả dụng');
      return false;
    }
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra ChromaDB:', error.message);
    return false;
  }
}

// Kiểm tra trạng thái MongoDB
async function checkMongoStatus() {
  console.log('\n🔍 Kiểm tra trạng thái MongoDB...');
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB đã kết nối');
    
    // Đếm sản phẩm
    const productCount = await Product.countDocuments({ status: 'active' });
    console.log(`📦 Số sản phẩm active: ${productCount}`);
    
    // Đếm tất cả sản phẩm
    const totalProducts = await Product.countDocuments();
    console.log(`📦 Tổng số sản phẩm: ${totalProducts}`);
    
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi kết nối MongoDB:', error.message);
    return false;
  }
}

// Kiểm tra embedding service
async function checkEmbeddingService() {
  console.log('\n🔍 Kiểm tra Embedding Service...');
  
  try {
    if (embeddingService.ready) {
      console.log(`✅ Embedding service sẵn sàng với model: ${embeddingService.embeddingModel}`);
    } else {
      console.log('⚠️ Embedding service đang dùng fallback mode');
    }
    
    // Test embedding
    const testText = 'test sản phẩm';
    const embedding = await embeddingService.embedText(testText);
    console.log(`🔢 Test embedding cho "${testText}": ${embedding.length} dimensions`);
    
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra embedding service:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Kiểm tra trạng thái hệ thống...\n');
  
  const chromaOk = await checkChromaStatus();
  const mongoOk = await checkMongoStatus();
  const embeddingOk = await checkEmbeddingService();
  
  console.log('\n📋 Tóm tắt trạng thái:');
  console.log(`ChromaDB: ${chromaOk ? '✅ OK' : '❌ FAIL'}`);
  console.log(`MongoDB: ${mongoOk ? '✅ OK' : '❌ FAIL'}`);
  console.log(`Embedding: ${embeddingOk ? '✅ OK' : '❌ FAIL'}`);
  
  if (chromaOk && mongoOk && embeddingOk) {
    console.log('\n🎉 Tất cả hệ thống đều OK! Bạn có thể chạy sync script.');
    console.log('💡 Chạy: node scripts/sync-products-to-chroma.js');
  } else {
    console.log('\n⚠️ Có vấn đề với hệ thống. Hãy kiểm tra lại.');
    if (!chromaOk) console.log('   - ChromaDB có thể chưa chạy hoặc sai URL');
    if (!mongoOk) console.log('   - MongoDB có thể chưa chạy hoặc sai connection string');
    if (!embeddingOk) console.log('   - LM Studio endpoint có thể không accessible');
  }
  
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
