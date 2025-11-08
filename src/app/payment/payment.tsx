"use client";
import React, { useState } from "react";
import styles from "./styles/payment.module.css";
import { LuCreditCard ,LuSmartphone,LuWallet ,LuLock } from "react-icons/lu";
import { BsBank,BsCash ,BsExclamationCircle  } from "react-icons/bs";

import PaymentOptionCard from "./paymentcard";

type PaymentType = "UPI" | "Card" | "NetBanking" | "Wallets" | "COD";

const Payment: React.FC = () => {

  const items = 3;
  const subtotal = 1576;
  const savings = 670;
  const delivery = 0; 
  const total = subtotal - savings + delivery;

  const [selected, setSelected] = useState<PaymentType>("UPI");

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Payment Method</h3>
          <p className={styles.subtext}>Choose your preferred payment option</p>

      <div className={styles.content}>

        <div  className={styles.leftmain}>
          <div className={styles.left}>
          <div>
            <div>
              <p className={styles.sectionTitle}>Payment Method</p>
              <p className={styles.sectionSubtext}>Choose your preferred payment option</p>
            </div>
          </div>
          

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
          <h4 className={styles.summaryTitle}>Order Summary</h4>

          <div className={styles.rowBetween}>
            <span>Subtotal ({items} items)</span>
            <span>₹{subtotal}</span>
          </div>

          <div className={styles.rowBetween}>
            <span className={styles.savingsText}>Product Savings</span>
            <span className={styles.savingsValue}>-₹{savings}</span>
          </div>

          <div className={styles.rowBetween}>
            <span>Delivery Fee</span>
            <span className={styles.free}>FREE</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.rowBetween}>
            <strong className={styles.totaltext}>Total Amount</strong>
            <strong className={styles.totalvalue}>₹{total}</strong>
          </div>

          <button className={styles.buyBtn}>Buy Now</button>
        </div>


      </div>
    </div>
  );
};

export default Payment;
