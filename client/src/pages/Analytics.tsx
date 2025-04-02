import React from 'react';
import { sampleAnalytics, topStates, topCategories } from '../utils/sampleData';

interface OrderStatus {
  [key: string]: number;
}

interface ShipmentTypes {
  [key: string]: number;
}

const Analytics: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500';
      case 'Shipped': return 'bg-blue-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const orderStatus: OrderStatus = sampleAnalytics.orderStatus as OrderStatus;
  const shipmentTypes: ShipmentTypes = sampleAnalytics.shipmentTypes as ShipmentTypes;

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Analytics Overview
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Detailed insights into your business performance
          </p>
        </div>

        {/* Revenue by State */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue by State</h2>
          <div className="space-y-4">
            {topStates.map((state) => {
              const percentage = (state.revenue / sampleAnalytics.totalRevenue) * 100;
              return (
                <div key={state.state} className="relative">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{state.state}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(state.revenue)}</span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="absolute right-0 -top-6 text-sm text-gray-600">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Order Status Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status Distribution</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(orderStatus).map(([status, count]) => (
                <div key={status} className="bg-gray-50 rounded-lg p-4">
                  <div className={`w-12 h-12 ${getStatusColor(status)} rounded-lg flex items-center justify-center mb-3`}>
                    <span className="text-white text-lg font-bold">
                      {((count / sampleAnalytics.totalOrders) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{status}</h3>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Performance</h2>
            <div className="space-y-4">
              {topCategories.map((category) => {
                const percentage = (category.revenue / sampleAnalytics.totalRevenue) * 100;
                return (
                  <div key={category.category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{category.category}</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(category.revenue)}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Shipment Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipment Types</h2>
            <div className="space-y-4">
              {Object.entries(shipmentTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{type}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{count} orders</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Average Values</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(sampleAnalytics.averageOrderValue)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Daily Order Average</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(sampleAnalytics.totalOrders / 30)} orders
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Success Metrics</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600">Delivery Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {((orderStatus.Delivered / sampleAnalytics.totalOrders) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cancellation Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {((orderStatus.Cancelled / sampleAnalytics.totalOrders) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
