// AI Service - Placeholder cho việc tích hợp AI thực tế
// TODO: Thay thế bằng AI service thực tế (OpenAI, Claude, etc.)

import chromaService from './chroma.service.js';
import embeddingService from './embedding.service.js';
import fetch from 'node-fetch';
import { LLM_BASE_URL } from '../../config/index.js';

class AIService {
  constructor() {
    this.isConfigured = false;
    this.model = null;
    this.initializeAI();
  }

  async initializeAI() {
    try {
      this.baseUrl = LLM_BASE_URL;
      // Load models from LM Studio
      const res = await fetch(`${this.baseUrl}/models`, { method: 'GET' });
      if (!res.ok) throw new Error(`Model list error ${res.status}`);
      const data = await res.json();
      const list = data?.data || data?.models || [];
      // Prefer chat/capable models, skip embedding-only models
      const preferred = list.find(m => !String(m.id || m.name || '').toLowerCase().includes('embedding')) || list[0];
      this.model = preferred?.id || preferred?.name || 'default';
      this.isConfigured = true;
      console.log('🤖 AI Service initialized with model:', this.model);
    } catch (error) {
      console.warn('⚠️ AI Service model discovery failed, fallback mode:', error.message);
      this.isConfigured = false;
      this.model = null;
    }
  }

  async callLLM(systemPrompt, chatHistory, userMessage) {
    const url = `${this.baseUrl}/chat/completions`;
    const body = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3
    };
    const headers = { 'Content-Type': 'application/json' };
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`LLM error ${res.status}: ${text}`);
    }
    const data = await res.json();
    const answer = data?.choices?.[0]?.message?.content || '';
    return answer;
  }

  async generateResponse(userMessage, chatHistory = []) {
    try {
      // RAG: Lấy context từ Chroma nếu khả dụng
      let contextText = '';
      try {
        const available = await chromaService.isAvailable();
        if (available && userMessage && userMessage.length > 0) {
          console.log('🔍 Querying ChromaDB for context...');
          const queryEmbedding = await embeddingService.embedText(userMessage);
          
          // Lấy tất cả collections để tìm collection có dữ liệu
          const collections = await chromaService.client.listCollections();
          console.log(`📚 Found ${collections.length} collections:`, collections);
          
          // Tìm collection mới nhất có taphoaso_kb_
          const taphoasoCollections = collections.filter(c => c && c.includes('taphoaso_kb_')).sort();
          const collectionName = taphoasoCollections[taphoasoCollections.length - 1];
          
                      if (collectionName) {
              console.log(`📚 Using collection: ${collectionName}`);
              const result = await chromaService.query({
                collectionName: collectionName,
                queryEmbeddings: [queryEmbedding],
                nResults: 3
              });
              const docs = result?.documents?.[0] || [];
              const meta = result?.metadatas?.[0] || [];
              const distances = result?.distances?.[0] || [];
              
              console.log(`🔍 Query result: ${docs.length} documents found`);
              console.log(`📊 Distances:`, distances);
              
              if (docs.length > 0) {
                contextText = docs.map((d, i) => `- ${d}${meta[i]?.brand ? ` (brand: ${meta[i].brand})` : ''}`).join('\n');
                console.log(`📝 Context extracted: ${contextText.length} characters`);
              } else {
                console.log(`⚠️ No documents found for query: "${userMessage}"`);
              }
            }
        }
      } catch (e) {
        console.log('⚠️ RAG query failed:', e.message);
      }

      // Gọi LLM nếu đã có model
      if (this.model) {
        try {
          const systemPrompt = `Bạn là trợ lý ảo của TapHoaSo. Nếu có context dưới đây, hãy ưu tiên dùng để trả lời chính xác và ngắn gọn.\nContext:\n${contextText}`;
          const answer = await this.callLLM(systemPrompt, chatHistory, userMessage);
          if (answer && answer.trim().length > 0) return answer;
        } catch (e) {}
      }

      // Fallback: RAG + rule-based
      return this.getFallbackResponse(userMessage, contextText);

    } catch (error) {
      console.error('AI Service error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  getFallbackResponse(userMessage, contextText = '') {
    const lowerMessage = (userMessage || '').toLowerCase();

    if (contextText) {
      return `Tôi tìm thấy vài thông tin liên quan:\n${contextText}\n\n${this.basicAnswer(lowerMessage)}`;
    }

    return this.basicAnswer(lowerMessage);
  }

  basicAnswer(lowerMessage) {
    if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Xin chào! Tôi là trợ lý ảo của TapHoaSo. Tôi có thể giúp gì cho bạn hôm nay?';
    }
    if (lowerMessage.includes('giá') || lowerMessage.includes('bao nhiêu')) {
      return 'Để biết chính xác giá sản phẩm, bạn có thể xem trên website hoặc liên hệ hotline của chúng tôi. Bạn đang quan tâm đến sản phẩm nào vậy?';
    }
    if (lowerMessage.includes('giao hàng') || lowerMessage.includes('ship')) {
      return 'Chúng tôi giao hàng toàn quốc với phí ship từ 15.000đ - 50.000đ tùy khu vực. Thời gian giao hàng từ 2-5 ngày làm việc.';
    }
    if (lowerMessage.includes('thanh toán') || lowerMessage.includes('payment')) {
      return 'Chúng tôi hỗ trợ nhiều hình thức thanh toán: tiền mặt, chuyển khoản, VNPay, và các ví điện tử khác.';
    }
    if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('mua')) {
      return 'Chúng tôi có đa dạng sản phẩm: thực phẩm tươi sống, đồ khô, đồ uống, mỹ phẩm... Bạn đang tìm kiếm sản phẩm gì cụ thể?';
    }
    if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank')) {
      return 'Không có gì! Nếu cần hỗ trợ thêm, đừng ngại liên hệ với chúng tôi nhé!';
    }
    return 'Cảm ơn bạn đã liên hệ! Tôi hiểu bạn đang hỏi về: "' + (lowerMessage || '...') + '". Bạn có thể mô tả rõ hơn để tôi hỗ trợ tốt hơn không?';
  }

  async analyzeSentiment(message) { return 'neutral'; }
  async getProductRecommendations(userMessage) { return []; }
}

export default new AIService();
