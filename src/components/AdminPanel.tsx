import React from 'react';
import { Clock, User, AlertCircle, CheckCircle, AlertTriangle, Shield, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockAuditLogs, mockUsers } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface AdminPanelProps {
  className?: string;
}

const statusIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const statusColors = {
  success: 'text-sql-string',
  warning: 'text-sql-number',
  error: 'text-destructive',
};

const roleColors = {
  admin: 'bg-primary/20 text-primary border-primary/30',
  user: 'bg-sql-table/20 text-sql-table border-sql-table/30',
  viewer: 'bg-muted text-muted-foreground border-border',
};

const databaseIcons = [
  { name: 'PostgreSQL', connected: true },
  { name: 'MySQL', connected: true },
  { name: 'SQLite', connected: false },
  { name: 'MS SQL', connected: false },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ className }) => {
  return (
    <div className={cn('glass-panel rounded-xl overflow-hidden', className)}>
      <Tabs defaultValue="audit" className="h-full flex flex-col">
        <div className="border-b border-border/50 bg-secondary/30 px-4">
          <TabsList className="bg-transparent h-12">
            <TabsTrigger
              value="audit"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Clock className="w-4 h-4 mr-2" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <User className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="databases"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Settings className="w-4 h-4 mr-2" />
              Databases
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="audit" className="flex-1 p-4 m-0 overflow-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Action</TableHead>
                <TableHead className="text-muted-foreground">Query</TableHead>
                <TableHead className="text-muted-foreground">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAuditLogs.map((log) => {
                const StatusIcon = statusIcons[log.status];
                return (
                  <TableRow key={log.id} className="border-border/30 hover:bg-secondary/30">
                    <TableCell>
                      <StatusIcon className={cn('w-4 h-4', statusColors[log.status])} />
                    </TableCell>
                    <TableCell className="font-medium text-foreground text-sm">
                      {log.user}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate font-mono text-xs text-muted-foreground">
                      {log.query}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {log.timestamp.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="users" className="flex-1 p-4 m-0 overflow-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Role</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id} className="border-border/30 hover:bg-secondary/30">
                  <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('capitalize', roleColors[user.role])}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          user.status === 'active' ? 'bg-sql-string' : 'bg-muted-foreground'
                        )}
                      />
                      <span className="text-sm text-muted-foreground capitalize">
                        {user.status}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="databases" className="flex-1 p-4 m-0">
          <div className="grid grid-cols-2 gap-4">
            {databaseIcons.map((db) => (
              <div
                key={db.name}
                className={cn(
                  'p-4 rounded-lg border transition-colors',
                  db.connected
                    ? 'bg-sql-string/5 border-sql-string/30'
                    : 'bg-secondary/50 border-border/50'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{db.name}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      db.connected
                        ? 'bg-sql-string/10 text-sql-string border-sql-string/30'
                        : 'bg-muted text-muted-foreground border-border'
                    )}
                  >
                    {db.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
