document.addEventListener('DOMContentLoaded', function() {
    // Products data with discount prices
    const products = [
        {
            id: 1,
            title: 'Smart Watch Pro',
            originalPrice: 7000,
            discountPrice: 6000,
            image: 'images/watch1.png',
            description: 'Premium smart watch with health tracking features'
        },
        {
            id: 2,
            title: 'Elegant Watch',
            originalPrice: 7000,
            discountPrice: 6000,
            image: 'images/watch2.png',
            description: 'Classic elegant watch for formal occasions'
        },
        {
            id: 3,
            title: 'Classic Watch',
            originalPrice: 7000,
            discountPrice: 6000,
            image: 'images/watch3.png',
            description: 'Timeless classic watch design'
        },
        {
            id: 4,
            title: 'Premium Smartphone',
            originalPrice: 5000,
            discountPrice: 4500,
            image: 'images/phone1.png',
            description: 'High-performance smartphone with advanced camera'
        }
    ];

    // Algerian wilayas
    const wilayas = [
        "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", 
        "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", 
        "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", 
        "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", 
        "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", 
        "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", 
        "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", 
        "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", 
        "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", 
        "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", 
        "El M'Ghair", "El Menia"
    ];

    // Cart and current product
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentProduct = null;

    // DOM Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('nav a[data-page]');
    const pages = document.querySelectorAll('.page');
    const addToCartBtn = document.getElementById('add-to-cart');
    const quantitySelect = document.getElementById('quantity');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const orderForm = document.querySelector('.order-form');
    const shopNowBtn = document.querySelector('.hero .btn[data-page="products"]');

    // Initialize the app
    init();

    function init() {
        setupEventListeners();
        updateCartCount();
        // Show 3 featured products on home
        displayProducts(document.querySelector('#home-page .products-grid'), products.slice(0, 3));
        // Show ALL products on products page
        displayProducts(document.querySelector('#products-page .products-grid'), products);
        populateWilayas();
    }

    function setupEventListeners() {
        // Mobile menu toggle
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateTo(this.getAttribute('data-page'));
            });
        });

        // Shop Now button
        if (shopNowBtn) {
            shopNowBtn.addEventListener('click', function(e) {
                e.preventDefault();
                navigateTo('products');
                // Smooth scroll to products section
                setTimeout(() => {
                    const productsPage = document.getElementById('products-page');
                    if (productsPage) {
                        productsPage.scrollIntoView({ 
                            behavior: 'smooth' 
                        });
                    }
                }, 10);
            });
        }

        // Add to cart button
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', addToCart);
        }

        // Checkout button
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                navigateTo('order-form');
                updateOrderSummary();
            });
        }

        // Order form submission
        if (orderForm) {
            orderForm.addEventListener('submit', function(e) {
                e.preventDefault();
                prepareOrderSummary();
            });
        }
    }

    function navigateTo(pageId) {
        // Close mobile menu
        navMenu.classList.remove('active');
        
        // Update active nav link
        navLinks.forEach(link => link.classList.remove('active'));
        const activeNav = document.querySelector(`nav a[data-page="${pageId}"]`);
        if (activeNav) activeNav.classList.add('active');
        
        // Show selected page
        pages.forEach(page => page.classList.remove('active'));
        const activePage = document.getElementById(`${pageId}-page`);
        if (activePage) activePage.classList.add('active');
        
        // Special cases
        if (pageId === 'checkout') {
            updateCartDisplay();
        }
    }

    function displayProducts(container, productsToDisplay) {
        if (!container) return;
        
        container.innerHTML = '';
        
        productsToDisplay.forEach(product => {
            const discountPercentage = Math.round(
                ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
            );
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                ${product.originalPrice > product.discountPrice ? 
                    `<div class="product-badge">-${discountPercentage}%</div>` : ''}
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="price-container">
                        ${product.originalPrice > product.discountPrice ? 
                            `<span class="original-price">${product.originalPrice} DA</span>` : ''}
                        <span class="discount-price">${product.discountPrice} DA</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            // Click event for product image
            const productImage = productCard.querySelector('.product-image');
            if (productImage) {
                productImage.addEventListener('click', (e) => {
                    e.preventDefault();
                    showProductDetail(product);
                });
            }
            
            // Click event for add to cart button
            const addToCartButton = productCard.querySelector('.add-to-cart');
            if (addToCartButton) {
                addToCartButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCartFromCard(product.id);
                });
            }
            
            container.appendChild(productCard);
        });
    }

    function showProductDetail(product) {
        currentProduct = product;
        
        const detailImage = document.getElementById('detail-product-image');
        const detailTitle = document.getElementById('detail-product-title');
        const detailDesc = document.getElementById('detail-product-description');
        const originalPriceEl = document.getElementById('detail-original-price');
        const discountPriceEl = document.getElementById('detail-discount-price');
        
        if (detailImage) detailImage.src = product.image;
        if (detailTitle) detailTitle.textContent = product.title;
        if (detailDesc) detailDesc.textContent = product.description;
        
        if (product.originalPrice > product.discountPrice) {
            if (originalPriceEl) originalPriceEl.textContent = `${product.originalPrice} DA`;
            if (discountPriceEl) discountPriceEl.textContent = `${product.discountPrice} DA`;
        } else {
            if (originalPriceEl) originalPriceEl.textContent = '';
            if (discountPriceEl) discountPriceEl.textContent = `${product.discountPrice} DA`;
        }
        
        navigateTo('product-detail');
    }

    function addToCartFromCard(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            currentProduct = product;
            if (quantitySelect) quantitySelect.value = 1;
            showProductDetail(product);
        }
    }

    function addToCart() {
        if (!currentProduct) return;
        
        const quantity = quantitySelect ? parseInt(quantitySelect.value) : 1;
        const existingItem = cart.find(item => item.id === currentProduct.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: currentProduct.id,
                title: currentProduct.title,
                price: currentProduct.discountPrice,
                image: currentProduct.image,
                quantity: quantity
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        navigateTo('checkout');
    }

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) cartCount.textContent = count;
    }

    function updateCartDisplay() {
        const cartItemsList = document.querySelector('.cart-items-list');
        if (!cartItemsList) return;
        
        cartItemsList.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
            updateCartSummary(0, 0, 0);
            return;
        }
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">${item.price} DA</p>
                    <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
                    <p class="cart-item-remove" data-id="${item.id}">Remove</p>
                </div>
                <div class="cart-item-total">${itemTotal} DA</div>
            `;
            
            cartItemsList.appendChild(cartItemElement);
        });
        
        // Calculate discount based on quantity
        const discount = calculateDiscount(cart);
        const total = subtotal - discount;
        
        updateCartSummary(subtotal, discount, total);
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }

    function calculateDiscount(cartItems) {
        let totalDiscount = 0;
        
        cartItems.forEach(item => {
            if (item.quantity >= 3) {
                totalDiscount += 500;
            } else if (item.quantity >= 2) {
                totalDiscount += 200;
            }
        });
        
        return totalDiscount;
    }

    function updateCartSummary(subtotal, discount, total) {
        const subtotalEl = document.getElementById('subtotal');
        const discountEl = document.getElementById('discount');
        const totalEl = document.getElementById('total');
        
        if (subtotalEl) subtotalEl.textContent = `${subtotal} DA`;
        if (discountEl) discountEl.textContent = `-${discount} DA`;
        if (totalEl) totalEl.textContent = `${total} DA`;
    }

    function updateOrderSummary() {
        const orderItemsContainer = document.querySelector('.order-items');
        if (!orderItemsContainer) return;
        
        orderItemsContainer.innerHTML = '';
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            
            orderItem.innerHTML = `
                <span>${item.title} x ${item.quantity}</span>
                <span>${itemTotal} DA</span>
            `;
            
            orderItemsContainer.appendChild(orderItem);
        });
        
        const discount = calculateDiscount(cart);
        const total = subtotal - discount;
        
        const orderSubtotal = document.getElementById('order-subtotal');
        const orderDiscount = document.getElementById('order-discount');
        const orderTotal = document.getElementById('order-total');
        
        if (orderSubtotal) orderSubtotal.textContent = `${subtotal} DA`;
        if (orderDiscount) orderDiscount.textContent = `-${discount} DA`;
        if (orderTotal) orderTotal.textContent = `${total} DA`;
    }

    function prepareOrderSummary() {
        let orderItems = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            orderItems += `${item.title} x ${item.quantity} - ${itemTotal} DA\n`;
        });
        
        const discount = calculateDiscount(cart);
        const total = subtotal - discount;
        
        const orderSummary = `
            ORDER SUMMARY:
            ${orderItems}
            Subtotal: ${subtotal} DA
            Discount: -${discount} DA
            Total: ${total} DA
        `;
        
        const orderSummaryInput = document.getElementById('order-summary-input');
        if (orderSummaryInput) orderSummaryInput.value = orderSummary;
        
        // Clear the cart after submission
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }

    function populateWilayas() {
        const wilayaSelects = document.querySelectorAll('select[id$="wilaya"]');
        
        wilayaSelects.forEach(select => {
            wilayas.forEach(wilaya => {
                const option = document.createElement('option');
                option.value = wilaya;
                option.textContent = wilaya;
                select.appendChild(option);
            });
        });
    }
});
