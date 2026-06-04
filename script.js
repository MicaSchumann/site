document.addEventListener("DOMContentLoaded", function () {

    // 0. RADAR DE DIREÇÃO DO SCROLL (Identifica se está subindo ou descendo)
    let lastScrollY = window.scrollY;
    document.body.classList.add("scrolling-down"); // Estado inicial

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            // Roldando para baixo
            document.body.classList.add("scrolling-down");
            document.body.classList.remove("scrolling-up");
        } else if (currentScrollY < lastScrollY) {
            // Rolando para cima
            document.body.classList.add("scrolling-up");
            document.body.classList.remove("scrolling-down");
        }

        lastScrollY = currentScrollY;
    });

    // 1. STICKY NAVBAR (MUDANÇA DE COR)
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 1.5 MENU HAMBÚRGUER MOBILE
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    // Abrir o menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.add('active');
        });
    }

    // Fechar o menu ao clicar no X
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    }

    // Fechar o menu automaticamente ao clicar em qualquer link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // 2. PARALLAX NO HERO
    const heroBg = document.getElementById('hero-slideshow');
    window.addEventListener('scroll', () => {
        let scrollPosition = window.pageYOffset;
        if (heroBg) heroBg.style.transform = 'translateY(' + scrollPosition * 0.4 + 'px)';
    });

    // 3. ROLAGEM COM DESACELERAÇÃO CINEMATOGRÁFICA (Ease-Out)
    function customSmoothScroll(targetPositionY, duration) {
        const startPositionY = window.scrollY;
        const distance = targetPositionY - startPositionY;
        let startTime = null;

        // Nova função "Ease-Out-Quint":
        // Inicia ágil, mas suave, e usa a maior parte do tempo freando BEM devagar no final.
        function easeOutQuint(t) {
            return 1 - Math.pow(1 - t, 5);
        }

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // Aplica a nova curva de frenagem
            const easeProgress = easeOutQuint(progress);

            window.scrollTo(0, startPositionY + (distance * easeProgress));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // 4. CONTROLE DE TODOS OS LINKS INTERNOS USANDO O SCROLL CUSTOMIZADO
    // Seleciona QUALQUER link do site cujo href comece com "#"
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

            // Se for o botão da Logo ou de voltar ao topo
            if (targetId === '#hero' || targetId === '#') {
                customSmoothScroll(0, 1300); // 1.3 segundos de pura elegância
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calcula o desconto do menu
                let offset = targetId === '#servicos' ? 0 : navbar.offsetHeight;
                let targetY = targetElement.offsetTop - offset;

                customSmoothScroll(targetY, 1300);
            }
        });
    });

    // 5. A MÁGICA DA ROLAGEM HORIZONTAL (Inteligente e Proporcional)
    const portfolioSection = document.querySelector('.portfolio-section');
    const portfolioTrack = document.getElementById('portfolio-track');

    function updatePortfolioHeight() {
        if (portfolioSection && portfolioTrack) {
            const trackWidth = portfolioTrack.scrollWidth;
            portfolioSection.style.height = `${trackWidth}px`;
        }
    }

    updatePortfolioHeight();
    window.addEventListener('resize', updatePortfolioHeight);

    if (portfolioSection && portfolioTrack) {
        window.addEventListener('scroll', () => {
            const sectionTop = portfolioSection.offsetTop;
            const sectionHeight = portfolioSection.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            if (scrollY >= sectionTop && scrollY <= (sectionTop + sectionHeight - windowHeight)) {
                const scrollPercentage = (scrollY - sectionTop) / (sectionHeight - windowHeight);
                const maxTranslate = portfolioTrack.scrollWidth - window.innerWidth;
                portfolioTrack.style.transform = `translateX(-${scrollPercentage * maxTranslate}px)`;
            }
            else if (scrollY < sectionTop) {
                portfolioTrack.style.transform = `translateX(0px)`;
            }
            else {
                const maxTranslate = portfolioTrack.scrollWidth - window.innerWidth;
                portfolioTrack.style.transform = `translateX(-${maxTranslate}px)`;
            }
        });
    }

    // 6. EFEITO DE LUZ (LANTERNA) SEGUINDO O MOUSE
    const glow = document.getElementById('mouse-glow');
    if (glow && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            glow.style.background = `radial-gradient(400px circle at ${e.clientX}px ${e.clientY}px, rgba(189, 162, 126, 0.12), transparent 60%)`;
        });
    }

    // 7. SCROLL REVEAL ANIMATION (Intersection Observer Responsivo)

    // Calcula a margem dinamicamente:
    // Se for celular (tela menor que 768px), usa margem menor (-10%)
    // Se for desktop, usa margem maior (-20%)
    const margemLateral = window.innerWidth <= 768 ? "-1%" : "-20%";
    const rootMarginValor = `0px ${margemLateral} 0px ${margemLateral}`;

    const observerOptions = {
        root: null,
        rootMargin: rootMarginValor,
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-h').forEach((el) => {
        observer.observe(el);
    });
});