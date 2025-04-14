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

    // Load items from JSON file
    fetch('/static/data/items.json')
        .then(response => response.json())
        .then(data => {
            // Store items globally
            window.allItems = data.items;
            
            // Render items to the page
            renderItems(data.items);
            // Set up event listeners for "Add to Cart" buttons after items are loaded
            setupAddToCartListeners();
        })
        .catch(error => {
            console.error('Error loading items:', error);
        });

    // Render items from JSON data
    function renderItems(items) {
        const codeGrid = document.getElementById('code-grid');
        
        // Clear existing items
        codeGrid.innerHTML = '';
        
        // Create HTML for each item
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'code-card';
            itemElement.dataset.id = item.id;
            itemElement.dataset.language = item.language.toLowerCase();
            itemElement.dataset.price = item.price;
            
            // Determine category based on language
            let category = 'backend';
            if (['react.js', 'vue.js', 'angular'].includes(item.language.toLowerCase())) {
                category = 'frontend';
            } else if (['swift', 'kotlin', 'flutter'].includes(item.language.toLowerCase())) {
                category = 'mobile';
            } else if (['python', 'tensorflow'].includes(item.language.toLowerCase())) {
                category = 'ai';
            }
            
            itemElement.dataset.category = category;
            
            itemElement.innerHTML = `
                <div class="card-header">
                    <i class="${item.icon}"></i>
                    <span class="language">${item.language}</span>
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="card-footer">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            `;
            
            codeGrid.appendChild(itemElement);
        });
    }

    // Setup event listeners for Add to Cart buttons
    function setupAddToCartListeners() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', handleAddToCart);
        });
        
        // Add click event for "Browse Items" button in empty cart
        const browseItemsBtn = document.querySelector('.browse-items-btn');
        if (browseItemsBtn) {
            browseItemsBtn.addEventListener('click', () => {
                toggleCart(false);
            });
        }
    }

    // Handle Add to Cart button clicks
    function handleAddToCart(e) {
        const card = e.target.closest('.code-card');
        const item = {
            name: card.querySelector('h3').textContent,
            price: parseFloat(card.querySelector('.price').textContent.replace('$', '')),
            id: Date.now()
        };
        addToCart(item);
        
        // Add animation
        const btnClone = e.target.cloneNode(true);
        btnClone.textContent = 'Added!';
        btnClone.classList.add('added');
        e.target.replaceWith(btnClone);
        
        setTimeout(() => {
            btnClone.textContent = 'Add to Cart';
            btnClone.classList.remove('added');
            btnClone.addEventListener('click', handleAddToCart);
        }, 1500);
    }

    let cart = [];

    function addToCart(item) {
        cart.push(item);
        updateCartUI();
        
        // Show a brief notification
        showNotification(`${item.name} added to cart!`);
    }
    
    // Notification system
    function showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after a delay
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2500);
    }

    // Remove from cart functionality
    window.removeFromCart = (itemId) => {
        const removedItem = cart.find(item => item.id === itemId);
        cart = cart.filter(item => item.id !== itemId);
        updateCartUI();
        
        if (removedItem) {
            showNotification(`${removedItem.name} removed from cart`);
        }
    };

    function updateCartUI() {
        // Update cart count
        document.querySelector('.cart-count').textContent = cart.length;
        
        // Update cart items
        const cartItems = document.querySelector('.cart-items');
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <button class="browse-items-btn">Browse Items</button>
                </div>
            `;
            
            // Re-add event listener to the new button
            const browseItemsBtn = document.querySelector('.browse-items-btn');
            if (browseItemsBtn) {
                browseItemsBtn.addEventListener('click', () => {
                    toggleCart(false);
                });
            }
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

    // Secure checkout functionality
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        // Calculate total from cart
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        // Create a form dynamically
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/receipt';
        
        // Add hidden fields
        const fields = {
            'total': total,
            'discount': 0,
            'remaining_balance': parseFloat(document.querySelector('.balance').textContent.replace(/[^0-9.]/g, '')),
        };
        
        // Create and append hidden inputs
        Object.entries(fields).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
        });
        
        // Append form to body and submit
        document.body.appendChild(form);
        form.submit();
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidePanel = document.querySelector('.side-panel');
    
    menuToggle.addEventListener('click', () => {
        sidePanel.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    // Close side panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidePanel.contains(e.target) && !menuToggle.contains(e.target)) {
            sidePanel.classList.remove('open');
            menuToggle.classList.remove('active');
        }
    });

    // Remove loading screen
    const loading = document.querySelector('.loading');
    if (loading) {
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => loading.remove(), 500);
        }, 800);
    }

    // Category toggling with enhanced animation
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    categoryHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Toggle active state with visual feedback
            const wasActive = header.classList.contains('active');
            
            // First close all other categories for accordion effect
            categoryHeaders.forEach(h => {
                h.classList.remove('active');
                const items = h.nextElementSibling;
                if (items && items.classList.contains('featured-items')) {
                    items.classList.remove('show');
                    // Add smooth height transition
                    items.style.maxHeight = '0px';
                }
            });
            
            // Then toggle the clicked category
            if (!wasActive) {
                header.classList.add('active');
                const featuredItems = header.nextElementSibling;
                if (featuredItems && featuredItems.classList.contains('featured-items')) {
                    featuredItems.classList.add('show');
                    // Set proper height for animation
                    featuredItems.style.maxHeight = featuredItems.scrollHeight + 'px';
                }
            }
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
    
    // Quick filters functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            filterItems(filter);
        });
    });
    
    function filterItems(filter) {
        const items = document.querySelectorAll('.code-card');
        
        items.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'flex';
                return;
            }
            
            if (item.dataset.category === filter) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        sortItems(sortValue);
    });
    
    function sortItems(sortType) {
        if (!window.allItems) return;
        
        let sortedItems = [...window.allItems];
        
        switch (sortType) {
            case 'price-low':
                sortedItems.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedItems.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // Assuming the higher ID is newer (for demo)
                sortedItems.sort((a, b) => b.id - a.id);
                break;
            default: // popular - use default order
                break;
        }
        
        renderItems(sortedItems);
        setupAddToCartListeners();
        
        // Reapply current filter
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        if (activeFilter !== 'all') {
            filterItems(activeFilter);
        }
    }
    
    // Price filter with dynamic feedback
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    
    if (priceSlider && priceValue) {
        // Add visual feedback when sliding
        priceSlider.addEventListener('input', () => {
            priceValue.textContent = priceSlider.value;
            // Update active price marker color based on value
            const percent = (priceSlider.value / priceSlider.max) * 100;
            priceSlider.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percent}%, rgba(255, 255, 255, 0.1) ${percent}%, rgba(255, 255, 255, 0.1) 100%)`;
            
            // Add subtle animation to price display
            priceValue.style.transform = 'scale(1.05)';
            setTimeout(() => {
                priceValue.style.transform = 'scale(1)';
            }, 200);
        });
        
        // Set initial gradient
        const percent = (priceSlider.value / priceSlider.max) * 100;
        priceSlider.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percent}%, rgba(255, 255, 255, 0.1) ${percent}%, rgba(255, 255, 255, 0.1) 100%)`;
        
        const applyFiltersBtn = document.querySelector('.apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                const maxPrice = parseInt(priceSlider.value);
                filterByPrice(maxPrice);
                
                // Show feedback to user
                showNotification(`Price filter applied: $0 - $${maxPrice}`);
                
                // Add animation to button
                applyFiltersBtn.classList.add('applied');
                setTimeout(() => {
                    applyFiltersBtn.classList.remove('applied');
                }, 500);
            });
        }
        
        const resetFiltersBtn = document.querySelector('.reset-filters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                priceSlider.value = 100;
                priceValue.textContent = '100';
                
                // Reset the gradient
                priceSlider.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) 100%, rgba(255, 255, 255, 0.1) 100%, rgba(255, 255, 255, 0.1) 100%)`;
                
                renderItems(window.allItems);
                setupAddToCartListeners();
                
                // Show feedback to user
                showNotification('Filters have been reset');
            });
        }
    }
    
    function filterByPrice(maxPrice) {
        if (!window.allItems) return;
        
        const filteredItems = window.allItems.filter(item => item.price <= maxPrice);
        renderItems(filteredItems);
        setupAddToCartListeners();
        
        // Show notification about filtering
        showNotification(`Showing items under $${maxPrice}`);
    }
    
    // Banner buttons
    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            // Smooth scroll to the categories section
            document.querySelector('.featured-section').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Open side panel on mobile
            if (window.innerWidth < 1024) {
                sidePanel.classList.add('open');
            }
        });
    }
    
    const newestBtn = document.querySelector('.newest-btn');
    if (newestBtn) {
        newestBtn.addEventListener('click', () => {
            // Set sort select to "newest" and trigger change
            sortSelect.value = 'newest';
            sortSelect.dispatchEvent(new Event('change'));
            
            // Show notification
            showNotification('Showing newest arrivals');
        });
    }
    
    // Add CSS for notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--primary);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            font-weight: 500;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .add-to-cart.added {
            background: var(--success);
        }
        
        @media (max-width: 768px) {
            .notification {
                top: auto;
                bottom: 20px;
                left: 20px;
                right: 20px;
                text-align: center;
            }
        }
    `;
    
    document.head.appendChild(style);
});
