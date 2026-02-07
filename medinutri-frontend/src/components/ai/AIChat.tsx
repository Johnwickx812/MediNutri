/**
 * AIChat Component
 * 
 * Main chat interface for the MediNutri AI Assistant.
 * Features streaming responses, markdown rendering, and suggested prompts.
 */

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAIChat, ChatMessage } from "@/hooks/useAIChat";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

// Suggested prompts for users
const getSuggestedPrompts = (t: any, hasMedications: boolean) => [
  hasMedications 
    ? t.ai.suggestDietPlan
    : t.ai.whatFoodsAvoid,
  t.ai.checkFoodSafe,
  t.ai.breakfastSuggestion,
  t.ai.explainInteraction,
];

export function AIChat() {
  const { t } = useLanguage();
  const { userMedications } = useApp();
  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle send message
  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  // Handle suggested prompt click
  const handleSuggestedPrompt = (prompt: string) => {
    if (!isLoading) {
      sendMessage(prompt);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = getSuggestedPrompts(t, userMedications.length > 0);

  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh]">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{t.ai.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{t.ai.subtitle}</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {t.ai.clearChat}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            // Welcome state
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t.ai.welcomeTitle}</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  {t.ai.welcomeDescription}
                </p>
              </div>
              
              {/* Context badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">
                  {userMedications.length} {t.ai.medicationsTracked}
                </Badge>
              </div>
              
              {/* Suggested prompts */}
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {suggestedPrompts.map((prompt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            // Chat messages
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {/* Loading indicator */}
              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                  </div>
                  <span className="text-sm">{t.ai.thinking}</span>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Error display */}
        {error && (
          <Alert variant="destructive" className="mx-4 mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Input area */}
        <div className="flex-shrink-0 p-4 border-t bg-muted/30">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.ai.inputPlaceholder}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {t.ai.disclaimer}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Message bubble component
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  
  return (
    <div className={cn(
      "flex gap-3",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn(
        "flex-1 max-w-[80%] rounded-lg px-4 py-2",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        {/* Render message content with basic markdown support */}
        <div className={cn(
          "prose prose-sm max-w-none",
          isUser && "prose-invert"
        )}>
          <MessageContent content={message.content} isUser={isUser} />
        </div>
      </div>
    </div>
  );
}

// Simple markdown-like content renderer
function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  if (!content) return null;
  
  // Split by lines and render
  const lines = content.split("\n");
  
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Bold text (**text**)
        const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Headers (## or ###)
        if (line.startsWith("### ")) {
          return (
            <h4 key={i} className="font-semibold text-sm mt-2">
              {line.replace("### ", "")}
            </h4>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="font-bold mt-2">
              {line.replace("## ", "")}
            </h3>
          );
        }
        
        // Bullet points
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span>•</span>
              <span dangerouslySetInnerHTML={{ __html: boldParsed.slice(2) }} />
            </div>
          );
        }
        
        // Empty lines
        if (line.trim() === "") {
          return <div key={i} className="h-2" />;
        }
        
        // Regular text
        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: boldParsed }} />
        );
      })}
    </div>
  );
}
