
document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const resultsCount = document.getElementById('results-count');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const categoryPillContainer = document.getElementById('category-pills');

    if (!productsGrid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category') || 'All';

    let state = {
        searchQuery: '',
        category: initialCategory,
        sortBy: 'featured'
    };

    function renderCategoryPills() {
        const categories = ['All', 'Skincare', 'Electronics', 'Fashion', 'Home'];
        categoryPillContainer.innerHTML = categories.map(cat => `
            <button class="pill-btn ${cat.toLowerCase() === state.category.toLowerCase() ? 'active' : ''}" 
                    data-category="${cat}">
                ${cat}
            </button>
        `).join('');

        document.querySelectorAll('.pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                state.category = e.target.dataset.category;
                renderCategoryPills();
                renderProducts();
            });
        });
    }

    function getProcessedProducts() {
        let list = getProducts();

        if (state.category && state.category.toLowerCase() !== 'all') {
            list = list.filter(p => p.category.toLowerCase() === state.category.toLowerCase());
        }

        if (state.searchQuery.trim() !== '') {
            const query = state.searchQuery.toLowerCase().trim();
            list = list.filter(p => 
                p.name.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        switch (state.sortBy) {
            case 'price-low':
                list = list.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                list = list.sort((a, b) => b.price - a.price);
                break;
            case 'rating-high':
                list = list.sort((a, b) => b.rating - a.rating);
                break;
            case 'featured':
            default:
                break;
        }

        return list;
    }

    function renderProducts() {
        const filteredList = getProcessedProducts();

        resultsCount.textContent = `${filteredList.length} ${filteredList.length === 1 ? 'product' : 'products'} found`;

        if (filteredList.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">No matching products found</h3>
                    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try adjusting your search term or clearing the filters.</p>
                    <button id="empty-clear-btn" class="btn btn-primary btn-sm">Clear All Filters</button>
                </div>
            `;
            const emptyClear = document.getElementById('empty-clear-btn');
            if (emptyClear) emptyClear.addEventListener('click', resetFilters);
            return;
        }

        productsGrid.innerHTML = filteredList.map(p => `
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
                        <span>(${p.reviews} reviews)</span>
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
    }

    function resetFilters() {
        state.searchQuery = '';
        state.category = 'All';
        state.sortBy = 'featured';
        searchInput.value = '';
        sortSelect.value = 'featured';
        renderCategoryPills();
        renderProducts();
    }

    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderProducts();
    });

    sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderProducts();
    });

    clearFiltersBtn.addEventListener('click', resetFilters);

    renderCategoryPills();
    renderProducts();
});
