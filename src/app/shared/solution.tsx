import styles from "./styles/solution.module.css"
import { BsCheckCircle, BsBoxFill, BsHeart, BsBag, BsStars, BsDroplet } from "react-icons/bs";

const cardsData = [
    { icon: <BsDroplet />, title: "10 Premium Sanitary Pads", desc: "Zero Compromise Protection", bg: "#9C2CA4" },
    { icon: <BsHeart />, title: "Dark Chocolate That Actually Heals", desc: "Natural mood booster & cramp relief", bg: "#004C35" },
    { icon: <BsBoxFill />, title: "Disposal Bags", desc: "No More Awkward Wrapping", bg: "#E33756" },
    { icon: <BsStars />, title: "Extra Tissues for Everything", desc: "Stay fresh and clean", bg: "#C65BF7" },
    { icon: <BsDroplet />, title: "Stain Remover", desc: "For \"Oh Crap\" Moments", bg: "#F7C65B" },
];

export default function Solution() {
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
                    {cardsData.map((card, idx) => (
                        <div className={styles.card} key={idx} style={{ backgroundColor: card.bg }}>
                            <div className={styles.cardIcon}>{card.icon}</div>
                            <div className={styles.cardText}>
                                <p className={styles.cardTitle}>{card.title}</p>
                                <p className={styles.cardDesc}>{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.right}>
                    <img src="/2.png" alt="Period Kit" className={styles.image} />
                </div>
            </div>
        </div>
    )
}
