// Generate random data for the dashboard
const indianCities = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Chandigarh', state: 'Punjab' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
  { city: 'Kochi', state: 'Kerala' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Nagpur', state: 'Maharashtra' }
];

const productCategories = [
  { name: 'Electronics', minPrice: 1000, maxPrice: 150000 },
  { name: 'Fashion', minPrice: 300, maxPrice: 15000 },
  { name: 'Home & Kitchen', minPrice: 500, maxPrice: 50000 },
  { name: 'Books', minPrice: 100, maxPrice: 2000 },
  { name: 'Beauty', minPrice: 200, maxPrice: 5000 },
  { name: 'Sports', minPrice: 500, maxPrice: 20000 },
  { name: 'Toys', minPrice: 300, maxPrice: 10000 },
  { name: 'Grocery', minPrice: 100, maxPrice: 5000 },
  { name: 'Automotive', minPrice: 1000, maxPrice: 100000 },
  { name: 'Health', minPrice: 200, maxPrice: 8000 }
];

const orderStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
const shipmentTypes = ['Standard', 'Express', 'Premium', 'Same Day'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateOrderId = () => {
  const prefix = Math.floor(Math.random() * 999) + 100;
  const suffix = Math.floor(Math.random() * 9999999) + 1000000;
  return `${prefix}-${suffix}`;
};

const generateRandomPrice = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateOrders = (count: number) => {
  const orders = [];
  const startDate = new Date(2024, 0, 1); // January 1, 2024
  const endDate = new Date();

  for (let i = 0; i < count; i++) {
    const location = indianCities[Math.floor(Math.random() * indianCities.length)];
    const category = productCategories[Math.floor(Math.random() * productCategories.length)];
    const orderDate = generateRandomDate(startDate, endDate);
    const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const amount = generateRandomPrice(category.minPrice, category.maxPrice);

    orders.push({
      orderId: generateOrderId(),
      date: orderDate.toLocaleDateString('en-IN'),
      customerName: `${location.city} Customer ${i + 1}`,
      location: location.city,
      state: location.state,
      amount,
      status,
      category: category.name,
      shipmentType: shipmentTypes[Math.floor(Math.random() * shipmentTypes.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)]
    });
  }

  return orders;
};

export const generateAnalytics = (orders: any[]) => {
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

  // Group by state
  const stateRevenue = orders.reduce((acc: any, order) => {
    if (!acc[order.state]) {
      acc[order.state] = {
        revenue: 0,
        orders: 0
      };
    }
    acc[order.state].revenue += order.amount;
    acc[order.state].orders += 1;
    return acc;
  }, {});

  // Group by category
  const categoryRevenue = orders.reduce((acc: any, order) => {
    if (!acc[order.category]) {
      acc[order.category] = {
        revenue: 0,
        orders: 0
      };
    }
    acc[order.category].revenue += order.amount;
    acc[order.category].orders += 1;
    return acc;
  }, {});

  // Group by status
  const orderStatus = orders.reduce((acc: any, order) => {
    if (!acc[order.status]) {
      acc[order.status] = 0;
    }
    acc[order.status] += 1;
    return acc;
  }, {});

  // Group by shipment type
  const shipmentTypes = orders.reduce((acc: any, order) => {
    if (!acc[order.shipmentType]) {
      acc[order.shipmentType] = 0;
    }
    acc[order.shipmentType] += 1;
    return acc;
  }, {});

  return {
    totalRevenue,
    stateRevenue,
    categoryRevenue,
    orderStatus,
    shipmentTypes,
    totalOrders: orders.length,
    averageOrderValue: totalRevenue / orders.length
  };
};

// Generate 2000 orders
export const sampleOrders = generateOrders(2000);
export const sampleAnalytics = generateAnalytics(sampleOrders);

// Export recent orders (last 10)
export const recentOrders = sampleOrders
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 10);

// Export top performing states
export const topStates = Object.entries(sampleAnalytics.stateRevenue)
  .map(([state, data]: [string, any]) => ({
    state,
    revenue: data.revenue,
    orders: data.orders
  }))
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);

// Export top categories
export const topCategories = Object.entries(sampleAnalytics.categoryRevenue)
  .map(([category, data]: [string, any]) => ({
    category,
    revenue: data.revenue,
    orders: data.orders
  }))
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);
