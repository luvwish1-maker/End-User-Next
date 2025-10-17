import styles from "./styles/counts.module.css";
import { BsPeople, BsStar, BsBox } from "react-icons/bs";

export default function Counts() {
    return (
        <div className={styles.container}>
            <div className={styles.countsWrapper}>
                {/* Happy Customers */}
                <div className={styles.item}>
                    <div className={styles.iconWrapper}>
                        <BsPeople className={styles.icon} />
                    </div>
                    <div className={styles.content}>
                        <h3 className={styles.countText}>100K<span className={styles.plus}>+</span></h3>
                        <p className={styles.labelText}>Happy Customers</p>
                    </div>
                </div>

                {/* Average Rating */}
                <div className={styles.item}>
                    <div className={styles.iconWrapper}>
                        <BsStar className={styles.icon} />
                    </div>
                    <div className={styles.content}>
                        <h3 className={styles.countText}>4.9/5</h3>
                        <p className={styles.labelText}>Average Rating</p>
                    </div>
                </div>

                {/* Monthly Orders */}
                <div className={styles.item}>
                    <div className={styles.iconWrapper}>
                        <BsBox className={styles.icon} />
                    </div>
                    <div className={styles.content}>
                        <h3 className={styles.countText}>50K<span className={styles.plus}>+</span></h3>
                        <p className={styles.labelText}>Monthly Orders</p>
                    </div>
                </div>
            </div>
        </div>
    );
}