#!/usr/bin/env node

import chromaService from '../src/services/ai/chroma.service.js';
import embeddingService from '../src/services/ai/embedding.service.js';

async function testSimpleRAG() {
  console.log('🧪 Testing Simple RAG...\n');

  try {
    // 1. Initialize embedding service
    console.log('1️⃣ Initializing embedding service...');
    await embeddingService._init();
    console.log(`   Ready: ${embeddingService.ready}`);
    console.log(`   Model: ${embeddingService.embeddingModel}`);

    // 2. Test embedding
    console.log('\n2️⃣ Testing embedding...');
    const testText = 'mì';
    const embedding = await embeddingService.embedText(testText);
    console.log(`   Text: "${testText}"`);
    console.log(`   Dimension: ${embedding.length}`);

    // 3. Get collection
    console.log('\n3️⃣ Getting collection...');
    const collections = await chromaService.client.listCollections();
    const collectionName = collections.find(c => c && c.includes('taphoaso_kb_'));
    console.log(`   Collection: ${collectionName}`);

    if (!collectionName) {
      console.log('❌ No collection found');
      return;
    }

    // 4. Query using ChromaService
    console.log('\n4️⃣ Querying using ChromaService...');
    
    try {
      const result = await chromaService.query({
        collectionName: collectionName,
        queryTexts: [testText],
        nResults: 5
      });
      
      console.log(`   Query successful!`);
      console.log(`   Documents found: ${result.documents?.[0]?.length || 0}`);
      
      if (result.documents && result.documents[0].length > 0) {
        console.log('\n📋 Sample results:');
        result.documents[0].forEach((doc, i) => {
          const distance = result.distances?.[0]?.[i];
          const metadata = result.metadatas?.[0]?.[i];
          console.log(`   [${i+1}] Distance: ${distance?.toFixed(4)}`);
          console.log(`       Product: ${metadata?.name || 'N/A'}`);
          console.log(`       Category: ${metadata?.category || 'N/A'}`);
          console.log(`       Price: ${metadata?.price || 'N/A'}`);
          console.log(`       Content: ${doc.substring(0, 100)}...`);
          console.log('');
        });
      } else {
        console.log('   ⚠️ No documents found');
      }
      
    } catch (error) {
      console.log(`   ❌ Query failed: ${error.message}`);
      console.log(`   Error details:`, error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Chạy test
testSimpleRAG().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test error:', error);
  process.exit(1);
});
