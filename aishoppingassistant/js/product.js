/**
 * AI Shopping Assistant (ShopAI) - Product Detail Controller with Real Images
 */

document.addEventListener('DOMContentLoaded', () => {
    const detailContainer = document.getElementById('product-detail-container');
    const similarContainer = document.getElementById('similar-products-grid');

    if (!detailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        renderNotFound("No product specified.");
        return;
    }

    const product = getProductById(productId);

    if (!product) {
        renderNotFound("The product you are looking for could not be found.");
        return;
    }

    document.title = `${product.name} - ShopAI`;

    detailContainer.innerHTML = `
        <div class="detail-grid">
            <!-- Left: Large Product Photo -->
            <div class="detail-visual">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'">
            </div>

            <!-- Right: Product Info -->
            <div class="detail-info">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                    <span class="product-category">${product.category}</span>
                    <span class="product-badge" style="position: static;">${product.badge}</span>
                </div>
                <h1>${product.name}</h1>

                <div class="product-rating" style="margin-bottom: 1rem;">
                    <span class="stars">★ ${product.rating}</span>
                    <span>(${product.reviews} customer reviews)</span>
                </div>

                <div class="detail-price">${formatCurrency(product.price)}</div>

                <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
                    ${product.description}
                </p>

                <h4 style="font-size: 1rem; font-weight: 800; color: var(--dark); margin-bottom: 0.75rem;">Key Highlights & Features:</h4>
                <ul class="feature-list">
                    ${product.features.map(f => `<li>${f}</li>`).join('')}
                </ul>

                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" style="flex: 1;">
                        🛒 Add to Cart
                    </button>
                    <a href="chat.html?query=${encodeURIComponent('Is ' + product.name + ' worth buying for ' + formatCurrency(product.price) + '?')}" class="btn btn-secondary" style="flex: 1;">
                        ✨ Ask AI About This
                    </a>
                </div>
            </div>
        </div>
    `;

    if (similarContainer) {
        const allProducts = getProducts();
        const similar = allProducts
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 3);

        if (similar.length > 0) {
            similarContainer.innerHTML = similar.map(p => `
                <div class="product-card">
                    <div class="product-image-container">
                        <span class="product-badge">${p.badge}</span>
                        <img src="${p.image}" alt="${p.name}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'">
                    </div>
                    <div class="product-content">
                        <span class="product-category">${p.category}</span>
                        <h3 class="product-title">
                            <a href="product.html?id=${p.id}">${p.name}</a>
                        </h3>
                        <div class="product-rating">
                            <span class="stars">★ ${p.rating}</span>
                            <span>(${p.reviews})</span>
                        </div>
                        <div class="product-footer">
                            <span class="product-price">${formatCurrency(p.price)}</span>
                            <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})">
                                + Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            similarContainer.parentElement.style.display = 'none';
        }
    }

    function renderNotFound(message) {
        detailContainer.innerHTML = `
            <div style="text-align: center; padding: 5rem 1rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🛍️</div>
                <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem;">Product Not Found</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">${message}</p>
                <a href="products.html" class="btn btn-primary">Back to Catalog</a>
            </div>
        `;
        if (similarContainer && similarContainer.parentElement) {
            similarContainer.parentElement.style.display = 'none';
        }
    }
});
