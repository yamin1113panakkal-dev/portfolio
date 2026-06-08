/* ==========================================================================
   Mohammed Yamin Panakkal CV - Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initMetricCounters();
    initPrintCV();
    initWorksGallery();
    initClientSlider();
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
        desc: 'Designed a responsive, WooCommerce-integrated e-commerce website on WordPress. Features custom page templates, product listing layout, search filters, and smooth mobile checkouts.',
        img: 'campaign_ecom.jpg',
        tools: ['WordPress', 'WooCommerce', 'Elementor', 'Tailwind CSS', 'PHP'],
        date: 'January 2026',
        client: 'Organic Harvest Co.',
        liveUrl: 'https://organic-harvest.demo.yamin.dev',
        websiteUrl: 'https://organic-harvest.demo.yamin.dev',
        designUrl: 'https://behance.net/gallery/organic-harvest-design',
        screenshots: ['campaign_ecom.jpg', 'campaign_saas.jpg', 'campaign_seo.jpg']
    },
    {
        id: 'default-logo',
        title: 'Apex Fit Vector Branding',
        category: 'logo',
        categoryName: 'Logo Design',
        desc: 'Developed a custom modern minimalist logo design for a premium physical coaching center using Adobe Illustrator. Vector files fully scaled.',
        img: 'campaign_saas.jpg',
        tools: ['Adobe Illustrator', 'Branding', 'Typography', 'Vector Graphics'],
        date: 'November 2025',
        client: 'Apex Fit Gym',
        liveUrl: '',
        websiteUrl: '',
        designUrl: 'https://behance.net/gallery/apex-fit-branding',
        screenshots: ['campaign_saas.jpg', 'campaign_ecom.jpg']
    },
    {
        id: 'default-poster',
        title: 'Summer Event Product Flyer',
        category: 'poster',
        categoryName: 'Social Poster',
        desc: 'Created an engaging, eye-catching promotional poster design for a retail boutique launch campaign. Run as part of 5 months freelance graphics operations.',
        img: 'campaign_seo.jpg',
        tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Layout Design', 'Color Grading'],
        date: 'February 2026',
        client: 'Summer Glow Boutique',
        liveUrl: '',
        websiteUrl: '',
        designUrl: 'https://dribbble.com/shots/summer-flyer',
        screenshots: ['campaign_seo.jpg', 'campaign_saas.jpg', 'campaign_ecom.jpg']
    },
    {
        id: 'default-seo',
        title: 'CompareTech Search Ranking Hub',
        category: 'seo',
        categoryName: 'SEO Campaign',
        desc: 'Optimized search rankings by restructuring site metadata structure, performing on-page keyword density sweeps, and tracking search impressions.',
        img: 'campaign_seo.jpg',
        tools: ['Google Search Console', 'Ahrefs', 'Screaming Frog', 'Yoast SEO', 'Google Analytics'],
        date: 'December 2025',
        client: 'CompareTech India',
        liveUrl: 'https://comparetech.co.in',
        websiteUrl: 'https://comparetech.co.in',
        designUrl: '',
        screenshots: ['campaign_seo.jpg'],
        seoStats: {
            growth: '+150%',
            clicks: '+220%',
            keywords: '+45',
            beforeTraffic: '15K / mo',
            afterTraffic: '48K / mo',
            beforeImpressions: '120K',
            afterImpressions: '2.4M'
        }
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
    const mDynamicContent = document.getElementById('modal-dynamic-content');

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
                    if (w.screenshots) {
                        w.screenshots = w.screenshots.map(s => {
                            if (s && s.startsWith('assets/')) {
                                updated = true;
                                return s.replace('assets/', '');
                            }
                            return s;
                        });
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

    // --- View Detail Modal (Simplified Lightbox) ---
    function openViewModal(work) {
        if (!mDynamicContent) return;

        const screenshots = work.screenshots && work.screenshots.length > 0 ? work.screenshots : [work.img];
        
        // Check local liked state
        const likedIds = JSON.parse(localStorage.getItem('yamin_liked_ids') || '[]');
        let isLiked = likedIds.includes(work.id);
        let activeImageIndex = 0;

        // Render simplified visual-first lightbox content
        mDynamicContent.innerHTML = `
            <div class="lightbox-container">
                <!-- Top Header Bar -->
                <div class="lightbox-header">
                    <button class="lightbox-back-btn" id="view-close-btn" aria-label="Go back">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="btn-icon" style="width:16px;height:16px;">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>Back</span>
                    </button>
                    
                    <h2 class="lightbox-title">${work.title}</h2>
                    
                    <button class="lightbox-like-btn ${isLiked ? 'liked' : ''}" id="lightbox-like-btn" aria-label="Like project">
                        <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${isLiked ? '#ef4444' : 'none'}" stroke="${isLiked ? '#ef4444' : 'currentColor'}" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span class="like-count" id="like-count-value">${work.likes || 0}</span>
                    </button>
                </div>
                
                <!-- Central Media Preview Area -->
                <div class="lightbox-media-area">
                    <div class="zoom-img-container" id="zoom-img-container">
                        <img id="active-lightbox-img" src="${screenshots[activeImageIndex]}" alt="${work.title}" loading="lazy">
                    </div>
                    
                    ${screenshots.length > 1 ? `
                    <button class="gallery-nav-btn prev-slide" id="prev-lightbox-btn" aria-label="Previous Slide">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button class="gallery-nav-btn next-slide" id="next-lightbox-btn" aria-label="Next Slide">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                    ` : ''}
                </div>
            </div>
        `;

        viewModal.classList.add('open');
        viewModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');

        // Attach Like Button Event Listener
        const likeBtn = mDynamicContent.querySelector('#lightbox-like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                const currentLikedIds = JSON.parse(localStorage.getItem('yamin_liked_ids') || '[]');
                const idx = currentLikedIds.indexOf(work.id);
                if (idx === -1) {
                    currentLikedIds.push(work.id);
                    work.likes = (work.likes || 0) + 1;
                    isLiked = true;
                } else {
                    currentLikedIds.splice(idx, 1);
                    work.likes = Math.max(0, (work.likes || 0) - 1);
                    isLiked = false;
                }
                localStorage.setItem('yamin_liked_ids', JSON.stringify(currentLikedIds));
                
                // Save updated work counts back to works list
                const workInArray = works.find(w => w.id === work.id);
                if (workInArray) {
                    workInArray.likes = work.likes;
                    localStorage.setItem('yamin_works', JSON.stringify(works));
                }
                
                // Toggle visual state
                likeBtn.classList.toggle('liked', isLiked);
                const heartSvg = likeBtn.querySelector('.heart-icon');
                if (heartSvg) {
                    heartSvg.setAttribute('fill', isLiked ? '#ef4444' : 'none');
                    heartSvg.setAttribute('stroke', isLiked ? '#ef4444' : 'currentColor');
                }
                const countSpan = likeBtn.querySelector('#like-count-value');
                if (countSpan) countSpan.textContent = work.likes;
            });
        }

        // Attach Image Click-to-Zoom Event Listener
        const zoomContainer = mDynamicContent.querySelector('#zoom-img-container');
        if (zoomContainer) {
            zoomContainer.addEventListener('click', () => {
                zoomContainer.classList.toggle('zoomed');
            });
        }

        // Attach Slider Navigation Event Listeners
        const prevBtn = mDynamicContent.querySelector('#prev-lightbox-btn');
        const nextBtn = mDynamicContent.querySelector('#next-lightbox-btn');
        const activeImg = mDynamicContent.querySelector('#active-lightbox-img');
        if (prevBtn && nextBtn && activeImg) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent zoom trigger
                activeImageIndex = (activeImageIndex - 1 + screenshots.length) % screenshots.length;
                activeImg.src = screenshots[activeImageIndex];
            });
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent zoom trigger
                activeImageIndex = (activeImageIndex + 1) % screenshots.length;
                activeImg.src = screenshots[activeImageIndex];
            });
        }

        // Attach Close/Back Button Event Listener
        const closeIconBtn = mDynamicContent.querySelector('#view-close-btn');
        if (closeIconBtn) closeIconBtn.addEventListener('click', closeViewModal);
    }

    function closeViewModal() {
        viewModal.classList.remove('open');
        viewModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    // Modal click-outside dismissal
    viewModal.addEventListener('click', (e) => {
        if (e.target === viewModal) closeViewModal();
    });

    // Keyboard ESC key dismissal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && viewModal.classList.contains('open')) {
            closeViewModal();
        }
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

    // Image compression helper
    function compressImage(file, maxWidth, maxHeight, quality) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const tempImg = new Image();
                tempImg.onload = function() {
                    let width = tempImg.width;
                    let height = tempImg.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(tempImg, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                };
                tempImg.onerror = reject;
                tempImg.src = event.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const MAX_WIDTH = 800;
    const MAX_HEIGHT = 800;

    // --- Handle Upload Submit ---
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('work-title').value;
            const categorySelect = document.getElementById('work-category');
            const category = categorySelect.value;
            const categoryName = categorySelect.options[categorySelect.selectedIndex].text;
            const desc = document.getElementById('work-desc').value;
            
            const toolsVal = document.getElementById('work-tools').value;
            const liveUrl = document.getElementById('work-url').value;
            const date = document.getElementById('work-date').value;
            const client = document.getElementById('work-client').value;
            
            const fileInput = document.getElementById('work-image');
            const galleryInput = document.getElementById('work-gallery');

            if (fileInput.files.length === 0) return;

            // Show loading status on button during compression
            const submitBtn = uploadForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Compressing & Saving...</span>';

            const tools = toolsVal ? toolsVal.split(',').map(t => t.trim()).filter(Boolean) : [];

            // Compress thumbnail
            const thumbnailPromise = compressImage(fileInput.files[0], 800, 800, 0.6);

            // Compress gallery screenshots
            const galleryPromises = [];
            if (galleryInput && galleryInput.files.length > 0) {
                for (let i = 0; i < galleryInput.files.length; i++) {
                    galleryPromises.push(compressImage(galleryInput.files[i], 800, 800, 0.5));
                }
            }

            Promise.all([thumbnailPromise, Promise.all(galleryPromises)])
                .then(([compressedThumbnail, compressedGallery]) => {
                    const newWorkItem = {
                        id: 'work-' + Date.now(),
                        title: title,
                        category: category,
                        categoryName: categoryName,
                        desc: desc,
                        img: compressedThumbnail,
                        screenshots: compressedGallery.length > 0 ? compressedGallery : [compressedThumbnail],
                        tools: tools,
                        liveUrl: liveUrl,
                        websiteUrl: liveUrl,
                        date: date || 'Recent',
                        client: client || 'Freelance Client',
                        likes: Math.floor(Math.random() * 5) + 1 // random default count between 1 and 5
                    };

                    if (category === 'seo') {
                        newWorkItem.seoStats = {
                            growth: '+120%',
                            clicks: '+180%',
                            keywords: '+30',
                            beforeTraffic: '10K / mo',
                            afterTraffic: '30K / mo',
                            beforeImpressions: '80K',
                            afterImpressions: '1.2M'
                        };
                    }

                    try {
                        works.push(newWorkItem);
                        localStorage.setItem('yamin_works', JSON.stringify(works));
                        
                        // Close, reset, and re-render
                        closeUploadModal();
                        
                        // Select "All Works" filter
                        filterBtns.forEach(b => b.classList.remove('active'));
                        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
                        
                        renderGallery('all');
                    } catch (error) {
                        alert("Storage limit reached! The images are too large or storage is full. Please try uploading fewer or smaller screenshots.");
                        console.error("Local storage quota exceeded:", error);
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                })
                .catch(err => {
                    alert("Error compressing the images. Please check the files and try again.");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    console.error("Compression failed:", err);
                });
        });
    }

    // Init Gallery execution
    loadWorks();
    renderGallery('all');
}

/* ==========================================================================
   Dynamic Clients Slider Management System
   ========================================================================== */

