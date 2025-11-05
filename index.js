// optimized-app.js - Полная оптимизация для всего сайта
class OptimizedTireShop {
    constructor() {
        this.cache = new Map();
        this.observers = new Map();
        this.performance = {
            startTime: performance.now(),
            metrics: new Map()
        };
        this.init();
    }

    async init() {
        console.log('🚀 Инициализация оптимизированного приложения...');
        
        try {
            // Приоритетная инициализация
            await this.initCriticalPath();
            
            // Отложенная инициализация некритичных модулей
            this.initNonCriticalModules();
            
            // Оптимизации производительности
            this.initPerformanceOptimizations();
            
            // Мониторинг
            this.initMonitoring();
            
        } catch (error) {
            console.error('Ошибка инициализации:', error);
            this.showNotification('Произошла ошибка при загрузке страницы', 'error');
        }
    }

    // Критический путь - должен загружаться первым
    async initCriticalPath() {
        return new Promise((resolve) => {
            // 1. Core functionality
            this.initCore();
            
            // 2. Immediate user interactions
            this.initImmediateInteractions();
            
            // 3. Restore critical state
            this.restoreCriticalState();
            
            // Отметить готовность критического пути
            document.documentElement.classList.add('core-ready');
            resolve();
        });
    }

    initCore() {
        this.initErrorHandling();
        this.initLoadingStates();
        this.initCoreNavigation();
        this.initBasicInteractions();
    }

