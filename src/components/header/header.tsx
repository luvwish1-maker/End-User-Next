"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import { BsHeart, BsPerson, BsBag, BsGift, BsList } from "react-icons/bs";
import { useAlert } from "../alert/alertProvider";
import LoginModal from "@/app/login/loginModal";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 992);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ Called after successful login in modal
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        showAlert({
            message: "Successfully logged in!",
            type: "success",
            autoDismiss: true,
            duration: 3000,
        });
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        showAlert({
            message: "You have logged out.",
            type: "info",
            autoDismiss: true,
            duration: 3000,
        });
    };

    return (
        <header className={styles.mainHeader}>
            <div className={styles.label}>
                <p>
                    <span><BsGift /></span>
                    Free delivery on orders above ₹499
                    <span> Subscribe & save 10%</span>
                </p>
            </div>

            <nav className={styles.navbar}>
                <div className={styles.navContainer}>
                    <Link href="/" className={styles.brand}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={130}
                            height={34}
                            className={styles.logo}
                        />
                    </Link>

                    <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
                        <ul>
                            <li><Link href="/" className={styles.navLink}>Home</Link></li>
                            <li><Link href="/products" className={styles.navLink}>Products</Link></li>
                            <li><Link href="/contact" className={styles.navLink}>Contact</Link></li>
                            <li><Link href="/about" className={styles.navLink}>About Us</Link></li>
                        </ul>

                        {isLoggedIn && isMobile && (
                            <ul className={styles.mobileUserIcons}>
                                <li><BsHeart /></li>
                                <li><BsPerson /></li>
                                <li><BsBag /></li>
                            </ul>
                        )}
                    </div>

                    {!isMobile && (
                        <div className={styles.userSection}>
                            {!isLoggedIn ? (
                                <button onClick={() => setShowLoginModal(true)} className={styles.loginBtn}>
                                    Login
                                </button>
                            ) : (
                                <ul className={styles.userIcons}>
                                    <li><BsHeart /></li>
                                    <li><BsPerson /></li>
                                    <li><BsBag /></li>
                                    <li><button onClick={handleLogout} className={styles.logoutBtn}>Logout</button></li>
                                </ul>
                            )}
                        </div>
                    )}

                    {isMobile && (
                        <div className={styles.mobileActions}>
                            {!isLoggedIn && (
                                <button onClick={() => setShowLoginModal(true)} className={styles.loginBtn}>
                                    Login
                                </button>
                            )}
                            <button
                                className={styles.menuToggle}
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <BsList size={28} />
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* ✅ Login Modal */}
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </header>
    );
}
