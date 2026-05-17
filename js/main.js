/* =========================================================
   ASOCIACIÓN PEMPA — Main JS
   ========================================================= */

(function () {
    'use strict';

    // ============== CONFIG ==============
    const CONFIG = {
        totalPhotos: 83,
        photoFormat: 'webp',
        photoPrefix: 'pempa_',
        photoPath: '/img/caballos/',
        galleryVideos: [
            'gallery_01.mp4',
            'gallery_02.mp4',
            'gallery_03.mp4',
            'gallery_04.mp4',
            'gallery_05.mp4'
        ],
        videoPath: '/videos/',
        siteUrl: 'https://pempa.com.ar',
        shareText: 'Apoyemos a PEMPA 🐎 Primera y única protectora de equinos de Mendoza. Más de 400 caballos rescatados desde 2014. Sumate, doná, difundí.'
    };

    // ============== HELPERS ==============
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const padNumber = (num, length = 3) => String(num).padStart(length, '0');

    // ============== PRELOADER ==============
    const initPreloader = () => {
        const preloader = $('#preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 1800); // Tiempo para que se vea la animación
        });
    };

    // ============== SCROLL PROGRESS ==============
    const initScrollProgress = () => {
        const bar = $('#scrollProgress');
        if (!bar) return;

        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            bar.style.width = progress + '%';
        };

        window.addEventListener('scroll', update, { passive: true });
        update();
    };

    // ============== NAVIGATION ==============
    const initNav = () => {
        const nav = $('#nav');
        const toggle = $('#navToggle');
        const overlay = $('#navOverlay');

        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
        }, { passive: true });

        // Toggle menu
        toggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('nav--open');
            document.body.classList.toggle('no-scroll', isOpen);
        });

        // Close on link click
        $$('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav--open');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
                nav.classList.remove('nav--open');
                document.body.classList.remove('no-scroll');
            }
        });
    };

    // ============== STATS COUNTER ==============
    const initStats = () => {
        const stats = $$('[data-count]');
        if (!stats.length) return;

        // Years counter (años desde 2014)
        const yearsEl = $('#yearsCounter');
        if (yearsEl) {
            const startYear = 2014;
            const currentYear = new Date().getFullYear();
            yearsEl.dataset.count = currentYear - startYear;
            yearsEl.textContent = '0';
            stats.push(yearsEl);
        }

        const animate = (el) => {
            const target = parseInt(el.dataset.count, 10);
            const duration = 2000;
            const startTime = performance.now();

            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(eased * target);
                el.textContent = value.toLocaleString('es-AR');
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        stats.forEach(stat => observer.observe(stat));
    };

    // ============== GALLERY ==============
    const buildGallery = () => {
        const gallery = $('#gallery');
        if (!gallery) return [];

        const items = [];
        // Distribuir 5 videos entre 83 fotos
        const videoPositions = [8, 25, 42, 60, 78];

        let photoNum = 1;
        let videoIdx = 0;
        const totalItems = CONFIG.totalPhotos + CONFIG.galleryVideos.length;

        for (let i = 0; i < totalItems; i++) {
            if (videoPositions.includes(i) && videoIdx < CONFIG.galleryVideos.length) {
                items.push({
                    type: 'video',
                    src: CONFIG.videoPath + CONFIG.galleryVideos[videoIdx],
                    alt: `Caballo rescatado de PEMPA - Video ${videoIdx + 1}`
                });
                videoIdx++;
            } else if (photoNum <= CONFIG.totalPhotos) {
                items.push({
                    type: 'image',
                    src: `${CONFIG.photoPath}${CONFIG.photoPrefix}${padNumber(photoNum)}.${CONFIG.photoFormat}`,
                    alt: `Caballo rescatado de PEMPA - Foto ${photoNum}`
                });
                photoNum++;
            }
        }

        const fragment = document.createDocumentFragment();
        items.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'gallery__item' + (item.type === 'video' ? ' gallery__item--video' : '');
            el.dataset.index = index;
            el.dataset.type = item.type;
            el.dataset.src = item.src;
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');
            el.setAttribute('aria-label', item.alt);

            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.alt;
                img.loading = 'lazy';
                img.decoding = 'async';
                img.onerror = () => { el.style.display = 'none'; };
                el.appendChild(img);
            } else {
                const video = document.createElement('video');
                video.src = item.src;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.preload = 'metadata';
                video.onerror = () => { el.style.display = 'none'; };
                el.addEventListener('mouseenter', () => video.play().catch(() => {}));
                el.addEventListener('mouseleave', () => video.pause());
                el.appendChild(video);
            }

            fragment.appendChild(el);
        });

        gallery.appendChild(fragment);
        return items;
    };

    // ============== LIGHTBOX ==============
    const initLightbox = (galleryItems) => {
        const lightbox = $('#lightbox');
        const content = $('#lightboxContent');
        const closeBtn = $('#lightboxClose');
        const prevBtn = $('#lightboxPrev');
        const nextBtn = $('#lightboxNext');
        const counter = $('#lightboxCounter');
        const gallery = $('#gallery');

        if (!lightbox || !gallery) return;

        let currentIndex = 0;
        let visibleItems = [];

        const updateContent = () => {
            const item = visibleItems[currentIndex];
            if (!item) return;

            content.innerHTML = '';
            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.alt;
                content.appendChild(img);
            } else {
                const video = document.createElement('video');
                video.src = item.src;
                video.controls = true;
                video.autoplay = true;
                video.loop = true;
                video.playsInline = true;
                content.appendChild(video);
            }
            counter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
        };

        const open = (index) => {
            visibleItems = $$('.gallery__item', gallery)
                .filter(el => el.style.display !== 'none')
                .map(el => ({
                    type: el.dataset.type,
                    src: el.dataset.src,
                    alt: el.querySelector('img,video')?.alt || ''
                }));

            const targetSrc = galleryItems[index]?.src;
            currentIndex = visibleItems.findIndex(it => it.src === targetSrc);
            if (currentIndex < 0) currentIndex = 0;

            lightbox.hidden = false;
            document.body.classList.add('no-scroll');
            updateContent();
        };

        const close = () => {
            lightbox.hidden = true;
            content.innerHTML = '';
            document.body.classList.remove('no-scroll');
        };

        const prev = () => {
            currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            updateContent();
        };

        const next = () => {
            currentIndex = (currentIndex + 1) % visibleItems.length;
            updateContent();
        };

        gallery.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery__item');
            if (item) open(parseInt(item.dataset.index, 10));
        });

        gallery.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const item = e.target.closest('.gallery__item');
                if (item) {
                    e.preventDefault();
                    open(parseInt(item.dataset.index, 10));
                }
            }
        });

        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', prev);
        nextBtn.addEventListener('click', next);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) close();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.hidden) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });

        // Swipe en mobile
        let touchStartX = 0;
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) next();
                else prev();
            }
        }, { passive: true });
    };

    // ============== MODAL DONAR ==============
    const initDonateModal = () => {
        const modal = $('#donateModal');
        const floatBtn = $('#floatDonate');
        if (!modal) return;

        const open = () => {
            modal.hidden = false;
            document.body.classList.add('no-scroll');
        };

        const close = () => {
            modal.hidden = true;
            document.body.classList.remove('no-scroll');
        };

        if (floatBtn) floatBtn.addEventListener('click', open);

        // Botones con data-action="donate"
        $$('[data-action="donate"]').forEach(btn => {
            btn.addEventListener('click', open);
        });

        // Cerrar (usando closest porque el click puede caer en hijos)
        modal.addEventListener('click', (e) => {
            const closer = e.target.closest('[data-close]');
            if (!closer) return;

            // Si es un anchor link, cerrar y luego hacer scroll
            const href = closer.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                close();
                const targetEl = document.querySelector(href);
                if (targetEl) {
                    setTimeout(() => {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Forzar :target para mostrar el highlight
                        history.replaceState(null, '', href);
                    }, 100);
                }
            } else {
                close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) close();
        });
    };

    // ============== MINI-MODAL CONTACTO ==============
    const initContactoModal = () => {
        const modal = $('#contactoModal');
        if (!modal) return;

        const open = () => {
            modal.hidden = false;
            document.body.classList.add('no-scroll');
        };

        const close = () => {
            modal.hidden = true;
            document.body.classList.remove('no-scroll');
        };

        // Todos los botones con data-action="contacto"
        $$('[data-action="contacto"]').forEach(btn => {
            btn.addEventListener('click', () => {
                // Si viene del modal donar, primero cerrarlo
                const donateModal = $('#donateModal');
                if (donateModal && !donateModal.hidden) {
                    donateModal.hidden = true;
                }
                document.body.classList.remove('no-scroll');
                setTimeout(open, 80);
            });
        });

        // Cerrar con data-close o fondo
        modal.addEventListener('click', (e) => {
            const closer = e.target.closest('[data-close]');
            if (closer) close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) close();
        });
    };

    // ============== MODAL COMPARTIR ==============
    const initShareModal = () => {
        const modal = $('#shareModal');
        const floatBtn = $('#floatShare');
        if (!modal) return;

        const fullText = `${CONFIG.shareText} → ${CONFIG.siteUrl}`;
        const encodedText = encodeURIComponent(fullText);
        const encodedUrl = encodeURIComponent(CONFIG.siteUrl);
        const encodedTitle = encodeURIComponent('Asociación PEMPA - Apoyá la causa');

        const open = () => {
            modal.hidden = false;
            document.body.classList.add('no-scroll');
        };

        const close = () => {
            modal.hidden = true;
            document.body.classList.remove('no-scroll');
        };

        if (floatBtn) floatBtn.addEventListener('click', open);

        // Botones data-action="share"
        $$('[data-action="share"]').forEach(btn => {
            btn.addEventListener('click', open);
        });

        // Cerrar (usando closest)
        modal.addEventListener('click', (e) => {
            const closer = e.target.closest('[data-close]');
            if (closer) close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) close();
        });

        // Compartir en redes
        $$('.share-btn', modal).forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const platform = btn.dataset.share;
                let url = '';

                switch (platform) {
                    case 'whatsapp':
                        url = `https://wa.me/?text=${encodedText}`;
                        break;
                    case 'facebook':
                        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
                        break;
                    case 'twitter':
                        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
                        break;
                    case 'telegram':
                        url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
                        break;
                    case 'email':
                        url = `mailto:?subject=${encodedTitle}&body=${encodedText}`;
                        window.location.href = url;
                        return;
                    case 'copy':
                        await copyToClipboard(fullText);
                        showToast('✓ Link copiado al portapapeles');
                        return;
                }

                if (url) {
                    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
                }
            });
        });

        // Copiar texto sugerido
        const copyBtn = $('#copyShareText');
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                await copyToClipboard(fullText);
                showToast('✓ Texto copiado');
            });
        }
    };

    // ============== COPY ==============
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            } catch (e) {
                document.body.removeChild(textarea);
                return false;
            }
        }
    };

    const initCopyButtons = () => {
        $$('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const text = btn.dataset.copy;
                const ok = await copyToClipboard(text);
                showToast(ok ? `✓ Copiado: ${text}` : 'No se pudo copiar');
            });
        });
    };

    // ============== TOAST ==============
    let toastTimer;
    const showToast = (msg) => {
        const toast = $('#toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('active');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('active');
        }, 2400);
    };

    // ============== HERO VIDEO ROTATION ==============
    const initHeroVideo = () => {
        const video = $('.hero__video');
        if (!video) return;

        const sources = ['/videos/hero_1.mp4', '/videos/hero_2.mp4'];
        let currentIdx = 0;

        video.removeAttribute('loop');

        video.addEventListener('ended', () => {
            currentIdx = (currentIdx + 1) % sources.length;
            const source = video.querySelector('source');
            if (source) {
                source.src = sources[currentIdx];
                video.load();
                video.play().catch(() => {});
            }
        });

        video.addEventListener('loadeddata', () => {
            video.play().catch(() => {});
        });
    };

    // ============== SCROLL ANIMATIONS ==============
    const initScrollAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        $$('.pilar, .ayuda, .contacto__block, .num-card, .nosotros__chapter').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
            observer.observe(el);
        });
    };

    // ============== YEAR FOOTER ==============
    const initYear = () => {
        const yearEl = $('#year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    };

    // ============== INIT ==============
    document.addEventListener('DOMContentLoaded', () => {
        initPreloader();
        initScrollProgress();
        initNav();
        initStats();
        const galleryItems = buildGallery();
        initLightbox(galleryItems);
        initDonateModal();
        initContactoModal();
        initShareModal();
        initCopyButtons();
        initScrollAnimations();
        initHeroVideo();
        initYear();
    });

})();
