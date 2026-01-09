import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: Record<string, unknown>[];
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export const DataTable: React.FC<DataTableProps> = ({ data, className }) => {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  if (!data || data.length === 0) {
    return (
      <div className={cn('glass-panel rounded-xl p-8 text-center', className)}>
        <p className="text-muted-foreground">No data to display</p>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3.5 h-3.5 text-primary" />;
    }
    return <ArrowDown className="w-3.5 h-3.5 text-primary" />;
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'number') {
      if (Number.isInteger(value)) return value.toLocaleString();
      return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return String(value);
  };

  const getCellColor = (value: unknown): string => {
    if (typeof value === 'number') {
      if (value < 0) return 'text-destructive';
      if (value > 0 && String(value).includes('.')) return 'text-sql-string';
    }
    return '';
  };

  return (
    <div className={cn('glass-panel rounded-xl overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-secondary/30">
        <span className="text-sm font-medium text-foreground">
          Query Results
          <span className="ml-2 text-muted-foreground">({data.length} rows)</span>
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="xs" className="text-muted-foreground hover:text-foreground">
            <Download className="w-3.5 h-3.5" />
            CSV
          </Button>
          <Button variant="ghost" size="xs" className="text-muted-foreground hover:text-foreground">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Sheets
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className="text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    {column}
                    {getSortIcon(column)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-border/30 hover:bg-secondary/30 transition-colors"
              >
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    className={cn('font-mono text-sm', getCellColor(row[column]))}
                  >
                    {formatValue(row[column])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
