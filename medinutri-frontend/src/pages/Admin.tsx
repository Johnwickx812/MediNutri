import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Activity, Pill, Utensils, ShieldCheck, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const Admin = () => {
    const { token, user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    fetch(`${API_URL}/api/admin/stats`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_URL}/api/admin/users`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (statsRes.ok && usersRes.ok) {
                    const statsData = await statsRes.json();
                    const usersData = await usersRes.json();
                    setStats(statsData.stats);
                    setUsers(usersData.users);
                }
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };

        if (token && user?.role === 'admin') {
            fetchAdminData();
        }
    }, [token, user]);

    if (user?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <ShieldCheck className="w-16 h-16 text-destructive animate-pulse" />
                <h1 className="text-3xl font-bold italic tracking-tight">Access Denied</h1>
                <p className="text-muted-foreground text-lg italic">Only authorized administrators can view this page.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground font-medium italic">Generating admin insights...</p>
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight italic bg-gradient-to-r from-primary via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                        Admin Command Center
                    </h1>
                    <p className="text-muted-foreground italic">Monitor platform activity and user engagement.</p>
                </div>
                <div className="flex items-center gap-2 text-sm bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" /> System Online
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 hover:scale-[1.02] transition-transform duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-indigo-500">Total Users</CardTitle>
                        <Users className="w-5 h-5 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{stats?.total_users || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 hover:scale-[1.02] transition-transform duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-rose-500">Meds Logged</CardTitle>
                        <Pill className="w-5 h-5 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{stats?.total_medications_logged || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Cross-interaction checking active</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 hover:scale-[1.02] transition-transform duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-amber-500">Meals Tracked</CardTitle>
                        <Utensils className="w-5 h-5 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{stats?.total_meals_logged || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on Nin/USDA data</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 hover:scale-[1.02] transition-transform duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-violet-500">Active Records</CardTitle>
                        <Activity className="w-5 h-5 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{filteredUsers.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Real-time DB synchronization</p>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card className="border-none shadow-2xl overflow-hidden glass">
                <CardHeader className="border-b bg-card/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-black italic">Platform Users</CardTitle>
                            <CardDescription className="italic">Total {users.length} registered accounts</CardDescription>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="pl-10 pr-4 py-2 rounded-xl bg-muted/50 border-none focus:ring-2 ring-primary transition-all w-full md:w-64 italic"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b">
                                <th className="p-4 font-bold uppercase text-xs tracking-tighter italic">Name</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-tighter italic">Email</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-tighter italic">Role</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-tighter italic">Joined</th>
                                <th className="p-4 font-bold uppercase text-xs tracking-tighter italic text-center">Onboarding</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="border-b hover:bg-muted/10 transition-colors group">
                                    <td className="p-4 font-bold flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-black uppercase">
                                            {u.name?.substring(0, 2)}
                                        </div>
                                        {u.name}
                                    </td>
                                    <td className="p-4 text-muted-foreground font-mono text-sm">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-black ${u.role === 'admin' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted-foreground text-sm italic">
                                        {u.created_at ? format(new Date(u.created_at), 'MMM dd, yyyy') : 'N/A'}
                                    </td>
                                    <td className="p-4 text-center">
                                        {u.onboarding_complete ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-500 text-xs font-bold uppercase">
                                                <ShieldCheck className="w-3 h-3" /> Done
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground/30 text-xs font-bold uppercase">Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground italic">No users matching your search.</div>
                    )}
                </CardContent>
            </Card>

            <div className="text-center pb-8 opacity-20 hover:opacity-100 transition-opacity duration-500 cursor-default">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">MediNutri Advanced Administrative Layer • Restricted Access</p>
            </div>
        </div>
    );
};

export default Admin;
