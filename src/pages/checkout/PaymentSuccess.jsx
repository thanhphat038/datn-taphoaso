import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }} className="flex flex-col items-center justify-center">
      <img
        src="/img/success.png"
        alt="success"
        style={{ width: 300, height: 300, objectFit: 'contain', marginBottom: 24 }}
      />
      <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, color: '#222', textAlign: 'center' }}>
        Đặt hàng thành công!
      </h2>
      <div style={{ color: '#666', fontSize: 16, marginBottom: 24, textAlign: 'center', maxWidth: 400 }}>
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng và giao đến bạn sớm nhất có thể.
      </div>
      <div style={{ color: '#888', fontSize: 14, marginBottom: 32, textAlign: 'center' }}>
        Bạn có thể theo dõi đơn hàng trong phần "Đơn hàng của tôi"
      </div>
      <div className="flex gap-4">
        <button
          style={{
            background: '#4fc3f7',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px 0 rgba(33,150,243,0.08)',
          }}
          onClick={() => navigate('/profile/order')}
        >
          Xem đơn hàng
        </button>
        <button
          style={{
            background: '#fff',
            color: '#4fc3f7',
            border: '2px solid #4fc3f7',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          Về Trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess; 