const DEFAULT_CLIENTS = [
    { id: 'c-default-1', name: 'ApexCommerce', img: '' },
    { id: 'c-default-2', name: 'GrowthSaaS', img: '' },
    { id: 'c-default-3', name: 'NetAgency', img: '' },
    { id: 'c-default-4', name: 'PixelStudio', img: '' },
    { id: 'c-default-5', name: 'RankSEO', img: '' },
    { id: 'c-default-6', name: 'MetaAds', img: '' }
];

function initClientSlider() {
    const track = document.getElementById('logo-track-inner');
    const addClientTrigger = document.getElementById('add-client-trigger');
    const clientModal = document.getElementById('client-upload-modal');
    const clientCloseBtn = document.getElementById('client-close-btn');
    const clientForm = document.getElementById('upload-client-form');

    if (!track) return;

    let clients = [];

    // Load clients from localStorage or default
    function loadClients() {
        const stored = localStorage.getItem('yamin_clients');
        if (stored) {
            try {
                clients = JSON.parse(stored);
            } catch (e) {
                clients = [...DEFAULT_CLIENTS];
            }
        } else {
            clients = [...DEFAULT_CLIENTS];
            localStorage.setItem('yamin_clients', JSON.stringify(clients));
        }
    }

    // Helper to create a single card DOM element
    function createCardElement(client) {
        const card = document.createElement('div');
        card.className = 'logo-card';
        card.setAttribute('data-id', client.id);

        const img = document.createElement('img');
        img.alt = `${client.name} Brand Logo`;
        img.loading = 'lazy';
        
        const fallback = document.createElement('span');
        fallback.className = 'fallback-logo';
        fallback.textContent = client.name;

        // Onerror handler to show text fallback if no image is uploaded
        img.onerror = () => {
            img.style.display = 'none';
            fallback.style.display = 'block';
        };

        if (client.img && client.img.trim() !== '') {
            img.src = client.img;
            fallback.style.display = 'none';
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
            fallback.style.display = 'block';
        }

        card.appendChild(img);
        card.appendChild(fallback);
        return card;
    }

    // Render client logos inside track and duplicate to ensure infinite looping marquee
    function renderSlider() {
        track.innerHTML = '';
        
        if (clients.length === 0) return;

        // Render first set
        clients.forEach(c => {
            track.appendChild(createCardElement(c));
        });

        // Duplicate set for seamless looping (must repeat elements)
        clients.forEach(c => {
            track.appendChild(createCardElement(c));
        });
    }

    // --- Modal Event Listeners ---
    if (addClientTrigger && clientModal) {
        addClientTrigger.addEventListener('click', () => {
            clientModal.classList.add('open');
            clientModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        });
    }

    function closeClientModal() {
        if (clientModal) {
            clientModal.classList.remove('open');
            clientModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            clientForm.reset();
        }
    }

    if (clientCloseBtn) clientCloseBtn.addEventListener('click', closeClientModal);
    if (clientModal) {
        clientModal.addEventListener('click', (e) => {
            if (e.target === clientModal) closeClientModal();
        });
    }

    // File compression using Canvas helper
    function compressImage(file, maxWidth, maxHeight, quality) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const tempImg = new Image();
                tempImg.onload = function() {
                    let width = tempImg.width;
                    let height = tempImg.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(tempImg, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                };
                tempImg.onerror = reject;
                tempImg.src = event.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Form submission processing
    if (clientForm) {
        clientForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const brandName = document.getElementById('client-brand-name').value;
            const logoInput = document.getElementById('client-brand-logo');

            if (logoInput.files.length === 0) return;

            const submitBtn = clientForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Uploading...</span>';

            // Compress to maximum width 360px and height 180px for logos (keeps size small in localStorage)
            compressImage(logoInput.files[0], 360, 180, 0.7)
                .then(compressedLogo => {
                    const newClient = {
                        id: 'client-' + Date.now(),
                        name: brandName,
                        img: compressedLogo
                    };

                    try {
                        clients.push(newClient);
                        localStorage.setItem('yamin_clients', JSON.stringify(clients));
                        
                        // Close modal and re-render
                        closeClientModal();
                        renderSlider();
                    } catch (err) {
                        alert("Storage quota exceeded! Please remove some client logos or upload a smaller file.");
                        console.error("Storage quota full:", err);
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                })
                .catch(err => {
                    alert("Error processing the logo image. Please try again.");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    console.error("Logo upload compression error:", err);
                });
        });
    }

    // Init slider track rendering
    loadClients();
    renderSlider();
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
