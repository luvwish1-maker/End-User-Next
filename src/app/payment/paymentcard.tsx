import React, { ReactNode } from "react";
import styles from "./styles/paymentcard.module.css";

interface PaymentOptionCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
  extra?: string;
  recommended?: boolean;
}

const PaymentOptionCard: React.FC<PaymentOptionCardProps> = ({
  title,
  subtitle,
  icon,
  selected,
  onClick,
  extra,
  recommended,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.card} ${selected ? styles.active : ""}`}
      aria-pressed={selected}
    >
      <div className={styles.left}>
        <span className={`${styles.radio} ${selected ? styles.radioOn : ""}`} aria-hidden />
        <span className={styles.icon}>{icon}</span>
        <span className={styles.texts}>
          <span className={styles.title}>{title}</span>
          <span className={styles.subtitle}>{subtitle}</span>
        </span>
      </div>

      <div className={styles.right}>
        {recommended && <span className={styles.badge}>Recommended</span>}
        {extra && <span className={styles.extra}>{extra}</span>}
      </div>
    </button>
  );
};

export default PaymentOptionCard;
