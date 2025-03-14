// Проверка инициализации
console.log('main.js начал загрузку');

// Функция для работы с пользовательскими настройками
function getUserPreference(key, defaultValue) {
    if (isStorageAvailable('localStorage')) {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? value : defaultValue;
        } catch (e) {
            console.warn('Error accessing localStorage:', e);
            return defaultValue;
        }
    }
    return defaultValue;
}

// Функция инициализации модальных окон
function initModals() {
    console.log('Инициализация модальных окон');
    
    // Находим все модальные окна и кнопки
    const modals = {
        trailer: document.getElementById('trailer-modal'),
        preorder: document.getElementById('preorder-modal')
    };
    
    const buttons = {
        trailer: document.querySelector('[data-modal="trailer"]'),
        preorder: document.querySelector('[data-modal="preorder"]')
    };

    console.log('Найденные элементы:', {
        trailerModal: modals.trailer,
        preorderModal: modals.preorder,
        trailerButton: buttons.trailer,
        preorderButton: buttons.preorder
    });

    // URL трейлера
    const trailerUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

    function openModal(modalId) {
        const modal = modals[modalId];
        if (!modal) {
            console.error('Modal not found:', modalId);
            return;
        }

        console.log('Opening modal:', modalId);
        
        // Получаем текущую позицию скролла
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // Блокируем скролл и компенсируем сдвиг
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        
        // Устанавливаем модальное окно по центру текущего viewport
        modal.style.top = `${scrollY}px`;
        modal.style.height = `${viewportHeight}px`;
        
        // Показываем модальное окно
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
            
            // Если это трейлер, загружаем видео
            if (modalId === 'trailer') {
                const iframe = modal.querySelector('iframe');
                if (iframe) {
                    iframe.src = trailerUrl;
                }
            }
        }, 10);
    }

    function closeModal(modal) {
        if (!modal) return;
        
        console.log('Closing modal');
        
        // Получаем сохраненную позицию скролла
        const scrollY = Math.abs(parseInt(document.body.style.top || '0'));
        
        // Убираем активный класс
        modal.classList.remove('active');
        
        // Восстанавливаем состояние страницы
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
        
        // Очищаем стили модального окна
        modal.style.top = '';
        modal.style.height = '';
        
        // Если это трейлер, очищаем src у iframe после закрытия
        if (modal.classList.contains('trailer-modal')) {
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                setTimeout(() => {
                    iframe.src = '';
                }, 300);
            }
        }

        // Скрываем модальное окно после анимации
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Добавляем обработчики для кнопок
    if (buttons.trailer) {
        console.log('Adding trailer button handler');
        buttons.trailer.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('trailer');
        });
    }

    if (buttons.preorder) {
        console.log('Adding preorder button handler');
        buttons.preorder.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('preorder');
        });
    }

    // Добавляем обработчики для закрытия
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            closeModal(modal);
        });
    });

    // Закрытие по клику вне модального окна
    Object.values(modals).forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            Object.values(modals).forEach(modal => {
                if (modal && modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });

    // Обработка формы предзаказа
    const preorderForm = document.getElementById('preorder-form');
    if (preorderForm) {
        preorderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(preorderForm);
            
            // Валидация формы
            let isValid = true;
            formData.forEach((value, key) => {
                if (!value) isValid = false;
            });

            if (isValid) {
                alert('Спасибо за предзаказ! Мы свяжемся с вами в ближайшее время.');
                preorderForm.reset();
                closeModal(modals.preorder);
            } else {
                alert('Пожалуйста, заполните все поля формы.');
            }
        });
    }
}

