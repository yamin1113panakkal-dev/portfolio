/* ==========================================================================
   Mohammed Yamin Panakkal CV - Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initMetricCounters();
    initPrintCV();
    initWorksGallery();
    initContactForm();
    initProfileTilt();
});

/* ==========================================================================
   Theme Management
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme');
    let currentTheme = 'dark'; // Default to dark

    if (savedTheme) {
        currentTheme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        currentTheme = 'light';
    }

    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const targetTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
    });
}

/* ==========================================================================
   Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const menu = document.querySelector('.mobile-menu');
    const links = document.querySelectorAll('.mobile-link');

    if (!toggle || !menu) return;

    function toggleMenu() {
        toggle.classList.toggle('open');
        menu.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    }

    toggle.addEventListener('click', toggleMenu);

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
}

/* ==========================================================================
   Simplified Metrics Count-Up Animation
   ========================================================================== */
function initMetricCounters() {
    const metricsSection = document.getElementById('metrics');
    const counters = document.querySelectorAll('.metric-value');
    
    if (!metricsSection || counters.length === 0) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                counters.forEach(counter => animateCounter(counter));
                animated = true;
                observer.unobserve(metricsSection);
            }
        });
    }, { threshold: 0.25 });

    observer.observe(metricsSection);
}

function animateCounter(counter) {
    const target = parseFloat(counter.getAttribute('data-target'));
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeProgress = progress * (2 - progress); // easeOutQuad
        const currentValue = easeProgress * target;

        counter.textContent = Math.floor(currentValue);

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target; // Final exact value
        }
    }

    requestAnimationFrame(updateCounter);
}

/* ==========================================================================
   Works Gallery & Upload System (Local Persistence)
   ========================================================================== */

const DEFAULT_WORKS = [
    {
        id: 'default-wp',
        title: 'Organic Harvest Food Store',
        category: 'wordpress',
        categoryName: 'WordPress Website',
        desc: 'Designed a responsive, WooCommerce-integrated e-commerce website on WordPress. Features custom page templates, search filters, and smooth mobile checkouts.',
        img: 'campaign_ecom.jpg'
    },
    {
        id: 'default-logo',
        title: 'Apex Fit Vector Branding',
        category: 'logo',
        categoryName: 'Logo Design',
        desc: 'Developed a custom modern minimalist logo design for a premium physical coaching center using Adobe Illustrator. Vector files fully scaled.',
        img: 'campaign_saas.jpg'
    },
{
    id: 'default-poster',
    title: 'IAMS Digital Marketing Course',
    category: 'poster',
    categoryName: 'Social Poster',
    desc: 'Digital Marketing Course promotional poster for IAMS Campus.',
    img: 'iams1.jpg'
},
    {
        id: 'default-seo',
        title: 'CompareTech Search Ranking Hub',
        category: 'seo',
        categoryName: 'SEO Campaign',
        desc: 'Optimized search rankings by restructuring site metadata structure, performing on-page keyword density sweeps, and tracking search impressions.',
        img: 'campaign_seo.jpg'
    }
];

