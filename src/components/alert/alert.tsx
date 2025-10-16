"use client";
import React, { useEffect } from "react";
import styles from "./alert.module.css";
import { AlertData } from "./alertProvider";

interface AlertProps {
    alert: AlertData;
    onClose: () => void;
}

export default function Alert({ alert, onClose }: AlertProps) {
    useEffect(() => {
        if (alert.autoDismiss) {
            const timer = setTimeout(() => onClose(), alert.duration || 3000);
            return () => clearTimeout(timer);
        }
    }, [alert, onClose]);

    return (
        <div
            className={styles.alertContainer}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div className={`${styles.alertBox} ${styles[`alert-${alert.type}`]}`}>
                <div className={styles.alertMessage}>{alert.message}</div>
                {alert.dismissible !== false && (
                    <button
                        type="button"
                        className={styles.premiumCloseBtn}
                        aria-label="Close alert"
                        onClick={onClose}
                    ></button>
                )}
            </div>
        </div>
    );
}
