import styles from "./footer.module.css";
import Image from "next/image";
import { FaInstagram, FaFacebookF, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.footerTop}>
                <div className={styles.footerBrand}>
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={150}
                        height={50}
                        className={styles.footerLogo}
                        priority={true} // ensures it's loaded quickly for LCP
                    />
                    <p>
                        Period care that puts you first. Science-backed, body-positive,
                        delivered with care.
                    </p>
                    <div className={styles.socialIcons}>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaEnvelope /></a>
                    </div>
                </div>

                <div className={styles.footerLinks}>
                    <div>
                        <h5>Products</h5>
                        <ul>
                            <li>Sanitary Pads</li>
                            <li>Combo Kits</li>
                            <li>Pain Relief</li>
                            <li>Intimate Care</li>
                            <li>Subscriptions</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Support</h5>
                        <ul>
                            <li>Help Center</li>
                            <li>Track Order</li>
                            <li>Returns & Exchanges</li>
                            <li>Shipping Info</li>
                            <li>FAQs</li>
                        </ul>
                    </div>
                    <div>
                        <h5>About</h5>
                        <ul>
                            <li>Our Story</li>
                            <li>Ingredients</li>
                            <li>Sustainability</li>
                            <li>Blog</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Policies</h5>
                        <ul>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Refund Policy</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.footerCurve}></div>

            <div className={styles.footerBottom}>
                <p>© 2025 Luvwish. All rights reserved.</p>
            </div>
        </footer>
    );
}