    // Обработка ошибок
    initErrorHandling() {
        window.addEventListener('error', (e) => {
            this.trackError('Global Error', e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.trackError('Unhandled Promise Rejection', e.reason);
        });
        
        // Error Boundary для компонентов
        this.errorBoundary = (component, errorCallback) => {
            return (...args) => {
                try {
                    return component(...args);
                } catch (error) {
                    this.trackError(`Component Error: ${component.name}`, error);
                    if (errorCallback) errorCallback(error);
                }
            };
        };
    }

    // Состояния загрузки
    initLoadingStates() {
        // Добавляем классы для прогрессивной загрузки
        document.documentElement.classList.add('loading');
        
        window.addEventListener('load', () => {
            document.documentElement.classList.remove('loading');
            document.documentElement.classList.add('loaded');
            
            // Убираем preloader если есть
            const preloader = document.getElementById('preloader');
            if (preloader) {
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => preloader.remove(), 300);
                }, 500);
            }
        });
    }

    // Базовая навигация
    initCoreNavigation() {
        // Prefetch для внутренних ссылок при наведении
        this.initLinkPrefetching();
        
        // Плавная навигация
        this.initSmoothNavigation();
        
        // Быстрая навигация между страницами (если SPA-like)
        this.initFastNavigation();
    }

    initLinkPrefetching() {
        if (!this.supportsPreload()) return;
        
        document.addEventListener('mouseover', this.debounce((e) => {
            const link = e.target.closest('a[href^="/"], a[href^="."]');
            if (link && !this.isLinkPrefetched(link)) {
                this.prefetchLink(link.href);
            }
        }, 100));
    }

    prefetchLink(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'document';
        document.head.appendChild(link);
    }

    isLinkPrefetched(link) {
        return link.hasAttribute('data-prefetched');
    }

    supportsPreload() {
        const link = document.createElement('link');
        return link.relList && link.relList.supports('prefetch');
    }

    initSmoothNavigation() {
        // Плавная прокрутка к якорям
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    initFastNavigation() {
        // Перехват кликов по ссылкам для быстрой навигации
        document.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) return;
            
            const link = e.target.closest('a[href]:not([target="_blank"])');
            if (link && this.isSameOrigin(link.href)) {
                e.preventDefault();
                this.navigateTo(link.href);
            }
        });
    }

    isSameOrigin(href) {
        try {
            const url = new URL(href, window.location.href);
            return url.origin === window.location.origin;
        } catch {
            return false;
        }
    }

    async navigateTo(url) {
        // Показываем индикатор загрузки
        this.showLoadingIndicator();
        
        try {
            const response = await fetch(url, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const html = await response.text();
            this.updatePageContent(html, url);
            
        } catch (error) {
            // Fallback к обычной навигации
            window.location.href = url;
        }
    }

    updatePageContent(html, url) {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');
        
        // Обновляем title
        if (newDoc.title !== document.title) {
            document.title = newDoc.title;
        }
        
        // Обновляем основной контент
        const newContent = newDoc.querySelector('main, .content, .container');
        const oldContent = document.querySelector('main, .content, .container');
        
        if (newContent && oldContent) {
            // Плавный переход
            oldContent.style.opacity = '0';
            oldContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                oldContent.innerHTML = newContent.innerHTML;
                oldContent.style.opacity = '1';
                oldContent.style.transform = 'translateY(0)';
                
                // Обновляем URL в браузере
                window.history.pushState({}, '', url);
                
                // Реинициализируем компоненты для новой страницы
                this.reinitializeComponents();
                
                // Скрываем индикатор загрузки
                this.hideLoadingIndicator();
                
            }, 300);
        }
    }

    // Базовые взаимодействия
    initBasicInteractions() {
        this.initHamburgerMenu();
        this.initCartSystem();
        this.initSearch();
    }

    // Улучшенное гамбургер-меню
    initHamburgerMenu() {
        const hamburger = document.getElementById('hamburgerMenu');
        const nav = document.querySelector('.nav-list');
        
        if (!hamburger || !nav) return;

        const toggleMenu = this.errorBoundary((e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            const isOpening = !hamburger.classList.contains('active');
            
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = isOpening ? 'hidden' : '';
            
            // Анимация
            this.animateMenuToggle(isOpening);
            
        }, (error) => {
            console.error('Menu toggle error:', error);
        });

        // События
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('touchstart', toggleMenu, { passive: true });

        // Закрытие по клику вне меню
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && nav.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Адаптация к изменению размера
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth > 768 && nav.classList.contains('active')) {
                toggleMenu();
            }
        }, 250));
    }

    animateMenuToggle(isOpening) {
        const navItems = document.querySelectorAll('.nav-link');
        
        if (isOpening) {
            navItems.forEach((item, index) => {
                item.style.animation = `navItemSlideIn 0.3s ease ${index * 0.1}s forwards`;
            });
        } else {
            navItems.forEach((item, index) => {
                item.style.animation = `navItemSlideOut 0.3s ease ${index * 0.1}s forwards`;
            });
        }
    }

    // Система корзины
    initCartSystem() {
        this.cart = this.getStoredCart();
        this.updateCartUI();
        this.initCartEvents();
    }

    getStoredCart() {
        try {
            return JSON.parse(localStorage.getItem('optimizedCart')) || [];
        } catch {
            return [];
        }
    }

    updateCartUI() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Обновляем все счетчики корзины
        document.querySelectorAll('.cart-counter').forEach(counter => {
            if (totalItems > 0) {
                counter.textContent = totalItems;
                counter.style.display = 'flex';
                counter.classList.add('pulse');
                setTimeout(() => counter.classList.remove('pulse'), 600);
            } else {
                counter.style.display = 'none';
            }
        });
        
        // Если на странице корзины - рендерим полное содержимое
        if (this.isCartPage()) {
            this.renderFullCart();
        }
    }

    // Немедленные взаимодействия
    initImmediateInteractions() {
        this.initProductInteractions();
        this.initFormHandlers();
        this.initQuickActions();
    }

    initProductInteractions() {
        // Делегирование событий для товаров
        document.addEventListener('click', this.throttle((e) => {
            const target = e.target;
            
            // Добавление в корзину
            if (target.closest('[data-action="add-to-cart"]')) {
                this.handleAddToCart(e);
            }
            
            // Избранное
            if (target.closest('[data-action="toggle-favorite"]')) {
                this.handleToggleFavorite(e);
            }
            
            // Быстрый просмотр
            if (target.closest('[data-action="quick-view"]')) {
                this.handleQuickView(e);
            }
            
        }, 100));
        
        // Загрузка изображений по мере необходимости
        this.initLazyLoading();
    }

    handleAddToCart(e) {
        const button = e.target.closest('[data-action="add-to-cart"]');
        const productId = button.dataset.productId;
        
        if (!productId) return;
        
        this.addToCartOptimized(productId, button);
        e.preventDefault();
    }

    addToCartOptimized(productId, button) {
        const product = this.getProductData(productId);
        if (!product) return;

        // Быстрое обновление UI
        this.optimisticCartUpdate(productId);
        
        // Анимация
        this.animateCartAdd(button);
        
        // Асинхронное сохранение
        setTimeout(() => {
            this.persistCartUpdate(productId, product);
        }, 0);
    }

    optimisticCartUpdate(productId) {
        // Временное обновление UI без блокировки
        const tempCart = [...this.cart];
        const existingItem = tempCart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            tempCart.push({
                id: productId,
                quantity: 1,
                pending: true
            });
        }
        
        this.cart = tempCart;
        this.updateCartUI();
    }

    persistCartUpdate(productId, product) {
        const cart = this.getStoredCart();
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
    }

    // Восстановление критического состояния
    restoreCriticalState() {
        this.restoreUserPreferences();
        this.restoreSessionData();
    }

    restoreUserPreferences() {
        // Темная тема
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
        }
        
        // Предпочтительный вид
        const preferredView = localStorage.getItem('preferredView') || 'grid';
        this.setViewMode(preferredView);
        
        // Сохраненные фильтры
        this.restoreFilters();
    }

    restoreSessionData() {
        // Восстановление данных сессии
        const sessionData = sessionStorage.getItem('sessionData');
        if (sessionData) {
            try {
                const data = JSON.parse(sessionData);
                this.restoreFromSession(data);
            } catch (e) {
                console.warn('Invalid session data:', e);
            }
        }
    }

    // Некритичные модули (загружаются после основного контента)
    initNonCriticalModules() {
        // Загружаем после события load
        if (document.readyState === 'loading') {
            window.addEventListener('load', () => {
                setTimeout(() => this.loadNonCritical(), 1000);
            });
        } else {
            setTimeout(() => this.loadNonCritical(), 1000);
        }
    }

    loadNonCritical() {
        this.initAnalytics();
        this.initSocialFeatures();
        this.initBackgroundTasks();
        this.initEnhancedFeatures();
    }

    initAnalytics() {
        // Легковесная аналитика
        this.trackPageView();
        this.initPerformanceTracking();
    }

    initSocialFeatures() {
        // Ленивая загрузка социальных виджетов
        this.initLazySocialWidgets();
    }

    initBackgroundTasks() {
        // Prefetch для likely next pages
        this.prefetchLikelyPages();
        
        // Кэширование данных
        this.initBackgroundCaching();
    }

    initEnhancedFeatures() {
        // Улучшенные функции, которые не критичны
        this.initAdvancedAnimations();
        this.initOfflineSupport();
        this.initPushNotifications();
    }

    // Оптимизации производительности
    initPerformanceOptimizations() {
        this.initIntersectionObserver();
        this.initMutationObserver();
        this.initIdleCallback();
        this.initMemoryManagement();
    }

    initIntersectionObserver() {
        if (!window.IntersectionObserver) return;
        
        // Ленивая загрузка изображений
        this.lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadLazyImage(img);
                    this.lazyImageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.lazyImageObserver.observe(img);
        });
    }

    loadLazyImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        const loadingImage = new Image();
        loadingImage.src = src;
        loadingImage.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        };
        
        loadingImage.onerror = () => {
            console.warn('Failed to load image:', src);
            img.classList.add('error');
        };
    }

    initMutationObserver() {
        // Отслеживание изменений DOM для переинициализации
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    this.handleDOMChanges(mutation.addedNodes);
                }
            });
        });
        
        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    initIdleCallback() {
        // Использование idle callbacks для некритичных задач
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
                this.cleanupOldData();
                this.prefetchResources();
            });
        } else {
            // Fallback
            setTimeout(() => {
                this.cleanupOldData();
                this.prefetchResources();
            }, 5000);
        }
    }

    initMemoryManagement() {
        // Очистка кэша при низкой памяти
        if ('memory' in performance) {
            setInterval(() => {
                if (performance.memory.usedJSHeapSize > performance.memory.jsHeapSizeLimit * 0.8) {
                    this.clearUnusedCache();
                }
            }, 30000);
        }
        
        // Очистка при скрытии страницы
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.suspendNonCriticalTasks();
            } else {
                this.resumeTasks();
            }
        });
    }

    // Мониторинг
    initMonitoring() {
        this.initPerformanceMonitoring();
        this.initErrorTracking();
        this.initUserBehaviorTracking();
    }

    initPerformanceMonitoring() {
        // Core Web Vitals
        this.monitorLCP();
        this.monitorFID();
        this.monitorCLS();
        
        // Custom metrics
        this.monitorFirstPaint();
        this.monitorTimeToInteractive();
    }

    monitorLCP() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.performance.metrics.set('LCP', lastEntry.startTime);
            this.trackMetric('LCP', lastEntry.startTime);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Вспомогательные методы
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Уведомления
    showNotification(message, type = 'info', duration = 3000) {
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
                <button class="notification-close" aria-label="Закрыть">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Закрытие
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hideNotification(notification));
        
        // Авто-закрытие
        if (duration > 0) {
            setTimeout(() => this.hideNotification(notification), duration);
        }
        
        return notification;
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Индикатор загрузки
    showLoadingIndicator() {
        let indicator = document.getElementById('loading-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'loading-indicator';
            indicator.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">Загрузка...</div>
            `;
            document.body.appendChild(indicator);
        }
        
        indicator.classList.add('active');
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.classList.remove('active');
        }
    }

    // Сохранение состояния
    saveState() {
        const state = {
            cart: this.cart,
            preferences: this.getUserPreferences(),
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('appState', JSON.stringify(state));
        } catch (e) {
            console.warn('Failed to save state:', e);
        }
    }

    // Методы, требующие реализации (заглушки)
    getProductData(productId) {
        // Заглушка - должна быть реализована
        const products = {
            '1': { name: 'Nokian Hakkapeliitta R5', price: 12490, image: 'https://via.placeholder.com/250x250' },
            // ... другие товары
        };
        return products[productId];
    }

    isCartPage() {
        return window.location.pathname.includes('cart');
    }

    saveCart(cart) {
        try {
            localStorage.setItem('optimizedCart', JSON.stringify(cart));
            this.cart = cart;
            this.updateCartUI();
        } catch (e) {
            console.error('Failed to save cart:', e);
        }
    }

    renderFullCart() {
        // Реализация рендеринга полной корзины
        console.log('Rendering full cart...');
    }

    setViewMode(mode) {
        // Реализация установки режима просмотра
        console.log('Setting view mode:', mode);
    }

    restoreFilters() {
        // Реализация восстановления фильтров
        console.log('Restoring filters...');
    }

    restoreFromSession(data) {
        // Реализация восстановления из сессии
        console.log('Restoring from session:', data);
    }

    trackPageView() {
        // Реализация отслеживания просмотров
        console.log('Tracking page view');
    }

    initPerformanceTracking() {
        // Реализация отслеживания производительности
        console.log('Initializing performance tracking');
    }

    initLazySocialWidgets() {
        // Реализация ленивой загрузки социальных виджетов
        console.log('Initializing lazy social widgets');
    }

    prefetchLikelyPages() {
        // Реализация prefetch для вероятных страниц
        console.log('Prefetching likely pages');
    }

    initBackgroundCaching() {
        // Реализация фонового кэширования
        console.log('Initializing background caching');
    }

    initAdvancedAnimations() {
        // Реализация продвинутых анимаций
        console.log('Initializing advanced animations');
    }

    initOfflineSupport() {
        // Реализация оффлайн поддержки
        console.log('Initializing offline support');
    }

    initPushNotifications() {
        // Реализация push уведомлений
        console.log('Initializing push notifications');
    }

    handleDOMChanges(addedNodes) {
        // Реализация обработки изменений DOM
        console.log('Handling DOM changes:', addedNodes);
    }

    cleanupOldData() {
        // Реализация очистки старых данных
        console.log('Cleaning up old data');
    }

    prefetchResources() {
        // Реализация prefetch ресурсов
        console.log('Prefetching resources');
    }

    clearUnusedCache() {
        // Реализация очистки неиспользуемого кэша
        console.log('Clearing unused cache');
    }

    suspendNonCriticalTasks() {
        // Реализация приостановки некритичных задач
        console.log('Suspending non-critical tasks');
    }

    resumeTasks() {
        // Реализация возобновления задач
        console.log('Resuming tasks');
    }

    monitorFID() {
        // Реализация мониторинга FID
        console.log('Monitoring FID');
    }

    monitorCLS() {
        // Реализация мониторинга CLS
        console.log('Monitoring CLS');
    }

    monitorFirstPaint() {
        // Реализация мониторинга First Paint
        console.log('Monitoring First Paint');
    }

    monitorTimeToInteractive() {
        // Реализация мониторинга TTI
        console.log('Monitoring Time to Interactive');
    }

    trackError(type, error) {
        // Реализация отслеживания ошибок
        console.error('Tracked error:', type, error);
    }

    trackMetric(name, value) {
        // Реализация отслеживания метрик
        console.log('Tracked metric:', name, value);
    }

    initErrorTracking() {
        // Реализация отслеживания ошибок
        console.log('Initializing error tracking');
    }

    initUserBehaviorTracking() {
        // Реализация отслеживания поведения пользователей
        console.log('Initializing user behavior tracking');
    }

    animateCartAdd(button) {
        // Реализация анимации добавления в корзину
        console.log('Animating cart add');
    }

    showAddToCartNotification(product) {
        // Реализация уведомления о добавлении в корзину
        console.log('Showing add to cart notification:', product);
    }

    handleToggleFavorite(e) {
        // Реализация переключения избранного
        console.log('Toggling favorite');
    }

    handleQuickView(e) {
        // Реализация быстрого просмотра
        console.log('Handling quick view');
    }

    initCartEvents() {
        // Реализация событий корзины
        console.log('Initializing cart events');
    }

    initSearch() {
        // Реализация поиска
        console.log('Initializing search');
    }

    initFormHandlers() {
        // Реализация обработчиков форм
        console.log('Initializing form handlers');
    }

    initQuickActions() {
        // Реализация быстрых действий
        console.log('Initializing quick actions');
    }

    initLazyLoading() {
        // Реализация ленивой загрузки
        console.log('Initializing lazy loading');
    }

    reinitializeComponents() {
        // Реализация переинициализации компонентов
        console.log('Reinitializing components');
    }

    getUserPreferences() {
        // Реализация получения предпочтений пользователя
        return {};
    }
}

// CSS для оптимизаций
const optimizationStyles = `
/* Progressive loading */
html.loading * {
    animation-play-state: paused !important;
}

html.loaded .progressive {
    opacity: 1;
    transform: translateY(0);
}

/* Loading states */
.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Optimized animations */
@media (prefers-reduced-motion: no-preference) {
    .optimized-animate {
        animation-duration: 0.3s;
        animation-fill-mode: both;
    }
}

@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Notification system */
.notification {
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
    max-width: 400px;
    font-family: Georgia, 'Times New Roman', Times, serif;
    border-left: 4px solid #b3e9e2;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.notification.show {
    transform: translateX(0);
}

.notification-success { 
    background: rgba(76, 175, 80, 0.95);
    border-left-color: #4CAF50;
}

.notification-error { 
    background: rgba(244, 67, 54, 0.95);
    border-left-color: #f44336;
}

.notification-warning { 
    background: rgba(255, 152, 0, 0.95);
    border-left-color: #ff9800;
}

.notification-info { 
    background: rgba(33, 150, 243, 0.95);
    border-left-color: #2196F3;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 18px;
    cursor: pointer;
    margin-left: auto;
}

/* Loading indicator */
#loading-indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
}

#loading-indicator.active {
    display: flex;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #b3e9e2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-text {
    color: white;
    margin-left: 15px;
    font-size: 16px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Optimized image loading */
img[data-src] {
    opacity: 0;
    transition: opacity 0.3s ease;
}

img.loaded {
    opacity: 1;
}

/* Cart animations */
.cart-counter.pulse {
    animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

/* Navigation animations */
@keyframes navItemSlideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes navItemSlideOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(-20px);
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .auto-dark {
        background: #1a1a1a;
        color: #ffffff;
    }
}

/* Print styles */
@media print {
    .no-print {
        display: none !important;
    }
}
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = optimizationStyles;
document.head.appendChild(styleSheet);

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем поддержку современных API
    if ('Promise' in window && 'Map' in window && 'Set' in window) {
        window.optimizedApp = new OptimizedTireShop();
    } else {
        // Fallback для старых браузеров
        console.warn('Browser lacks modern features, using fallback');
        initFallbackMode();
    }
});

// Режим совместимости для старых браузеров
function initFallbackMode() {
    console.log('Initializing fallback mode...');
    
    // Базовая функциональность без оптимизаций
    const hamburger = document.getElementById('hamburgerMenu');
    const navList = document.querySelector('.nav-list');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }
    
    // Базовая корзина
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.dataset.productId;
            alert('Товар добавлен в корзину: ' + productId);
        }
    });
}

// Service Worker для оффлайн работы
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OptimizedTireShop;
}