import fetch from 'node-fetch';
import { LLM_BASE_URL } from '../../config/index.js';

// Embedding Service: tries LM Studio embeddings first, falls back to deterministic mock
class EmbeddingService {
  constructor() {
    this.dimension = 384; // default when falling back
    this.lmBaseUrl = LLM_BASE_URL;
    this.embeddingModel = null;
    this.ready = false;
    this._init();
  }

  async _init() {
    try {
      console.log('🔍 Initializing embedding service...');
      console.log('   LM Studio URL:', this.lmBaseUrl);
      
      const res = await fetch(`${this.lmBaseUrl}/models`);
      if (!res.ok) throw new Error(`models ${res.status}`);
      
      const data = await res.json();
      console.log('   Raw response:', JSON.stringify(data, null, 2));
      
      const list = data?.data || data?.models || [];
      console.log(`   Found ${list.length} models:`, list.map(m => m.id || m.name));
      
      const emb = list.find(m => {
        const modelName = String(m.id || m.name || '').toLowerCase();
        const isEmbedding = modelName.includes('embedding') || modelName.includes('embed');
        console.log(`   Checking model "${modelName}": ${isEmbedding ? 'YES' : 'NO'}`);
        return isEmbedding;
      });
      
      if (emb) {
        this.embeddingModel = emb.id || emb.name;
        this.ready = true;
        console.log('🔎 Embedding model detected:', this.embeddingModel);
      } else {
        console.warn('⚠️ No embedding model found in LM Studio models, using fallback embeddings');
        this.ready = false;
      }
    } catch (e) {
      console.warn('⚠️ Embedding service init failed, fallback mode:', e.message);
      this.ready = false;
    }
  }

  async embedText(text) {
    if (!text || typeof text !== 'string') return this.zeros();
    if (this.ready && this.embeddingModel) {
      try {
        const res = await fetch(`${this.lmBaseUrl}/embeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: this.embeddingModel, input: text })
        });
        if (res.ok) {
          const data = await res.json();
          const vec = data?.data?.[0]?.embedding;
          if (Array.isArray(vec)) return vec;
        }
      } catch (_) {}
    }
    // fallback deterministic
    return this._fallback(text);
  }

  async embedBatch(texts = []) {
    if (!Array.isArray(texts) || texts.length === 0) return [];
    if (this.ready && this.embeddingModel) {
      try {
        const res = await fetch(`${this.lmBaseUrl}/embeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: this.embeddingModel, input: texts })
        });
        if (res.ok) {
          const data = await res.json();
          const arr = data?.data?.map(d => d.embedding).filter(Array.isArray) || [];
          if (arr.length === texts.length) return arr;
        }
      } catch (_) {}
    }
    // fallback per item
    return Promise.all(texts.map(t => this._fallback(t)));
  }

  _fallback(text) {
    const vec = new Array(this.dimension).fill(0);
    let seed = 0;
    for (let i = 0; i < text.length; i++) {
      seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
      const idx = seed % this.dimension;
      vec[idx] += 1;
    }
    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return vec.map(v => v / norm);
  }

  zeros() { return new Array(this.dimension).fill(0); }
}

export default new EmbeddingService();
