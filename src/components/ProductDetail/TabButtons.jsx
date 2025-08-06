import React from 'react';

const TabButtons = ({ activeTab, setActiveTab, reviewsCount }) => {
    return (
        <div className="flex border-b border-gray-200 mb-6">
            <button
                onClick={() => setActiveTab('comments')}
                className={`px-6 py-3 font-semibold text-base border-b-2 transition-colors ${
                    activeTab === 'comments'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                💬 Bình luận
            </button>
            <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-semibold text-base border-b-2 transition-colors ${
                    activeTab === 'reviews'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                ⭐ Đánh giá ({reviewsCount})
            </button>
        </div>
    );
};

export default TabButtons;