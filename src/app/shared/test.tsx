import styles from "./styles/test.module.css"
import { BsHeartFill, BsFillStarFill, BsCheck2, BsHandThumbsUp } from "react-icons/bs";
import Image from "next/image";

export default function Solution() {
    const testimonials = [
        {
            id: 1,
            quote: "Finally, pads that don't irritate my skin! The toxin-free promise is real. I've switched my entire family to Luvwish.",
            product: "Ultra-Soft Day Pads",
            user: "Priya M.",
            location: "Mumbai",
            likes: 234,
            image: "/t1.jpg",
        },
        {
            id: 2,
            quote: "The subscription service is a game-changer. I never have to worry about running out, and the 10% savings add up!",
            product: "Complete Care Combo",
            user: "Anjali K.",
            location: "Bangalore",
            likes: 189,
            image: "/t2.jpg",
        },
        {
            id: 3,
            quote: "Those pain relief patches are magic! I can actually function during my period now. Thank you, Luvwish!",
            productLabel: "Pain Relief Combo",
            user: "Meera S.",
            location: "Delhi",
            likes: 312,
            image: "/t3.jpg",
        },
    ];

    const Stars = () => (
        <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
                <BsFillStarFill key={i} className={styles.starIcon} />
            ))}
        </div>
    );

    return (
        <div className={styles.sectionContainer}>
            <div className={styles.container}>
                <div className={styles.badge}>
                    <p>
                        <BsHeartFill className={styles.heartIcon} /> Customer Love
                    </p>
                </div>

                <div className={styles.head}>
                    <h3 className={styles.heading}>
                        Loved by Women <span className={styles.highlight}>Like You</span>
                    </h3>
                    <p className={styles.subheading}>
                        Join thousands who&apos;ve made the switch to better period care
                    </p>
                </div>

                <div className={styles.cards}>
                    {testimonials.map((t) => (
                        <div key={t.id} className={styles.card}>
                            <Stars />
                            <p className={styles.quote}>&quot; {t.quote} &quot;</p>

                            <div className={styles.productTags}>
                                <span className={styles.productTag}>{t.product || t.productLabel}</span>
                            </div>

                            <div className={styles.con}>
                                <div className={styles.det}>
                                    <div className={styles.avatar}>
                                        <Image
                                            src={t.image}
                                            alt={t.user}
                                            width={40}
                                            height={40}
                                            className={styles.avatarImage}
                                        />
                                    </div>
                                    <div className={styles.nameLocation}>
                                        <p className={styles.userName}>
                                            {t.user} <BsCheck2 className={styles.checkIcon} />
                                        </p>
                                        <p className={styles.location}>{t.location}</p>
                                    </div>
                                </div>
                                <div className={styles.likes}>
                                    <p className={styles.likesText}>
                                        <BsHandThumbsUp className={styles.thumbIcon} /> {t.likes}
                                    </p>
                                </div>
                            </div>

                            <div className={styles.quoteOverlay}>&rdquo;</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}