"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles/counts.module.css";
import { BsPeople, BsStar, BsBox } from "react-icons/bs";

export default function Counts() {
    const [counts, setCounts] = useState({ customers: 0, rating: 0, orders: 0 });
    const hasAnimated = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById("counts-section");
            if (!section) return;
            const rect = section.getBoundingClientRect();

            // Trigger animation when section enters viewport
            if (rect.top < window.innerHeight && rect.bottom >= 0 && !hasAnimated.current) {
                hasAnimated.current = true;
                animateCounts();
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const animateCounts = () => {
        const duration = 2000; // 2 seconds
        const start = performance.now();

        const step = (timestamp: number) => {
            const progress = Math.min((timestamp - start) / duration, 1);

            setCounts({
                customers: Math.floor(progress * 100),
                rating: +(progress * 4.9).toFixed(1),
                orders: Math.floor(progress * 50),
            });

            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    return (
        <div className={styles.container} id="counts-section">
            <div className={styles.countsWrapper}>
                {/* Happy Customers */}
                <div className={styles.item}>
                    <div className={styles.iconWrapper}>
                        <BsPeople className={styles.icon} />
                    </div>
                    <div className={styles.content}>
                        <h3 className={styles.countText}>
                            {counts.customers}K<span className={styles.plus}>+</span>
                        </h3>
                        <p className={styles.labelText}>Happy Customers</p>
                    </div>
                </div>

                {/* Average Rating */}
                <div className={styles.item}>
                    <div className={styles.iconWrapper}>
                        <BsStar className={styles.icon} />
                    </div>
                    <div className={styles.content}>
                        <h3 className={styles.countText}>
                            {counts.rating}/5
                        </h3>
                        <p className={styles.labelText}>Average Rating</p>
                    </div>
                </div>

                {/* Monthly Orders */}
                <div className={styles.item}>
                    <div className={styles.iconWrapper}>
                        <BsBox className={styles.icon} />
                    </div>
                    <div className={styles.content}>
                        <h3 className={styles.countText}>
                            {counts.orders}K<span className={styles.plus}>+</span>
                        </h3>
                        <p className={styles.labelText}>Monthly Orders</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
