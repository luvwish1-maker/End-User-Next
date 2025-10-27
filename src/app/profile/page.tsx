"use client";

import { useEffect, useState } from "react";
import styles from "./styles/profile.module.css";
import ProfileService from "../services/profileService";
import { Profile } from "../types/profile";
import { useAlert } from "@/components/alert/alertProvider"; // ✅ Import alert hook
import AddressPage from "./address";

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);

    const { showAlert } = useAlert(); // ✅ Alert hook

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await ProfileService.getProfile();
                const data = response.data.data;
                setProfile(data);
                setName(data.CustomerProfile.name);
                setPhone(data.CustomerProfile.phone);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        try {
            const payload = {
                name,
                phone,
            };
            await ProfileService.updateProfile(payload);

            setProfile({
                ...profile,
                CustomerProfile: {
                    ...profile.CustomerProfile,
                    name,
                    phone,
                },
            });

            setIsEditing(false);

            // ✅ Show success alert
            showAlert({
                message: "Profile updated successfully!",
                type: "success",
                autoDismiss: true,
                duration: 3000,
            });
        } catch (err) {
            console.error("Error updating profile:", err);

            // ❌ Show error alert
            showAlert({
                message: "Failed to update profile. Please try again.",
                type: "error",
                autoDismiss: true,
                duration: 3000,
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.spinnerContainer}>
                <div className={styles.spinner}></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error) return <p className={styles.error}>{error}</p>;
    if (!profile) return <p>No profile data found.</p>;

    const user = profile.CustomerProfile;

    return (

        <>
            <div className={styles.container}>
                <h2 className={styles.title}>My Profile</h2>

                <div className={styles.profileCard}>
                    <div className={styles.details}>
                        <div className={styles.field}>
                            <strong>Name:</strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={styles.input}
                                />
                            ) : (
                                <span>{user.name}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <strong>Email:</strong> <span>{profile.email}</span>
                        </div>

                        <div className={styles.field}>
                            <strong>Phone:</strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={styles.input}
                                />
                            ) : (
                                <span>{user.phone}</span>
                            )}
                        </div>

                        {isEditing ? (
                            <div className={styles.btnGroup}>
                                <button
                                    className={styles.saveBtn}
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                className={styles.editBtn}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <AddressPage />
        </>
    );
}
