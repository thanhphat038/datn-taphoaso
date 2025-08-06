import React from 'react';
import { Link } from 'react-router-dom';

const CommentSection = ({
    comments,
    loadingComments,
    newComment,
    setNewComment,
    postingComment,
    handlePostComment,
    replyingTo,
    replyText,
    setReplyText,
    postingReply,
    handleReply,
    handleCancelReply,
    handlePostReply,
    showAllComments,
    setShowAllComments,
    expandedReplies,
    toggleReplies,
    isRepliesExpanded,
    getUserId,
    COMMENTS_TO_SHOW
}) => {
    const displayedComments = showAllComments ? comments : comments.slice(0, COMMENTS_TO_SHOW);

    return (
        <div className="space-y-6">
            {/* Comment input box */}
            {getUserId() ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">💭 Viết bình luận của bạn</h3>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                        className="w-full border border-gray-300 rounded-lg p-4 text-[16px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handlePostComment}
                            disabled={!newComment.trim() || postingComment}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <svg key="main-send-icon" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                            <span key="main-send-text">{postingComment ? 'Đang gửi...' : 'Gửi bình luận'}</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg key="comment-section-icon" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Đăng nhập để bình luận</h3>
                    <p className="text-gray-600 mb-6 text-lg">Bạn cần đăng nhập để có thể gửi bình luận về sản phẩm này.</p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-lg"
                    >
                        <svg key="login-icon" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Đăng nhập ngay
                    </Link>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {loadingComments ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600 text-lg">Đang tải bình luận...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có bình luận nào</h3>
                        <p className="text-gray-600 text-lg">Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này!</p>
                    </div>
                ) : (
                    displayedComments && Array.isArray(displayedComments) && displayedComments.map((comment) => (
                        <div key={`comment-${comment._id}-${comment.replies?.length || 0}`} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            {/* User info */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden shadow-md">
                                    {comment.user_id?.avatar ? (
                                        <img
                                            src={comment.user_id.avatar}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg key={`comment-avatar-${comment._id}`} className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-lg text-gray-800">
                                        {comment.user_id?.full_name || comment.user_id?.username || 'Người dùng'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {comment.create_at ?
                                            new Date(comment.create_at).toLocaleString('vi-VN', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) :
                                            'Vừa xong'
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* Comment content */}
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 ml-16 mb-4 border-l-4 border-blue-200">
                                <p className="text-gray-800 text-lg leading-relaxed">{comment.comment || 'Nội dung bình luận'}</p>
                            </div>
                            {/* Actions */}
                            <div className="flex items-center gap-6 ml-16">
                                <button
                                    onClick={() => handleReply(comment._id, comment.user_id?.full_name || comment.user_id?.username || 'Người dùng')}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    <svg key="reply-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                                    </svg>
                                    Trả lời
                                </button>
                            </div>

                            {/* Reply Form */}
                            {replyingTo && replyingTo.id === comment._id && (
                                <div className="ml-12 mt-3 border-l-2 border-blue-200 pl-4">
                                    <div className="bg-white rounded-lg border border-blue-200 p-3">
                                        <div className="text-sm text-gray-600 mb-2">
                                            Trả lời <span className="font-medium text-blue-600">@{replyingTo.userName}</span>
                                        </div>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Viết trả lời của bạn..."
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            rows="2"
                                        />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                onClick={handleCancelReply}
                                                className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={handlePostReply}
                                                disabled={!replyText.trim() || postingReply}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                                            >
                                                {postingReply ? (
                                                    <>
                                                        <div key="loading-spinner" className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span key="loading-text">Đang gửi...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg key="send-icon" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                                        </svg>
                                                        <span key="send-text">Gửi</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Replies List */}
                            {comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0 ? (
                                <div className="ml-12 mt-3">
                                    {/* Hiển thị 1 reply đầu tiên nếu chưa mở rộng */}
                                    {!isRepliesExpanded(comment._id) && comment.replies.length > 1 ? (
                                        <>
                                            {/* Hiển thị 1 reply đầu tiên */}
                                            <div className="space-y-3">
                                                {comment.replies.slice(0, 1).map((reply, replyIndex) => (
                                                    <div key={reply._id || replyIndex} className="border-l-2 border-gray-200 pl-4">
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                                    {reply.user_id?.avatar ? (
                                                                        <img
                                                                            src={reply.user_id.avatar}
                                                                            alt="Avatar"
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <svg key={`avatar-icon-${reply._id || replyIndex}`} className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <span className="font-medium text-sm">
                                                                    {reply.user_id?.full_name || reply.user_id?.username || 'Người dùng'}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {reply.create_at ?
                                                                        new Date(reply.create_at).toLocaleString('vi-VN', {
                                                                            year: 'numeric',
                                                                            month: '2-digit',
                                                                            day: '2-digit',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        }) :
                                                                        'Vừa xong'
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-800 ml-8">
                                                                {reply.reply || 'Nội dung trả lời'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Nút "Xem thêm replies" */}
                                            <div className="mt-2">
                                                <button
                                                    onClick={() => toggleReplies(comment._id)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                    Xem thêm {comment.replies.length - 1} trả lời
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Hiển thị tất cả replies khi đã mở rộng hoặc chỉ có 1 reply */}
                                            <div className="space-y-3">
                                                {comment.replies.map((reply, replyIndex) => (
                                                    <div key={reply._id || replyIndex} className="border-l-2 border-gray-200 pl-4">
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                                    {reply.user_id?.avatar ? (
                                                                        <img
                                                                            src={reply.user_id.avatar}
                                                                            alt="Avatar"
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <svg key={`avatar-icon-${reply._id || replyIndex}`} className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <span className="font-medium text-sm">
                                                                    {reply.user_id?.full_name || reply.user_id?.username || 'Người dùng'}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {reply.create_at ?
                                                                        new Date(reply.create_at).toLocaleString('vi-VN', {
                                                                            year: 'numeric',
                                                                            month: '2-digit',
                                                                            day: '2-digit',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        }) :
                                                                        'Vừa xong'
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-800 ml-8">
                                                                {reply.reply || 'Nội dung trả lời'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Nút "Thu gọn" nếu đã mở rộng và có nhiều hơn 1 reply */}
                                            {isRepliesExpanded(comment._id) && comment.replies.length > 1 && (
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => toggleReplies(comment._id)}
                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                        Thu gọn
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ) : comment.replies === undefined ? (
                                <div className="ml-12 mt-3 text-center text-gray-500 text-sm">
                                    Đang tải trả lời...
                                </div>
                            ) : null}
                        </div>
                    ))
                )}

                {comments.length > COMMENTS_TO_SHOW && (
                    <div className="text-center pt-4">
                        <button
                            onClick={() => setShowAllComments(!showAllComments)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {showAllComments ? 'Thu gọn' : `Xem thêm ${comments.length - COMMENTS_TO_SHOW} bình luận`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;