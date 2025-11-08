import api from "../lib/axios"; 

export default class CouponsService {
  static async applyCoupon({ cartId, couponName, token }: { cartId: string; couponName: string; token: string }) {
    return api.post(
      "http://31.97.237.63/luvwish/v1/coupons", // Use your actual apply endpoint, NOT the creation endpoint
      { cartId, couponName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}
