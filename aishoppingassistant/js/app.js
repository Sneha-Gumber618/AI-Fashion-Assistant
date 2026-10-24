/**
 * AI Shopping Assistant (ShopAI) - Core App Controller, Scroll Observer & Cart Manager
 * Aesthetic Pastel & Interactive Upgrade
 */

const CART_STORAGE_KEY = 'shopai_cart';

/**
 * Retrieve cart contents from LocalStorage
 * @returns {Array} List of cart item objects { productId, quantity }
 */
function getCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Error reading cart from LocalStorage:", e);
        return [];
    }
}

/**
 * Save cart contents to LocalStorage
 * @param {Array} cart 
 */
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartBadge();
    } catch (e) {
        console.error("Error saving cart to LocalStorage:", e);
    }
}

/**
 * Add a product to the cart
 * @param {number|string} productId 
 * @param {number} quantity 
 */
function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.productId === Number(productId));

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ productId: Number(productId), quantity: quantity });
    }

    saveCart(cart);

    // Fetch product details for toast
    const product = typeof getProductById === 'function' ? getProductById(productId) : null;
    const productName = product ? product.name : 'Product';
    showToast(`✨ Added <strong>${productName}</strong> to cart! 🛍️`);
}

/**
 * Remove a product from the cart
 * @param {number|string} productId 
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== Number(productId));
    saveCart(cart);
    showToast(`Removed item from cart.`);
}

/**
 * Update quantity of a product in the cart
 * @param {number|string} productId 
 * @param {number} quantity 
 */
function updateCartQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(i => i.productId === Number(productId));
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        item.quantity = quantity;
        saveCart(cart);
    }
}

/**
 * Calculate total count of items in cart using reduce()
 * @returns {number} Total item count
 */
function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Update dynamic cart badge in navbar
 */
function updateCartBadge() {
    const badgeElements = document.querySelectorAll('.cart-badge');
    const count = getCartCount();
    badgeElements.forEach(badge => {
        badge.textContent = `Cart (${count})`;
    });
}

/**
 * Display toast notification
 * @param {string} message 
 */
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 350);
    }, 2800);
}

/**
 * Helper to format Indian Rupee prices
 * @param {number} amount 
 * @returns {string} e.g. ₹1,299
 */
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

/**
 * Highlight active link in navbar based on current filename
 */
function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Setup Scroll-Triggered Reveal Animations (IntersectionObserver)
 * Triggers dynamic text and card fade-up on scroll
 */
function initScrollObserver() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('reveal-visible'));
    }

    // Scroll Navbar Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Inject Floating Interactive AI Assistant Widget into every page
 */
function initFloatingAIWidget() {
    // Only add on pages that aren't chat.html
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPath === 'chat.html') return;

    const triggerBtn = document.createElement('button');
    triggerBtn.className = 'ai-widget-trigger';
    triggerBtn.innerHTML = `<span>🤖</span> Ask ShopAI`;
    document.body.appendChild(triggerBtn);

    const modal = document.createElement('div');
    modal.className = 'ai-widget-modal';
    modal.innerHTML = `
        <div class="chat-header-bar" style="border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.3rem;">🤖</span>
                <div>
                    <strong style="font-size: 0.95rem; color: var(--dark);">ShopAI Assistant</strong>
                    <div style="font-size: 0.75rem; color: var(--pastel-mint); font-weight: 700;">● Online</div>
                </div>
            </div>
            <button id="close-widget-btn" style="background: transparent; font-size: 1.25rem; color: var(--text-muted); cursor: pointer;">✕</button>
        </div>
        <div id="widget-messages" class="chat-messages" style="flex: 1; padding: 1rem; font-size: 0.88rem;">
            <div class="chat-msg assistant">
                <div class="msg-content">
                    Hi! I'm ShopAI 👋 Ask me anything about sunscreen, headphones, sneakers or home decor!
                </div>
            </div>
        </div>
        <div class="chat-input-bar" style="padding: 0.85rem 1rem;">
            <input type="text" id="widget-input" placeholder="Ask AI..." style="padding: 0.65rem 1rem; font-size: 0.85rem;">
            <button id="widget-send-btn" class="btn btn-primary btn-sm" style="padding: 0.65rem 1rem;">Send</button>
        </div>
    `;
    document.body.appendChild(modal);

    triggerBtn.addEventListener('click', () => {
        modal.classList.toggle('active');
    });

    document.getElementById('close-widget-btn').addEventListener('click', () => {
        modal.classList.remove('active');
    });

    const widgetInput = document.getElementById('widget-input');
    const widgetSendBtn = document.getElementById('widget-send-btn');
    const widgetMessages = document.getElementById('widget-messages');

    function sendWidgetMsg() {
        const query = widgetInput.value.trim();
        if (!query) return;

        // User msg
        const userDiv = document.createElement('div');
        userDiv.className = 'chat-msg user';
        userDiv.innerHTML = `<div class="msg-content">${query}</div>`;
        widgetMessages.appendChild(userDiv);
        widgetInput.value = '';
        widgetMessages.scrollTop = widgetMessages.scrollHeight;

        // Assistant reply
        setTimeout(() => {
            if (typeof generateAIResponse === 'function') {
                const res = generateAIResponse(query);
                const botDiv = document.createElement('div');
                botDiv.className = 'chat-msg assistant';
                
                let prodsHTML = '';
                if (res.products && res.products.length > 0) {
                    prodsHTML = `<div style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.4rem;">
                        ${res.products.slice(0, 2).map(p => `
                            <div style="background: rgba(248,250,252,0.9); padding: 0.5rem; border-radius: 8px; font-size: 0.8rem; display: flex; align-items: center; justify-content: space-between;">
                                <span>${p.icon} <strong>${p.name}</strong> (${formatCurrency(p.price)})</span>
                                <button onclick="addToCart(${p.id})" class="btn btn-primary btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.7rem;">+ Add</button>
                            </div>
                        `).join('')}
                    </div>`;
                }

                botDiv.innerHTML = `<div class="msg-content">${res.text} ${prodsHTML}</div>`;
                widgetMessages.appendChild(botDiv);
            } else {
                const botDiv = document.createElement('div');
                botDiv.className = 'chat-msg assistant';
                botDiv.innerHTML = `<div class="msg-content">Check out our catalog or click AI Assistant for deep search! ✨</div>`;
                widgetMessages.appendChild(botDiv);
            }
            widgetMessages.scrollTop = widgetMessages.scrollHeight;
        }, 400);
    }

    widgetSendBtn.addEventListener('click', sendWidgetMsg);
    widgetInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendWidgetMsg();
    });
}

// Global page initialization
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNav();
    updateCartBadge();
    initScrollObserver();
    initFloatingAIWidget();
});
