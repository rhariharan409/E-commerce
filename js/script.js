// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const productGrid = document.getElementById('productGrid');

// Cart/Wishlist/Modals
const cartBtn = document.getElementById('cartBtn');
const wishlistBtn = document.getElementById('wishlistBtn');
const cartModal = document.getElementById('cartModal');
const wishlistModal = document.getElementById('wishlistModal');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutBtn = document.getElementById('checkoutBtn');
const placeOrderBtn = document.getElementById('placeOrderBtn');

// Sample product data
const products = [
    { id: 1, name: 'Smartphone', price: 499.99, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80', description: 'Latest model smartphone with high-end features' },
    { id: 2, name: 'Laptop', price: 999.99, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80', description: 'Powerful laptop for work and gaming' },
    { id: 3, name: 'Headphones', price: 99.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80', description: 'Wireless noise-canceling headphones' },
    { id: 4, name: 'Smartwatch', price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80', description: 'Fitness tracking smartwatch' },
    { id: 5, name: 'Camera', price: 699.99, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80', description: 'Professional DSLR camera' },
    { id: 6, name: 'Gaming Console', price: 399.99, image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=500&q=80', description: 'Next-gen gaming console' }
];

// User management via localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Cart and wishlist state (per session / per user)
let cart = [];
let wishlist = [];
if (currentUser) {
    cart = JSON.parse(JSON.stringify(currentUser.cart || []));
    wishlist = JSON.parse(JSON.stringify(currentUser.wishlist || []));
}

function saveUserData() {
    if (!currentUser) return;
    currentUser.cart = cart;
    currentUser.wishlist = wishlist;
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) users[idx] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// UI: Load products
function loadProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="price">$${product.price}</p>
            <div class="actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="add-to-wishlist" onclick="addToWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Login/Registration handling
function updateLoginStatus() {
    if (!loginBtn || !registerBtn) return;
    if (currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        registerBtn.innerHTML = 'Logout';
        registerBtn.onclick = handleLogout;
    } else {
        loginBtn.innerHTML = 'Login';
        registerBtn.innerHTML = 'Register';
        registerBtn.onclick = () => registerModal.style.display = 'block';
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    cart = [];
    wishlist = [];
    updateCartCount();
    updateWishlistCount();
    updateLoginStatus();
    updateOrdersList();
    alert('Logged out successfully!');
}

// Login form
if (loginForm) {
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        if (!validateEmail(email)) { alert('Please enter a valid email address'); return; }
        if (password.length < 6) { alert('Password must be at least 6 characters long'); return; }
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            cart = JSON.parse(JSON.stringify(currentUser.cart || []));
            wishlist = JSON.parse(JSON.stringify(currentUser.wishlist || []));
            updateCartCount();
            updateWishlistCount();
            updateLoginStatus();
            updateOrdersList();
            loginModal.style.display = 'none';
            alert('Login successful!');
        } else {
            alert('Invalid email or password');
        }
    };
}

// Register form
if (registerForm) {
    registerForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (name.length < 2) { alert('Please enter a valid name'); return; }
        if (!validateEmail(email)) { alert('Please enter a valid email address'); return; }
        if (password.length < 6) { alert('Password must be at least 6 characters long'); return; }
        if (password !== confirmPassword) { alert('Passwords do not match'); return; }
        if (users.some(u => u.email === email)) { alert('Email already registered'); return; }
        const newUser = { id: Date.now(), name, email, password, cart: [], wishlist: [], orders: [] };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        cart = [];
        wishlist = [];
        updateCartCount();
        updateWishlistCount();
        updateLoginStatus();
        updateOrdersList();
        registerModal.style.display = 'none';
        alert('Registration successful! Logged in.');
    };
}

// Cart/Wishlist functions
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = cart.reduce((t, i) => t + (i.quantity || 0), 0);
}
function updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) wishlistCount.textContent = wishlist.length;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(i => i.id === productId);
    if (existing) existing.quantity += 1; else cart.push({ ...product, quantity: 1 });
    saveUserData();
    updateCartCount();
    updateCartModal();
    alert(`${product.name} added to cart`);
}

function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (!wishlist.some(i => i.id === productId)) wishlist.push(product);
    saveUserData();
    updateWishlistCount();
    updateWishlistModal();
    alert(`${product.name} added to wishlist`);
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartItems) return;
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="item-card">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price}</p>
                    <div class="item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <i class="fas fa-times remove-item" onclick="removeFromCart(${item.id})"></i>
            </div>
        `;
    }).join('');
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
}

function updateWishlistModal() {
    const wishlistItems = document.getElementById('wishlistItems');
    if (!wishlistItems) return;
    wishlistItems.innerHTML = wishlist.map(item => `
        <div class="item-card">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price}</p>
                <button class="add-to-cart" onclick="moveToCart(${item.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
            <i class="fas fa-times remove-item" onclick="removeFromWishlist(${item.id})"></i>
        </div>
    `).join('');
}

function updateQuantity(productId, newQty) {
    if (newQty < 1) return removeFromCart(productId);
    const it = cart.find(i => i.id === productId);
    if (it) { it.quantity = newQty; saveUserData(); updateCartCount(); updateCartModal(); }
}
function removeFromCart(productId) { cart = cart.filter(i => i.id !== productId); saveUserData(); updateCartCount(); updateCartModal(); }
function removeFromWishlist(productId) { wishlist = wishlist.filter(i => i.id !== productId); saveUserData(); updateWishlistCount(); updateWishlistModal(); }
function moveToCart(productId) { addToCart(productId); removeFromWishlist(productId); }

// Checkout
function openCheckout() {
    if (!currentUser) { alert('Please login/register to checkout'); registerModal.style.display = 'block'; return; }
    if (!cart || cart.length === 0) { alert('Cart is empty'); return; }
    const summary = document.getElementById('checkoutSummary');
    const totalEl = document.getElementById('checkoutTotal');
    let total = 0;
    summary.innerHTML = cart.map(it => { total += it.price * it.quantity; return `
        <div class="item-card">
            <img src="${it.image}" alt="${it.name}">
            <div class="item-details"><h4>${it.name} x ${it.quantity}</h4><p class="item-price">$${(it.price*it.quantity).toFixed(2)}</p></div>
        </div>` }).join('');
    if (totalEl) totalEl.textContent = total.toFixed(2);
    const shipName = document.getElementById('shipName'); if (shipName) shipName.value = currentUser.name || '';
    if (checkoutModal) checkoutModal.style.display = 'block';
}

function placeOrder() {
    if (!currentUser) { alert('Please login/register'); registerModal.style.display = 'block'; return; }
    if (!cart || cart.length === 0) { alert('Cart empty'); return; }
    const name = document.getElementById('shipName').value.trim();
    const address = document.getElementById('shipAddress').value.trim();
    const city = document.getElementById('shipCity').value.trim();
    const phone = document.getElementById('shipPhone').value.trim();
    if (!name || !address || !city || !phone) { alert('Fill shipping info'); return; }
    const total = cart.reduce((s,i)=>s + i.price*i.quantity,0);
    const order = { id: Date.now(), items: JSON.parse(JSON.stringify(cart)), total: total.toFixed(2), shipping: {name:address,city,phone}, date: new Date().toISOString(), status: 'Processing' };
    currentUser.orders = currentUser.orders || [];
    currentUser.orders.push(order);
    cart = [];
    saveUserData();
    updateCartCount(); updateCartModal(); updateOrdersList();
    if (checkoutModal) checkoutModal.style.display = 'none';
    alert('Order placed successfully');
}

function updateOrdersList() {
    const ordersEl = document.getElementById('ordersList');
    if (!ordersEl) return;
    if (!currentUser || !currentUser.orders || currentUser.orders.length === 0) { ordersEl.innerHTML = '<p class="muted">No orders yet.</p>'; return; }
    ordersEl.innerHTML = currentUser.orders.slice().reverse().map(o => `
        <div class="item-card">
            <div class="item-details">
                <h4>Order #${o.id}</h4>
                <p class="muted">${new Date(o.date).toLocaleString()}</p>
                <p>Total: $${o.total} - ${o.status}</p>
                <details>
                    <summary>Items (${o.items.length})</summary>
                    ${o.items.map(it=>`<div>${it.name} x ${it.quantity} - $${it.price}</div>`).join('')}
                </details>
            </div>
        </div>
    `).join('');
}

// Modal interactions (close buttons)
Array.from(document.getElementsByClassName('close')).forEach(btn => {
    btn.onclick = () => {
        if (cartModal) cartModal.style.display = 'none';
        if (wishlistModal) wishlistModal.style.display = 'none';
        if (loginModal) loginModal.style.display = 'none';
        if (registerModal) registerModal.style.display = 'none';
        if (checkoutModal) checkoutModal.style.display = 'none';
    }
});

window.onclick = (e) => {
    if (e.target === cartModal) cartModal.style.display = 'none';
    if (e.target === wishlistModal) wishlistModal.style.display = 'none';
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
    if (e.target === checkoutModal) checkoutModal.style.display = 'none';
}

// Wire up modal buttons
if (loginBtn) loginBtn.onclick = () => loginModal.style.display = 'block';
if (registerBtn) registerBtn.onclick = () => registerModal.style.display = 'block';
if (cartBtn) cartBtn.onclick = () => { if (cartModal) { cartModal.style.display = 'block'; updateCartModal(); } };
if (wishlistBtn) wishlistBtn.onclick = () => { if (wishlistModal) { wishlistModal.style.display = 'block'; updateWishlistModal(); } };
if (checkoutBtn) checkoutBtn.onclick = () => openCheckout();
if (placeOrderBtn) placeOrderBtn.onclick = (e) => { e.preventDefault(); placeOrder(); };

// Initialize UI
loadProducts();
updateCartCount();
updateWishlistCount();
updateLoginStatus();
updateOrdersList();