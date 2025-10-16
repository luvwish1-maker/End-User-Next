"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Alert from "./alert";

export type AlertType = "success" | "error" | "info" | "warning";

export interface AlertData {
    message: string;
    type: AlertType;
    dismissible?: boolean;
    autoDismiss?: boolean;
    duration?: number;
}

interface AlertContextType {
    showAlert: (alert: AlertData) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alert, setAlert] = useState<AlertData | null>(null);

    const showAlert = useCallback((alertData: AlertData) => {
        setAlert(alertData);

        if (alertData.autoDismiss) {
            setTimeout(() => setAlert(null), alertData.duration || 3000);
        }
    }, []);

    const closeAlert = () => setAlert(null);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alert && <Alert alert={alert} onClose={closeAlert} />}
        </AlertContext.Provider>
    );
}

export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};
