import Image from "next/image";
import Link from "next/link";
import {
    BsStars,
    BsDroplet,
    BsBoxFill,
    BsFire,
    BsRepeat,
    BsArrowRight,
} from "react-icons/bs";
import styles from "./styles/category.module.css";

const categories = [
    {
        id: 1,
        title: "Sanitary Pads",
        description: "Ultra-soft, dermatologist-tested",
        img: "/c1.png",
        icon: <BsDroplet />,
        color: "#9C2CA4",
    },
    {
        id: 2,
        title: "Relief Patch",
        description: "Instant comfort and care",
        img: "/c2.png",
        icon: <BsBoxFill />,
        color: "#004C35",
    },
    {
        id: 3,
        title: "Menstrual Kit",
        description: "Complete comfort essentials",
        img: "/c3.png",
        icon: <BsFire />,
        color: "#E33756",
    },
    {
        id: 4,
        title: "Combo Packs",
        description: "All-in-one savings bundle",
        img: "/c4.png",
        icon: <BsRepeat />,
        color: "#C65BF7",
    },
];

export default function Category() {
    return (
        <section className={styles.container}>
            <div className={styles.badge}>
                <p>
                    <BsStars /> Shop by Category
                </p>
            </div>

            <h3>
                Find what you <span>need, fast</span>
            </h3>
            <p className={styles.subtitle}>
                Explore our curated collection designed for every stage of your cycle
            </p>

            <div className={styles.cards}>
                {categories.map((item) => (
                    <div className={styles.card} key={item.id}>
                        <div className={styles.img}>
                            <Image
                                src={item.img}
                                alt={item.title}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 100vw, 250px"
                            />
                            <div
                                className={styles.iconWrapper}
                                style={{ backgroundColor: item.color }}
                            >
                                {item.icon}
                            </div>
                        </div>

                        <div className={styles.cont}>
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>

                            <div className={styles.dat}>
                                <p>15+ products</p>
                                <Link href="/shop" className={styles.shopBtn}>
                                    Shop <BsArrowRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.last}>
                <p>
                    Not sure what you need?{" "}
                    <Link href="/quiz">
                        <span>Take our 2-minute quiz</span>
                    </Link>{" "}
                    to find your perfect match.
                </p>
            </div>
        </section>
    );
}
