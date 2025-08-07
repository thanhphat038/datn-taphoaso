import React from 'react';

const Notification = ({ notification, setNotification }) => {
    if (!notification.show) return null;

    return (
        <div className={`fixed top-20 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
            notification.type === 'success' ? 'border-green-500' : 'border-red-500'
        } transform transition-all duration-300 ease-in-out`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {notification.type === 'success' ? (
                            <svg key="success-icon" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg key="error-icon" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className={`text-sm font-medium ${
                            notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                        }`}>
                            {notification.message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className={`inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150`}
                            onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                        >
                            <svg key="close-icon" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;