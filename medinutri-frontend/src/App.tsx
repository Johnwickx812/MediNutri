import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Layout } from "@/components/layout/Layout";
import Home from "./pages/Home";
import Medications from "./pages/Medications";
import Diet from "./pages/Diet";
import Interactions from "./pages/Interactions";
import DrugSafety from "./pages/DrugSafety";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">MediNutri is loading...</p>
      </div>
    );
  }

  if (isAuthenticated && !user?.onboardingComplete && window.location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/interactions" element={<Interactions />} />
          <Route path="/drug-safety" element={<DrugSafety />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </AppProvider>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;


