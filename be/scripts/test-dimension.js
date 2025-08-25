#!/usr/bin/env node

import chromaService from '../src/services/ai/chroma.service.js';
import embeddingService from '../src/services/ai/embedding.service.js';

async function testDimension() {
  console.log('🔍 Testing embedding dimensions...\n');

  try {
    // 1. Force initialize embedding service
    console.log('1️⃣ Initializing embedding service...');
    await embeddingService._init();
    
    // 2. Test embedding service
    console.log('\n2️⃣ Testing embedding service...');
    const testText = 'sữa tươi';
    const embedding = await embeddingService.embedText(testText);
    console.log(`   Text: "${testText}"`);
    console.log(`   Dimension: ${embedding.length}`);
    console.log(`   First 5 values: [${embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}]`);
    console.log(`   Ready: ${embeddingService.ready}`);
    console.log(`   Model: ${embeddingService.embeddingModel}`);

    // 3. Test batch embedding
    console.log('\n3️⃣ Testing batch embedding...');
    const texts = ['sữa tươi', 'bánh mì', 'nước ngọt'];
    const batchEmbeddings = await embeddingService.embedBatch(texts);
    console.log(`   Batch size: ${batchEmbeddings.length}`);
    batchEmbeddings.forEach((emb, i) => {
      console.log(`   [${i}] "${texts[i]}": ${emb.length} dimensions`);
    });

    // 4. Check ChromaDB collection
    console.log('\n4️⃣ Checking ChromaDB collection...');
    const collections = await chromaService.client.listCollections();
    console.log(`   Collections: ${collections.length}`);
    
    if (collections.length > 0) {
      const collectionName = collections[0];
      console.log(`   Using collection: ${collectionName}`);
      
      const collection = await chromaService.client.getCollection({ name: collectionName });
      const count = await collection.count();
      console.log(`   Documents: ${count}`);
      
      // Try to get collection info
      try {
        const info = await collection.get();
        if (info.embeddings && info.embeddings.length > 0) {
          const firstEmbedding = info.embeddings[0];
          console.log(`   First embedding dimension: ${firstEmbedding.length}`);
        }
      } catch (e) {
        console.log(`   Could not get collection info: ${e.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Chạy test
testDimension().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test error:', error);
  process.exit(1);
});
