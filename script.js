document.addEventListener('DOMContentLoaded', function() {
    // Products data with discount prices
    const products = [
        {
            id: 1,
            title: 'Lampwood base',
            originalPrice: 2500,
            discountPrice: 2000,
            image: 'images/lampwood.jpg',
            description: 'مصباح خشبي عصري صغير وبضوء خافت يعطيك جمالية لغرفتك'
        },
        {
            id: 2,
            title: ' مصباح خشبي',
            originalPrice: 2500,
            discountPrice: 2000,
            image: 'images/lampwood2.jpg',
            description: ' مصنوع بالخشب يعطيك صلابة ومنظر جميل لغرفتك'
        },
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
    const deliveryMethodSelect = document.getElementById('delivery-method'); // Added for convenience

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

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                navigateTo(pageId);
            });
        });

        // Add to cart button
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', addToCart);
        }

        // Proceed to checkout button
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                navigateTo('order-form');
                updateOrderSummary();
            });
        }

        // Prepare order summary before form submission
        if (orderForm) {
            orderForm.addEventListener('submit', function(e) {
                prepareOrderSummary();
            });
        }

        // Event listener for delivery method change
        if (deliveryMethodSelect) {
            deliveryMethodSelect.addEventListener('change', updateOrderSummary);
        }
    }

    function navigateTo(pageId) {
        // Close mobile menu if open
        navMenu.classList.remove('active');
        
        // Update active nav link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        const activeNavLink = document.querySelector(`nav a[data-page="${pageId}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
        
        // Show the selected page
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Update specific pages if needed
        if (pageId === 'checkout') {
            updateCartDisplay();
        }
        if (pageId === 'order-form') {
            updateOrderSummary(); // Ensure summary is updated when navigating to order form
        }
    }

    function displayProducts(container, productsToDisplay) {
        if (!container) return;
        container.innerHTML = '';
        
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
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
            
            const productImageEl = productCard.querySelector('.product-image');
            if (productImageEl) {
                productImageEl.addEventListener('click', (e) => {
                    e.preventDefault();
                    showProductDetail(product);
                });
            }
            
            const addToCartButtonEl = productCard.querySelector('.add-to-cart');
            if (addToCartButtonEl) {
                addToCartButtonEl.addEventListener('click', (e) => {
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
        if (detailImage) detailImage.src = product.image;
        const detailTitle = document.getElementById('detail-product-title');
        if (detailTitle) detailTitle.textContent = product.title;
        const detailDesc = document.getElementById('detail-product-description');
        if (detailDesc) detailDesc.textContent = product.description;
        
        const originalPriceEl = document.getElementById('detail-original-price');
        const discountPriceEl = document.getElementById('detail-discount-price');
        
        if (originalPriceEl && discountPriceEl) {
            if (product.originalPrice > product.discountPrice) {
                originalPriceEl.textContent = `${product.originalPrice} DA`;
                discountPriceEl.textContent = `${product.discountPrice} DA`;
            } else {
                originalPriceEl.textContent = '';
                discountPriceEl.textContent = `${product.discountPrice} DA`;
            }
        }
        
        navigateTo('product-detail');
    }

    function addToCartFromCard(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        currentProduct = product;
        if(quantitySelect) quantitySelect.value = 1;
        showProductDetail(product);
    }

    function addToCart() {
        if (!currentProduct || !quantitySelect) return;
        
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

    function updateCartCount() {
        const cartCountEl = document.querySelector('.cart-count');
        if (cartCountEl) {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountEl.textContent = count;
        }
    }

    function updateCartDisplay() {
        const cartItemsList = document.querySelector('.cart-items-list');
        if (!cartItemsList) return;

        cartItemsList.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
            updateCartSummary(0, 0, 0); // This is for checkout page summary
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
        
        const discount = calculateDiscount(cart);
        const total = subtotal - discount;
        
        updateCartSummary(subtotal, discount, total); // This is for checkout page summary
        
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

    // This function is for the CHECKOUT PAGE summary (price WITHOUT delivery)
    function updateCartSummary(subtotal, discount, total) {
        const subtotalEl = document.getElementById('subtotal');
        if (subtotalEl) subtotalEl.textContent = `${subtotal} DA`;
        const discountEl = document.getElementById('discount');
        if (discountEl) discountEl.textContent = `-${discount} DA`;
        const totalEl = document.getElementById('total');
        if (totalEl) totalEl.textContent = `${total} DA`;
    }

    // This function is for the ORDER FORM PAGE summary (price WITH delivery)
    function updateOrderSummary() {
        const orderItemsContainer = document.querySelector('.order-items');
        if (!orderItemsContainer) return;

        let subtotal = 0;
        orderItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            if(document.getElementById('order-subtotal')) document.getElementById('order-subtotal').textContent = '0 DA';
            if(document.getElementById('order-discount')) document.getElementById('order-discount').textContent = '-0 DA';
            if(document.getElementById('order-delivery-cost')) document.getElementById('order-delivery-cost').textContent = '0 DA';
            if(document.getElementById('order-total')) document.getElementById('order-total').textContent = '0 DA'; // This is now final total
            return;
        }

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
        
        let deliveryCost = 0;
        if (deliveryMethodSelect && deliveryMethodSelect.value) {
            if (deliveryMethodSelect.value === 'home') {
                deliveryCost = 800;
            } else if (deliveryMethodSelect.value === 'office') {
                deliveryCost = 400;
            }
        }

        const finalTotal = subtotal - discount + deliveryCost;

        if(document.getElementById('order-subtotal')) document.getElementById('order-subtotal').textContent = `${subtotal} DA`;
        if(document.getElementById('order-discount')) document.getElementById('order-discount').textContent = `-${discount} DA`;
        
        const orderDeliveryCostEl = document.getElementById('order-delivery-cost');
        if (orderDeliveryCostEl) { // User needs to add this element in HTML
            orderDeliveryCostEl.textContent = `${deliveryCost} DA`;
        }

        // 'order-total' now represents the final total including delivery.
        // User needs to update the label in HTML for this field to 'السعر النهائي' or similar.
        if(document.getElementById('order-total')) document.getElementById('order-total').textContent = `${finalTotal} DA`;
    }

    function prepareOrderSummary() {
        let orderItemsText = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            orderItemsText += `${item.title} x ${item.quantity} - ${itemTotal} DA\n`;
        });

        const discount = calculateDiscount(cart);
        
        let deliveryCost = 0;
        if (deliveryMethodSelect && deliveryMethodSelect.value) {
            if (deliveryMethodSelect.value === 'home') {
                deliveryCost = 800;
            } else if (deliveryMethodSelect.value === 'office') {
                deliveryCost = 400;
            }
        }
        
        const finalTotal = subtotal - discount + deliveryCost;

        const orderSummaryString = `
ORDER SUMMARY:
${orderItemsText.trim()}
Subtotal: ${subtotal} DA
Discount: -${discount} DA
Delivery Cost: ${deliveryCost} DA
Final Total (including delivery): ${finalTotal} DA
        `.trim();
        
        const orderSummaryInput = document.getElementById('order-summary-input');
        if (orderSummaryInput) {
            orderSummaryInput.value = orderSummaryString;
        }
        
        // Clear the cart after submission is initiated
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        // If on checkout page, update its display
        if (document.getElementById('checkout-page')?.classList.contains('active')) {
            updateCartDisplay();
        }
        // If on order form page, update its display
        if (document.getElementById('order-form-page')?.classList.contains('active')) {
            updateOrderSummary();
        }
    }

    function populateWilayas() {
        const wilayaSelects = document.querySelectorAll('select[name="wilaya"]'); // Corrected selector
        wilayaSelects.forEach(select => {
            wilayas.forEach(wilaya => {
                const option = document.createElement('option');
                option.value = wilaya;
                option.textContent = wilaya;
                select.appendChild(option);
            });
        });
                    }
