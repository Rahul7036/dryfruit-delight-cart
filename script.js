// Global variables
let cart = [];
let products = [
    {
        id: 1,
        name: "Premium Almonds",
        price: 899.00,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        description: "Handpicked premium quality almonds, rich in nutrients and perfect for snacking."
    },
    {
        id: 2,
        name: "Organic Cashews",
        price: 749.00,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        description: "Organic cashews with a rich, buttery flavor and smooth texture."
    },
    {
        id: 3,
        name: "Golden Raisins",
        price: 299.00,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        description: "Sweet and juicy golden raisins, perfect for baking and snacking."
    },
    {
        id: 4,
        name: "Premium Walnuts",
        price: 649.00,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        description: "Fresh and crunchy walnuts with a rich, nutty flavor."
    },
    {
        id: 5,
        name: "Organic Pistachios",
        price: 799.00,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        description: "Premium organic pistachios with a distinctive green color and rich taste."
    },
    {
        id: 6,
        name: "Dried Apricots",
        price: 449.00,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        description: "Naturally sweet dried apricots, rich in vitamins and minerals."
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    loadCartFromStorage();
    updateCartCount();
    
    // Contact form submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
    
    // Product form submission
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewProduct();
    });
});

// Display products in the grid
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    displayCartItems();
    updateCartTotal();
}

// Update product quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            updateCartCount();
            displayCartItems();
            updateCartTotal();
        }
    }
}

// Display cart items
function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = `₹${total.toFixed(2)}`;
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar.classList.contains('active')) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    } else {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        displayCartItems();
        updateCartTotal();
    }
}

// Toggle admin panel
function toggleAdmin() {
    const adminPanel = document.getElementById('adminPanel');
    
    if (adminPanel.classList.contains('active')) {
        adminPanel.classList.remove('active');
    } else {
        adminPanel.classList.add('active');
    }
}

// Add new product
function addNewProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value;
    const description = document.getElementById('productDescription').value;
    
    if (!name || !price || !image) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        image: image,
        description: description || 'Premium quality dry fruit product.'
    };
    
    products.push(newProduct);
    displayProducts();
    
    // Reset form
    document.getElementById('productForm').reset();
    
    // Close admin panel
    toggleAdmin();
    
    showNotification('Product added successfully!');
}

// Checkout via WhatsApp
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let message = `🛒 *DryFruit Delight - Order Summary*\n\n`;
    message += `*Items in Cart:*\n`;
    
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Total Amount: ₹${total.toFixed(2)}*\n\n`;
    message += `Please confirm my order and provide delivery details.`;
    
    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '919876543210'; // Replace with your actual WhatsApp number
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    
    // Clear cart after checkout
    cart = [];
    saveCartToStorage();
    updateCartCount();
    displayCartItems();
    updateCartTotal();
    toggleCart();
    
    showNotification('Order sent to WhatsApp!');
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('dryfruitCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('dryfruitCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4a7c59;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(44, 85, 48, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #2c5530 0%, #4a7c59 100%)';
        header.style.backdropFilter = 'none';
    }
});

// Add loading animation to images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Add hover effects to product cards
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add search functionality (optional enhancement)
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    // Update display with filtered products
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No products found</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to open cart
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCart();
    }
    
    // Ctrl/Cmd + A to open admin panel
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        toggleAdmin();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cartSidebar');
        const adminPanel = document.getElementById('adminPanel');
        
        if (cartSidebar.classList.contains('active')) {
            toggleCart();
        }
        if (adminPanel.classList.contains('active')) {
            toggleAdmin();
        }
    }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const cartSidebar = document.getElementById('cartSidebar');
    const adminPanel = document.getElementById('adminPanel');
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - close cart if open
        if (cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - close admin if open
        if (adminPanel.classList.contains('active')) {
            toggleAdmin();
        }
    }
} 