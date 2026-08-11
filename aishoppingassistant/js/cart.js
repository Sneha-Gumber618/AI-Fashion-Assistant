/**
 * AI Shopping Assistant (ShopAI) - Cart Page Controller with Real Product Images
 */

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-items-container');
    const summaryContainer = document.getElementById('cart-summary');

    if (!cartContainer) return;

    function renderCartPage() {
        const rawCart = getCart();
        const allProducts = getProducts();

        const cartItems = rawCart.map(item => {
            const product = getProductById(item.productId);
            return {
                ...item,
                product: product
            };
        }).filter(item => item.product !== undefined);

        if (cartItems.length === 0) {
            cartContainer.innerHTML = `
                <div style="text-align: center; padding: 4rem 1rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
                    <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Your Shopping Cart is Empty</h3>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">Looks like you haven't added any products yet.</p>
                    <a href="products.html" class="btn btn-primary">Start Shopping Now</a>
                </div>
            `;
            if (summaryContainer) summaryContainer.style.display = 'none';
            return;
        }

        if (summaryContainer) summaryContainer.style.display = 'block';

        const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        const FREE_SHIPPING_THRESHOLD = 999;
        const deliveryCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 79;
        const grandTotal = subtotal + deliveryCharge;

        cartContainer.innerHTML = `
            <div style="margin-bottom: 1.25rem; font-weight: 800; color: var(--dark); font-size: 1.1rem;">
                Cart Items (${cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </div>
            ${cartItems.map(item => `
                <div class="cart-item">
                    <div class="cart-item-icon">
                        <img src="${item.product.image}" alt="${item.product.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'">
                    </div>
                    <div>
                        <a href="product.html?id=${item.product.id}" style="font-weight: 800; color: var(--dark); font-size: 1.05rem; display: block;">
                            ${item.product.name}
                        </a>
                        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">${item.product.category}</div>
                        <div style="font-size: 0.9rem; font-weight: 800; color: var(--primary); margin-top: 0.25rem;">
                            ${formatCurrency(item.product.price)} each
                        </div>
                    </div>

                    <!-- Quantity Control -->
                    <div class="qty-control">
                        <button class="qty-btn" onclick="handleQuantityChange(${item.productId}, ${item.quantity - 1})">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="handleQuantityChange(${item.productId}, ${item.quantity + 1})">+</button>
                    </div>

                    <!-- Item Total -->
                    <div style="font-weight: 900; font-size: 1.1rem; text-align: right; color: var(--dark);">
                        ${formatCurrency(item.product.price * item.quantity)}
                    </div>

                    <!-- Remove Action -->
                    <button class="remove-btn" onclick="handleRemoveItem(${item.productId})" title="Remove item">
                        🗑️
                    </button>
                </div>
            `).join('')}
        `;

        summaryContainer.innerHTML = `
            <h3 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 1.25rem; color: var(--dark);">
                Order Summary
            </h3>

            ${subtotal >= FREE_SHIPPING_THRESHOLD ? `
                <div class="shipping-banner">
                    🎉 You qualify for FREE Delivery!
                </div>
            ` : `
                <div class="shipping-banner" style="background: #fffbeb; color: #92400e; border-color: #fcd34d;">
                    💡 Add ${formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for FREE Delivery
                </div>
            `}

            <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>

            <div class="summary-row">
                <span>Delivery Charge</span>
                <span>${deliveryCharge === 0 ? '<strong style="color: var(--pastel-mint);">FREE</strong>' : formatCurrency(deliveryCharge)}</span>
            </div>

            <div class="summary-row total">
                <span>Total</span>
                <span>${formatCurrency(grandTotal)}</span>
            </div>

            <button id="checkout-btn" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; padding: 1rem;">
                Proceed to Checkout →
            </button>

            <a href="products.html" style="display: block; text-align: center; font-size: 0.875rem; color: var(--text-muted); font-weight: 700; margin-top: 1rem;">
                ← Continue Shopping
            </a>
        `;

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                showToast("🎉 Order placed successfully! Thank you for shopping with ShopAI.");
            });
        }
    }

    window.handleQuantityChange = function(productId, newQty) {
        updateCartQuantity(productId, newQty);
        renderCartPage();
    };

    window.handleRemoveItem = function(productId) {
        removeFromCart(productId);
        renderCartPage();
    };

    renderCartPage();
});
