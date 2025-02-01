document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const overlay = document.querySelector('.cart-overlay');
    
    // Toggle cart function
    function toggleCart(show) {
        if (show) {
            cartSidebar.classList.add('open');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            cartSidebar.classList.remove('open');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Event listeners
    cartBtn.addEventListener('click', () => toggleCart(true));
    closeCart.addEventListener('click', () => toggleCart(false));
    overlay.addEventListener('click', () => toggleCart(false));
    
    // Close cart on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleCart(false);
    });

    // Add to cart functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    let cart = [];

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.code-card');
            const item = {
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('.price').textContent.replace('$', '')),
                id: Date.now()
            };
            addToCart(item);
        });
    });

    function addToCart(item) {
        cart.push(item);
        updateCartUI();
    }

    // Remove from cart functionality
    window.removeFromCart = (itemId) => {
        cart = cart.filter(item => item.id !== itemId);
        updateCartUI();
    };

    function updateCartUI() {
        // Update cart count
        document.querySelector('.cart-count').textContent = cart.length;
        
        // Update cart items
        const cartItems = document.querySelector('.cart-items');
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <button onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        // Update total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        document.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidePanel = document.querySelector('.side-panel');
    
    menuToggle.addEventListener('click', () => {
        sidePanel.classList.toggle('open');
    });

    // Close side panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidePanel.contains(e.target) && !menuToggle.contains(e.target)) {
            sidePanel.classList.remove('open');
        }
    });

    // Remove loading screen
    const loading = document.querySelector('.loading');
    if (loading) {
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => loading.remove(), 500);
        }, 500);
    }

    // Category toggling
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    categoryHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Toggle active state
            categoryHeaders.forEach(h => h.classList.remove('active'));
            header.classList.add('active');
            
            // Toggle featured items
            const featuredItems = header.nextElementSibling;
            const allFeaturedItems = document.querySelectorAll('.featured-items');
            
            allFeaturedItems.forEach(items => {
                if (items !== featuredItems) {
                    items.classList.remove('show');
                }
            });
            
            featuredItems.classList.toggle('show');
        });
    });

    // Profile dropdown toggle
    const userProfile = document.querySelector('.user-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');

    userProfile.addEventListener('click', () => {
        profileDropdown.classList.toggle('show');
    });

    // Close profile dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userProfile.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });
});
