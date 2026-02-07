import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
    const { t } = useLanguage();
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                authLogin(data.access_token, data.user);
                toast({
                    title: "Welcome back!",
                    description: `Logged in as ${data.user.name}`,
                });
                navigate("/profile");
            } else {
                toast({
                    variant: "destructive",
                    title: "Login failed",
                    description: data.detail || "Invalid email or password",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Connection error",
                description: "Could not connect to the server",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl ring-1 ring-white/10">
                    <CardHeader className="space-y-1 text-center pt-8">
                        <div className="flex justify-center mb-6">
                            <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center shadow-inner">
                                <LogIn className="h-10 w-10 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight">
                            {t.auth.loginTitle}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-lg">
                            {t.auth.loginSubtitle}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder={t.auth.email}
                                        className="pl-12 h-14 rounded-2xl border-muted bg-white/50 backdrop-blur-sm focus:ring-primary/20"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder={t.auth.password}
                                        className="pl-12 h-14 rounded-2xl border-muted bg-white/50 backdrop-blur-sm focus:ring-primary/20"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-14 rounded-2xl text-lg font-bold mt-4 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>{t.auth.loggingIn}</span>
                                    </div>
                                ) : (
                                    t.auth.loginButton
                                )}
                            </Button>
                        </form>
                        <div className="mt-10 text-center text-muted-foreground">
                            {t.auth.noAccount}{" "}
                            <Link
                                to="/register"
                                className="text-primary font-bold hover:underline underline-offset-4 decoration-2"
                            >
                                {t.auth.register}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
