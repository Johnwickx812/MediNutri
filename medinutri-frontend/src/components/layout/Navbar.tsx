import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  Home,
  Pill,
  UtensilsCrossed,
  AlertTriangle,
  Menu,
  Settings,
  Bot,
  ShieldCheck,
  ChevronDown,
  Shield,
  User,
  MessageSquare,
  UserCog
} from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group min-w-0">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center transition-transform group-hover:scale-105 shrink-0 rounded-lg md:rounded-xl overflow-hidden border border-primary/10 shadow-sm">
            <img src="/medinutri.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display text-lg md:text-xl font-bold text-foreground truncate tracking-tight">
              {t.common.appName}
            </span>
            <span className="text-[9px] md:text-[10px] text-muted-foreground -mt-1 truncate hidden xs:block font-medium">
              {t.common.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {/* Main Links */}
          <Link to="/">
            <Button variant={isActive("/") ? "default" : "ghost"} size="sm" className="gap-2 h-10 rounded-full px-4 font-bold">
              <Home className="h-4 w-4" />
              <span>{t.nav.home}</span>
            </Button>
          </Link>
          <Link to="/medications">
            <Button variant={isActive("/medications") ? "default" : "ghost"} size="sm" className="gap-2 h-10 rounded-full px-4 font-bold">
              <Pill className="h-4 w-4" />
              <span>{t.nav.medications}</span>
            </Button>
          </Link>
          <Link to="/diet">
            <Button variant={isActive("/diet") ? "default" : "ghost"} size="sm" className="gap-2 h-10 rounded-full px-4 font-bold">
              <UtensilsCrossed className="h-4 w-4" />
              <span>{t.nav.diet}</span>
            </Button>
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin">
              <Button variant={isActive("/admin") ? "default" : "ghost"} size="sm" className="gap-2 h-10 rounded-full px-4 font-bold bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white border border-indigo-500/20">
                <UserCog className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </Link>
          )}

          {/* Safety Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={(isActive("/interactions") || isActive("/drug-safety") || isActive("/ai-assistant")) ? "default" : "ghost"}
                size="sm"
                className="gap-2 h-10 rounded-full px-4 font-bold"
              >
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Safety</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2 bg-slate-900 border-white/10 text-white shadow-2xl backdrop-blur-xl">
              <Link to="/interactions">
                <DropdownMenuItem className="gap-3 p-3 rounded-xl focus:bg-primary/20 focus:text-white cursor-pointer transition-colors font-bold">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span>{t.nav.checkSafety}</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/drug-safety">
                <DropdownMenuItem className="gap-3 p-3 rounded-xl focus:bg-primary/20 focus:text-white cursor-pointer transition-colors font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>{t.nav.drugSafety}</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/ai-assistant">
                <DropdownMenuItem className="gap-3 p-3 rounded-xl focus:bg-primary/20 focus:text-white cursor-pointer transition-colors font-bold">
                  <Bot className="h-4 w-4 text-primary" />
                  <span>{t.nav.aiAssistant}</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings Page Link */}
          <Link to="/settings">
            <Button variant={isActive("/settings") ? "default" : "ghost"} size="sm" className="gap-2 h-10 rounded-full px-4 font-bold">
              <Settings className="h-4 w-4 text-slate-400" />
              <span>{t.settings.settings}</span>
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] p-0 border-l border-white/5 bg-slate-950">
            <div className="flex flex-col h-full">
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img src="/medinutri.png" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-tighter text-white">{t.common.appName}</span>
                    <span className="text-xs text-slate-400 font-bold">{t.common.tagline}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {[
                  { path: "/", label: t.nav.home, icon: Home },
                  ...(user?.role === 'admin' ? [{ path: "/admin", label: "Admin Dashboard", icon: UserCog }] : []),
                  { path: "/medications", label: t.nav.medications, icon: Pill },
                  { path: "/diet", label: t.nav.diet, icon: UtensilsCrossed },
                  { path: "/interactions", label: t.nav.checkSafety, icon: AlertTriangle },
                  { path: "/drug-safety", label: t.nav.drugSafety, icon: ShieldCheck },
                  { path: "/ai-assistant", label: t.nav.aiAssistant, icon: Bot },
                  { path: "/settings", label: t.settings.settings, icon: Settings },
                  { path: "/profile", label: t.auth.profile, icon: User },
                  { path: "/feedback", label: t.feedback.title, icon: MessageSquare },
                ].map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className="block"
                    >
                      <Button
                        variant={active ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-4 h-14 rounded-2xl text-base font-bold transition-all",
                          active ? "shadow-xl bg-primary" : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <Icon className={cn("h-5 w-5", active ? "text-white" : "text-primary")} />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}