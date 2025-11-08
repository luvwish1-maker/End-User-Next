"use client";

import { useState, useEffect } from "react";
import styles from './DeliveryAddressPage.module.css';
import { BsShield, BsRepeat, BsBox, BsTruck, BsCheckCircle, BsArrowClockwise } from "react-icons/bs";
import ProfileService from '../services/profileService';
import ProductsService from "../services/productService";
import { Address } from '../types/profile';
import { CartItems } from "../types/types";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/alert/alertProvider";

type DeliveryType = "standard" | "express";

export default function DeliveryAddressPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  // Cart state
  const [cartItems, setCartItems] = useState<CartItems[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Delivery Option
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("standard");

  // Address form & validation state
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    landmark: ""
  });
  const [addressErrors, setAddressErrors] = useState<{ [key: string]: string }>({});

  // Fetch addresses
  useEffect(() => {
    async function fetchAddresses() {
      const res = await ProfileService.getAddresses();
      setAddresses(res.data.data);
      if (res.data.data.length) {
        const defaultAddr = res.data.data.find(a => a.isDefault) || res.data.data[0];
        setSelectedAddressId(defaultAddr.id);
      }
    }
    fetchAddresses();
  }, []);

  // Fetch cart data
  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await ProductsService.getCart();
        const cartData = response.data.data;
        setCartItems(cartData.items || []);
        setTotalAmount(cartData.totalAmount || 0);
      } catch (error) {
        console.error("Error fetching cart", error);
      }
    }
    fetchCart();
  }, []);

  // Address validation logic
  function validateAddressFields(addr: typeof newAddress) {
    const errors: { [key: string]: string } = {};

    if (!addr.name.trim()) errors.name = "Name is required";
    if (!addr.phone.trim()) errors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(addr.phone)) errors.phone = "Enter a valid 10-digit phone number";
    if (!addr.address.trim()) errors.address = "Address is required";
    if (!addr.city.trim()) errors.city = "City is required";
    if (!addr.state.trim()) errors.state = "State is required";
    if (!addr.country.trim()) errors.country = "Country is required";
    if (!addr.postalCode.trim()) errors.postalCode = "Postal Code is required";
    else if (!/^\d+$/.test(addr.postalCode)) errors.postalCode = "Postal Code must be digits";

    return errors;
  }

  // Address form change handler
  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));

    // Validate this field only
    setAddressErrors(prevErrors => ({
      ...prevErrors,
      [name]: validateAddressFields({ ...newAddress, [name]: value })[name] ?? ""
    }));
  };

  // Address form submit handler
  const handleAddAddressForOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateAddressFields(newAddress);
    setAddressErrors(errors);

    if (Object.values(errors).some(err => err)) return;

    const tempId = `orderaddr-${Date.now()}`;
    const now = new Date().toISOString();
    const addr: Address = {
      ...newAddress,
      id: tempId,
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    };
    setAddresses(prev => [...prev, addr]);
    setSelectedAddressId(tempId);
    setNewAddress({
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      phone: "",
      landmark: ""
    });
    setAddressErrors({});
  };

  // Delivery option handlers
  const handleDeliverySelect = (type: DeliveryType) => {
    setDeliveryType(type);
  };

  // Cart calculations
  const subtotal = totalAmount;
  const deliveryFee = deliveryType === "express" ? 99 : 0;
  const totalSavings = cartItems.reduce(
    (acc, item) =>
      acc +
      ((item.product.actualPrice ?? 0) - (item.product.discountedPrice ?? 0)) *
      (item.quantity ?? 0),
    0
  );
  const total = subtotal + deliveryFee;

  // Submit order
  const handleBuyNow = () => {
    const selectedAddr = addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddr) {
      showAlert({
      message: "Please add a delivery address",
      type: "error",
      duration: 2000,
      autoDismiss: true,
    });
    return;
    }
     router.push('/payment');
  };
  // Disable submit if any errors
  const hasErrors = Object.values(validateAddressFields(newAddress)).some(err => err);

  return (
    <div className={styles.deliveryLayout}>
      {/* LEFT COLUMN */}
      <div className={styles.leftColumn}>
        <h2 className={styles.heading}>Delivery Address</h2>
        <p className={styles.subheading}>Where should we deliver your order?</p>
        <section className={styles.addressSection}>
          <div className={styles.addressLabel}>Select Delivery Address</div>
          <div className={styles.addressList}>
            {addresses.map(addr => (
              <div
                key={addr.id}
                className={`${styles.savedAddress} ${selectedAddressId === addr.id ? styles.selected : ""}`}
                onClick={() => setSelectedAddressId(addr.id)}
                style={{
                  cursor: "pointer",
                  borderColor: selectedAddressId === addr.id ? "#d81b60" : "#E5E5E5"
                }}
              >
                <input
                  type="radio"
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  name="deliveryAddress"
                  style={{ marginRight: "10px" }}
                />
                <span className={addr.isDefault ? styles.addressTagDefault : styles.addressTag}>
                  {addr.name}{" "}
                  {addr.isDefault && (<span className={styles.defaultBadge}>Default</span>)}
                </span>
                <div className={styles.addressText}>
                  {addr.address}
                  <br />
                  {addr.city}, {addr.state}, {addr.country} - {addr.postalCode}
                  <br />
                  {addr.phone}
                  {addr.landmark && (
                    <>
                      <br />
                      {addr.landmark}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <form className={styles.addAddressForm} onSubmit={handleAddAddressForOrder} noValidate>
            <h3 className={styles.formTitle}>Add New Address</h3>
            <div className={styles.formRow}>
              <div style={{ width: "50%" }}>
                <input className={styles.input} placeholder="Full Name" name="name" value={newAddress.name} onChange={handleNewAddressChange} />
                {addressErrors.name && <div className={styles.errorMsg}>{addressErrors.name}</div>}
              </div>
              <div style={{ width: "50%" }}>
                <input className={styles.input} placeholder="Phone Number" name="phone" value={newAddress.phone} onChange={handleNewAddressChange} />
                {addressErrors.phone && <div className={styles.errorMsg}>{addressErrors.phone}</div>}
              </div>
            </div>
            <input className={styles.input} placeholder="House no., Building name" name="address" value={newAddress.address} onChange={handleNewAddressChange} />
            {addressErrors.address && <div className={styles.errorMsg}>{addressErrors.address}</div>}
            <input className={styles.input} placeholder="Landmark (optional)" name="landmark" value={newAddress.landmark} onChange={handleNewAddressChange} />
            <div className={styles.formRow}>
              <div style={{ width: "25%" }}>
                <input className={styles.input} placeholder="City" name="city" value={newAddress.city} onChange={handleNewAddressChange} />
                {addressErrors.city && <div className={styles.errorMsg}>{addressErrors.city}</div>}
              </div>
              <div style={{ width: "25%" }}>
                <input className={styles.input} placeholder="State" name="state" value={newAddress.state} onChange={handleNewAddressChange} />
                {addressErrors.state && <div className={styles.errorMsg}>{addressErrors.state}</div>}
              </div>
              <div style={{ width: "25%" }}>
                <input className={styles.input} placeholder="Country" name="country" value={newAddress.country} onChange={handleNewAddressChange} />
                {addressErrors.country && <div className={styles.errorMsg}>{addressErrors.country}</div>}
              </div>
              <div style={{ width: "25%" }}>
                <input className={styles.input} placeholder="Postal Code" name="postalCode" value={newAddress.postalCode} onChange={handleNewAddressChange} />
                {addressErrors.postalCode && <div className={styles.errorMsg}>{addressErrors.postalCode}</div>}
              </div>
            </div>
            <button className={styles.saveAddressBtn} type="submit" disabled={hasErrors}>
              Add
            </button>
          </form>
        </section>

        {/* DELIVERY OPTIONS with highlight & dynamic fee */}
        <section className={styles.deliveryOptions}>
          <h3 className={styles.optionsTitle}>Delivery Options</h3>
          <div
            className={deliveryType === "standard" ? styles.optionCardActive : styles.optionCard}
            onClick={() => handleDeliverySelect("standard")}
          >
            <span className={styles.optionCardMain}>
              <span className={styles.optionRadio} style={{
                borderColor: deliveryType === "standard" ? "#d81b60" : "#ddd",
                background: deliveryType === "standard" ? "#d81b60" : "#fff"
              }}></span>
              Standard Delivery&nbsp;
              <span className={styles.optionFee}>Free</span>
            </span>
            <span className={styles.optionSubtext}>Delivery in 3-5 business days</span>
          </div>
          <div
            className={deliveryType === "express" ? styles.optionCardActive : styles.optionCard}
            onClick={() => handleDeliverySelect("express")}
          >
            <span className={styles.optionCardMain}>
              <span className={styles.optionRadio} style={{
                borderColor: deliveryType === "express" ? "#d81b60" : "#ddd",
                background: deliveryType === "express" ? "#d81b60" : "#fff"
              }}></span>
              Express Delivery&nbsp;
              <span className={styles.optionFeePaid}>₹99</span>
            </span>
            <span className={styles.optionSubtext}>Delivery in 1-2 business days</span>
          </div>
        </section>
        <div className={styles.badgeFooter}>
          <div className={styles.Lock}>
            <BsShield style={{ color: "#A31157" }} /> <span className={styles.badge}> Secure Checkout</span>
          </div>
          <div className={styles.Box}>
            <BsBox style={{ color: "#A31157" }} /> <span className={styles.badge}> Discreet Packaging</span>
          </div>
          <div className={styles.Truck}>
            <BsTruck style={{ color: "#A31157" }} /> <span className={styles.badge}> Fast Delivery</span>
          </div>
          <div className={styles.Return}>
            <BsCheckCircle style={{ color: "#A31157" }} /> <span className={styles.badge}> Easy Returns</span>
          </div>
        </div>
      </div>
      {/* RIGHT COLUMN */}
      <div className={styles.right}>
        <h4>Order Summary</h4>
        <div className={styles.summaryItem}>
          <span className={styles.subtotaln}>Subtotal ({cartItems.length} items)</span>
          <span className={styles.subtotalA}>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.proSavingsN}>Product Savings</span>
          <span className={styles.proSavingsN}>-₹{totalSavings.toFixed(2)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.subtotaln}>Delivery Fee</span>
          <span className={styles.proSavingsN}>{deliveryFee > 0 ? `₹${deliveryFee}` : "FREE"}</span>
        </div>
        <hr />
        <div className={styles.total}>
          <span className={styles.totalN}>Total Amount</span>
          <span className={styles.totalA}>₹{total.toFixed(2)}</span>
        </div>
        <button className={styles.buyNowBtn} onClick={handleBuyNow}>Buy Now</button>
        <p className={styles.subInfoSub}><BsRepeat color="#A31157" size={15} /> Subscribe & Save 10%</p>
        <p className={styles.subInfo}><BsShield color="#A31157" size={15} /> Secure Checkout</p>
        <p className={styles.subInfo}><BsArrowClockwise color="#A31157" size={15} /> Easy 30-day Returns</p>
      </div>
    </div>
  );
}
