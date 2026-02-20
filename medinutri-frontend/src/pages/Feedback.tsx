
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
    MessageSquare,
    Send,
    Mail,
    User,
    BookOpen,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config";


const Feedback = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/feedback`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast({
                    title: t.feedback.successTitle,
                    description: t.feedback.successDesc,
                });
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                throw new Error("Failed to submit");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: t.feedback.errorTitle,
                description: t.feedback.errorDesc,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-primary/10 text-primary">
                    <MessageSquare className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {t.feedback.title}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t.feedback.description}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact Info Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-6"
                >
                    <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-blue-500/5">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Quick Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Our team typically responds within 24 hours during business days.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                Emergency?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                In case of a medical emergency, please contact your local emergency services (108 in India) or visit the nearest hospital immediately.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Feedback Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:col-span-2"
                >
                    <Card className="border-none shadow-xl">
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <User className="w-4 h-4 text-primary" />
                                            {t.feedback.name}
                                        </label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder={t.feedback.placeholders.name}
                                            required
                                            className="rounded-xl border-muted focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-primary" />
                                            {t.feedback.email}
                                        </label>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder={t.feedback.placeholders.email}
                                            required
                                            className="rounded-xl border-muted focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-primary" />
                                        {t.feedback.subject}
                                    </label>
                                    <Input
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder={t.feedback.placeholders.subject}
                                        required
                                        className="rounded-xl border-muted focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-primary" />
                                        {t.feedback.message}
                                    </label>
                                    <Textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder={t.feedback.placeholders.message}
                                        required
                                        rows={6}
                                        className="rounded-xl border-muted focus:ring-primary/20 resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20 translate-y-0 active:translate-y-0.5 transition-all"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Send className="w-5 h-5" />
                                            </motion.div>
                                            {t.common.loading}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Send className="w-5 h-5" />
                                            {t.feedback.submit}
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Feedback;
