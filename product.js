// app.js - исправленный и рабочий функционал
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация приложения
    initApp();
});

function initApp() {
    initHamburgerMenu();
    initProductActions();
    initFilters();
    initCart();
    initSorting();
    initViewToggle();
    showCartNotification();
}

// Гамбургер-меню
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburgerMenu');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            const navList = document.querySelector('.nav-list');
            if (navList) {
                navList.classList.toggle('active');
            }
        });
    }
}

// Действия с товарами
function initProductActions() {
    document.addEventListener('click', function(e) {
        // Добавление в корзину
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = button.getAttribute('data-product-id');
            addToCart(productId, button);
        }

        // Добавление в избранное
        if (e.target.classList.contains('add-to-favorites') || e.target.closest('.add-to-favorites')) {
            const button = e.target.classList.contains('add-to-favorites') ? e.target : e.target.closest('.add-to-favorites');
            const productId = button.getAttribute('data-product-id');
            toggleFavorite(productId, button);
        }
    });
}

// Фильтры - исправленная версия
function initFilters() {
    console.log('Инициализация фильтров...');
    
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
        console.log('Кнопка "Применить" подключена');
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
        console.log('Кнопка "Сбросить" подключена');
    }
    
    // Добавляем мгновенные фильтры
    addInstantFilters();
}

function addInstantFilters() {
    // Чекбоксы
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (!this.closest('.view-options')) {
                applyFilters();
            }
        });
    });
    
    // Поля цены с задержкой
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    
    if (priceMin) {
        priceMin.addEventListener('input', function() {
            clearTimeout(this.timer);
            this.timer = setTimeout(applyFilters, 500);
        });
    }
    
    if (priceMax) {
        priceMax.addEventListener('input', function() {
            clearTimeout(this.timer);
            this.timer = setTimeout(applyFilters, 500);
        });
    }
}

function applyFilters() {
    console.log('Применяем фильтры...');
    
    const selectedSeasons = getSelectedValues('season');
    const selectedTypes = getSelectedValues('type');
    const selectedBrands = getSelectedValues('brand');
    const priceMin = parseInt(document.getElementById('priceMin').value) || 0;
    const priceMax = parseInt(document.getElementById('priceMax').value) || 50000;
    
    console.log('Сезоны:', selectedSeasons, 'Типы:', selectedTypes, 'Бренды:', selectedBrands);
    console.log('Цена от', priceMin, 'до', priceMax);
    
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        const categories = product.dataset.category.split(' ');
        const price = getProductPrice(product);
        
        // Проверяем фильтры
        const seasonMatch = selectedSeasons.length === 0 || selectedSeasons.some(season => categories.includes(season));
        const typeMatch = selectedTypes.length === 0 || selectedTypes.some(type => categories.includes(type));
        const brandMatch = selectedBrands.length === 0 || selectedBrands.some(brand => categories.includes(brand));
        const priceMatch = price >= priceMin && price <= priceMax;
        
        if (seasonMatch && typeMatch && brandMatch && priceMatch) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    updateResultsCounter(visibleCount);
    showNotification(`Найдено товаров: ${visibleCount}`);
    
    // Анимация кнопки
    const btn = document.getElementById('applyFilters');
    if (btn) {
        btn.style.backgroundColor = '#4CAF50';
        setTimeout(() => btn.style.backgroundColor = '', 500);
    }
}

function resetFilters() {
    console.log('Сбрасываем фильтры...');
    
    // Сбрасываем чекбоксы
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (!checkbox.closest('.view-options')) {
            checkbox.checked = false;
        }
    });
    
    // Сбрасываем цену
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    if (priceMin) priceMin.value = 5000;
    if (priceMax) priceMax.value = 50000;
    
    // Показываем все товары
    document.querySelectorAll('.product-card').forEach(product => {
        product.style.display = 'block';
    });
    
    updateResultsCounter(document.querySelectorAll('.product-card').length);
    showNotification('Фильтры сброшены');
    
    // Анимация кнопки
    const btn = document.getElementById('resetFilters');
    if (btn) {
        btn.style.backgroundColor = '#b3e9e2';
        btn.style.color = '#000';
        setTimeout(() => {
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 500);
    }
}

// Вспомогательные функции для фильтров
function getSelectedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

function getProductPrice(product) {
    const priceElement = product.querySelector('.current-price');
    if (priceElement) {
        return parseInt(priceElement.textContent.replace(/[^\d]/g, '')) || 0;
    }
    return 0;
}

function updateResultsCounter(count) {
    let counter = document.getElementById('resultsCounter');
    if (!counter) {
        counter = document.createElement('div');
        counter.id = 'resultsCounter';
        counter.style.cssText = `
            background: rgba(179, 233, 226, 0.2);
            color: #b3e9e2;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin-left: 20px;
            border: 1px solid rgba(179, 233, 226, 0.3);
        `;
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.appendChild(counter);
        }
    }
    counter.textContent = `Найдено: ${count} товаров`;
}

