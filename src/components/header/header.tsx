"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import { BsHeart, BsPerson, BsBag, BsGift, BsList, BsPower } from "react-icons/bs";
import { useAlert } from "../alert/alertProvider";
import LoginModal from "@/app/login/loginModal";
import { useConfirmation } from "../confirmation/useConfirmation";
import { useAuth } from "@/app/lib/authContext";

export default function Header() {
    const { isLoggedIn, login, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { showAlert } = useAlert();
    const { confirm, ConfirmationElement } = useConfirmation();

    const handleLogout = async () => {
        const confirmed = await confirm({
            title: "Logout",
            message: "Are you sure you want to log out?",
            confirmText: "Yes, log out",
            cancelText: "Cancel",
        });

        if (confirmed) {
            logout();
            showAlert({
                message: "You have logged out.",
                type: "info",
                autoDismiss: true,
                duration: 3000,
            });
        }
    };

    // ✅ Detect screen size
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 992);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ On successful login
    const handleLoginSuccess = () => {
        login();
        setShowLoginModal(false);
        showAlert({
            message: "Successfully logged in!",
            type: "success",
            autoDismiss: true,
            duration: 3000,
        });
    };

    return (
        <header className={styles.mainHeader}>
            {/* 🔹 Top banner */}
            <div className={styles.label}>
                <p>
                    <span><BsGift /></span>
                    Free delivery on orders above ₹499
                    <span> Subscribe & save 10%</span>
                </p>
            </div>

            {/* 🔹 Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.navContainer}>
                    {/* Logo */}
                    <Link href="/" className={styles.brand}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={130}
                            height={34}
                            className={styles.logo}
                        />
                    </Link>

                    {/* Menu Links */}
                    <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
                        <ul>
                            <li><Link href="/" className={styles.navLink}>Home</Link></li>
                            <li><Link href="/products" className={styles.navLink}>Products</Link></li>
                            <li><Link href="/contact" className={styles.navLink}>Contact</Link></li>
                            <li><Link href="/about" className={styles.navLink}>About Us</Link></li>
                        </ul>

                        {/* Mobile user icons */}
                        {isLoggedIn && isMobile && (
                            <ul className={styles.mobileUserIcons}>
                                <li><BsHeart /></li>
                                <li><BsPerson /></li>
                                <li><BsBag /></li>
                                <li title="Logout">
                                    <button onClick={handleLogout}>
                                        <BsPower />
                                    </button>
                                </li>

                            </ul>
                        )}
                    </div>

                    {/* Desktop User Section */}
                    {!isMobile && (
                        <div className={styles.userSection}>
                            {!isLoggedIn ? (
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className={styles.loginBtn}
                                >
                                    Login
                                </button>
                            ) : (
                                <ul className={styles.userIcons}>
                                    <li title="Wishlist"><BsHeart /></li>
                                    <li title="Profile"><BsPerson /></li>
                                    <li title="Cart"><BsBag /></li>
                                    <li title="Logout">
                                        <button onClick={handleLogout}>
                                            <BsPower />
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Mobile actions */}
                    {isMobile && (
                        <div className={styles.mobileActions}>
                            {!isLoggedIn && (
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className={styles.loginBtn}
                                >
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

            {ConfirmationElement}
        </header>
    );
}
