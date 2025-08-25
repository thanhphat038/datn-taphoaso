import { ChromaClient } from 'chromadb';
import { CHROMA_URL } from '../../config/index.js';

class ChromaService {
  constructor() {
    this.client = null;
    this.defaultCollectionName = 'taphoaso_knowledge_base';
    this._init();
  }

  async _init() {
    try {
      this.client = new ChromaClient({ path: CHROMA_URL });
      console.log('📚 ChromaDB client initialized at', CHROMA_URL);
    } catch (error) {
      console.warn('⚠️ ChromaDB not available:', error.message);
      this.client = null;
    }
  }

  async isAvailable() {
    return !!this.client;
  }

  async getOrCreateCollection(name = this.defaultCollectionName, metadata = {}) {
    if (!this.client) throw new Error('ChromaDB client not initialized');
    return this.client.getOrCreateCollection({ name, metadata });
  }

  async upsertDocuments({
    collectionName = this.defaultCollectionName,
    ids,
    documents,
    metadatas,
    embeddings,
  }) {
    if (!this.client) throw new Error('ChromaDB client not initialized');
    const collection = await this.getOrCreateCollection(collectionName, {
      description: 'Knowledge base for TapHoaSo products and information',
      created_at: new Date().toISOString()
    });
    await collection.upsert({ ids, documents, metadatas, embeddings });
    return { count: ids.length };
  }

  async query({
    collectionName = this.defaultCollectionName,
    queryTexts,
    queryEmbeddings,
    nResults = 5,
    where,
    whereDocument,
  }) {
    if (!this.client) throw new Error('ChromaDB client not initialized');
    
    // Sử dụng collection đã có thay vì tạo mới
    const collection = await this.client.getCollection({ name: collectionName });
    
    const result = await collection.query({
      queryTexts,
      queryEmbeddings,
      nResults,
      where,
      whereDocument,
    });
    return result;
  }

  async delete({ collectionName = this.defaultCollectionName, ids, where }) {
    if (!this.client) throw new Error('ChromaDB client not initialized');
    const collection = await this.getOrCreateCollection(collectionName, {
      description: 'Knowledge base for TapHoaSo products and information',
      created_at: new Date().toISOString()
    });
    const res = await collection.delete({ ids, where });
    return res;
  }
}

export default new ChromaService();
