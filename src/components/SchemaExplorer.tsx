import React, { useState } from 'react';
import { Database, Table, Key, Link2, ChevronDown, ChevronRight } from 'lucide-react';
import { mockSchemas } from '@/data/mockData';
import { TableSchema } from '@/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SchemaExplorerProps {
  className?: string;
  collapsed?: boolean;
}

export const SchemaExplorer: React.FC<SchemaExplorerProps> = ({ className, collapsed }) => {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set(['users']));

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tableName)) {
        newSet.delete(tableName);
      } else {
        newSet.add(tableName);
      }
      return newSet;
    });
  };

  const getTypeColor = (type: string): string => {
    if (type.includes('uuid') || type.includes('id')) return 'text-sql-keyword';
    if (type.includes('varchar') || type.includes('text')) return 'text-sql-string';
    if (type.includes('int') || type.includes('decimal')) return 'text-sql-number';
    if (type.includes('timestamp') || type.includes('date')) return 'text-sql-table';
    return 'text-muted-foreground';
  };

  if (collapsed) {
    return (
      <div className={cn('space-y-2', className)}>
        {mockSchemas.map((table) => (
          <Tooltip key={table.name}>
            <TooltipTrigger asChild>
              <button className="w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors flex items-center justify-center">
                <Table className="w-4 h-4 text-sidebar-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="glass-panel">
              <div className="text-sm">
                <p className="font-medium text-foreground">{table.name}</p>
                <p className="text-muted-foreground text-xs">{table.columns.length} columns</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {mockSchemas.map((table: TableSchema) => (
        <div key={table.name} className="rounded-lg overflow-hidden">
          <button
            onClick={() => toggleTable(table.name)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            {expandedTables.has(table.name) ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <Table className="w-3.5 h-3.5 text-sql-table" />
            <span className="text-sidebar-foreground font-medium">{table.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {table.columns.length}
            </span>
          </button>

          {expandedTables.has(table.name) && (
            <div className="ml-4 pl-4 border-l border-sidebar-border space-y-0.5 py-1">
              {table.columns.map((column) => (
                <Tooltip key={column.name}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-sidebar-accent/50 transition-colors cursor-default">
                      {column.isPrimaryKey && (
                        <Key className="w-3 h-3 text-sql-number flex-shrink-0" />
                      )}
                      {column.isForeignKey && (
                        <Link2 className="w-3 h-3 text-sql-keyword flex-shrink-0" />
                      )}
                      {!column.isPrimaryKey && !column.isForeignKey && (
                        <span className="w-3" />
                      )}
                      <span className="text-sidebar-foreground truncate">{column.name}</span>
                      <span className={cn('ml-auto font-mono text-[10px]', getTypeColor(column.type))}>
                        {column.type}
                      </span>
                    </div>
                  </TooltipTrigger>
                  {column.isForeignKey && column.references && (
                    <TooltipContent side="right" className="glass-panel">
                      <div className="text-xs">
                        <span className="text-muted-foreground">References: </span>
                        <span className="text-sql-table font-mono">{column.references}</span>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
