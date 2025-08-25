# Scripts để Sync dữ liệu vào ChromaDB

## Mục đích
Các script này giúp bạn kiểm tra trạng thái hệ thống và sync dữ liệu sản phẩm từ MongoDB vào ChromaDB để AI chatbot có thể sử dụng RAG (Retrieval Augmented Generation).

## Các script có sẵn

### 1. `check-chroma-status.js` - Kiểm tra trạng thái hệ thống
Script này kiểm tra:
- ChromaDB có đang chạy không
- MongoDB có kết nối được không  
- Embedding service có hoạt động không
- Số lượng sản phẩm trong database

**Chạy script:**
```bash
cd be
node scripts/check-chroma-status.js
```

**Kết quả mong đợi:**
```
🚀 Kiểm tra trạng thái hệ thống...

🔍 Kiểm tra trạng thái ChromaDB...
✅ ChromaDB đang hoạt động
📊 Số documents trong collection: 0

🔍 Kiểm tra trạng thái MongoDB...
✅ MongoDB đã kết nối
📦 Số sản phẩm active: 25
📦 Tổng số sản phẩm: 30

🔍 Kiểm tra Embedding Service...
✅ Embedding service sẵn sàng với model: text-embedding-nomic-embed-text-v1.5
🔢 Test embedding cho "test sản phẩm": 384 dimensions

📋 Tóm tắt trạng thái:
ChromaDB: ✅ OK
MongoDB: ✅ OK
Embedding: ✅ OK

🎉 Tất cả hệ thống đều OK! Bạn có thể chạy sync script.
💡 Chạy: node scripts/sync-products-to-chroma.js
```

### 2. `sync-products-to-chroma.js` - Sync sản phẩm vào ChromaDB
Script này sẽ:
- Kết nối MongoDB
- Lấy tất cả sản phẩm active
- Tạo embeddings cho mỗi sản phẩm
- Upsert vào ChromaDB
- Test query để xác nhận

**Chạy script:**
```bash
cd be
node scripts/sync-products-to-chroma.js
```

**Kết quả mong đợi:**
```
🚀 Bắt đầu script sync sản phẩm vào ChromaDB...

✅ MongoDB connected successfully
🔄 Bắt đầu sync sản phẩm vào ChromaDB...
📦 Tìm thấy 25 sản phẩm active
🔍 Đang tạo embeddings...
💾 Đang upsert vào ChromaDB...
✅ Sync thành công 25 sản phẩm vào ChromaDB
🧪 Testing query...
✅ Query test thành công! ChromaDB đã có dữ liệu.

🎉 Script hoàn thành thành công!
👋 Đã đóng kết nối MongoDB
```

## Yêu cầu trước khi chạy

### 1. ChromaDB phải đang chạy
```bash
# Terminal 1: Start ChromaDB
chroma run --host localhost --port 8000
```

### 2. MongoDB phải accessible
Kiểm tra biến môi trường `MONGODB_URI` trong file `.env`

### 3. LM Studio endpoint phải accessible
Kiểm tra biến môi trường `LLM_BASE_URL` trong file `.env`
```bash
# Test endpoint
curl https://fleet-toucan-refined.ngrok-free.app/v1/models
```

## Xử lý lỗi thường gặp

### ChromaDB không kết nối được
```
❌ ChromaDB không khả dụng. Hãy đảm bảo ChromaDB đang chạy.
```
**Giải pháp:** Start ChromaDB với `chroma run --host localhost --port 8000`

### MongoDB connection failed
```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```
**Giải pháp:** Kiểm tra MongoDB service và connection string

### Embedding service fallback
```
⚠️ Embedding service đang dùng fallback mode
```
**Giải pháp:** Kiểm tra LM Studio endpoint có accessible không

## Sau khi sync thành công

1. **Kiểm tra ChromaDB có dữ liệu:**
```bash
curl http://localhost:8000/api/v1/collections/taphoaso_knowledge_base/count
```

2. **Test query trực tiếp:**
```bash
curl -X POST http://localhost:8000/api/v1/collections/taphoaso_knowledge_base/query \
  -H "Content-Type: application/json" \
  -d '{"query_texts": ["sữa tươi"], "n_results": 3}'
```

3. **Test chat API:**
```bash
# Gửi tin nhắn qua chat API
POST /api/chat/send
{
  "message": "Bạn có sản phẩm sữa nào?"
}
```

## Lưu ý
- Script chỉ sync sản phẩm có `status: 'active'`
- Mỗi sản phẩm sẽ được tạo text content bao gồm: tên, danh mục, giá, mô tả, đánh giá
- Embeddings được tạo bằng LM Studio hoặc fallback deterministic nếu không có
- Collection mặc định: `taphoaso_knowledge_base`
- Script tự động test query sau khi sync để xác nhận thành công
