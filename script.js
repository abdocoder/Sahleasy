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
        shopNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('products');
            // Smooth scroll to products section
            setTimeout(() => {
                document.getElementById('products-page').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }, 10);
        });

        // Add to cart button
        addToCartBtn.addEventListener('click', addToCart);

        // Checkout button
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('order-form');
            updateOrderSummary();
        });

        // Order form submission
        orderForm.addEventListener('submit', function(e) {
            prepareOrderSummary();
        });
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
            productCard.querySelector('.product-image').addEventListener('click', (e) => {
                e.preventDefault();
                showProductDetail(product);
            });
            
            // Click event for add to cart button
            productCard.querySelector('.add-to-cart').addEventListener('click', (e) => {
                e.preventDefault();
                addToCartFromCard(product.id);
            });
            
            container.appendChild(productCard);
        });
    }

    // [Keep all your other existing functions...]
      
            // Add click event for add to cart button
            productCard.querySelector('.add-to-cart').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCartFromCard(product.id);
            });
            
            container.appendChild(productCard);
        });
    }

    function showProductDetail(product) {
        currentProduct = product;
        
        document.getElementById('detail-product-image').src = product.image;
        document.getElementById('detail-product-title').textContent = product.title;
        document.getElementById('detail-product-description').textContent = product.description;
        
        const originalPriceEl = document.getElementById('detail-original-price');
        const discountPriceEl = document.getElementById('detail-discount-price');
        
        if (product.originalPrice > product.discountPrice) {
            originalPriceEl.textContent = `${product.originalPrice} DA`;
            discountPriceEl.textContent = `${product.discountPrice} DA`;
        } else {
            originalPriceEl.textContent = '';
            discountPriceEl.textContent = `${product.discountPrice} DA`;
        }
        
        navigateTo('product-detail');
    }

    function addToCartFromCard(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        currentProduct = product;
        quantitySelect.value = 1;
        showProductDetail(product);
    }

    function addToCart() {
        if (!currentProduct) return;
        
        const quantity = parseInt(quantitySelect.value);
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
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Navigate to checkout
        navigateTo('checkout');
    }

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }

    function updateCartDisplay() {
        const cartItemsList = document.querySelector('.cart-items-list');
        
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
        document.getElementById('subtotal').textContent = `${subtotal} DA`;
        document.getElementById('discount').textContent = `-${discount} DA`;
        document.getElementById('total').textContent = `${total} DA`;
    }

    function updateOrderSummary() {
        const orderItemsContainer = document.querySelector('.order-items');
        let subtotal = 0;
        
        orderItemsContainer.innerHTML = '';
        
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
        
        document.getElementById('order-subtotal').textContent = `${subtotal} DA`;
        document.getElementById('order-discount').textContent = `-${discount} DA`;
        document.getElementById('order-total').textContent = `${total} DA`;
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
        
        document.getElementById('order-summary-input').value = orderSummary;
        
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

    function showProductDetail(product) {
        currentProduct = product;
        document.getElementById('detail-product-image').src = product.image;
        document.getElementById('detail-product-title').textContent = product.title;
        document.getElementById('detail-product-description').textContent = product.description;
        
        const originalPriceEl = document.getElementById('detail-original-price');
        const discountPriceEl = document.getElementById('detail-discount-price');
        
        if (product.originalPrice > product.discountPrice) {
            originalPriceEl.textContent = `${product.originalPrice} DA`;
            discountPriceEl.textContent = `${product.discountPrice} DA`;
        } else {
            originalPriceEl.textContent = '';
            discountPriceEl.textContent = `${product.discountPrice} DA`;
        }
        
        navigateTo('product-detail');
    }

    function addToCartFromCard(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            currentProduct = product;
            quantitySelect.value = 1;
            showProductDetail(product);
        }
    }

    function addToCart() {
        if (!currentProduct) return;
        
        const quantity = parseInt(quantitySelect.value);
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

    // [Keep all remaining functions...]
});
