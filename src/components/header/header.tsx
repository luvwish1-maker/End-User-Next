"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import { BsHeart, BsPerson, BsBag, BsGift, BsList } from "react-icons/bs";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 992);
        handleResize(); // initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogin = () => setIsLoggedIn(!isLoggedIn);

    return (
        <header className={styles.mainHeader}>
            {/* Top label bar */}
            <div className={styles.label}>
                <p>
                    <span><BsGift /></span>
                    Free delivery on orders above ₹499
                    <span> Subscribe & save 10%</span>
                </p>
            </div>

            {/* Navbar */}
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

                    {/* Nav Links & User icons (center on desktop, dropdown on mobile) */}
                    <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
                        {/* Nav Links */}
                        <ul>
                            <li><Link href="/" className={styles.navLink}>Home</Link></li>
                            <li><Link href="/products" className={styles.navLink}>Products</Link></li>
                            <li><Link href="/contact" className={styles.navLink}>Contact</Link></li>
                            <li><Link href="/about" className={styles.navLink}>About Us</Link></li>
                        </ul>

                        {/* Mobile user icons - only show on mobile & logged in */}
                        {isLoggedIn && isMobile && (
                            <ul className={styles.mobileUserIcons}>
                                <li><BsHeart /></li>
                                <li><BsPerson /></li>
                                <li><BsBag /></li>
                            </ul>
                        )}
                    </div>

                    {/* Right section - desktop only */}
                    {!isMobile && (
                        <div className={styles.userSection}>
                            {!isLoggedIn ? (
                                <button onClick={handleLogin} className={styles.loginBtn}>
                                    Login
                                </button>
                            ) : (
                                <ul className={styles.userIcons}>
                                    <li><BsHeart /></li>
                                    <li><BsPerson /></li>
                                    <li><BsBag /></li>
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Mobile actions (menu + login) */}
                    {isMobile && (
                        <div className={styles.mobileActions}>
                            {!isLoggedIn && (
                                <button onClick={handleLogin} className={styles.loginBtn}>
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
        </header>
    );
}
