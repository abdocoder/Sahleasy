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
        displayProducts(document.querySelector('#home-page .products-grid'), products.slice(0, 3));
        displayProducts(document.querySelector('#products-page .products-grid'), products);
        populateWilayas();
    }

    function setupEventListeners() {
        // Mobile menu toggle
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                navigateTo(pageId);
            });
        });

        // Shop Now button
        shopNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('products');
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                navigateTo(pageId);
            });
        });

        // Add to cart button
        addToCartBtn.addEventListener('click', addToCart);

        // Proceed to checkout button
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('order-form');
            updateOrderSummary();
        });

        // Prepare order summary before form submission
        orderForm.addEventListener('submit', function(e) {
            prepareOrderSummary();
        });
    }

    function navigateTo(pageId) {
        // Close mobile menu if open
        navMenu.classList.remove('active');
        
        // Update active nav link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        document.querySelector(`nav a[data-page="${pageId}"]`)?.classList.add('active');
        
        // Show the selected page
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === `${pageId}-page`) {
                page.classList.add('active');
                
                // Scroll to the top of the section
                window.scrollTo({
                    top: page.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
        
        // Update specific pages if needed
        if (pageId === 'checkout') {
            updateCartDisplay();
        }
    }

    function displayProducts(container, productsToDisplay) {
        container.innerHTML = '';
        
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // Add badge if there's a discount
            const discountPercentage = Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100);
            
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
            
            // Add click event for image to show product detail
            productCard.querySelector('.product-image').addEventListener('click', (e) => {
                e.preventDefault();
                showProductDetail(product);
            });
            
            // Add click event for add to cart button
            productCard.querySelector('.add-to-cart').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCartFromCard(product.id);
            });
            
            container.appendChild(productCard);
        });
    }

    // ... (rest of your existing JavaScript functions remain the same) ...
});
// Shop Now button
shopNowBtn.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo('products');
});
// Show the selected page
pages.forEach(page => {
    page.classList.remove('active');
    if (page.id === `${pageId}-page`) {
        page.classList.add('active');
        
        // Scroll to the top of the section
        window.scrollTo({
            top: page.offsetTop,
            behavior: 'smooth'
        });
    }
    const shopNowBtn = document.querySelector('.hero .btn[data-page="products"]');
});
