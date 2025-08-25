#!/usr/bin/env node

import chromaService from '../src/services/ai/chroma.service.js';
import embeddingService from '../src/services/ai/embedding.service.js';
import aiService from '../src/services/ai/ai.service.js';

async function testRAG() {
  console.log('🧪 Testing RAG functionality...\n');

  try {
    // 1. Force initialize embedding service
    console.log('1️⃣ Initializing embedding service...');
    await embeddingService._init();
    
    // 2. Kiểm tra ChromaDB
    console.log('\n2️⃣ Checking ChromaDB...');
    const chromaAvailable = await chromaService.isAvailable();
    console.log(`   ChromaDB available: ${chromaAvailable ? '✅' : '❌'}`);

    if (!chromaAvailable) {
      console.log('❌ ChromaDB not available');
      return;
    }

    // 3. Kiểm tra collections
    console.log('\n3️⃣ Checking collections...');
    const collections = await chromaService.client.listCollections();
    console.log(`   Found ${collections.length} collections:`);
    console.log('   Raw collections data:', JSON.stringify(collections, null, 2));
    
    collections.forEach((c, i) => {
      console.log(`   [${i}] Collection:`, c);
      if (c && typeof c === 'object') {
        console.log(`      Keys:`, Object.keys(c));
        console.log(`      Name:`, c.name);
        console.log(`      ID:`, c.id);
      }
    });

    // 4. Tìm collection có dữ liệu (sử dụng collection mới nhất)
    const taphoasoCollections = collections.filter(c => c && c.includes('taphoaso_kb_')).sort();
    const collectionName = taphoasoCollections[taphoasoCollections.length - 1]; // Lấy collection cuối cùng
    
    if (!collectionName) {
      console.log('❌ No taphoaso_kb_ collection found');
      console.log('   Available collection names:', collections);
      return;
    }
    console.log(`   Using collection: ${collectionName} (newest)`);
    console.log(`   All taphoaso collections: ${taphoasoCollections.join(', ')}`);

    // 5. Kiểm tra số documents
    const collection = await chromaService.client.getCollection({ name: collectionName });
    const count = await collection.count();
    console.log(`   Documents in collection: ${count}`);

    // 6. Test embedding
    console.log('\n4️⃣ Testing embedding...');
    const testText = 'sữa tươi';
    const embedding = await embeddingService.embedText(testText);
    console.log(`   Embedding for "${testText}": ${embedding.length} dimensions`);

    // 6. Test query
    console.log('\n4️⃣ Testing ChromaDB query...');
    let queryResult = null;
    try {
      // Query trực tiếp vào collection
      queryResult = await collection.query({
        queryTexts: [testText],
        nResults: 3
      });
      
      if (queryResult.documents && queryResult.documents[0].length > 0) {
        console.log(`   ✅ Query successful! Found ${queryResult.documents[0].length} results`);
        console.log('   First result:', queryResult.documents[0][0].substring(0, 100) + '...');
      } else {
        console.log('   ❌ Query failed or no results');
      }
    } catch (error) {
      console.log('   ❌ Query error:', error.message);
    }

    // 7. Test AI service RAG
    console.log('\n5️⃣ Testing AI service RAG...');
    const aiResponse = await aiService.generateResponse(testText);
    console.log(`   AI Response: ${aiResponse.substring(0, 200)}...`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Chạy test
testRAG().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test error:', error);
  process.exit(1);
});