// Функция инициализации всех компонентов
function initializeComponents() {
    console.log('Начало инициализации компонентов');
    
    // Инициализируем модальные окна
    initModals();
    
    // Mobile menu functionality
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('nav');
    let menuOpen = getUserPreference('menuOpen', 'false') === 'true';

    if (menuBtn && nav) {
        console.log('Меню найдено и инициализировано');
        // Добавляем плавный скролл к секциям
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Закрываем мобильное меню при клике
                    if (menuOpen) {
                        menuOpen = false;
                        nav.classList.remove('active');
                        menuBtn.classList.remove('active');
                    }
                    
                    // Плавный скролл к элементу
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Добавляем подсветку секции
                    setTimeout(() => {
                        targetElement.classList.add('highlight');
                        
                        // Удаляем класс подсветки через 2 секунды
                        setTimeout(() => {
                            targetElement.classList.remove('highlight');
                        }, 2000);
                    }, 500); // Задержка для начала анимации после завершения скролла
                }
            });
        });

        // Обработка навигации
        document.addEventListener('DOMContentLoaded', () => {
            const navLinks = document.querySelectorAll('nav ul li a');
            
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const href = this.getAttribute('href');
                    
                    // Удаляем активный класс у всех пунктов меню
                    navLinks.forEach(link => link.parentElement.classList.remove('active'));
                    // Добавляем активный класс текущему пункту
                    this.parentElement.classList.add('active');
                    
                    // Если это якорная ссылка
                    if (href.startsWith('#')) {
                        const targetId = href === '#hero' ? 'body' : href;
                        const targetElement = href === '#hero' ? document.body : document.querySelector(targetId);
                        
                        if (targetElement) {
                            // Закрываем мобильное меню при клике
                            if (menuOpen) {
                                menuOpen = false;
                                nav.classList.remove('active');
                                menuBtn.classList.remove('active');
                            }
                            
                            // Плавный скролл к элементу
                            if (href === '#hero') {
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });
                            } else {
                                targetElement.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }
                        }
                    }
                });
            });
        });

        // Toggle menu on button click
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            menuOpen = !menuOpen;
            setLocalPreference('menuOpen', menuOpen.toString());
            nav.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.body.addEventListener('click', function(e) {
            if (menuOpen && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
                menuOpen = false;
                nav.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        }, true);

        // Prevent menu closing when clicking inside nav
        nav.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Оптимизация загрузки изображения для new-game секции
        document.addEventListener('DOMContentLoaded', function() {
            const newGameImage = document.querySelector('.new-game__image img');
            if (newGameImage) {
                // Предзагрузка изображения
                const img = new Image();
                img.src = newGameImage.src;
                
                img.onload = function() {
                    newGameImage.style.opacity = '1';
                }

                // Добавляем поддержку IntersectionObserver для ленивой загрузки
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.1
                });

                observer.observe(document.querySelector('.new-game__image'));
            }
        });

        // Плавное появление изображения при скролле
        const handleScroll = () => {
            const newGameSection = document.querySelector('.new-game');
            if (newGameSection) {
                const rect = newGameSection.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
                
                if (isVisible) {
                    newGameSection.classList.add('visible');
                    window.removeEventListener('scroll', handleScroll);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Проверяем видимость при загрузке страницы

        // Оптимизация производительности
        const throttle = (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        };

        // Оптимизированная анимация частиц
        document.addEventListener('DOMContentLoaded', () => {
            const particles = document.querySelectorAll('.particle');
            
            particles.forEach(particle => {
                particle.style.transform = `translate(${Math.random() * 50 - 25}px, 0)`;
            });

            // Оптимизация анимации с использованием requestAnimationFrame
            let lastScrollTop = 0;
            const parallaxParticles = throttle(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const direction = scrollTop > lastScrollTop ? 1 : -1;
                
                requestAnimationFrame(() => {
                    particles.forEach(particle => {
                        const speed = parseFloat(particle.style.animationDuration) || 15;
                        const offset = direction * (scrollTop * 0.1 / speed);
                        particle.style.transform = `translate(${Math.random() * 50 - 25}px, ${offset}px)`;
                    });
                });
                
                lastScrollTop = scrollTop;
            }, 16); // ~60fps

            window.addEventListener('scroll', parallaxParticles, { passive: true });
        });

        // Оптимизация загрузки изображений
        const lazyLoadImages = () => {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        };

        // Оптимизация анимаций
        const optimizeAnimations = () => {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(() => {
                            entry.target.classList.add('visible');
                        });
                    }
                });
            }, {
                threshold: 0.1
            });

            document.querySelectorAll('.new-game__image, .game-card').forEach(el => {
                animationObserver.observe(el);
            });
        };

        // Оптимизация событий
        document.addEventListener('DOMContentLoaded', () => {
            lazyLoadImages();
            optimizeAnimations();

            // Оптимизация обработчиков событий
            const debouncedResize = throttle(() => {
                // Обновление размеров и позиций при ресайзе
                document.querySelectorAll('.particle').forEach(particle => {
                    particle.style.transform = `translate(${Math.random() * 50 - 25}px, 0)`;
                });
            }, 100);

            window.addEventListener('resize', debouncedResize, { passive: true });
        });

        // Оптимизация для секции New Release
        document.addEventListener('DOMContentLoaded', () => {
            const newGameSection = document.querySelector('.new-game');
            const newGameImage = document.querySelector('.new-game__image');
            
            if (newGameSection && newGameImage) {
                // Используем IntersectionObserver для ленивой загрузки и анимаций
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            
                            // Отключаем наблюдение после первого появления
                            observer.unobserve(entry.target);
                            
                            // Загружаем изображение только когда секция видима
                            const img = entry.target.querySelector('img');
                            if (img && img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            }
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '50px'
                });

                observer.observe(newGameSection);

                // Оптимизация hover эффекта
                let hoverTimeout;
                newGameImage.addEventListener('mouseenter', () => {
                    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                        cancelAnimationFrame(hoverTimeout);
                        hoverTimeout = requestAnimationFrame(() => {
                            newGameImage.style.transform = 'perspective(1000px) rotateY(-5deg)';
                        });
                    }
                });

                newGameImage.addEventListener('mouseleave', () => {
                    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                        cancelAnimationFrame(hoverTimeout);
                        hoverTimeout = requestAnimationFrame(() => {
                            newGameImage.style.transform = 'perspective(1000px) rotateY(-15deg)';
                        });
                    }
                });
            }
        });

        // Ленивая загрузка изображений
        document.addEventListener('DOMContentLoaded', () => {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            imageObserver.unobserve(img);
                        }
                    });
                });

                lazyImages.forEach(img => imageObserver.observe(img));
            }
        });

        // Плавная прокрутка для навигации
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Анимация соединительных линий между иконками игр
function initGameIconsAnimation() {
    console.log('Начало инициализации анимации игровых иконок');
    
    const canvas = document.getElementById('connectionCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.game-icons-animation');
    const icons = document.querySelectorAll('.game-icon');

    if (!container || icons.length === 0) {
        console.error('Required elements not found:', {
            container: !!container,
            iconsCount: icons.length
        });
        return;
    }

    console.log('Все элементы для анимации найдены:', {
        canvas: !!canvas,
        container: !!container,
        iconsCount: icons.length
    });

    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
    }

    function drawConnections() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const containerRect = container.getBoundingClientRect();
        
        for (let i = 0; i < icons.length; i++) {
            for (let j = i + 1; j < icons.length; j++) {
                const icon1 = icons[i].getBoundingClientRect();
                const icon2 = icons[j].getBoundingClientRect();

                const x1 = icon1.left + icon1.width / 2 - containerRect.left;
                const y1 = icon1.top + icon1.height / 2 - containerRect.top;
                const x2 = icon2.left + icon2.width / 2 - containerRect.left;
                const y2 = icon2.top + icon2.height / 2 - containerRect.top;

                const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                if (distance < 300) { // Увеличил максимальное расстояние
                    const opacity = 1 - (distance / 300);
                    
                    // Создаем градиент для линии
                    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                    gradient.addColorStop(0, `rgba(255, 230, 0, ${opacity * 0.5})`);
                    gradient.addColorStop(0.5, `rgba(255, 230, 0, ${opacity * 0.8})`);
                    gradient.addColorStop(1, `rgba(255, 230, 0, ${opacity * 0.5})`);

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        drawConnections();
        requestAnimationFrame(animate);
    }

    // Инициализация
    window.addEventListener('resize', () => {
        resizeCanvas();
        drawConnections();
    });

    // Начальная настройка
    resizeCanvas();
    animate();

    // Добавляем отладочную информацию
    console.log('Animation initialized:', {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        containerRect: container.getBoundingClientRect(),
        iconsCount: icons.length
    });
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, начинаем инициализацию');
    initializeComponents();
    // НЕ инициализируем здесь initGameIconsAnimation, 
    // так как она будет вызвана из HTML после загрузки скрипта
});

// Запускаем анимацию после полной загрузки страницы
window.addEventListener('load', initGameIconsAnimation);

// Инициализация всех анимаций
document.addEventListener('DOMContentLoaded', () => {
    initGameIconsAnimation();
    // ... existing initialization code ...
});

// Мобильная навигация
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('header nav');
const navLinks = document.querySelectorAll('header nav ul li a');

// Функция для переключения меню
function toggleMenu() {
    menuBtn.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

// Обработчик клика по кнопке меню
menuBtn.addEventListener('click', toggleMenu);

// Закрытие меню при клике по ссылке
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Закрытие меню при клике вне навигации
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuBtn.contains(e.target) && nav.classList.contains('active')) {
        toggleMenu();
    }
});

// Предотвращение скролла при открытом меню
document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('active')) {
        toggleMenu();
    }
}); 