import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }} className="flex flex-col items-center justify-center">
      <img
        src="/img/success.png"
        alt="success"
        style={{ width: 400, height: 400, objectFit: 'contain', display: 'block', margin: '0 auto 32px auto' }}
      />
      <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, color: '#222', textAlign: 'center' }}>Thanh toán thành công</h2>
      <div style={{ color: '#666', fontSize: 18, marginBottom: 32, textAlign: 'center' }}>
        Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn sẽ được giao đến sớm.
      </div>
      <button
        style={{
          background: '#4fc3f7',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '12px 32px',
          fontSize: 18,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px 0 rgba(33,150,243,0.08)',
        }}
        onClick={() => navigate('/')}
      >
        Về Trang chủ
      </button>
    </div>
  );
};

export default PaymentSuccess; 