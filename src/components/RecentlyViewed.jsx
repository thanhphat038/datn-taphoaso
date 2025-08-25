import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getRecentViews } from '../service/RecentViews.service.js';
import Product from './Product';

const RecentlyViewed = ({ limit = 10, excludeId, title = 'Đã xem gần đây', className = '' }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      if (!isAuthenticated) {
        setItems([]);
        return;
      }
      try {
        const res = await getRecentViews(limit);
        const list = Array.isArray(res.data) ? res.data : [];
        const mapped = list
          .map(entry => entry?.product_id)
          .filter(Boolean)
          .filter(p => (excludeId ? p._id !== excludeId : true));
        setItems(mapped);
      } catch (e) {
        console.error('Error fetching recent views:', e);
        setItems([]);
      }
    };
    fetchRecent();
  }, [isAuthenticated, excludeId, limit]);

  if (!isAuthenticated || items.length === 0) return null;

  return (
    <section className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 ${className}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-green-500 rounded-full"></div>
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
        {items.slice(0, limit).map((product, idx) => (
          <Product key={product._id || idx} data={product} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;


