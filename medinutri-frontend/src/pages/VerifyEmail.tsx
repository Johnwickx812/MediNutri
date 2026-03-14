import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShieldCheck, Mail, ArrowRight, Loader2, RefreshCw } from "lucide-react";

const VerifyEmail = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        // Since we don't have a real email service yet, any 6-digit code or "123456" will work for now
        // This simulates the flow perfectly.
        if (code.length !== 6) {
            toast.error("Please enter a valid 6-digit verification code");
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            await updateUser({ email_verified: true });
            toast.success("Email verified successfully!");
            navigate("/complete-profile");
        } catch (error) {
            toast.error("Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.info("A new verification code has been sent to your email!");
        setIsResending(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Animations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] opacity-20 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] opacity-30" />

            <div className="w-full max-w-md relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center space-y-3">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary/10 border border-primary/20 shadow-2xl mb-4 group hover:scale-110 transition-transform duration-500">
                        <ShieldCheck className="h-10 w-10 text-primary group-hover:rotate-12 transition-transform" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">Verify Your Email</h1>
                    <p className="text-slate-400 font-bold px-4">
                        We've sent a 6-digit security code to <span className="text-primary">{user?.email}</span>
                    </p>
                </div>

                <Card className="border border-white/10 bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] overflow-hidden shadow-3xl">
                    <CardContent className="p-10 space-y-8">
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-center gap-2">
                                    <Input
                                        type="text"
                                        maxLength={6}
                                        placeholder="0 0 0 0 0 0"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                        className="h-16 md:h-20 text-center text-3xl md:text-4xl font-black tracking-[0.5em] bg-white/5 border-white/10 rounded-2xl focus:ring-primary/20 text-white placeholder:opacity-20"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    Enter 6-digit code to continue
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || code.length !== 6}
                                className="w-full h-16 rounded-2xl text-xl font-black gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify Email
                                        <ArrowRight className="h-6 w-6" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="text-slate-400 hover:text-white font-bold gap-2 rounded-xl transition-colors"
                                >
                                    {isResending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="h-4 w-4" />
                                    )}
                                    Resend Code
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={logout}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 font-bold rounded-xl transition-colors"
                                >
                                    Log Out
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-slate-600 font-bold text-sm">
                        Need help? <a href="mailto:support@medinutri.ai" className="text-primary hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
