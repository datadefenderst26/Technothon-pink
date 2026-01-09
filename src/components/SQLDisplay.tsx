import React from 'react';
import { Copy, Check, Lightbulb, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SQLDisplayProps {
  sql: string;
  showOptimizationHint?: boolean;
  className?: string;
}

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
  'ON', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL',
  'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT',
  'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'INDEX', 'VIEW', 'UNION', 'ALL', 'EXISTS', 'DESC', 'ASC',
  'NOW', 'COALESCE', 'CAST', 'EXTRACT', 'DATE', 'TIMESTAMP', 'TRUE', 'FALSE'
];

const highlightSQL = (sql: string): React.ReactNode[] => {
  const lines = sql.split('\n');
  
  return lines.map((line, lineIndex) => {
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let tokenIndex = 0;
    
    while (remaining.length > 0) {
      // Check for comments
      if (remaining.startsWith('--')) {
        tokens.push(
          <span key={`${lineIndex}-${tokenIndex++}`} className="sql-comment">
            {remaining}
          </span>
        );
        remaining = '';
        continue;
      }
      
      // Check for strings (single quotes)
      const stringMatch = remaining.match(/^'[^']*'/);
      if (stringMatch) {
        tokens.push(
          <span key={`${lineIndex}-${tokenIndex++}`} className="sql-string">
            {stringMatch[0]}
          </span>
        );
        remaining = remaining.slice(stringMatch[0].length);
        continue;
      }
      
      // Check for numbers
      const numberMatch = remaining.match(/^\d+(\.\d+)?/);
      if (numberMatch) {
        tokens.push(
          <span key={`${lineIndex}-${tokenIndex++}`} className="sql-number">
            {numberMatch[0]}
          </span>
        );
        remaining = remaining.slice(numberMatch[0].length);
        continue;
      }
      
      // Check for keywords
      const keywordMatch = SQL_KEYWORDS.find(kw => {
        const regex = new RegExp(`^${kw}(?![a-zA-Z_])`, 'i');
        return regex.test(remaining);
      });
      
      if (keywordMatch) {
        const actualKeyword = remaining.slice(0, keywordMatch.length);
        tokens.push(
          <span key={`${lineIndex}-${tokenIndex++}`} className="sql-keyword">
            {actualKeyword}
          </span>
        );
        remaining = remaining.slice(keywordMatch.length);
        continue;
      }
      
      // Check for operators and symbols
      const operatorMatch = remaining.match(/^(>=|<=|<>|!=|[+\-*/%=<>(),;.])/);
      if (operatorMatch) {
        tokens.push(
          <span key={`${lineIndex}-${tokenIndex++}`} className="sql-operator">
            {operatorMatch[0]}
          </span>
        );
        remaining = remaining.slice(operatorMatch[0].length);
        continue;
      }
      
      // Check for identifiers (table/column names)
      const identifierMatch = remaining.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
      if (identifierMatch) {
        tokens.push(
          <span key={`${lineIndex}-${tokenIndex++}`} className="sql-table">
            {identifierMatch[0]}
          </span>
        );
        remaining = remaining.slice(identifierMatch[0].length);
        continue;
      }
      
      // Handle whitespace and other characters
      tokens.push(
        <span key={`${lineIndex}-${tokenIndex++}`}>{remaining[0]}</span>
      );
      remaining = remaining.slice(1);
    }
    
    return (
      <div key={lineIndex} className="leading-relaxed">
        {tokens}
      </div>
    );
  });
};

export const SQLDisplay: React.FC<SQLDisplayProps> = ({
  sql,
  showOptimizationHint = false,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('glass-panel rounded-xl overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Generated SQL</span>
        </div>
        <div className="flex items-center gap-2">
          {showOptimizationHint && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-sql-string/10 border border-sql-string/20">
              <Lightbulb className="w-3 h-3 text-sql-string" />
              <span className="text-xs text-sql-string font-medium">Optimized</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono scrollbar-thin">
        <code>{highlightSQL(sql)}</code>
      </pre>
    </div>
  );
};
