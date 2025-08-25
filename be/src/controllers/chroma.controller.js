import chromaService from '../services/ai/chroma.service.js';
import embeddingService from '../services/ai/embedding.service.js';
import { ok, badRequest, serviceUnavailable } from '../utils/response.js';
import Product from '../models/product.model.js';

class ChromaController {
  async health(req, res) {
    try {
      const available = await chromaService.isAvailable();
      if (!available) return serviceUnavailable(res, 'ChromaDB not available');
      return ok(res, { available: true, url: chromaService?.client?.config?.path }, 'ChromaDB OK');
    } catch (error) {
      return serviceUnavailable(res, 'ChromaDB not available');
    }
  }

  async upsert(req, res) {
    try {
      const { collectionName, items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return badRequest(res, 'items must be a non-empty array');
      }
      const ids = items.map((i) => i.id?.toString());
      const documents = items.map((i) => i.document?.toString());
      const metadatas = items.map((i) => i.metadata || {});
      const embeddings = items[0]?.embedding ? items.map((i) => i.embedding) : undefined;

      const result = await chromaService.upsertDocuments({
        collectionName,
        ids,
        documents,
        metadatas,
        embeddings,
      });
      return ok(res, result, 'Upserted documents');
    } catch (error) {
      return badRequest(res, error.message || 'Upsert failed');
    }
  }

  async query(req, res) {
    try {
      const { collectionName, query, nResults = 5, where, whereDocument } = req.body;
      if (!query || typeof query !== 'string') {
        return badRequest(res, 'query is required string');
      }
      const result = await chromaService.query({
        collectionName,
        queryTexts: [query],
        nResults,
        where,
        whereDocument,
      });
      return ok(res, result, 'Query success');
    } catch (error) {
      return badRequest(res, error.message || 'Query failed');
    }
  }

  async remove(req, res) {
    try {
      const { collectionName, ids, where } = req.body;
      const result = await chromaService.delete({ collectionName, ids, where });
      return ok(res, result, 'Delete success');
    } catch (error) {
      return badRequest(res, error.message || 'Delete failed');
    }
  }

  // Admin: sync all products into Chroma with embeddings
  async syncProducts(req, res) {
    try {
      const { collectionName = 'taphoaso_products', batchSize = 200 } = req.body || {};
      const available = await chromaService.isAvailable();
      if (!available) return serviceUnavailable(res, 'ChromaDB not available');

      const total = await Product.countDocuments({});
      let processed = 0;

      for (let skip = 0; skip < total; skip += batchSize) {
        const products = await Product.find({})
          .skip(skip)
          .limit(batchSize)
          .select('_id name description brand category')
          .lean();

        if (products.length === 0) break;

        const ids = products.map(p => p._id.toString());
        const documents = products.map(p => [p.name, p.description, p.brand, p.category].filter(Boolean).join(' | '));
        const metadatas = products.map(p => ({ type: 'product', productId: p._id.toString(), brand: p.brand || null, category: p.category || null }));
        const embeddings = await embeddingService.embedBatch(documents);

        await chromaService.upsertDocuments({ collectionName, ids, documents, metadatas, embeddings });
        processed += products.length;
      }

      return ok(res, { total, processed, collectionName }, 'Synced products to Chroma');
    } catch (error) {
      return badRequest(res, error.message || 'Sync failed');
    }
  }
}

export default new ChromaController();
