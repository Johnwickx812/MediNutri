/**
 * useAIChat Hook
 * 
 * Custom hook for managing AI chat state and streaming responses.
 * Handles conversation history, streaming tokens, and error states.
 */

import { useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { indianFoods } from "@/data/foods";
import { getInteractionsForMedications } from "@/data/interactions";

// Message type for chat history
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// User profile for AI context
export interface UserProfile {
  age?: number;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  bmi?: number;
  activity_level?: string;
  diet_type?: string;
  medical_conditions?: string[];
  allergies?: string[];
  primary_goal?: string;
}

// Edge function URL
const CHAT_URL = "http://localhost:8000/api/ai/chat";

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get app context for medications and meals
  const { userMedications, getTodaysMeals, getTodaysCalories, getTodaysProtein } = useApp();
  
  // User profile state (stored locally for now)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("medinutri_user_profile");
    return saved ? JSON.parse(saved) : {};
  });

  // Update user profile
  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...profile };
      localStorage.setItem("medinutri_user_profile", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Build context object for AI
  const buildUserContext = useCallback(() => {
    const medicationNames = userMedications.map(m => m.name);
    const knownInteractions = getInteractionsForMedications(medicationNames);
    const todaysMeals = getTodaysMeals();
    
    return {
      profile: userProfile,
      medications: userMedications,
      todaysMeals,
      totalCalories: getTodaysCalories(),
      totalProtein: getTodaysProtein(),
      knownInteractions,
      availableFoods: indianFoods,
    };
  }, [userMedications, getTodaysMeals, getTodaysCalories, getTodaysProtein, userProfile]);

  // Send message and stream response
  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim()) return;
    
    setError(null);
    
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    let assistantContent = "";
    
    try {
      // Prepare messages for API (without id and timestamp)
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          userContext: buildUserContext(),
        }),
      });
      
      // Handle error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error("No response body");
      }
      
      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      
      // Create assistant message placeholder
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      }]);
      
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });
        
        // Process line-by-line as data arrives
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              // Update the assistant message with accumulated content
              setMessages(prev => 
                prev.map(m => 
                  m.id === assistantId 
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch {
            // Incomplete JSON, put it back
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
      
      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch { /* ignore */ }
        }
      }
      
    } catch (err) {
      console.error("AI Chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to get response");
      // Remove empty assistant message on error
      setMessages(prev => prev.filter(m => m.content !== ""));
    } finally {
      setIsLoading(false);
    }
  }, [messages, buildUserContext]);

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    userProfile,
    updateProfile,
  };
}
