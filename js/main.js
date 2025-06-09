// Array de productos
const products = [
    { id: 1, name: "Cemento Portland 50kg", price: 125.00, image: "assets/cemento.jpg", category: "cemento", brand: "Sol" },
    { id: 2, name: "Arena Fina (m³)", price: 350.00, image: "assets/arena.jpg", category: "arena", brand: "ConstruMax" },
    { id: 3, name: "Grava 3/4 (m³)", price: 400.00, image: "assets/grava.jpg", category: "grava", brand: "Atlas" },
    { id: 4, name: "Bloques de Concreto (unidad)", price: 8.50, image: "assets/bloques.jpg", category: "bloques", brand: "Cemex" },
    { id: 5, name: "Piedra Chancada (m³)", price: 380.00, image: "assets/grava.jpg", category: "grava", brand: "ConstruMax" },
    { id: 6, name: "Cemento Gris 42.5kg", price: 110.00, image: "assets/cemento.jpg", category: "cemento", brand: "Sol" },
    { id: 7, name: "Arena Gruesa (m³)", price: 320.00, image: "assets/arena.jpg", category: "arena", brand: "ConstruMax" },
    { id: 8, name: "Bloques de Hormigón (unidad)", price: 9.00, image: "assets/bloques.jpg", category: "bloques", brand: "Cemex" }
];

// Variables
let cart = [];

const productsGrid = document.getElementById('products-grid');
const categoryFilter = document.getElementById('category-filter');
const brandFilter = document.getElementById('brand-filter');
const minPriceFilter = document.getElementById('min-price');
const maxPriceFilter = document.getElementById('max-price');
const applyFiltersBtn = document.getElementById('apply-filters');

const cartButton = document.getElementById('cart-button');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// Cargar carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
    }
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Renderizar productos
function renderProducts(filteredProducts = products) {
    if (!productsGrid) return; // Si la página no tiene grid (ej: contacto.html)

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart btn" data-id="${product.id}">Agregar al carrito</button>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Agregar producto al carrito
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);

    if (product) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart();
        updateCart();
        showCart();
    }
}

// Actualizar carrito
function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (!cartItemsContainer) return; // Si la página no tiene carrito (ej: contacto.html)

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Eliminar</button>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });

        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Manejar cambios de cantidad
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }

        saveCart();
        updateCart();
    }
}

function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += 1;
        saveCart();
        updateCart();
    }
}

function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
}

// Finalizar compra
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    alert('Compra realizada');
    cart = [];
    saveCart();
    updateCart();
    hideCart();
}

// Mostrar/ocultar carrito
function showCart() {
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideCart() {
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Aplicar filtros
function applyFilters() {
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    const selectedBrand = brandFilter ? brandFilter.value : '';
    const minPrice = minPriceFilter ? parseFloat(minPriceFilter.value) || 0 : 0;
    const maxPrice = maxPriceFilter ? parseFloat(maxPriceFilter.value) || Infinity : Infinity;

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === '' || product.category === selectedCategory;
        const brandMatch = selectedBrand === '' || product.brand.toLowerCase() === selectedBrand.toLowerCase();
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;

        return categoryMatch && brandMatch && priceMatch;
    });

    renderProducts(filteredProducts);
}

// Event listeners
if (cartButton) cartButton.addEventListener('click', showCart);
if (closeCart) closeCart.addEventListener('click', hideCart);
if (cartOverlay) cartOverlay.addEventListener('click', hideCart);
if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', applyFilters);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCart();

    // Si estamos en página con productos:
    if (productsGrid) {
        renderProducts();
    }
});
