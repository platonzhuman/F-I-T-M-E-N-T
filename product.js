// app.js - улучшенная версия с максимальной функциональностью
class TireShopApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚗 Инициализация приложения TireShop...');
        this.initHamburgerMenu();
        this.initProductActions();
        this.initFilters();
        this.initCart();
        this.initSorting();
        this.initViewToggle();
        this.initLazyLoading();
        this.initSmoothScrolling();
        this.initBackToTop();
        this.initFormValidation();
        this.showCartNotification();
        this.initPerformanceMonitoring();
        
        // Предзагрузка критичных ресурсов
        this.preloadCriticalResources();
    }

    // Гамбургер-меню с улучшенной обработкой
    initHamburgerMenu() {
        const hamburger = document.getElementById('hamburgerMenu');
        const navList = document.querySelector('.nav-list');
        
        if (!hamburger || !navList) return;

        const toggleMenu = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            hamburger.classList.toggle('active');
            navList.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Блокировка скролла при открытом меню
            if (navList.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        // Множественные события для лучшей совместимости
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('touchstart', toggleMenu, { passive: true });

        // Закрытие меню при клике вне области
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && navList.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Закрытие меню при клике на ссылку
        navList.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                toggleMenu();
            }
        });

        // Закрытие меню при нажатии Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Адаптация к ориентации устройства
        window.addEventListener('orientationchange', () => {
            if (window.innerWidth > 768 && navList.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // Действия с товарами с делегированием событий
    initProductActions() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Добавление в корзину
            if (target.closest('.add-to-cart')) {
                const button = target.closest('.add-to-cart');
                const productId = button.dataset.productId;
                this.addToCart(productId, button);
                e.preventDefault();
            }

            // Добавление в избранное
            if (target.closest('.add-to-favorites')) {
                const button = target.closest('.add-to-favorites');
                const productId = button.dataset.productId;
                this.toggleFavorite(productId, button);
                e.preventDefault();
            }

            // Быстрый просмотр
            if (target.closest('.quick-view')) {
                const button = target.closest('.quick-view');
                const productId = button.dataset.productId;
                this.quickView(productId);
                e.preventDefault();
            }
        });

        // Обработка клавиатуры для доступности
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const target = e.target;
                if (target.classList.contains('product-card') || target.closest('.product-card')) {
                    const productCard = target.classList.contains('product-card') ? target : target.closest('.product-card');
                    const productId = productCard.dataset.productId;
                    if (productId) {
                        this.showProductDetails(productId);
                    }
                }
            }
        });
    }

    // Улучшенная система фильтров
    initFilters() {
        console.log('🔍 Инициализация улучшенных фильтров...');
        
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }
        
        // Мгновенные фильтры с debounce
        this.addInstantFilters();
        
        // Сохранение состояния фильтров
        this.loadFilterState();
    }

    addInstantFilters() {
        // Чекбоксы с сохранением состояния
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            if (!checkbox.closest('.view-options')) {
                checkbox.addEventListener('change', () => {
                    this.saveFilterState();
                    this.debounce(() => this.applyFilters(), 300)();
                });
            }
        });
        
        // Поля цены с улучшенным debounce
        const priceInputs = ['priceMin', 'priceMax'];
        priceInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', this.debounce(() => {
                    this.validatePriceRange();
                    this.saveFilterState();
                    this.applyFilters();
                }, 500));
            }
        });

        // Фильтры по размеру
        const sizeSelects = document.querySelectorAll('.size-select');
        sizeSelects.forEach(select => {
            select.addEventListener('change', this.debounce(() => {
                this.saveFilterState();
                this.applyFilters();
            }, 300));
        });
    }

    validatePriceRange() {
        const minInput = document.getElementById('priceMin');
        const maxInput = document.getElementById('priceMax');
        
        if (!minInput || !maxInput) return;
        
        let min = parseInt(minInput.value) || 0;
        let max = parseInt(maxInput.value) || 50000;
        
        // Валидация диапазона
        if (min < 0) min = 0;
        if (max > 100000) max = 100000;
        if (min > max) [min, max] = [max, min];
        
        minInput.value = min;
        maxInput.value = max;
    }

    applyFilters() {
        console.log('🎯 Применение фильтров...');
        
        const filters = {
            seasons: this.getSelectedValues('season'),
            types: this.getSelectedValues('type'),
            brands: this.getSelectedValues('brand'),
            sizes: this.getSelectedSizes(),
            priceMin: parseInt(document.getElementById('priceMin')?.value) || 0,
            priceMax: parseInt(document.getElementById('priceMax')?.value) || 50000
        };
        
        console.log('Фильтры:', filters);
        
        const products = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        products.forEach(product => {
            const matches = this.productMatchesFilters(product, filters);
            product.style.display = matches ? 'block' : 'none';
            if (matches) visibleCount++;
            
            // Анимация появления
            if (matches && product.style.opacity !== '1') {
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 50);
            }
        });
        
        this.updateResultsCounter(visibleCount);
        this.showNotification(`Найдено товаров: ${visibleCount}`, 'success');
        this.animateFilterButton('applyFilters');
        
        // Сохранение в историю для аналитики
        this.saveFilterHistory(filters);
    }

    productMatchesFilters(product, filters) {
        const productData = {
            categories: product.dataset.category?.split(' ') || [],
            price: this.getProductPrice(product),
            size: product.dataset.size || '',
            season: product.dataset.season || '',
            brand: product.dataset.brand || ''
        };
        
        return (
            this.matchesCategories(productData.categories, filters.seasons, filters.types, filters.brands) &&
            this.matchesPrice(productData.price, filters.priceMin, filters.priceMax) &&
            this.matchesSize(productData.size, filters.sizes) &&
            this.matchesSeason(productData.season, filters.seasons) &&
            this.matchesBrand(productData.brand, filters.brands)
        );
    }

    matchesCategories(categories, seasons, types, brands) {
        const seasonMatch = seasons.length === 0 || seasons.some(season => categories.includes(season));
        const typeMatch = types.length === 0 || types.some(type => categories.includes(type));
        const brandMatch = brands.length === 0 || brands.some(brand => categories.includes(brand));
        return seasonMatch && typeMatch && brandMatch;
    }

    matchesPrice(price, min, max) {
        return price >= min && price <= max;
    }

    matchesSize(size, selectedSizes) {
        return selectedSizes.length === 0 || selectedSizes.includes(size);
    }

    matchesSeason(season, selectedSeasons) {
        return selectedSeasons.length === 0 || selectedSeasons.includes(season);
    }

    matchesBrand(brand, selectedBrands) {
        return selectedBrands.length === 0 || selectedBrands.includes(brand);
    }

    getSelectedSizes() {
        const selects = document.querySelectorAll('.size-select');
        return Array.from(selects)
            .map(select => select.value)
            .filter(value => value);
    }

    resetFilters() {
        console.log('🔄 Сброс фильтров...');
        
        // Сброс чекбоксов
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            if (!checkbox.closest('.view-options')) {
                checkbox.checked = false;
            }
        });
        
        // Сброс цены
        const priceMin = document.getElementById('priceMin');
        const priceMax = document.getElementById('priceMax');
        if (priceMin) priceMin.value = 5000;
        if (priceMax) priceMax.value = 50000;
        
        // Сброс размеров
        document.querySelectorAll('.size-select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        // Показ всех товаров с анимацией
        const products = document.querySelectorAll('.product-card');
        products.forEach((product, index) => {
            setTimeout(() => {
                product.style.display = 'block';
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, index * 50);
        });
        
        this.updateResultsCounter(products.length);
        this.showNotification('Фильтры сброшены', 'info');
        this.animateFilterButton('resetFilters');
        
        // Очистка сохраненного состояния
        localStorage.removeItem('filterState');
    }

    // Система корзины с улучшенной функциональностью
    initCart() {
        if (this.isCartPage()) {
            this.renderCart();
            this.initCartEventListeners();
        }
        
        // Обновление счетчика корзины в реальном времени
        this.updateCartCounter();
    }

    isCartPage() {
        return window.location.pathname.includes('cart.html') || document.getElementById('cartItems');
    }

    getCart() {
        try {
            return JSON.parse(localStorage.getItem('tireShopCart')) || [];
        } catch (e) {
            console.error('Ошибка чтения корзины:', e);
            return [];
        }
    }

    saveCart(cart) {
        try {
            localStorage.setItem('tireShopCart', JSON.stringify(cart));
            this.updateCartCounter();
        } catch (e) {
            console.error('Ошибка сохранения корзины:', e);
        }
    }

    addToCart(productId, button) {
        const product = this.getProductData(productId);
        if (!product) {
            this.showNotification('Товар не найден', 'error');
            return;
        }

        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart(cart);
        this.showAddToCartNotification(product);
        this.animateAddToCart(button);

        // Перенаправление в корзину только если пользователь явно хочет
        if (this.shouldRedirectToCart()) {
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 1500);
        }
    }

    shouldRedirectToCart() {
        return window.innerWidth > 768 && !window.location.href.includes('cart.html');
    }

    showAddToCartNotification(product) {
        const notification = this.showNotification(
            `"${product.name}" добавлен в корзину!`, 
            'success'
        );
        
        // Добавляем кнопку для быстрого перехода
        setTimeout(() => {
            const goToCartBtn = document.createElement('button');
            goToCartBtn.textContent = 'Перейти в корзину';
            goToCartBtn.style.cssText = `
                margin-left: 10px;
                padding: 5px 10px;
                background: #b3e9e2;
                border: none;
                border-radius: 4px;
                color: #000;
                cursor: pointer;
                font-size: 12px;
            `;
            goToCartBtn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
            
            notification.appendChild(goToCartBtn);
        }, 500);
    }

    animateAddToCart(button) {
        if (!button) return;
        
        const originalText = button.innerHTML;
        const originalBg = button.style.backgroundColor;
        
        button.innerHTML = '✓ Добавлено';
        button.style.backgroundColor = '#4CAF50';
        button.disabled = true;
        
        // Создаем эффект "пульсации"
        button.style.animation = 'pulse 0.5s ease-in-out';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = originalBg;
            button.disabled = false;
            button.style.animation = '';
        }, 2000);
    }

    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
        this.renderCart();
        this.showNotification('Товар удален из корзины', 'info');
    }

    updateQuantity(productId, change) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart(cart);
                this.renderCart();
            }
        }
    }

    renderCart() {
        const cartContainer = document.getElementById('cartItems');
        const totalPriceElement = document.getElementById('totalPrice');
        const cartCounter = document.querySelector('.cart-counter');
        
        if (!cartContainer) return;

        const cart = this.getCart();

        if (cart.length === 0) {
            cartContainer.innerHTML = this.getEmptyCartHTML();
            if (totalPriceElement) totalPriceElement.textContent = '0 ₽';
            if (cartCounter) cartCounter.style.display = 'none';
            return;
        }

        let total = 0;
        const itemsHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            return this.getCartItemHTML(item, itemTotal);
        }).join('');

        cartContainer.innerHTML = itemsHTML;
        if (totalPriceElement) totalPriceElement.textContent = `${total.toLocaleString()} ₽`;
        if (cartCounter) {
            cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCounter.style.display = 'flex';
        }
    }

    getEmptyCartHTML() {
        return `
            <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары из каталога</p>
                <a href="product.html" class="btn-primary">Перейти в каталог</a>
            </div>
        `;
    }

    getCartItemHTML(item, itemTotal) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    ${item.quantity > 1 ? `<span class="quantity-badge">${item.quantity}</span>` : ''}
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                    <div class="cart-item-meta">Добавлен: ${new Date(item.addedAt).toLocaleDateString()}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}" aria-label="Уменьшить количество">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}" aria-label="Увеличить количество">+</button>
                    </div>
                    <div class="item-total">${itemTotal.toLocaleString()} ₽</div>
                    <button class="btn-secondary remove-from-cart" data-product-id="${item.id}">
                        🗑️ Удалить
                    </button>
                </div>
            </div>
        `;
    }

    initCartEventListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            if (target.classList.contains('remove-from-cart') || target.closest('.remove-from-cart')) {
                const button = target.classList.contains('remove-from-cart') ? target : target.closest('.remove-from-cart');
                const productId = button.dataset.productId;
                this.removeFromCart(productId);
            }
            
            if (target.classList.contains('plus') || target.closest('.plus')) {
                const button = target.classList.contains('plus') ? target : target.closest('.plus');
                const productId = button.dataset.id;
                this.updateQuantity(productId, 1);
            }
            
            if (target.classList.contains('minus') || target.closest('.minus')) {
                const button = target.classList.contains('minus') ? target : target.closest('.minus');
                const productId = button.dataset.id;
                this.updateQuantity(productId, -1);
            }
        });

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }
    }

    handleCheckout() {
        const cart = this.getCart();
        if (cart.length === 0) {
            this.showNotification('Корзина пуста', 'warning');
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Показ модального окна подтверждения
        this.showCheckoutModal(total, cart);
    }

    showCheckoutModal(total, cart) {
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(20px);
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                color: white;
                text-align: center;
            ">
                <h3>Подтверждение заказа</h3>
                <p>Общая сумма: <strong>${total.toLocaleString()} ₽</strong></p>
                <p>Количество товаров: ${cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <div class="modal-buttons" style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                    <button class="btn-secondary" id="cancelCheckout">Отмена</button>
                    <button class="btn-primary" id="confirmCheckout">Подтвердить</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#cancelCheckout').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#confirmCheckout').addEventListener('click', () => {
            this.processOrder(total, cart);
            document.body.removeChild(modal);
        });

        // Закрытие по клику вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    processOrder(total, cart) {
        // Имитация процесса оформления заказа
        this.showNotification(`Заказ оформлен! Сумма: ${total.toLocaleString()} ₽`, 'success');
        
        // Очистка корзины
        localStorage.removeItem('tireShopCart');
        this.renderCart();
        
        // Перенаправление на страницу благодарности
        setTimeout(() => {
            window.location.href = 'thank-you.html';
        }, 2000);
    }

    // Дополнительные улучшения
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    initSmoothScrolling() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: rgba(179, 233, 226, 0.9);
            border: none;
            border-radius: 50%;
            color: #000;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
            backdrop-filter: blur(10px);
        `;

        document.body.appendChild(backToTop);

        window.addEventListener('scroll', () => {
            backToTop.style.opacity = window.pageYOffset > 300 ? '1' : '0';
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    initFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showInputError(input, 'Это поле обязательно для заполнения');
                isValid = false;
            } else {
                this.clearInputError(input);
            }
        });

        return isValid;
    }

    showInputError(input, message) {
        this.clearInputError(input);
        input.style.borderColor = '#ff6b6b';
        
        const error = document.createElement('div');
        error.className = 'input-error';
        error.textContent = message;
        error.style.cssText = 'color: #ff6b6b; font-size: 12px; margin-top: 5px;';
        
        input.parentNode.appendChild(error);
    }

    clearInputError(input) {
        input.style.borderColor = '';
        const existingError = input.parentNode.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }
    }

    initPerformanceMonitoring() {
        // Мониторинг производительности
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`🕒 Время загрузки страницы: ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('⚠️ Время загрузки превышает 3 секунды');
            }
        });
    }

    preloadCriticalResources() {
        // Предзагрузка критически важных ресурсов
        const criticalImages = [
            '/images/logo.png',
            '/images/background.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Вспомогательные методы
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    getSelectedValues(name) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }

    getProductPrice(product) {
        const priceElement = product.querySelector('.current-price');
        if (priceElement) {
            return parseInt(priceElement.textContent.replace(/[^\d]/g, '')) || 0;
        }
        return 0;
    }

    updateResultsCounter(count) {
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
        counter.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => counter.style.animation = '', 500);
    }

    updateCartCounter() {
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Обновление всех счетчиков на странице
        document.querySelectorAll('.cart-counter').forEach(counter => {
            if (totalItems > 0) {
                counter.textContent = totalItems;
                counter.style.display = 'flex';
            } else {
                counter.style.display = 'none';
            }
        });
    }

    animateFilterButton(buttonId) {
        const btn = document.getElementById(buttonId);
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        }
    }

    saveFilterState() {
        const filterState = {
            checkboxes: {},
            prices: {
                min: document.getElementById('priceMin')?.value,
                max: document.getElementById('priceMax')?.value
            }
        };

        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            if (!checkbox.closest('.view-options')) {
                filterState.checkboxes[checkbox.name] = checkbox.checked;
            }
        });

        localStorage.setItem('filterState', JSON.stringify(filterState));
    }

    loadFilterState() {
        try {
            const saved = localStorage.getItem('filterState');
            if (saved) {
                const filterState = JSON.parse(saved);
                
                // Восстанавливаем чекбоксы
                Object.entries(filterState.checkboxes).forEach(([name, checked]) => {
                    const checkbox = document.querySelector(`input[name="${name}"]`);
                    if (checkbox) checkbox.checked = checked;
                });
                
                // Восстанавливаем цены
                if (filterState.prices.min) {
                    const minInput = document.getElementById('priceMin');
                    if (minInput) minInput.value = filterState.prices.min;
                }
                if (filterState.prices.max) {
                    const maxInput = document.getElementById('priceMax');
                    if (maxInput) maxInput.value = filterState.prices.max;
                }
            }
        } catch (e) {
            console.error('Ошибка загрузки состояния фильтров:', e);
        }
    }

    saveFilterHistory(filters) {
        const history = JSON.parse(localStorage.getItem('filterHistory') || '[]');
        history.unshift({
            timestamp: new Date().toISOString(),
            filters: filters
        });
        
        // Сохраняем только последние 10 записей
        localStorage.setItem('filterHistory', JSON.stringify(history.slice(0, 10)));
    }

    showNotification(message, type = 'info') {
        // Удаляем старые уведомления
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            font-family: Georgia, 'Times New Roman', Times, serif;
            border-left: 4px solid #b3e9e2;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, type === 'error' ? 5000 : 3000);
        
        return notification;
    }

    getNotificationColor(type) {
        const colors = {
            success: 'rgba(76, 175, 80, 0.9)',
            error: 'rgba(244, 67, 54, 0.9)',
            warning: 'rgba(255, 152, 0, 0.9)',
            info: 'rgba(33, 150, 243, 0.9)'
        };
        return colors[type] || colors.info;
    }

    getProductData(productId) {
        const products = {
            '1': { name: 'Nokian Hakkapeliitta R5', price: 12490, image: 'https://via.placeholder.com/250x250' },
            '2': { name: 'Michelin X-Ice North 4', price: 13990, image: 'https://via.placeholder.com/250x250' },
            '3': { name: 'Bridgestone Turanza T005', price: 9790, image: 'https://via.placeholder.com/250x250' },
            '4': { name: 'Continental AllSeasonContact 2', price: 11290, image: 'https://via.placeholder.com/250x250' },
            '5': { name: 'Pirelli Ice Zero 2', price: 12450, image: 'https://via.placeholder.com/250x250' },
            '6': { name: 'Michelin Primacy 4', price: 10990, image: 'https://via.placeholder.com/250x250' }
        };
        
        return products[productId] || null;
    }

    toggleFavorite(productId, button) {
        const product = this.getProductData(productId);
        if (!product) return;

        let favorites = JSON.parse(localStorage.getItem('tireShopFavorites')) || [];
        const index = favorites.findIndex(item => item.id === productId);
        
        if (index > -1) {
            favorites.splice(index, 1);
            button.classList.remove('active');
            button.innerHTML = '🤍';
            this.showNotification(`"${product.name}" удален из избранного`, 'info');
        } else {
            favorites.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                addedAt: new Date().toISOString()
            });
            button.classList.add('active');
            button.innerHTML = '❤';
            this.showNotification(`"${product.name}" добавлен в избранное`, 'success');
        }
        
        localStorage.setItem('tireShopFavorites', JSON.stringify(favorites));
    }

    showCartNotification() {
        if (this.isCartPage()) {
            const lastProduct = localStorage.getItem('lastAddedProduct');
            if (lastProduct) {
                try {
                    const product = JSON.parse(lastProduct);
                    this.showNotification(`"${product.name}" был добавлен в корзину!`, 'success');
                    localStorage.removeItem('lastAddedProduct');
                } catch (e) {
                    console.error('Ошибка парсинга последнего товара:', e);
                }
            }
        }
    }

    // Сортировка и переключение вида
    initSorting() {
        const sortSelect = document.getElementById('sortOptions');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }
    }

    sortProducts(sortType) {
        console.log('Сортировка:', sortType);
        // Реализация сортировки товаров
        this.showNotification(`Сортировка: ${this.getSortLabel(sortType)}`, 'info');
    }

    getSortLabel(sortType) {
        const labels = {
            'price-asc': 'Цена по возрастанию',
            'price-desc': 'Цена по убыванию',
            'name-asc': 'Название А-Я',
            'name-desc': 'Название Я-А',
            'rating': 'По рейтингу'
        };
        return labels[sortType] || sortType;
    }

    initViewToggle() {
        const gridView = document.getElementById('view-grid');
        const listView = document.getElementById('view-list');
        
        if (gridView && listView) {
            // Загружаем сохраненные настройки
            const savedView = localStorage.getItem('preferredView') || 'grid';
            if (savedView === 'grid') {
                gridView.checked = true;
                this.setViewMode('grid');
            } else {
                listView.checked = true;
                this.setViewMode('list');
            }
            
            gridView.addEventListener('change', () => {
                this.setViewMode('grid');
                localStorage.setItem('preferredView', 'grid');
            });
            
            listView.addEventListener('change', () => {
                this.setViewMode('list');
                localStorage.setItem('preferredView', 'list');
            });
        }
    }

    setViewMode(mode) {
        const productsView = document.getElementById('productsView');
        if (productsView) {
            productsView.classList.remove('grid-view', 'list-view');
            productsView.classList.add(`${mode}-view`);
            
            // Добавляем плавную анимацию
            productsView.style.opacity = '0.5';
            setTimeout(() => {
                productsView.style.opacity = '1';
            }, 300);
        }
    }

    quickView(productId) {
        // Реализация быстрого просмотра товара
        console.log('Быстрый просмотр товара:', productId);
        this.showNotification('Функция быстрого просмотра в разработке', 'info');
    }

    showProductDetails(productId) {
        // Реализация показа деталей товара
        console.log('Показать детали товара:', productId);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.tireShopApp = new TireShopApp();
});

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .product-card {
        transition: all 0.3s ease;
        animation: fadeIn 0.5s ease-out;
    }
    
    .cart-counter {
        transition: all 0.3s ease;
    }
    
    .menu-open {
        overflow: hidden;
    }
    
    .quantity-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff6b6b;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
    }
    
    .empty-icon {
        font-size: 48px;
        margin-bottom: 20px;
    }
    
    .notification-success { background: rgba(76, 175, 80, 0.9) !important; }
    .notification-error { background: rgba(244, 67, 54, 0.9) !important; }
    .notification-warning { background: rgba(255, 152, 0, 0.9) !important; }
    .notification-info { background: rgba(33, 150, 243, 0.9) !important; }
`;

document.head.appendChild(style);

// Service Worker для оффлайн-работы (опционально)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}