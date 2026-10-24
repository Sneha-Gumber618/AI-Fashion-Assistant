export const AVAILABLE_COUPONS = [
  {
    code: "STYLE20",
    discountPercent: 20,
    maxDiscount: 1000,
    minOrder: 500,
    description: "20% OFF on all orders above ₹500 (Max discount ₹1,000)"
  },
  {
    code: "FIRST50",
    flatDiscount: 500,
    minOrder: 2000,
    description: "Flat ₹500 OFF on orders above ₹2,000"
  },
  {
    code: "SAVE10",
    discountPercent: 10,
    maxDiscount: 500,
    minOrder: 300,
    description: "10% OFF on minimum order ₹300"
  },
  {
    code: "FREESHIP",
    freeShipping: true,
    minOrder: 0,
    description: "Free Delivery on any order value!"
  }
];

export function validateCoupon(code, subtotal) {
  const normalized = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS.find(c => c.code === normalized);
  if (!coupon) {
    return { valid: false, message: "Invalid coupon code. Try STYLE20 or SAVE10." };
  }
  if (subtotal < coupon.minOrder) {
    return { valid: false, message: `Minimum order amount of ₹${coupon.minOrder} required for ${coupon.code}.` };
  }

  let discount = 0;
  if (coupon.discountPercent) {
    discount = Math.round((subtotal * coupon.discountPercent) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.flatDiscount) {
    discount = coupon.flatDiscount;
  }

  return {
    valid: true,
    coupon,
    discount,
    freeShipping: !!coupon.freeShipping,
    message: `Coupon "${coupon.code}" applied! You saved ₹${discount}${coupon.freeShipping ? ' + Free Shipping' : ''}.`
  };
}
