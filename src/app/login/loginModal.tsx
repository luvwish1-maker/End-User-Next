"use client";

import { useState } from "react";
import Image from "next/image";
import { FaEnvelope, FaLock } from "react-icons/fa";
import styles from "./login.module.css";
import { authService } from "../services/authService";
import { AxiosError } from "axios";

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

interface ApiErrorResponse {
    message?: string;
    error?: string;
    statusCode?: number;
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ email?: string; password?: string; general?: string }>({});

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Minimum 6 characters required";

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

 const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError({});

        try {
            await authService.login(email, password);
            onLoginSuccess();
        } catch (err) {
            const axiosError = err as AxiosError<ApiErrorResponse>;
            const status = axiosError.response?.status;
            const message = axiosError.response?.data?.message;

            if(status === 409) {
                try {
                    await authService.signup({ email, password });
                    await authService.login(email, password);
                    onLoginSuccess();
                } catch (signupErr) {
                    const signupError = signupErr as AxiosError<ApiErrorResponse>;
                    setError({ general: signupError.response?.data?.message || "Signup failed" });
                }
            }
             else if (status === 401) {
                try {
                    await authService.signup({ email, password });
                    await authService.login(email, password);
                    onLoginSuccess();
                } catch (signupErr) {
                    const signupError = signupErr as AxiosError<ApiErrorResponse>;
                    setError({ general: signupError.response?.data?.message || "Signup failed" });
                }
            } 
            else {
                setError({ general: message || "Login failed" });
            }
        } finally {
            setLoading(false);
        }
 }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>

                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={120}
                    height={50}
                    className={styles.logo}
                />

                <div className={styles.headings}>
                    <h3>Welcome Back!</h3>
                    <p>Sign in to access your account</p>
                </div>

                <div className={styles.socialOptions}>
                    <button className={styles.googleBtn}>
                        <Image
                            src="/google.png"
                            alt="Google"
                            width={20}
                            height={20}
                            className={styles.socialIcon}
                        />
                        Continue with Google
                    </button>

                    <button className={styles.facebookBtn}>
                        <Image
                            src="/facebook.png"
                            alt="Facebook"
                            width={20}
                            height={20}
                            className={styles.socialIcon}
                        />
                        Continue with Facebook
                    </button>
                </div>

                <div className={styles.divider}>Or continue with email</div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <div className={styles.inputWrapper}>
                            <FaEnvelope />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {error.email && <small className={styles.error}>{error.email}</small>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <div className={styles.inputWrapper}>
                            <FaLock />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error.password && <small className={styles.error}>{error.password}</small>}
                    </div>

                    {error.general && (
                        <div className={styles.errorBox}>{error.general}</div>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? <div className={styles.spinner}></div> : "Login / Signup"}
                    </button>
                </form>
            </div>
        </div>
    );
}
