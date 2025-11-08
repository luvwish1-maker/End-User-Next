"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CartItems } from "../types/types";
import styles from "./styles/page.module.css";
import ProductsService from "../services/productService";
import { BsX } from "react-icons/bs";
import { BsShield, BsRepeat, BsTag } from "react-icons/bs";
import { useAlert } from "@/components/alert/alertProvider";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import Solution from "../shared/solution";
import Counts from "../shared/counts";
import Test from "../shared/test";
import Subscribe from "../shared/subscribe";
import Random from "./random";
import CouponsService from "../services/couponsService";

export default function Cart() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItems[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
    const { showAlert } = useAlert();

    // Coupon Sevice


const [couponInput, setCouponInput] = useState("");
const [couponLoading, setCouponLoading] = useState(false);

const handleApplyCoupon = async () => {
  if (!couponInput.trim()) {
    showAlert({
      message: "Please enter a coupon code",
      type: "error",
      duration: 3000,
      autoDismiss: true,
    });
    return;
  }
  const token = authService.getToken();
  if (!token) {
    showAlert({
      message: "You must be logged in to apply a coupon.",
      type: "error",
      duration: 3000,
      autoDismiss: true,
    });
    return;
  }
  setCouponLoading(true);
  try {
    const cartId = cartItems[0]?.cartId || cartItems[0]?.id;
    const res = await CouponsService.applyCoupon({
      cartId,
      couponName: couponInput.trim(),
      token, 
    });
    showAlert({
      message: res.data.message || "Coupon applied!",
      type: "success",
      duration: 2500,
      autoDismiss: true,
    });
    fetchCart();
    setCouponInput(""); // optional
  } catch (err) {
    let msg = "Failed to apply coupon";
    if (err instanceof AxiosError) {
      msg = err.response?.data?.message || msg;
    }
    showAlert({ message: msg, type: "error", duration: 3000 });
  } finally {
    setCouponLoading(false);
  }
};



    useEffect(() => {
        // ✅ Check if user is logged in
        if (!authService.isLoggedIn()) {
            showAlert({
                message: "Please log in first!",
                type: "error",
                autoDismiss: true,
                duration: 3000,
            });
            router.push("/");
            return;
        }

        fetchCart();
    }, [router, showAlert]);

    const fetchCart = async () => {
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
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleQuantityChange = async (item: CartItems, change: number) => {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return;

        setLoadingItemId(item.id);

        try {
            await ProductsService.updateCartItem({
                productId: item.product.id,
                quantity: newQuantity
            });
            showAlert({
                message: "Quantity updated successfully!",
                type: "success",
                autoDismiss: true,
                duration: 2500,
            });
            fetchCart();
        } catch (error) {
            let message = "An unexpected error occurred";

            if (error instanceof AxiosError) {
                const backendMessage = error.response?.data?.message;
                if (typeof backendMessage === "string") {
                    message = backendMessage;
                }
            } else if (error instanceof Error) {
                message = error.message;
            }
            showAlert({
                message,
                type: "error",
                autoDismiss: true,
                duration: 3000,
            });
        } finally {
            setLoadingItemId(null);
        }
    };

    const handleRemoveItem = async (id: string) => {
        try {
            await ProductsService.removeCartItem(id);
            showAlert({
                message: "Item removed from cart",
                type: "info",
                autoDismiss: true,
                duration: 2500,
            });
            fetchCart();
        } catch (error) {
            showAlert({
                message: "Error removing item",
                type: "error",
                autoDismiss: true,
                duration: 3000,
            });
            console.error("Error removing cart item", error);
        }
    };

      const handleBuyNowClick = () => {
         router.push('/deliveryAddress');
      };

    const subtotal = totalAmount
    const totalSavings = cartItems
    .filter(item => item?.product)
    .reduce(
        (acc, item) =>
            acc +
            ((item.product?.actualPrice ?? 0) - (item.product?.discountedPrice ?? 0)) *
                (item.quantity ?? 0),
            0
    );


    if (loading)
        return (
            <div className={styles.loaderWrapper}>
                <div className={styles.loaderCom}></div>
            </div>
        );

    return (
        <>
            <div className={styles.container}>
                <div className={styles.head}>
                    <h3>Shopping Cart</h3>
                    <p>{cartItems.length} items in your cart</p>
                </div>

                <div className={styles.content}>
                    <div className={styles.left}>
                        {cartItems.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                {loadingItemId === item.id && (
                                    <div className={styles.itemLoaderOverlay}>
                                        <div className={styles.loader}></div>
                                    </div>
                                )}

                                <div className={styles.imageWrapper}>
                                    <Image
                                        src="/c1.png"
                                        alt={item?.product?.name || "Product image"}
                                        width={128}
                                        height={144}
                                        className={styles.productImage}
                                    />
                                </div>

                                <div className={styles.details}>
                                    <h4>{item?.product?.name}</h4>
                                    <p>{item?.product?.description}</p>
                                    <div className={styles.priceRow}>
                                        <span className={styles.discountedPrice}>₹{item?.product?.discountedPrice}</span>
                                        <span className={styles.actualPrice}>₹{item?.product?.actualPrice}</span>
                                    </div>
                                    <span className={styles.savings}>
                                        You save ₹{(item?.product?.actualPrice - item?.product?.discountedPrice).toFixed(2)}
                                    </span>
                                    <span className={styles.stockBadge}>In Stock</span>

                                    <BsX className={styles.closeIcon} onClick={() => handleRemoveItem(item.id)} />

                                    <div className={styles.quantityControl}>
                                        <button className={styles.qtyBtn} onClick={() => handleQuantityChange(item, -1)}>-</button>
                                        <span className={styles.quantityn}>{item.quantity}</span>
                                        <button className={styles.qtyBtn} onClick={() => handleQuantityChange(item, 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                <div className={styles.couponSection}>
                    <h5 className={styles.couponHeading}>
                        <span className={styles.couponIcon}><BsTag /> </span> Apply Coupon
                    </h5>
                    <div className={styles.couponInputRow}>
                        <input
                        type="text"
                        placeholder="Enter coupon code"
                        className={styles.couponInput}
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value)}
                        disabled={couponLoading}
                        />
                        <button
                        className={styles.couponApplyBtn}
                        disabled={couponLoading}
                        onClick={handleApplyCoupon}
                        >
                        {couponLoading ? "Applying..." : "Apply"}
                        </button>
                    </div>
                    <hr className={styles.couponDivider} />
                    <p className={styles.availableCoupons}>Available Coupons:</p>
                    <div className={styles.availableCouponBox}>
                        <div>
                        <p className={styles.couponCode}>SAVE10</p>
                        <p className={styles.couponDescription}>Get ₹130 off on orders above ₹999</p>
                        </div>
                        <button className={styles.couponSmallBtn} onClick={() => setCouponInput("SAVE10")}>APPLY</button>
                    </div>
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
                            <span className={styles.proSavingsN}>FREE</span>
                        </div>
                        <hr />
                        <div className={styles.total}>
                            <span className={styles.totalN}>Total Amount</span>
                            <span className={styles.totalA}>₹{subtotal.toFixed(2)}</span>
                        </div>
                        {/* <button className={styles.addToCartBtn}>Add to cart</button> */}
                        <button onClick={handleBuyNowClick} className={styles.buyNowBtn}>Buy Now</button>
                        <p className={styles.subInfoSub}><BsRepeat color="#A31157" size={15} /> Subscribe & Save 10%</p>
                        <p className={styles.subInfo}><BsShield color="#A31157" size={15} /> Secure Checkout</p>
                        <p className={styles.subInfo}><BsShield color="#A31157" size={15} /> Easy 30-day Returns</p>
                    </div>
                </div>
            </div>

            <Random />

            <Solution />

            <div className={styles.countsWrapper}>
                <Counts />
            </div>

            <Test />
            <Subscribe />
        </>
    );
}
