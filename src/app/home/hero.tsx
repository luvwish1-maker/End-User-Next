import Image from "next/image";
import styles from "./styles/hero.module.css";
import { FaStar } from "react-icons/fa";

export default function Hero() {
    return (
        <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
                {/* LEFT SECTION */}
                <div className={styles.heroLeft}>
                    <div className={styles.label}>
                        <div className={styles.avatars}>
                            <Image src="/w1.jpg" alt="user1" width={28} height={28} className={styles.avatarImg} />
                            <Image src="/w2.jpg" alt="user2" width={28} height={28} className={styles.avatarImg} />
                            <Image src="/w3.jpg" alt="user3" width={28} height={28} className={styles.avatarImg} />
                        </div>
                        <p>Trusted by 100k+ women across India</p>
                        <FaStar color="#800D45" size={16} />
                    </div>

                    <h2>
                        Period care that puts <span>you first.</span>
                    </h2>
                    <p className={styles.subtext}>
                        Cramps. Mood swings. Leaks. Still expected to perform? You deserve better support.
                    </p>

                    <div className={styles.promoCode}>
                        <p>Use code: <span>COMBO25</span></p>
                        <button className={styles.copyBtn}>Copy</button>
                    </div>

                    <button className={styles.exploreBtn}>Explore Our Products</button>

                    <div className={styles.reviewSection}>
                        <div className={styles.rating}>
                            <div className={styles.stars}>
                                <FaStar color="#ff4c8b" />
                                <FaStar color="#ff4c8b" />
                                <FaStar color="#ff4c8b" />
                                <FaStar color="#ff4c8b" />
                                <FaStar color="#ff4c8b" />
                            </div>
                            <p>4.9/5 from 12k+ reviews</p>
                        </div>
                        <div className={styles.fastDelivery}>
                            <h4>100X</h4>
                            <p>Faster Delivery</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className={styles.heroRight}>
                    <Image src="/1.png" alt="product" width={660} height={650} priority />
                </div>
            </div>
        </div>
    );
}
