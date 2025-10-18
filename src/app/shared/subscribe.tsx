import styles from "./styles/subscribe.module.css";
import { BsEnvelope, BsGift, BsBell, BsStars, BsLockFill } from "react-icons/bs";

export default function Subcribe() {
    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <BsEnvelope />
                <h3>Get Cycle-Sync Tips & Exclusive Offers</h3>
                <p>
                    Join our community for period care insights, wellness tips, and special
                    subscriber-only deals delivered to your inbox.
                </p>

                <div className={styles.points}>
                    <div className={styles.point}>
                        <BsGift />
                        <p>Exclusive subscriber-only deals</p>
                    </div>
                    <div className={styles.point}>
                        <BsBell />
                        <p>Cycle-sync wellness tips</p>
                    </div>
                    <div className={styles.point}>
                        <BsStars />
                        <p>Early access to new products</p>
                    </div>
                </div>

                <div className={styles.privacy}>
                    <BsLockFill />
                    <p>We respect your privacy. Unsubscribe anytime. No spam, ever.</p>
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.badge}>
                    <BsStars />
                    <p>Join 50,000+ subscribers</p>
                </div>

                <div className={styles.head}>
                    <h4>Subscribe Now</h4>
                    <p>Get 10% off your first order</p>
                </div>
            </div>
        </div>
    );
}
