import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { SupportedLanguage } from "@/i18n/translations";
import { Settings as SettingsIcon, Globe, Moon, Sun, LogOut, User, Palette, MessageSquare, ArrowRight, Pill, BellRing } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Settings() {
  const { language, setLanguage, t, languageNames } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const {
    reminderSettings,
    setRemindersEnabled,
    notificationPermission,
    requestNotificationPermission
  } = useApp();

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
  };

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden px-4 md:px-0 pb-20">
      {/* Background Decorative Mesh */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 opacity-50" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-y-1/2 opacity-30" />

      <div className="relative container py-12 space-y-12 max-w-4xl animate-in fade-in duration-800 focus-visible:outline-none">
        {/* Header */}
        <div className="flex items-center gap-4 px-2">
          <div className="h-14 w-14 rounded-[1.5rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xl">
            <SettingsIcon className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">
              {t.settings.settings}
            </h1>
            <p className="text-slate-400 font-bold">Manage your preferences and account</p>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/profile">
            <Button
              className="w-full h-20 rounded-[2rem] bg-slate-900 border border-white/5 hover:bg-slate-800/80 group transition-all p-2 pr-6"
            >
              <div className="flex h-full w-full items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-black text-white leading-none mb-1">{t.auth.profile}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">View Health Stats</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </Button>
          </Link>
          <Link to="/feedback">
            <Button
              className="w-full h-20 rounded-[2rem] bg-slate-900 border border-white/5 hover:bg-slate-800/80 group transition-all p-2 pr-6"
            >
              <div className="flex h-full w-full items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-black text-white leading-none mb-1">{t.feedback.title}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Get Help / Send Query</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Profile Summary Section */}
          <Card className="border border-white/10 shadow-3xl bg-slate-900/80 backdrop-blur-xl rounded-[3.5rem] overflow-hidden">
            <CardHeader className="pt-10 px-10">
              <CardTitle className="flex items-center gap-3 text-white text-2xl font-black tracking-tight">
                <User className="h-6 w-6 text-blue-400" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-10 pb-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-primary flex items-center justify-center text-white shadow-2xl border-4 border-white/10">
                    <span className="text-2xl font-black">{user?.name?.charAt(0)}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-2xl text-white">{user?.name}</p>
                    <p className="text-base font-medium text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={logout}
                  className="gap-3 h-14 rounded-2xl px-8 font-black text-lg shadow-xl shadow-red-500/10"
                >
                  <LogOut className="h-5 w-5" />
                  {t.auth.logout}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Language & Theme Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Appearance Settings */}
            <Card className="border border-white/10 shadow-3xl bg-slate-900/80 backdrop-blur-xl rounded-[3.5rem] overflow-hidden">
              <CardHeader className="pt-10 px-10">
                <CardTitle className="flex items-center gap-3 text-white text-2xl font-black tracking-tight">
                  <Palette className="h-6 w-6 text-emerald-400" />
                  {t.settings.appearance}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode" className="text-lg font-black text-white">{t.settings.darkMode}</Label>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {t.settings.darkModeDesc}
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={theme === "dark"}
                    onCheckedChange={handleThemeChange}
                    className="scale-125"
                  />
                </div>
                <div className="mt-6 flex justify-center text-slate-500">
                  {theme === "dark" ? <Moon className="h-12 w-12 opacity-20" /> : <Sun className="h-12 w-12 opacity-20" />}
                </div>
              </CardContent>
            </Card>

            {/* Medication Alerts Settings */}
            <Card className="border border-white/10 shadow-3xl bg-slate-900/80 backdrop-blur-xl rounded-[3.5rem] overflow-hidden">
              <CardHeader className="pt-10 px-10">
                <CardTitle className="flex items-center gap-3 text-white text-2xl font-black tracking-tight">
                  <Pill className="h-6 w-6 text-primary" />
                  Medicine Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-6">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5">
                  <div className="space-y-1">
                    <Label htmlFor="reminders" className="text-lg font-black text-white">Enable Reminders</Label>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Get notified for every dose
                    </p>
                  </div>
                  <Switch
                    id="reminders"
                    checked={reminderSettings.enabled}
                    onCheckedChange={setRemindersEnabled}
                    className="scale-125"
                  />
                </div>

                {notificationPermission !== "granted" && (
                  <div className="p-6 bg-primary/10 rounded-[2rem] border border-primary/20 flex flex-col items-center gap-4 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <BellRing className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-white">Permissions Required</p>
                      <p className="text-xs font-bold text-slate-400">Grant browser permission to receive time-critical alerts.</p>
                    </div>
                    <Button
                      onClick={requestNotificationPermission}
                      className="w-full h-12 rounded-xl font-black text-xs gap-2"
                    >
                      Grant Permission
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card className="border border-white/10 shadow-3xl bg-slate-900/80 backdrop-blur-xl rounded-[3.5rem] overflow-hidden">
              <CardHeader className="pt-10 px-10">
                <CardTitle className="flex items-center gap-3 text-white text-2xl font-black tracking-tight">
                  <Globe className="h-6 w-6 text-primary" />
                  {t.settings.language}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="language" className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.settings.selectLanguage}</Label>
                  <Select value={language} onValueChange={(v) => handleLanguageChange(v as SupportedLanguage)}>
                    <SelectTrigger id="language" className="w-full h-16 rounded-2xl bg-white/5 border-white/10 text-white font-bold text-lg focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                      {(Object.keys(languageNames) as SupportedLanguage[]).map((lang) => (
                        <SelectItem key={lang} value={lang} className="p-4 rounded-xl focus:bg-primary/20 focus:text-white font-bold">
                          {languageNames[lang]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-center text-slate-500 font-bold italic">Changing language will update the entire app instantly.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
