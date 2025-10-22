"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../services/authService";

interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());

    useEffect(() => {
        setIsLoggedIn(authService.isLoggedIn());
    }, []);

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        authService.logout();
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
