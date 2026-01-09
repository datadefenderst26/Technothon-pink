import React from 'react';
import {
  MessageSquare,
  Database,
  Star,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SchemaExplorer } from '@/components/SchemaExplorer';
import { mockChatSessions } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed,
  onToggle,
  className,
}) => {
  const [schemaOpen, setSchemaOpen] = React.useState(true);
  const [historyOpen, setHistoryOpen] = React.useState(true);

  return (
    <div
      className={cn(
        'h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-72',
        className
      )}
    >
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border flex items-center gap-2">
        {!collapsed && (
          <>
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center glow-primary">
              <Database className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="font-semibold text-sidebar-foreground">NL2SQL</h1>
              <p className="text-xs text-muted-foreground">AI Query Assistant</p>
            </div>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          variant="default"
          className={cn('w-full justify-start gap-2', collapsed && 'justify-center px-0')}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span>New Chat</span>}
        </Button>
      </div>

      {/* Search (only when expanded) */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="pl-9 h-9 bg-sidebar-accent/50 border-sidebar-border focus:border-sidebar-ring"
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Chat History */}
          <Collapsible open={!collapsed && historyOpen} onOpenChange={setHistoryOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  'flex items-center gap-2 w-full text-left text-sm font-medium text-muted-foreground hover:text-sidebar-foreground transition-colors',
                  collapsed && 'justify-center'
                )}
              >
                <MessageSquare className="w-4 h-4" />
                {!collapsed && (
                  <>
                    <span className="flex-1">Chat History</span>
                    <ChevronRight
                      className={cn(
                        'w-4 h-4 transition-transform',
                        historyOpen && 'rotate-90'
                      )}
                    />
                  </>
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1">
              {mockChatSessions.map((session) => (
                <div
                  key={session.id}
                  className="group flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="flex-1 text-sm text-sidebar-foreground truncate">
                    {session.title}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-panel">
                      <DropdownMenuItem>
                        <Edit2 className="w-3.5 h-3.5 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Play className="w-3.5 h-3.5 mr-2" />
                        Re-run
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="w-3.5 h-3.5 mr-2" />
                        Favorite
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Favorites (collapsed shows icon only) */}
          {collapsed ? (
            <button className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors">
              <Star className="w-4 h-4" />
            </button>
          ) : (
            <div>
              <button className="flex items-center gap-2 w-full text-left text-sm font-medium text-muted-foreground hover:text-sidebar-foreground transition-colors mb-2">
                <Star className="w-4 h-4" />
                <span>Favorites</span>
              </button>
              <p className="text-xs text-muted-foreground pl-6">No favorites yet</p>
            </div>
          )}

          {/* Schema Browser */}
          <Collapsible open={!collapsed && schemaOpen} onOpenChange={setSchemaOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  'flex items-center gap-2 w-full text-left text-sm font-medium text-muted-foreground hover:text-sidebar-foreground transition-colors',
                  collapsed && 'justify-center'
                )}
              >
                <Database className="w-4 h-4" />
                {!collapsed && (
                  <>
                    <span className="flex-1">Database Schema</span>
                    <ChevronRight
                      className={cn(
                        'w-4 h-4 transition-transform',
                        schemaOpen && 'rotate-90'
                      )}
                    />
                  </>
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <SchemaExplorer collapsed={collapsed} />
            </CollapsibleContent>
          </Collapsible>

          {collapsed && <SchemaExplorer collapsed />}
        </div>
      </ScrollArea>
    </div>
  );
};
