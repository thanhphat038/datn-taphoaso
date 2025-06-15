import React from 'react';

const AdminPage = () => {
  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-gray-600">Manage your users here.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <p className="text-gray-600">Manage your products here.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-gray-600">View and manage orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Sales Overview</h2>
          <p className="text-gray-600">Visualize sales data and trends.</p>
          {/* Placeholder for chart */}
          <div className="h-40 bg-gray-200 rounded mt-4"></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
          <p className="text-gray-600">Track recent admin actions and updates.</p>
          {/* Placeholder for activity feed */}
          <div className="h-40 bg-gray-200 rounded mt-4"></div>
        </div>
      </div>
    </main>
  );
};

export default AdminPage;
