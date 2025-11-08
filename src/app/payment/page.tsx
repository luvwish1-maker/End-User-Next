"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles/payment.module.css";
import { LuCreditCard ,LuSmartphone,LuWallet ,LuLock } from "react-icons/lu";
import { BsBank,BsCash ,BsExclamationCircle,BsRepeat,BsShield, BsArrowClockwise } from "react-icons/bs";
import { CartItems } from "../types/types";
import PaymentOptionCard from "./paymentcard";
import ProductsService from "../services/productService";

type PaymentType = "UPI" | "Card" | "NetBanking" | "Wallets" | "COD";
type DeliveryType = "standard" | "express";

const Payment: React.FC = () => {

  const [selected, setSelected] = useState<PaymentType>("UPI");
  const [cartItems, setCartItems] = useState<CartItems[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("standard");
  const [loading, setLoading] = useState(true);

  // Fetch live cart on mount
  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await ProductsService.getCart();
        const cartData = response.data.data;
        setCartItems(cartData.items || []);
        setTotalAmount(cartData.totalAmount || 0);
      } catch (error) {
        console.error("Error fetching cart", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

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

  if (loading) return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader}></div>
    </div>
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Payment Method</h3>
      <p className={styles.subtext}>Choose your preferred payment option</p>
      <div className={styles.content}>
        <div className={styles.leftmain}>
          <div className={styles.left}>
            <div>
              <p className={styles.sectionTitle}>Payment Method</p>
              <p className={styles.sectionSubtext}>Choose your preferred payment option</p>
            </div>

            {/* Payment Options */}
            <div className={styles.block}>
              <PaymentOptionCard
                title="UPI"
                subtitle="Pay using any UPI app"
                icon={<LuSmartphone />}
                selected={selected === "UPI"}
                onClick={() => setSelected("UPI")}
                recommended
              />
              {selected === "UPI" && (
                <div className={styles.details}>
                  <label className={styles.label}>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    className={styles.input}
                  />
                  <small className={styles.hint}>
                    Enter your UPI ID (eg: 9876543210@paytm)
                  </small>
                </div>
              )}
            </div>
            <div className={styles.block}>
              <PaymentOptionCard
                title="Credit / Debit Card"
                subtitle="Visa, Mastercard, Rupay"
                icon={<LuCreditCard />}
                selected={selected === "Card"}
                onClick={() => setSelected("Card")}
              />
              {selected === "Card" && (
                <div className={styles.details}>
                  <label className={styles.label}>Cardholder Name</label>
                  <input type="text" placeholder="Name on card" className={styles.input} />
                  <label className={styles.label}>Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" className={styles.input} />
                  <div className={styles.row}>
                    <div className={styles.col}>
                      <label className={styles.label}>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className={styles.input} />
                    </div>
                    <div className={styles.col}>
                      <label className={styles.label}>CVV</label>
                      <input type="password" placeholder="***" className={styles.input} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.block}>
              <PaymentOptionCard
                title="Net Banking"
                subtitle="All Indian banks"
                icon={<BsBank />}
                selected={selected === "NetBanking"}
                onClick={() => setSelected("NetBanking")}
              />
              {selected === "NetBanking" && (
                <div className={styles.details}>
                  <label className={styles.label}>Select Bank</label>
                  <select className={styles.input}>
                    <option>Select Bank</option>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                  </select>
                </div>
              )}
            </div>
            <div className={styles.block}>
              <PaymentOptionCard
                title="Wallets"
                subtitle="Paytm, PhonePe, Google Pay"
                icon={<LuWallet />}
                selected={selected === "Wallets"}
                onClick={() => setSelected("Wallets")}
              />
              {selected === "Wallets" && (
                <div className={styles.details}>
                  <p className={styles.note}>
                    You'll be redirected to your wallet to complete payment.
                  </p>
                </div>
              )}
            </div>
            <div className={styles.block}>
              <PaymentOptionCard
                title="Cash on Delivery"
                subtitle="Pay when you receive"
                icon={<BsCash />}
                selected={selected === "COD"}
                onClick={() => setSelected("COD")}
                extra="₹40 fee"
              />
              {selected === "COD"}
            </div>
          </div>
          <div className={styles.secureBox}>
            <div className={styles.secureTop}>
              <span className={styles.lockIcon}><LuLock color="#FFFFFF" size={24}/></span>
              <div>
                <h4>Secure Payment</h4>
                <p>Your payment information is encrypted and secure. We never store your card details.</p>
              </div>
            </div>
          </div>
          <div className={styles.termsBox}>
            <span className={styles.infoIcon}><BsExclamationCircle color="#155DFC" size={20}/></span>
            <p>
              By placing this order, you agree to our <a href="#">Terms & Conditions</a> and{" "}
              <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>

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
          <button className={styles.buyNowBtn}>Buy Now</button>
          <p className={styles.subInfoSub}><BsRepeat color="#A31157" size={15} /> Subscribe & Save 10%</p>
          <p className={styles.subInfo}><BsShield color="#A31157" size={15} /> Secure Checkout</p>
          <p className={styles.subInfo}><BsArrowClockwise color="#A31157" size={15} /> Easy 30-day Returns</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
