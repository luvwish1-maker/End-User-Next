"use client";

import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

export function useConfirmation() {
    const [modalState, setModalState] = useState<{
        open: boolean;
        title?: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
        resolve?: (value: boolean) => void;
    }>({ open: false });

    const confirm = (options: {
        title?: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
    }): Promise<boolean> => {
        return new Promise((resolve) => {
            setModalState({ open: true, ...options, resolve });
        });
    };

    const handleConfirm = () => {
        modalState.resolve?.(true);
        setModalState({ open: false });
    };

    const handleCancel = () => {
        modalState.resolve?.(false);
        setModalState({ open: false });
    };

    const ConfirmationElement = modalState.open ? (
        <ConfirmationModal
            title={modalState.title}
            message={modalState.message}
            confirmText={modalState.confirmText}
            cancelText={modalState.cancelText}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    ) : null;

    return { confirm, ConfirmationElement };
}
