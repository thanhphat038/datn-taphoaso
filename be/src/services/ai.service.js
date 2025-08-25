// AI Service - Placeholder cho việc tích hợp AI thực tế
// TODO: Thay thế bằng AI service thực tế (OpenAI, Claude, etc.)

class AIService {
  constructor() {
    this.isConfigured = false;
    this.initializeAI();
  }

  async initializeAI() {
    try {
      // TODO: Khởi tạo AI client (OpenAI, Claude, etc.)
      // this.aiClient = new OpenAIClient(process.env.OPENAI_API_KEY);
      this.isConfigured = true;
      console.log('🤖 AI Service initialized successfully');
    } catch (error) {
      console.warn('⚠️ AI Service not configured, using fallback responses');
      this.isConfigured = false;
    }
  }

  async generateResponse(userMessage, chatHistory = []) {
    try {
      if (!this.isConfigured) {
        return this.getFallbackResponse(userMessage);
      }

      // TODO: Gọi AI API thực tế
      // const response = await this.aiClient.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [
      //     { role: "system", content: "Bạn là trợ lý ảo của TapHoaSo, giúp khách hàng mua sắm và hỗ trợ." },
      //     ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
      //     { role: "user", content: userMessage }
      //   ]
      // });
      // return response.choices[0].message.content;

      // Tạm thời sử dụng fallback
      return this.getFallbackResponse(userMessage);

    } catch (error) {
      console.error('AI Service error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  getFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Các câu trả lời mẫu dựa trên từ khóa
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
    
    // Câu trả lời mặc định
    return 'Cảm ơn bạn đã liên hệ! Tôi hiểu bạn đang hỏi về "' + userMessage + '". Để hỗ trợ tốt nhất, bạn có thể mô tả rõ hơn hoặc liên hệ hotline của chúng tôi.';
  }

  async analyzeSentiment(message) {
    // TODO: Phân tích sentiment của tin nhắn
    // return await this.aiClient.analyzeSentiment(message);
    return 'neutral'; // placeholder
  }

  async getProductRecommendations(userMessage) {
    // TODO: Gợi ý sản phẩm dựa trên tin nhắn
    // return await this.aiClient.getRecommendations(userMessage);
    return []; // placeholder
  }
}

export default new AIService();
