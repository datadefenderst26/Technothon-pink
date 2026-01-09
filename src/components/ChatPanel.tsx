import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatMessage as ChatMessageType } from '@/types';
import { suggestedQueries, mockSQLExamples, mockQueryResults } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  className?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ className }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateResponse = (query: string): ChatMessageType => {
    const responseContent = query.toLowerCase().includes('delete') || query.toLowerCase().includes('update')
      ? "I've analyzed your request. This is a destructive operation that will modify data. Please review the SQL carefully before execution."
      : "Based on your query, I've generated the SQL and retrieved the results. The data shows category performance with revenue and order metrics.";

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: responseContent,
      sql: mockSQLExamples.select,
      data: mockQueryResults,
      timestamp: new Date(),
    };
  };

  const handleSubmit = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add loading message
    const loadingMessage: ChatMessageType = {
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Replace loading with response
    const response = simulateResponse(query);
    setMessages((prev) => prev.filter((m) => m.id !== 'loading').concat(response));
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(input);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(suggestion);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 glow-primary">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Ask anything about your data
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              I'll convert your questions into SQL queries and visualize the results.
              Start with a question or try one of these suggestions.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
              {suggestedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(query)}
                  className="px-4 py-2 rounded-full text-sm bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50 transition-all duration-200 hover:border-primary/30"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onRefine={() => setInput(`Refine: ${message.content}`)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-card/50">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your data..."
              className="min-h-[48px] max-h-[200px] pr-24 resize-none bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl"
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8"
                onClick={() => handleSubmit(input)}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};
