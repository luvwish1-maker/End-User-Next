"use client";

import React from "react";
import { BsExclamationCircle } from "react-icons/bs";
import styles from "./confirmation.module.css";

interface ConfirmationModalProps {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title = "Confirm",
    message = "Are you sure?",
    confirmText = "Yes",
    cancelText = "No",
    onConfirm,
    onCancel,
}) => {
    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={`${styles.modalHeader} border-0 pb-0`}>
                    <h5 className={styles.modalTitle}>
                        <BsExclamationCircle className={styles.icon} />
                        {title}
                    </h5>
                    <button
                        type="button"
                        aria-label="Close"
                        className={styles.btnClose}
                        onClick={onCancel}
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className={styles.modalBody}>
                    <p>{message}</p>
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <button className={styles.btnOutlineBrand} onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className={styles.btnBrand} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
