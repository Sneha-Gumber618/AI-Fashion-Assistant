document.addEventListener('DOMContentLoaded', () => {
    const loginPanel = document.getElementById('admin-login-panel');
    const dashboard = document.getElementById('admin-dashboard');
    const adminNavLogoutItem = document.getElementById('admin-nav-logout-item');
    const registerPage = document.getElementById('admin-register-page');
    const loginPage = document.getElementById('admin-login-page');
    const registerForm = document.getElementById('admin-register-form');
    const loginForm = document.getElementById('admin-login-form');
    const productForm = document.getElementById('product-form');
    const productsList = document.getElementById('admin-products-list');
    const productCount = document.getElementById('admin-product-count');
    const loginMessage = document.getElementById('admin-login-message');
    const registerMessage = document.getElementById('admin-register-message');
    const formMessage = document.getElementById('product-form-message');
    const showRegisterButton = document.getElementById('show-register-btn');
    const showLoginButton = document.getElementById('show-login-btn');

    function showAuthPage(page) {
        const isRegistering = page === registerPage;
        registerPage.hidden = !isRegistering;
        loginPage.hidden = isRegistering;
    }

    function renderAdminProducts() {
        const adminProducts = getAdminProducts();
        productCount.textContent = `${adminProducts.length} added`;
        productsList.innerHTML = adminProducts.length ? adminProducts.map(product => `
            <article class="admin-product-row">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'">
                <div><strong>${product.name}</strong><span>${product.category} · ${formatCurrency(product.price)}</span></div>
                <button class="admin-delete-btn" data-id="${product.id}" title="Delete product">Delete</button>
            </article>
        `).join('') : '<p class="admin-empty-state">No seller products yet. Publish your first one.</p>';

        productsList.querySelectorAll('.admin-delete-btn').forEach(button => {
            button.addEventListener('click', () => {
                const remaining = getAdminProducts().filter(product => product.id !== Number(button.dataset.id));
                saveAdminProducts(remaining);
                renderAdminProducts();
                showToast('Product removed from the catalog.');
            });
        });
    }

    function showDashboard() {
        loginPanel.hidden = true;
        dashboard.hidden = false;
        adminNavLogoutItem.hidden = false;
        renderAdminProducts();
    }

    if (isAdmin()) showDashboard();

    showRegisterButton.addEventListener('click', () => showAuthPage(registerPage));
    showLoginButton.addEventListener('click', () => showAuthPage(loginPage));

    registerForm.addEventListener('submit', event => {
        event.preventDefault();
        const password = document.getElementById('register-admin-password').value;
        const confirmPassword = document.getElementById('admin-confirm-password').value;

        if (password !== confirmPassword) {
            registerMessage.textContent = 'Passwords do not match.';
            registerMessage.className = 'admin-message error';
            return;
        }

        const result = registerAdmin({
            name: document.getElementById('admin-name').value,
            adminId: document.getElementById('register-admin-id').value,
            password
        });
        registerMessage.textContent = result.message;
        registerMessage.className = `admin-message ${result.success ? 'success' : 'error'}`;
        if (result.success) {
            registerForm.reset();
            showAuthPage(loginPage);
            document.getElementById('admin-id').value = result.user.adminId;
            loginMessage.textContent = 'Account created. Enter your password to log in.';
            loginMessage.className = 'admin-message success';
        }
    });

    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const result = loginAdmin({
            adminId: document.getElementById('admin-id').value,
            password: document.getElementById('admin-password').value
        });
        loginMessage.textContent = result.message;
        loginMessage.className = `admin-message ${result.success ? 'success' : 'error'}`;
        if (result.success) showDashboard();
    });

    document.getElementById('admin-logout-btn').addEventListener('click', () => {
        logoutUser();
        dashboard.hidden = true;
        loginPanel.hidden = false;
        adminNavLogoutItem.hidden = true;
        showAuthPage(registerPage);
        registerForm.reset();
        loginForm.reset();
        loginMessage.textContent = 'You have been logged out.';
        loginMessage.className = 'admin-message success';
    });

    productForm.addEventListener('submit', event => {
        event.preventDefault();
        if (!isAdmin()) return;

        const adminProducts = getAdminProducts();
        const newProduct = {
            id: Date.now(),
            name: document.getElementById('product-name').value.trim(),
            category: document.getElementById('product-category').value,
            price: Number(document.getElementById('product-price').value),
            rating: 0,
            reviews: 0,
            icon: '🛍️',
            badge: document.getElementById('product-badge').value.trim(),
            image: document.getElementById('product-image').value.trim(),
            description: document.getElementById('product-description').value.trim(),
            features: document.getElementById('product-features').value.split('\n').map(feature => feature.trim()).filter(Boolean)
        };

        adminProducts.push(newProduct);
        saveAdminProducts(adminProducts);
        productForm.reset();
        document.getElementById('product-badge').value = 'New Arrival';
        formMessage.textContent = 'Product published successfully.';
        formMessage.className = 'admin-message success';
        renderAdminProducts();
    });
});