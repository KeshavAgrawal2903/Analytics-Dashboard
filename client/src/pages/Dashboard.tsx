import React from 'react';
import { useAuthStore } from '../store/authStore';
import { sampleAnalytics, recentOrders, topStates, topCategories } from '../utils/sampleData';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back, {user?.fullName || 'User'}! Here's your latest sales overview
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 overflow-hidden shadow-lg rounded-lg text-white">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-indigo-100 truncate">Total Revenue</dt>
                    <dd className="text-2xl font-semibold">{formatCurrency(sampleAnalytics.totalRevenue)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 overflow-hidden shadow-lg rounded-lg text-white">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-purple-100 truncate">Total Orders</dt>
                    <dd className="text-2xl font-semibold">{sampleAnalytics.totalOrders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-purple-600 overflow-hidden shadow-lg rounded-lg text-white">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-pink-100 truncate">Avg. Order Value</dt>
                    <dd className="text-2xl font-semibold">{formatCurrency(sampleAnalytics.averageOrderValue)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden shadow-lg rounded-lg text-white">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-100 truncate">Success Rate</dt>
                    <dd className="text-2xl font-semibold">
                      {((sampleAnalytics.orderStatus.Delivered / sampleAnalytics.totalOrders) * 100).toFixed(1)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3 mb-8">
          {/* Top States */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing States</h3>
              <div className="space-y-4">
                {topStates.map((state, index) => (
                  <div key={state.state} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-400 w-8">{index + 1}</span>
                      <span className="text-sm font-medium text-gray-900">{state.state}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(state.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-400 w-8">{index + 1}</span>
                      <span className="text-sm font-medium text-gray-900">{category.category}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(category.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.orderId} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
                      <div className="text-xs text-gray-500">{order.location}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(order.amount)}</div>
                      <div className={`text-xs ${
                        order.status === 'Delivered' ? 'text-green-600' :
                        order.status === 'Shipped' ? 'text-blue-600' :
                        order.status === 'Cancelled' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
