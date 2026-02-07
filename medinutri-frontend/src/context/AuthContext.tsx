import React, { createContext, useContext, useState, useEffect } from "react";

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
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await fetch("http://localhost:8000/api/auth/me", {
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

    const updateUser = (data: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
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