// Сортировка
function initSorting() {
    const sortSelect = document.getElementById('sortOptions');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

function sortProducts(sortType) {
    console.log('Сортировка:', sortType);
    showNotification(`Сортировка: ${sortType}`);
    // Здесь можно добавить логику сортировки
}

// Переключение вида
function initViewToggle() {
    const gridView = document.getElementById('view-grid');
    const listView = document.getElementById('view-list');
    
    if (gridView && listView) {
        gridView.addEventListener('change', function() {
            const productsView = document.getElementById('productsView');
            if (productsView) {
                productsView.classList.add('grid-view');
                productsView.classList.remove('list-view');
            }
        });
        
        listView.addEventListener('change', function() {
            const productsView = document.getElementById('productsView');
            if (productsView) {
                productsView.classList.add('list-view');
                productsView.classList.remove('grid-view');
            }
        });
    }
}

// Корзина
function initCart() {
    if (document.getElementById('cartItems')) {
        renderCart();
        initCartEventListeners();
    }
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, button) {
    const product = getProductData(productId);
    const cart = getCart();
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    
    // Сохраняем информацию о последнем добавленном товаре
    localStorage.setItem('lastAddedProduct', JSON.stringify({
        name: product.name,
        price: product.price
    }));
    
    // Анимация кнопки
    if (button) {
        animateButton(button, '✓ Добавлено');
    }
    
    showNotification(`"${product.name}" добавлен в корзину! Перейдите в корзину для оформления.`);
    
    // Автоматическое перенаправление в корзину через 2 секунды
    setTimeout(() => {
        if (!window.location.href.includes('cart.html')) {
            window.location.href = 'cart.html';
        }
    }, 2000);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
    showNotification('Товар удален из корзины');
}

function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
            renderCart();
        }
    }
}

function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (!cartContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-state">
                <h3>Корзина пуста</h3>
                <p>Добавьте товары из каталога</p>
                <a href="product.html" class="btn-primary">Перейти в каталог</a>
            </div>
        `;
        if (totalPriceElement) totalPriceElement.textContent = '0 ₽';
        return;
    }
    
    let total = 0;
    const itemsHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <div class="item-total">${itemTotal.toLocaleString()} ₽</div>
                    <button class="btn-secondary remove-from-cart" data-product-id="${item.id}">Удалить</button>
                </div>
            </div>
        `;
    }).join('');
    
    cartContainer.innerHTML = itemsHTML;
    if (totalPriceElement) totalPriceElement.textContent = `${total.toLocaleString()} ₽`;
}

function initCartEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-from-cart')) {
            const productId = e.target.getAttribute('data-product-id');
            removeFromCart(productId);
        }
        
        if (e.target.classList.contains('plus')) {
            const productId = e.target.getAttribute('data-id');
            updateQuantity(productId, 1);
        }
        
        if (e.target.classList.contains('minus')) {
            const productId = e.target.getAttribute('data-id');
            updateQuantity(productId, -1);
        }
    });
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = getCart();
            if (cart.length === 0) {
                showNotification('Корзина пуста');
                return;
            }
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            showNotification(`Заказ оформлен! Сумма: ${total.toLocaleString()} ₽`);
            
            localStorage.removeItem('cart');
            renderCart();
        });
    }
}

// Показ уведомления о добавлении в корзину
function showCartNotification() {
    if (document.getElementById('cartItems')) {
        const lastProduct = localStorage.getItem('lastAddedProduct');
        if (lastProduct) {
            try {
                const product = JSON.parse(lastProduct);
                showNotification(`"${product.name}" был добавлен в корзину!`);
                localStorage.removeItem('lastAddedProduct');
            } catch (e) {
                console.error('Error parsing last product:', e);
            }
        }
    }
}

// Вспомогательные функции
function getProductData(productId) {
    const products = {
        '1': { name: 'Nokian Hakkapeliitta R5', price: 12490, image: 'https://via.placeholder.com/250x250' },
        '2': { name: 'Michelin X-Ice North 4', price: 13990, image: 'https://via.placeholder.com/250x250' },
        '3': { name: 'Bridgestone Turanza T005', price: 9790, image: 'https://via.placeholder.com/250x250' },
        '4': { name: 'Continental AllSeasonContact 2', price: 11290, image: 'https://via.placeholder.com/250x250' },
        '5': { name: 'Pirelli Ice Zero 2', price: 12450, image: 'https://via.placeholder.com/250x250' },
        '6': { name: 'Michelin Primacy 4', price: 10990, image: 'https://via.placeholder.com/250x250' }
    };
    
    return products[productId] || { name: 'Неизвестный товар', price: 0, image: '' };
}

function toggleFavorite(productId, button) {
    const product = getProductData(productId);
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(item => item.id === productId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        button.classList.remove('active');
        button.innerHTML = '🤍';
        showNotification(`"${product.name}" удален из избранного`);
    } else {
        favorites.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image
        });
        button.classList.add('active');
        button.innerHTML = '❤';
        showNotification(`"${product.name}" добавлен в избранное`);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function animateButton(button, newText) {
    const originalText = button.innerHTML;
    button.innerHTML = newText;
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

function showNotification(message) {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-family: Georgia, 'Times New Roman', Times, serif;
        border-left: 4px solid #b3e9e2;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}