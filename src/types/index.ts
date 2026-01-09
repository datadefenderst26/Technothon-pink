export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  data?: Record<string, unknown>[];
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
}

export interface ColumnSchema {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  query: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning';
}

export interface UserRole {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive';
}

export type DatabaseType = 'postgresql' | 'mysql' | 'sqlite' | 'mssql';
