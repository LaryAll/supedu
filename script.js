// Легендарный JavaScript для максимального UX
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initAnimations();
    initInteractions();
    initPerformance();
    initAccessibility();
    
    // Основные анимации
    function initAnimations() {
        // Плавная прокрутка с улучшенной производительностью
        const smoothScroll = (target) => {
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        };

        // Улучшенный Intersection Observer с throttling
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    if (entry.target.dataset.delay) {
                        entry.target.style.animationDelay = entry.target.dataset.delay;
                    }
                }
            });
        }, observerOptions);

        // Наблюдаем за всеми анимируемыми элементами
        const animatedElements = document.querySelectorAll(`
            .metric-item,
            .overview-card,
            .stat-card,
            .training-stat,
            .achievement-item,
            .summary-item,
            .conference-card,
            .highlight-card,
            .system-tag,
            .champion-item
        `);

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            el.dataset.delay = `${index * 0.1}s`;
            observer.observe(el);
        });

        // Добавляем CSS класс для анимации
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Интерактивность
    function initInteractions() {
        // Улучшенные hover эффекты с GPU ускорением
        const addHoverEffects = (selector, options = {}) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.addEventListener('mouseenter', function() {
                    this.style.transform = options.hover || 'translateY(-8px) scale(1.02)';
                    this.style.boxShadow = options.shadow || '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                    if (options.background) {
                        this.style.background = options.background;
                    }
                });
                
                el.addEventListener('mouseleave', function() {
                    this.style.transform = options.normal || 'translateY(0) scale(1)';
                    this.style.boxShadow = options.normalShadow || '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    if (options.normalBackground) {
                        this.style.background = options.normalBackground;
                    }
                });
            });
        };

        // Применяем hover эффекты
        addHoverEffects('.metric-item', {
            hover: 'translateY(-8px) scale(1.02)',
            shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            background: 'rgba(255, 255, 255, 0.2)'
        });

        addHoverEffects('.stat-card, .training-stat', {
            hover: 'translateY(-8px)',
            shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        });

        addHoverEffects('.achievement-item', {
            hover: 'translateX(8px)',
            shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
        });

        addHoverEffects('.system-tag', {
            hover: 'translateY(-4px) scale(1.05)',
            shadow: '0 15px 35px -5px rgba(0, 0, 0, 0.2)'
        });

        // Интерактивные клики с тактильной обратной связью
        const systemTags = document.querySelectorAll('.system-tag');
        systemTags.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Создаем ripple эффект
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                // Добавляем CSS для ripple анимации
                if (!document.querySelector('#ripple-style')) {
                    const style = document.createElement('style');
                    style.id = 'ripple-style';
                    style.textContent = `
                        @keyframes ripple {
                            to {
                                transform: scale(4);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                setTimeout(() => ripple.remove(), 600);
                
                // Тактильная обратная связь (если поддерживается)
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        });

        // Улучшенная анимация чисел с easing
        const animateNumbers = () => {
            const numberElements = document.querySelectorAll('.metric-value, .main-number, .stat-number, .nps-score, .summary-number');
            
            numberElements.forEach(element => {
                const finalNumber = element.textContent;
                const isPercentage = finalNumber.includes('%');
                const isPlus = finalNumber.includes('+');
                const isPlusMinus = finalNumber.includes('±');
                
                let cleanNumber = finalNumber.replace(/[^\d.-]/g, '');
                let prefix = '';
                let suffix = '';
                
                if (isPercentage) suffix = '%';
                if (isPlus) prefix = '+';
                if (isPlusMinus) prefix = '±';
                
                const targetNumber = parseFloat(cleanNumber);
                
                if (!isNaN(targetNumber)) {
                    let currentNumber = 0;
                    const duration = 2000; // 2 секунды
                    const startTime = performance.now();
                    
                    const animate = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Easing функция для более естественной анимации
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        currentNumber = targetNumber * easeOutQuart;
                        
                        if (Number.isInteger(targetNumber)) {
                            element.textContent = prefix + Math.floor(currentNumber) + suffix;
                        } else {
                            element.textContent = prefix + currentNumber.toFixed(1) + suffix;
                        }
                        
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    
                    requestAnimationFrame(animate);
                }
            });
        };

        // Запускаем анимацию чисел с задержкой
        setTimeout(animateNumbers, 800);
    }

    // Производительность
    function initPerformance() {
        // Throttling для scroll событий
        let ticking = false;
        
        const updateParallax = () => {
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                heroSection.style.transform = `translateY(${rate}px)`;
            }
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });

        // Lazy loading для изображений (если будут добавлены)
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Preload критических ресурсов
        const preloadCritical = () => {
            const criticalFonts = [
                'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
            ];
            
            criticalFonts.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = href;
                document.head.appendChild(link);
            });
        };

        preloadCritical();
    }

    // Доступность
    function initAccessibility() {
        // Улучшенная навигация с клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Фокус для интерактивных элементов
        const focusableElements = document.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
        focusableElements.forEach(el => {
            el.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--primary)';
                this.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', function() {
                this.style.outline = 'none';
            });
        });

        // ARIA live regions для динамического контента
        const liveRegions = document.querySelectorAll('[aria-live]');
        liveRegions.forEach(region => {
            region.addEventListener('DOMSubtreeModified', () => {
                // Обновляем содержимое для screen readers
                region.setAttribute('aria-label', region.textContent);
            });
        });
    }

    // Обработка ошибок и логирование
    window.addEventListener('error', function(e) {
        console.error('Page error:', e.error);
        // Здесь можно добавить отправку в систему мониторинга
    });

    // Аналитика событий
    const logEvent = (eventName, data = {}) => {
        console.log('Event:', eventName, data);
        // Интеграция с Google Analytics или другой аналитикой
        if (window.gtag) {
            window.gtag('event', eventName, data);
        }
    };

    // Отслеживаем важные взаимодействия
    document.addEventListener('click', (e) => {
        if (e.target.matches('.cta-button')) {
            logEvent('cta_click', { location: 'hero' });
        }
        if (e.target.matches('.system-tag')) {
            logEvent('system_tag_click', { system: e.target.textContent });
        }
    });

    // Добавляем класс для загрузки страницы
    document.body.classList.add('loaded');
    
    // Уведомляем о готовности
    console.log('🚀 Легендарный сайт загружен и готов к взрыву!');
}); 