import { ChatSession, TableSchema, AuditLog, UserRole } from '@/types';

export const mockSchemas: TableSchema[] = [
  {
    name: 'users',
    columns: [
      { name: 'id', type: 'uuid', isPrimaryKey: true },
      { name: 'email', type: 'varchar(255)' },
      { name: 'name', type: 'varchar(100)' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'role_id', type: 'uuid', isForeignKey: true, references: 'roles.id' },
    ],
  },
  {
    name: 'orders',
    columns: [
      { name: 'id', type: 'uuid', isPrimaryKey: true },
      { name: 'user_id', type: 'uuid', isForeignKey: true, references: 'users.id' },
      { name: 'total', type: 'decimal(10,2)' },
      { name: 'status', type: 'varchar(50)' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'products',
    columns: [
      { name: 'id', type: 'uuid', isPrimaryKey: true },
      { name: 'name', type: 'varchar(255)' },
      { name: 'price', type: 'decimal(10,2)' },
      { name: 'category', type: 'varchar(100)' },
      { name: 'stock', type: 'integer' },
    ],
  },
  {
    name: 'roles',
    columns: [
      { name: 'id', type: 'uuid', isPrimaryKey: true },
      { name: 'name', type: 'varchar(50)' },
      { name: 'permissions', type: 'jsonb' },
    ],
  },
];

export const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Sales Analysis Q4',
    messages: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'User Growth Report',
    messages: [],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    title: 'Product Inventory Check',
    messages: [],
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    user: 'john.doe@company.com',
    action: 'SELECT',
    query: 'SELECT * FROM users WHERE role = "admin"',
    timestamp: new Date('2024-01-15T10:30:00'),
    status: 'success',
  },
  {
    id: '2',
    user: 'jane.smith@company.com',
    action: 'UPDATE',
    query: 'UPDATE products SET stock = stock - 5 WHERE id = "abc123"',
    timestamp: new Date('2024-01-15T09:45:00'),
    status: 'warning',
  },
  {
    id: '3',
    user: 'admin@company.com',
    action: 'DELETE',
    query: 'DELETE FROM orders WHERE status = "cancelled"',
    timestamp: new Date('2024-01-15T08:15:00'),
    status: 'success',
  },
];

export const mockUsers: UserRole[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@company.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@company.com', role: 'user', status: 'active' },
  { id: '3', name: 'Bob Wilson', email: 'bob.wilson@company.com', role: 'viewer', status: 'inactive' },
];

export const mockQueryResults = [
  { id: 1, name: 'Electronics', revenue: 125000, orders: 450, growth: 12.5 },
  { id: 2, name: 'Clothing', revenue: 89000, orders: 320, growth: 8.3 },
  { id: 3, name: 'Home & Garden', revenue: 67000, orders: 180, growth: -2.1 },
  { id: 4, name: 'Sports', revenue: 45000, orders: 150, growth: 15.7 },
  { id: 5, name: 'Books', revenue: 23000, orders: 280, growth: 5.2 },
];

export const mockChartData = [
  { month: 'Jan', revenue: 45000, orders: 120 },
  { month: 'Feb', revenue: 52000, orders: 145 },
  { month: 'Mar', revenue: 48000, orders: 132 },
  { month: 'Apr', revenue: 61000, orders: 178 },
  { month: 'May', revenue: 55000, orders: 156 },
  { month: 'Jun', revenue: 67000, orders: 189 },
];

export const suggestedQueries = [
  'Show me total sales by category for this month',
  'Which products have low stock (< 10 units)?',
  'List top 10 customers by order value',
  'What is the average order value by region?',
  'Show monthly revenue trend for 2024',
  'Find all orders pending shipment',
];

export const mockSQLExamples = {
  select: `SELECT 
  p.category,
  COUNT(o.id) AS total_orders,
  SUM(o.total) AS revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at >= '2024-01-01'
GROUP BY p.category
ORDER BY revenue DESC;`,
  update: `UPDATE products
SET stock = stock - 1,
    updated_at = NOW()
WHERE id = 'prod_123'
  AND stock > 0;`,
  delete: `DELETE FROM orders
WHERE status = 'cancelled'
  AND created_at < '2024-01-01';`,
};
