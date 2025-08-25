#!/usr/bin/env node

import chromaService from '../src/services/ai/chroma.service.js';

async function cleanupChroma() {
  console.log('🧹 Cleaning up ChromaDB collections...\n');

  try {
    // 1. Kiểm tra ChromaDB
    if (!await chromaService.isAvailable()) {
      console.error('❌ ChromaDB không khả dụng');
      return false;
    }

    // 2. Lấy danh sách collections
    console.log('📋 Getting collections list...');
    const collections = await chromaService.client.listCollections();
    console.log(`Found ${collections.length} collections:`, collections);

    // 3. Xóa tất cả collections
    console.log('\n🗑️ Deleting all collections...');
    for (const collectionName of collections) {
      try {
        await chromaService.client.deleteCollection({ name: collectionName });
        console.log(`✅ Deleted collection: ${collectionName}`);
      } catch (error) {
        console.log(`⚠️ Failed to delete ${collectionName}:`, error.message);
      }
    }

    // 4. Đợi một chút để ChromaDB xử lý xong
    console.log('\n⏳ Waiting for cleanup to complete...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 5. Kiểm tra lại
    const remainingCollections = await chromaService.client.listCollections();
    console.log(`\n📊 Remaining collections: ${remainingCollections.length}`);
    
    if (remainingCollections.length === 0) {
      console.log('✅ All collections cleaned up successfully!');
      console.log('\n💡 Now you can run sync script again to create new collection with correct dimension');
      return true;
    } else {
      console.log('⚠️ Some collections still remain:', remainingCollections);
      return false;
    }

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting ChromaDB cleanup...\n');
  
  const success = await cleanupChroma();
  
  if (success) {
    console.log('\n🎉 Cleanup completed successfully!');
    console.log('💡 Next steps:');
    console.log('   1. Run: npm run sync-chroma');
    console.log('   2. Test: node scripts/test-rag.js');
  } else {
    console.log('\n💥 Cleanup failed!');
    process.exit(1);
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
