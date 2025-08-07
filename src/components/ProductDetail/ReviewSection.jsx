import React from 'react';

const ReviewSection = ({ reviews, reviewsLoading }) => {
    return (
        <div className="space-y-6">
            {/* Reviews List */}
            <div className="space-y-6">
                {reviewsLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600 text-lg">Đang tải đánh giá...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có đánh giá nào</h3>
                        <p className="text-gray-600 text-lg">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            {/* User info */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center overflow-hidden shadow-md">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-lg text-gray-800">{review.user_id?.email || 'Người dùng'}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {/* Rating stars */}
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={`star-${review._id}-${i}`}
                                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="text-sm font-medium text-gray-600 ml-2">{review.rating}/5</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(review.create_at).toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                            {/* Review content */}
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-400">
                                <p className="text-gray-800 text-lg leading-relaxed">{review.user_review || 'Không có nội dung đánh giá.'}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;