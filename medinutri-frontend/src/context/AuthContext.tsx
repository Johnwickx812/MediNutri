import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "@/config";

interface User {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    height?: number;
    weight?: number;
    medicalConditions?: string[];
    allergies?: string[];
    dietPreference?: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'eggetarian';
    cuisinePreference?: string;
    onboardingComplete?: boolean;
    role?: 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem("userData");
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
            localStorage.removeItem("userData");
            return null;
        }
    });

    const [token, setToken] = useState<string | null>(() => {
        try {
            return localStorage.getItem("token");
        } catch (error) {
            return null;
        }
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/api/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    if (data.success) {
                        setUser(data.user);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error("Auth check failed", error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("userData", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setToken(null);
        setUser(null);
    };

    const updateUser = async (data: Partial<User>) => {
        if (!user || !token) return;

        try {
            // Optimistic update
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem("userData", JSON.stringify(updatedUser));

            // Persist to backend
            const response = await fetch(`${API_URL}/api/auth/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile on server");
            }

            const result = await response.json();
            if (result.success) {
                setUser(result.user);
                localStorage.setItem("userData", JSON.stringify(result.user));
            }
        } catch (error) {
            console.error("Profile update failed:", error);
            // Rollback on failure if needed, but for now we just log
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                updateUser,
                isAuthenticated: !!token,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
