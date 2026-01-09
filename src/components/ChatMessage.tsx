import React from 'react';
import { Bot, User, RefreshCw, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SQLDisplay } from '@/components/SQLDisplay';
import { DataTable } from '@/components/DataTable';
import { ChartWidget } from '@/components/ChartWidget';
import { ChatMessage as ChatMessageType } from '@/types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  onRefine?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRefine }) => {
  const isUser = message.role === 'user';

  if (message.isLoading) {
    return (
      <div className="flex gap-3 animate-fade-in">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="chat-bubble-ai p-4 inline-block">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Analyzing your query...</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-48 shimmer rounded" />
            <div className="h-32 w-full shimmer rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex gap-3 justify-end animate-slide-up">
        <div className="max-w-[80%]">
          <div className="chat-bubble-user px-4 py-3">
            <p className="text-sm">{message.content}</p>
          </div>
          <div className="text-xs text-muted-foreground text-right mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 space-y-4 max-w-[90%]">
        <div className="chat-bubble-ai px-4 py-3 inline-block">
          <p className="text-sm">{message.content}</p>
        </div>

        {message.sql && (
          <SQLDisplay sql={message.sql} showOptimizationHint />
        )}

        {message.data && message.data.length > 0 && (
          <>
            <DataTable data={message.data} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartWidget
                type="bar"
                data={message.data}
                title="Category Distribution"
              />
              <ChartWidget
                type="line"
                data={message.data}
                title="Trend Analysis"
              />
            </div>
          </>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={onRefine}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refine Query
          </Button>
          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-sql-string"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
