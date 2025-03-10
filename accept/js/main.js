// Mobile menu functionality
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');
let menuOpen = false;

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

// Функционал для кнопок трейлера и предзаказа
document.addEventListener('DOMContentLoaded', function() {
    const trailerBtn = document.querySelector('.btn-secondary');
    const preorderBtn = document.querySelector('.btn-primary');
    const trailerModal = document.querySelector('.trailer-modal');
    const preorderModal = document.querySelector('.preorder-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const videoContainer = document.querySelector('.video-container iframe');
    const modals = document.querySelectorAll('.modal');

    // URL трейлера
    const trailerUrl = "https://www.youtube.com/embed/aSrFWinrkeQ?autoplay=1&rel=0&showinfo=0&modestbranding=1";

    function openModal(modal) {
        if (!modal) return;
        document.body.style.overflow = 'hidden';
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }

    function closeModal(modal) {
        if (!modal) return;
        document.body.style.overflow = '';
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            if (modal.classList.contains('trailer-modal')) {
                const iframe = modal.querySelector('iframe');
                if (iframe) iframe.src = '';
            }
        }, 300);
    }

    trailerBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const iframe = trailerModal?.querySelector('iframe');
        if (iframe) iframe.src = trailerUrl;
        openModal(trailerModal);
    });

    preorderBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(preorderModal);
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });

        const content = modal.querySelector('.modal-content');
        if (content) {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });
});

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