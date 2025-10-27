"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./styles/address.module.css";
import ProfileService from "../services/profileService";
import { Address } from "../types/profile";
import { BsTrash, BsPencilSquare, BsPlusLg, BsTelephone } from "react-icons/bs";
import { LiaLandmarkSolid } from "react-icons/lia";
import { useAlert } from "@/components/alert/alertProvider";
import { AxiosError } from "axios";

export default function AddressPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editAddress, setEditAddress] = useState<Partial<Address> | null>(null);
    const [form, setForm] = useState<Partial<Address>>({});
    const { showAlert } = useAlert();

    // ✅ useCallback to fix eslint warning
    const fetchAddresses = useCallback(async () => {
        try {
            const response = await ProfileService.getAddresses();
            setAddresses(response.data.data);
        } catch (error: unknown) {
            let message = "Failed to fetch addresses";
            if (error instanceof AxiosError) {
                message = error.response?.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            setError(message);
            showAlert({ message, type: "error", autoDismiss: true, duration: 3000 });
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleDelete = async (id: string) => {
        try {
            await ProfileService.deleteAddress(id);
            showAlert({
                message: "Address deleted successfully",
                type: "success",
                autoDismiss: true,
                duration: 2500,
            });
            setAddresses(addresses.filter((a) => a.id !== id));
        } catch (error: unknown) {
            let message = "Failed to delete address";
            if (error instanceof AxiosError) {
                message = error.response?.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            showAlert({ message, type: "error", autoDismiss: true, duration: 3000 });
        }
    };

    const handleAddOrUpdate = async () => {
        setIsSubmitting(true);
        try {
            if (isEditing && editAddress?.id) {
                await ProfileService.updateAddress(editAddress.id, form);
                showAlert({
                    message: "Address updated successfully",
                    type: "success",
                    autoDismiss: true,
                    duration: 2500,
                });
            } else {
                await ProfileService.addAddress(form as Address);
                showAlert({
                    message: "Address added successfully",
                    type: "success",
                    autoDismiss: true,
                    duration: 2500,
                });
            }
            setForm({});
            setIsEditing(false);
            setEditAddress(null);
            setIsModalOpen(false);
            fetchAddresses();
        } catch (error: unknown) {
            let message = "Failed to save address";
            if (error instanceof AxiosError) {
                message = error.response?.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            showAlert({ message, type: "error", autoDismiss: true, duration: 3000 });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (address: Address) => {
        setIsEditing(true);
        setEditAddress(address);
        setForm(address);
        setIsModalOpen(true);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    if (loading)
        return (
            <div className={styles.loaderWrapper}>
                <div className={styles.loader}></div>
            </div>
        );

    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.addressWrapper}>
            <div className={styles.header}>
                <h3 className={styles.title}>My Addresses</h3>
                <button
                    className={styles.addButton}
                    onClick={() => {
                        setIsEditing(false);
                        setForm({});
                        setEditAddress(null);
                        setIsModalOpen(true);
                    }}
                >
                    <BsPlusLg /> Add Address
                </button>
            </div>

            <div className={styles.cardGrid}>
                {addresses.map((addr) => (
                    <div key={addr.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h4>{addr.name}</h4>
                            {addr.isDefault && (
                                <span className={styles.defaultBadge}>Default</span>
                            )}
                        </div>
                        <p>{addr.address}</p>
                        <p>
                            {addr.city}, {addr.state}, {addr.country} - {addr.postalCode}
                        </p>
                        <p><BsTelephone className={styles.svg}/> {addr.phone}</p>
                        {addr.landmark && <p><LiaLandmarkSolid className={styles.svg}/> {addr.landmark}</p>}
                        <div className={styles.actions}>
                            <button
                                className={styles.iconButton}
                                onClick={() => handleEdit(addr)}
                            >
                                <BsPencilSquare />
                            </button>
                            <button
                                className={styles.iconButtonDelete}
                                onClick={() => handleDelete(addr.id)}
                            >
                                <BsTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Modal for Add/Edit */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h4>{isEditing ? "Edit Address" : "Add Address"}</h4>
                        <div className={styles.formGrid}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={form.name || ""}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={form.address || ""}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={form.city || ""}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={form.state || ""}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={form.country || ""}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="postalCode"
                                placeholder="Postal Code"
                                value={form.postalCode || ""}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone || ""}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="landmark"
                                placeholder="Landmark (optional)"
                                value={form.landmark || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.saveButton}
                                onClick={handleAddOrUpdate}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Saving..."
                                    : isEditing
                                        ? "Update Address"
                                        : "Add Address"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