function initWorksGallery() {
    const grid = document.getElementById('gallery-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const addWorkTrigger = document.getElementById('add-work-trigger');
    
    // Modal elements
    const uploadModal = document.getElementById('upload-modal');
    const uploadCloseBtn = document.getElementById('upload-close-btn');
    const uploadForm = document.getElementById('upload-work-form');
    
    // View Modal elements
    const viewModal = document.getElementById('campaign-modal');
    const viewCloseBtn = viewModal.querySelector('.modal-close-btn');
    const mCategory = document.getElementById('modal-category');
    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-challenge');
    const mImg = document.getElementById('modal-creative-img');

    if (!grid) return;

    let works = [];

    // Load works from localStorage or default
    function loadWorks() {
        const stored = localStorage.getItem('yamin_works');
        if (stored) {
            try {
                works = JSON.parse(stored);
                // Dynamically update old assets paths to root-level for users with cached storage
                let updated = false;
                works.forEach(w => {
                    if (w.img && w.img.startsWith('assets/')) {
                        w.img = w.img.replace('assets/', '');
                        updated = true;
                    }
                });
                if (updated) {
                    localStorage.setItem('yamin_works', JSON.stringify(works));
                }
            } catch (e) {
                works = [...DEFAULT_WORKS];
            }
        } else {
            works = [...DEFAULT_WORKS];
            localStorage.setItem('yamin_works', JSON.stringify(works));
        }
    }

    // Render works in gallery based on filter selection
    function renderGallery(filter = 'all') {
        grid.innerHTML = '';
        const filteredWorks = filter === 'all' ? works : works.filter(w => w.category === filter);

        if (filteredWorks.length === 0) {
            grid.innerHTML = `<div class="no-works-fallback">No works uploaded under this category yet. Click "Upload New Work" to add!</div>`;
            return;
        }

        // Render backwards to display newest uploads first
        filteredWorks.slice().reverse().forEach(work => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.setAttribute('data-id', work.id);
            
            card.innerHTML = `
                <div class="gallery-img-box">
                    <img src="${work.img}" alt="${work.title}" class="gallery-img" loading="lazy">
                    <span class="gallery-card-badge">${work.categoryName}</span>
                </div>
                <div class="gallery-card-info">
                    <h3>${work.title}</h3>
                    <p>${truncateString(work.desc, 85)}</p>
                </div>
            `;

            // Click to view full details
            card.addEventListener('click', () => {
                openViewModal(work);
            });

            grid.appendChild(card);
        });
    }

    function truncateString(str, num) {
        if (str.length <= num) return str;
        return str.slice(0, num) + '...';
    }

    // Filter Buttons click handler
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-filter');
            renderGallery(category);
        });
    });

    // --- View Detail Modal ---
    function openViewModal(work) {
        mCategory.textContent = work.categoryName;
        mTitle.textContent = work.title;
        mDesc.textContent = work.desc;
        mImg.src = work.img;
        mImg.alt = work.title;

        viewModal.classList.add('open');
        viewModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }

    function closeViewModal() {
        viewModal.classList.remove('open');
        viewModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    if (viewCloseBtn) viewCloseBtn.addEventListener('click', closeViewModal);
    viewModal.addEventListener('click', (e) => {
        if (e.target === viewModal) closeViewModal();
    });

    // --- Upload Work Modal ---
    if (addWorkTrigger && uploadModal) {
        addWorkTrigger.addEventListener('click', () => {
            uploadModal.classList.add('open');
            uploadModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        });
    }

    function closeUploadModal() {
        if (uploadModal) {
            uploadModal.classList.remove('open');
            uploadModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            uploadForm.reset();
        }
    }

    if (uploadCloseBtn) uploadCloseBtn.addEventListener('click', closeUploadModal);
    if (uploadModal) {
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) closeUploadModal();
        });
    }

    // --- Handle Upload Submit ---
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('work-title').value;
            const categorySelect = document.getElementById('work-category');
            const category = categorySelect.value;
            const categoryName = categorySelect.options[categorySelect.selectedIndex].text;
            const desc = document.getElementById('work-desc').value;
            const fileInput = document.getElementById('work-image');

            if (fileInput.files.length === 0) return;

            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function(event) {
                const newWorkItem = {
                    id: 'work-' + Date.now(),
                    title: title,
                    category: category,
                    categoryName: categoryName,
                    desc: desc,
                    img: event.target.result // Base64 string of the image
                };

                works.push(newWorkItem);
                localStorage.setItem('yamin_works', JSON.stringify(works));
                
                // Close and render
                closeUploadModal();
                
                // Select "All Works" filter after new upload
                filterBtns.forEach(b => b.classList.remove('active'));
                document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
                
                renderGallery('all');
            };

            reader.readAsDataURL(file);
        });
    }

    // Init Gallery execution
    loadWorks();
    renderGallery('all');
}

/* ==========================================================================
   Contact Form Processing
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successAlert = document.getElementById('form-success');
    
    if (!form || !successAlert) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        const submitText = submitBtn.querySelector('span');
        
        submitBtn.disabled = true;
        submitText.textContent = "Sending...";

        setTimeout(() => {
            form.classList.add('hidden');
            successAlert.classList.remove('hidden');
            form.reset();
        }, 1200);
    });
}

/* ==========================================================================
   Print / PDF CV Trigger
   ========================================================================== */
function initPrintCV() {
    const printBtns = [
        document.getElementById('download-cv'),
        document.getElementById('mobile-download-cv')
    ];

    printBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                window.print();
            });
        }
    });
}

/* ==========================================================================
   3D Tilt & Parallax Glow Effect for Profile Picture
   ========================================================================== */
function initProfileTilt() {
    const container = document.getElementById('profile-container');
    const card = document.getElementById('profile-card');
    const glow = document.getElementById('profile-glow');

    if (!container || !card || !glow) return;

    // Skip tilt on touch devices for mobile accessibility and performance
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouch) return;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        
        // Find cursor coordinate distance relative to container center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const normX = x / rect.width;
        const normY = y / rect.height;

        // Compute degree rotations (cap at max 15 degrees)
        const rotateX = -(normY * 15).toFixed(2);
        const rotateY = (normX * 15).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Move background glow parallax opposite of cursor direction
        const glowX = (normX * 25).toFixed(1);
        const glowY = (normY * 25).toFixed(1);
        glow.style.transform = `translate(calc(-50% + ${glowX}px), calc(-50% + ${glowY}px)) scale(1.08)`;
    });

    container.addEventListener('mouseleave', () => {
        // Return styles to zero offset
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        glow.style.transform = 'translate(-50%, -50%) scale(1)';
    });
}
