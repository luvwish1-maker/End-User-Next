"use client";

import { useEffect, useState } from "react";
import styles from "./styles/address.module.css";
import ProfileService from "../services/profileService";
import { Address } from "../types/profile";
import { BsTrash, BsPencilSquare, BsPlusLg } from "react-icons/bs";
import { useAlert } from "@/components/alert/alertProvider";
import { AxiosError } from "axios";

export default function AddressPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editAddress, setEditAddress] = useState<Partial<Address> | null>(null);
    const [form, setForm] = useState<Partial<Address>>({});
    const { showAlert } = useAlert();

    const fetchAddresses = async () => {
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
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

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
            fetchAddresses();
        } catch (error: unknown) {
            let message = "Failed to save address";
            if (error instanceof AxiosError) {
                message = error.response?.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            showAlert({ message, type: "error", autoDismiss: true, duration: 3000 });
        }
    };

    const handleEdit = (address: Address) => {
        setIsEditing(true);
        setEditAddress(address);
        setForm(address);
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
                        <p>📞 {addr.phone}</p>
                        {addr.landmark && <p>🏷 {addr.landmark}</p>}
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

            {/* Add/Edit Form */}
            <div className={styles.formContainer}>
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
                <button className={styles.saveButton} onClick={handleAddOrUpdate}>
                    {isEditing ? "Update Address" : "Add Address"}
                </button>
            </div>
        </div>
    );
}
