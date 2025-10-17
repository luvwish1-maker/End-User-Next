"use client";

import Image from "next/image";
import styles from "./styles/solution.module.css";
import { BsCheckCircle, BsBoxFill, BsHeart, BsStars, BsDroplet } from "react-icons/bs";

const cardsData = [
    { icon: BsDroplet, title: "10 Premium Sanitary Pads", desc: "Zero Compromise Protection" },
    { icon: BsHeart, title: "Dark Chocolate That Actually Heals", desc: "Natural mood booster & cramp relief" },
    { icon: BsBoxFill, title: "Disposal Bags", desc: "No More Awkward Wrapping" },
    { icon: BsStars, title: "Extra Tissues for Everything", desc: "Stay fresh and clean" },
    { icon: BsDroplet, title: "Stain Remover", desc: "For \"Oh Crap\" Moments" },
];

export default function Solution() {
    const gradients = [
        "linear-gradient(180deg, #C61469 0%, #A31157 100%)",
        "linear-gradient(135deg, #F6339A 0%, #E60076 100%)",
    ];

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.badge}>
                    <BsCheckCircle className={styles.icon} />
                    <span>Complete Period Care Kit</span>
                </div>
                <h3 className={styles.heading}>
                    All in One <span>Periods Solution</span>
                </h3>
                <p className={styles.subtext}>
                    Stop suffering through your period with incomplete protection. You deserve better.
                </p>
            </div>

            <div className={styles.bottom}>
                <div className={styles.left}>
                    {cardsData.map((card, idx) => {
                        const Icon = card.icon;
                        const gradient = gradients[idx % gradients.length];
                        return (
                            <div className={styles.card} key={idx}>
                                <div className={styles.cardIcon} style={{ background: gradient }}>
                                    <Icon />
                                </div>
                                <div className={styles.cardText}>
                                    <p className={styles.cardTitle}>{card.title}</p>
                                    <p className={styles.cardDesc}>{card.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.right}>
                    <Image
                        src="/2.png"
                        alt="Period Kit"
                        width={772}
                        height={515}
                        className={styles.image}
                    />
                </div>
            </div>
        </div>
    );
}
