import React from 'react';
import { Shield, User, Bell, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface HeaderProps {
  role: 'admin' | 'user';
  onRoleChange: (role: 'admin' | 'user') => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ role, onRoleChange, className }) => {
  return (
    <header
      className={cn(
        'h-14 border-b border-border/50 bg-card/50 backdrop-blur-lg flex items-center justify-between px-4',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">Conversational Dashboard</h2>
        <Badge
          variant="outline"
          className={cn(
            'text-xs',
            role === 'admin'
              ? 'bg-primary/10 text-primary border-primary/30'
              : 'bg-sql-table/10 text-sql-table border-sql-table/30'
          )}
        >
          <Shield className="w-3 h-3 mr-1" />
          {role === 'admin' ? 'Admin' : 'User'} Mode
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        {/* Role Toggle */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50">
          <span className={cn('text-xs', role === 'user' ? 'text-foreground' : 'text-muted-foreground')}>
            User
          </span>
          <Switch
            checked={role === 'admin'}
            onCheckedChange={(checked) => onRoleChange(checked ? 'admin' : 'user')}
            className="data-[state=checked]:bg-primary"
          />
          <span className={cn('text-xs', role === 'admin' ? 'text-foreground' : 'text-muted-foreground')}>
            Admin
          </span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-panel w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">john.doe@company.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>API Keys</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
