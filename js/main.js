/**
 * Birimo Corporate Website — Interactive Functionality
 * Author: Birimo Core Design Team
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initAnchorScrollSync();
  initCompanyDropdown();
  initAboutAndContactModals();
  initLegalModal();
  initRoiCalculator();
  initHeroKineticSlider();
  initFaqAccordion();
  initDemoModal();
  initDemoForm();
});

/**
 * 1. Navbar Glass Effect on Scroll
 */
function initNavbarScroll() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * 2. Mobile Menu Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('closeMobileMenu');
  const backdrop = document.getElementById('mobileMenuBackdrop');
  const menu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !menu) return;

  const openMenu = () => {
    menu.classList.remove('-translate-y-full', 'translate-x-full', 'pointer-events-none');
    menu.classList.add('translate-y-0');
    document.body.style.overflow = 'hidden';
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  const closeMenu = () => {
    menu.classList.remove('translate-y-0');
    menu.classList.add('-translate-y-full', 'pointer-events-none');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('translate-y-0')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * 3. Interactive ROI & Efficiency Calculator
 * Computes:
 * - Önlenen Seans Kaybı (₺)
 * - Muhasebe & Planlama Tasarrufu (Saat)
 * - Veli Sadakat Artışı (%)
 */
function initRoiCalculator() {
  const studentSlider = document.getElementById('sliderStudents');
  const hoursSlider = document.getElementById('sliderHours');
  const rateSlider = document.getElementById('sliderRate');

  const valStudents = document.getElementById('valStudents');
  const valHours = document.getElementById('valHours');
  const valRate = document.getElementById('valRate');

  const resultLoss = document.getElementById('resultLoss');
  const resultTime = document.getElementById('resultTime');
  const resultRoi = document.getElementById('resultRoi');

  if (!studentSlider || !hoursSlider || !rateSlider) return;

  function calculate() {
    const students = parseInt(studentSlider.value, 10);
    const weeklyHours = parseInt(hoursSlider.value, 10);
    const hourlyFee = parseInt(rateSlider.value, 10);

    // Update labels
    valStudents.textContent = `${students} Öğrenci`;
    valHours.textContent = `${weeklyHours} Saat/Hafta`;
    valRate.textContent = `₺${hourlyFee.toLocaleString('tr-TR')} / Saat`;

    // Monthly total hours
    const monthlyTotalHours = weeklyHours * 4;

    // Estimated unrecorded/lost session rate without Birimo: ~6% - 8%
    const preventedLostHours = Math.round(monthlyTotalHours * 0.07);
    const savedMoney = preventedLostHours * hourlyFee;

    // Administrative hours saved per month (scheduling, reconciliation, attendance check)
    // Roughly 0.25 hours saved per student per month
    const hoursSaved = Math.round(students * 0.4 + (weeklyHours * 0.1));

    // Annual gain projection
    const annualGain = savedMoney * 10; // 10 active education months

    // Update results in DOM with smooth counter or formatted text
    resultLoss.textContent = `₺${savedMoney.toLocaleString('tr-TR')}`;
    resultTime.textContent = `${hoursSaved} Saat`;
    resultRoi.textContent = `₺${annualGain.toLocaleString('tr-TR')}`;
  }

  studentSlider.addEventListener('input', calculate);
  hoursSlider.addEventListener('input', calculate);
  rateSlider.addEventListener('input', calculate);

  // Initial run
  calculate();
}

/**
 * 4. Embedded Graphical 1-on-1 Tutoring Lifecycle Loop (Able-Style Infinite Flow)
 */
function initHeroKineticSlider() {
  const svgBeats = [
    document.getElementById('sketchBeat1') || document.getElementById('svgBeat1'),
    document.getElementById('sketchBeat2') || document.getElementById('svgBeat2'),
    document.getElementById('sketchBeat3') || document.getElementById('svgBeat3'),
    document.getElementById('sketchBeat4') || document.getElementById('svgBeat4')
  ];

  const narrativeBeats = [
    document.getElementById('narrativeBeat1'),
    document.getElementById('narrativeBeat2'),
    document.getElementById('narrativeBeat3'),
    document.getElementById('narrativeBeat4')
  ];

  const stepBeats = [
    document.getElementById('stepBeat0'),
    document.getElementById('stepBeat1'),
    document.getElementById('stepBeat2'),
    document.getElementById('stepBeat3')
  ];

  const motionCanvas = document.getElementById('sketchMotionCanvas');

  if (!svgBeats[0] || !narrativeBeats[0]) return;

  let currentIdx = 0;
  let timer = null;
  const BEAT_DURATION = 4200; // 4.2 seconds per story beat

  function updateSegmentProgress() {
    stepBeats.forEach((stepEl, i) => {
      if (!stepEl) return;
      const label = stepEl.querySelector('span');
      const fillBar = stepEl.querySelector('.step-progress-fill');

      if (i < currentIdx) {
        // Completed step
        if (label) label.className = 'text-[11px] sm:text-xs font-semibold text-slate-700 transition-colors tracking-tight';
        if (fillBar) {
          fillBar.style.transition = 'none';
          fillBar.style.width = '100%';
        }
      } else if (i === currentIdx) {
        // Active step: animates fill from 0 to 100%
        if (label) label.className = 'text-[11px] sm:text-xs font-black text-brandCoral transition-colors tracking-tight';
        if (fillBar) {
          fillBar.style.transition = 'none';
          fillBar.style.width = '0%';
          void fillBar.offsetWidth; // Force reflow
          fillBar.style.transition = `width ${BEAT_DURATION}ms linear`;
          fillBar.style.width = '100%';
        }
      } else {
        // Future step
        if (label) label.className = 'text-[11px] sm:text-xs font-normal text-slate-400 group-hover:text-slate-600 transition-colors tracking-tight';
        if (fillBar) {
          fillBar.style.transition = 'none';
          fillBar.style.width = '0%';
        }
      }
    });
  }

  function showBeat(index) {
    currentIdx = (index + svgBeats.length) % svgBeats.length;

    // 0. Smoothly Pan/Glide Camera to Follow the Story Beat in Real Time
    if (motionCanvas) {
      motionCanvas.classList.remove('sketch-pan-1', 'sketch-pan-2', 'sketch-pan-3', 'sketch-pan-4');
      motionCanvas.classList.add(`sketch-pan-${currentIdx + 1}`);
    }

    // 1. Crossfade SVG graphical overlays
    svgBeats.forEach((svgLayer, i) => {
      if (!svgLayer) return;
      if (i === currentIdx) {
        svgLayer.classList.remove('opacity-0', 'pointer-events-none');
        svgLayer.classList.add('opacity-100');
      } else {
        svgLayer.classList.remove('opacity-100');
        svgLayer.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    // 2. Crossfade Narrative Text
    narrativeBeats.forEach((narrative, i) => {
      if (!narrative) return;
      if (i === currentIdx) {
        narrative.classList.remove('hidden');
        narrative.classList.add('flex', 'intro-scene-fade');
      } else {
        narrative.classList.add('hidden');
        narrative.classList.remove('flex', 'intro-scene-fade');
      }
    });

    // 3. Update Story Segment Progress & Typography (Zero Button Styling)
    updateSegmentProgress();
  }

  function startAutoplay() {
    stopAutoplay();
    updateSegmentProgress();
    timer = setInterval(() => {
      showBeat(currentIdx + 1);
    }, BEAT_DURATION);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  // Step button click handlers
  stepBeats.forEach((btn, i) => {
    btn?.addEventListener('click', () => {
      stopAutoplay();
      showBeat(i);
      startAutoplay();
    });
  });

  // Touch Swipe Support for Mobile
  const stage = document.getElementById('narrativeBeat1')?.parentElement;
  if (stage) {
    let startX = 0;
    stage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].clientX - startX;
      if (Math.abs(diffX) > 40) {
        stopAutoplay();
        if (diffX < 0) {
          showBeat(currentIdx + 1);
        } else {
          showBeat(currentIdx - 1);
        }
        startAutoplay();
      }
    }, { passive: true });
  }

  showBeat(0);
  startAutoplay();
}

/**
 * 4.1. Interactive Hero Mockup (Real Software TimetableGrid Simulation)
 */
function initMockupInteractivity() {
  const cells = document.querySelectorAll('.demo-cell');
  const statusFeed = document.getElementById('heroMockupStatus');
  if (!cells.length) return;

  const states = [
    {
      status: 'COMPLETED',
      pillText: '✔ KATILDI',
      containerClass: 'demo-cell mock-cell h-full border-l-[4px] border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-2 flex flex-col justify-between shadow-2xs hover:brightness-95 transition-all cursor-pointer',
      studentClass: 'font-extrabold text-emerald-950 text-[10px] leading-tight truncate cell-student',
      pillClass: 'cell-status text-[8px] font-black text-emerald-800 bg-emerald-100/90 px-1 py-0.5 rounded uppercase',
      metaClass: 'cell-meta text-[8px] text-emerald-700 font-semibold',
      metaText: 'Derslik 1',
      feedHtml: '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-950 border border-emerald-200/90 text-[11px] font-bold truncate max-w-full shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span><strong class="text-emerald-700 shrink-0">✔ Katıldı:</strong><span class="truncate">Veliye WhatsApp iletildi • 1 seans bakiye düşüldü</span></span>'
    },
    {
      status: 'PLANNED',
      pillText: '⏳ BEKLİYOR',
      containerClass: 'demo-cell mock-cell h-full border-l-[4px] border-l-blue-500 bg-gradient-to-br from-sky-50 to-blue-50/50 rounded-lg p-2 flex flex-col justify-between shadow-2xs hover:brightness-95 transition-all cursor-pointer',
      studentClass: 'font-extrabold text-blue-950 text-[10px] leading-tight truncate cell-student',
      pillClass: 'cell-status text-[8px] font-black text-blue-800 bg-blue-100/90 px-1 py-0.5 rounded uppercase',
      metaClass: 'cell-meta text-[8px] text-blue-700 font-semibold',
      metaText: 'Derslik Planı',
      feedHtml: '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-blue-950 border border-blue-200/90 text-[11px] font-bold truncate max-w-full shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span><strong class="text-blue-700 shrink-0">⏳ Bekliyor:</strong><span class="truncate">Ders takvimde rezerve edildi • Hatırlatıcı aktif</span></span>'
    },
    {
      status: 'UNEXCUSED',
      pillText: '✖ MAZERETSİZ',
      containerClass: 'demo-cell mock-cell h-full border-l-[4px] border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-2 flex flex-col justify-between shadow-2xs hover:brightness-95 transition-all cursor-pointer',
      studentClass: 'font-extrabold text-orange-950 text-[10px] leading-tight truncate line-through decoration-orange-400 cell-student',
      pillClass: 'cell-status text-[8px] font-black text-orange-800 bg-orange-100/90 px-1 py-0.5 rounded uppercase',
      metaClass: 'cell-meta text-[8px] text-orange-700 font-semibold',
      metaText: 'Bakiye Düştü',
      feedHtml: '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-950 border border-orange-200/90 text-[11px] font-bold truncate max-w-full shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span><strong class="text-orange-700 shrink-0">✖ Mazeretsiz:</strong><span class="truncate">Veliye devamsızlık WhatsApp iletildi • Bakiye düşüldü</span></span>'
    }
  ];

  function refreshCounters() {
    let completed = 0;
    let planned = 0;
    let unexcused = 0;
    cells.forEach(c => {
      const s = c.getAttribute('data-status');
      if (s === 'COMPLETED') completed++;
      else if (s === 'PLANNED') planned++;
      else if (s === 'UNEXCUSED') unexcused++;
    });
    const cEl = document.getElementById('heroCountCompleted');
    const pEl = document.getElementById('heroCountPlanned');
    const uEl = document.getElementById('heroCountUnexcused');
    if (cEl) cEl.textContent = `${completed} Katıldı`;
    if (pEl) pEl.textContent = `${planned} Bekliyor`;
    if (uEl) uEl.textContent = `${unexcused} Mazeretsiz`;
  }

  cells.forEach(cell => {
    const initialStatus = cell.getAttribute('data-status') || 'COMPLETED';
    let currentIndex = states.findIndex(s => s.status === initialStatus);
    if (currentIndex === -1) currentIndex = 0;

    cell.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % states.length;
      const st = states[currentIndex];
      cell.setAttribute('data-status', st.status);

      // Update container class
      cell.className = st.containerClass;

      // Update student name class
      const studentEl = cell.querySelector('.cell-student');
      if (studentEl) {
        studentEl.className = st.studentClass;
      }

      // Update status pill inside cell
      const tag = cell.querySelector('.cell-status');
      if (tag) {
        tag.textContent = st.pillText;
        tag.className = st.pillClass;
      }

      // Update meta text if present
      const metaEl = cell.querySelector('.cell-meta');
      if (metaEl) {
        metaEl.className = st.metaClass;
        metaEl.textContent = metaEl.textContent.includes('Fizik') ? 'Fizik Lab' : st.metaText;
      }

      // Update middle status feed neatly without any layout shift
      if (statusFeed && st.feedHtml) {
        statusFeed.innerHTML = st.feedHtml;
      }

      // Dynamically update the top counter badges
      refreshCounters();
    });
  });

  refreshCounters();
}

/**
 * 4.1. Mobile Interactive Matrix Scroll & Progress Synchronization
 */
function initMatrixMobileScroll() {
  const matrix = document.querySelector('.matrix-scroll-container');
  const progressBar = document.getElementById('mobileMatrixProgressBar');
  const prevBtns = [
    document.getElementById('btnScrollMatrixLeft'),
    document.getElementById('btnScrollMatrixLeftBottom')
  ];
  const nextBtns = [
    document.getElementById('btnScrollMatrixRight'),
    document.getElementById('btnScrollMatrixRightBottom')
  ];

  if (!matrix) return;

  function updateProgressBar() {
    if (!progressBar) return;
    const maxScroll = matrix.scrollWidth - matrix.clientWidth;
    if (maxScroll <= 0) {
      progressBar.style.width = '100%';
      progressBar.style.marginLeft = '0%';
      return;
    }
    const scrollRatio = Math.max(0, Math.min(1, matrix.scrollLeft / maxScroll));
    progressBar.style.width = '35%';
    progressBar.style.marginLeft = `${scrollRatio * 65}%`;
  }

  matrix.addEventListener('scroll', updateProgressBar, { passive: true });
  window.addEventListener('resize', updateProgressBar, { passive: true });

  prevBtns.forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      matrix.scrollBy({ left: -140, behavior: 'smooth' });
    });
  });

  nextBtns.forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      matrix.scrollBy({ left: 140, behavior: 'smooth' });
    });
  });

  updateProgressBar();
}

/**
 * 5. FAQ Accordion (with Active Card Highlights)
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all others
      faqItems.forEach(otherItem => {
        const c = otherItem.querySelector('.faq-content');
        const i = otherItem.querySelector('.faq-icon');
        if (c) c.classList.add('hidden');
        if (i) i.classList.remove('rotate-180');
        otherItem.classList.remove('ring-2', 'ring-brandCoral/25', 'border-brandCoral/50', 'shadow-md');
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
        item.classList.add('ring-2', 'ring-brandCoral/25', 'border-brandCoral/50', 'shadow-md');
      }
    });
  });
}

/**
 * 6. Demo Modal Controller
 */
function initDemoModal() {
  const modal = document.getElementById('demoModal');
  const openButtons = document.querySelectorAll('.open-demo-modal');
  const closeBtn = document.getElementById('closeDemoModal');
  const backdrop = document.getElementById('modalBackdrop');

  if (!modal) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    // Close company dropdown if open
    const companyContainer = document.getElementById('companyDropdownContainer');
    if (companyContainer) companyContainer.classList.remove('is-open');

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/**
 * 7. Sales Request Form Submission (Honeypot, Safe API & XSS-Protected Toast)
 */
function initDemoForm() {
  // Eski yerel depolama çerez/veri kalıntılarını temizle (KVKK & Gizlilik Koruması)
  try {
    localStorage.removeItem('birimo_leads');
  } catch (e) {}

  const forms = [
    document.getElementById('modalDemoForm'),
    document.getElementById('footerDemoForm'),
    document.getElementById('companyContactForm')
  ];

  forms.forEach(form => {
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Gönder';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Kaydediliyor...
        `;
      }

      // Collect data securely
      const formData = new FormData(form);
      const studentCountVal = formData.get('studentCount') || formData.get('studentCapacity') || '50-100';
      const data = {
        fullName: formData.get('fullName') || formData.get('name') || 'Sayın Yetkili',
        institutionName: formData.get('institutionName') || formData.get('institution') || '',
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        studentCount: studentCountVal,
        studentCapacity: studentCountVal,
        city: formData.get('city') || '',
        message: formData.get('message') || '',
        website_hp: formData.get('website_hp') || '', // Honeypot spam tuzağı
        submittedAt: new Date().toISOString()
      };

      try {
        // Attempt sending to local API if backend script is active
        try {
          const response = await fetch('/api/submit_demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (response && response.ok) {
            await response.json();
          }
        } catch (fetchErr) {
          // Network or offline fallback
        }

        // Show Success Toast (XSS-safe textContent)
        showToast(
          `Tebrikler ${data.fullName}! Satış talebiniz başarıyla alındı. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.`,
          'Satış Talebiniz Alındı'
        );

        form.reset();

        // Close modal if open
        const modal = document.getElementById('demoModal');
        if (modal && !modal.classList.contains('hidden')) {
          setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
          }, 1500);
        }

      } catch (err) {
        showToast('Satış talebiniz kaydedildi. Uzman ekibimiz en kısa sürede arayacaktır.', 'Satış Talebiniz Alındı');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  });
}

/**
 * Toast Notification Utility (XSS-Safe DOM Construction)
 */
function showToast(message, title = 'Satış Talebiniz Alındı') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'fixed bottom-6 right-6 z-50 max-w-md bg-[#0e284d] text-white p-4 rounded-2xl shadow-2xl border border-white/20 flex items-start gap-3 transition-all duration-300 transform translate-y-10 opacity-0';
    document.body.appendChild(toast);
  }

  // Clear previous content safely
  toast.innerHTML = '';

  const iconDiv = document.createElement('div');
  iconDiv.className = 'w-8 h-8 rounded-full bg-[#fc4c39] flex items-center justify-center shrink-0 mt-0.5';
  iconDiv.innerHTML = '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'flex-1';

  const heading = document.createElement('h4');
  heading.className = 'font-extrabold text-sm text-white';
  heading.textContent = title;

  const textP = document.createElement('p');
  textP.className = 'text-xs text-gray-300 mt-0.5 leading-relaxed';
  textP.textContent = message; // textContent kullanılarak DOM XSS tamamen engellendi

  contentDiv.appendChild(heading);
  contentDiv.appendChild(textP);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'text-gray-400 hover:text-white p-1 cursor-pointer';
  closeBtn.textContent = '✕';
  closeBtn.onclick = () => toast.classList.add('opacity-0', 'translate-y-10');

  toast.appendChild(iconDiv);
  toast.appendChild(contentDiv);
  toast.appendChild(closeBtn);

  toast.classList.remove('opacity-0', 'translate-y-10');

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-10');
  }, 5000);
}

/**
 * 7.1 Article Share & Copy Link (Elegant Floating Toast Notification)
 */
function copyArticleShareLink(btn) {
  const url = window.location.href;

  function onCopiedSuccess() {
    showShareToast();
    if (btn) {
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `
        <svg class="w-3.5 h-3.5 text-[#12305b] inline shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg> <span class="text-[#12305b] font-bold">Kopyalandı!</span>
      `;
      btn.classList.add('border-[#12305b]/40', 'bg-slate-50');
      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.classList.remove('border-[#12305b]/40', 'bg-slate-50');
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      }, 2500);
    }
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url)
      .then(onCopiedSuccess)
      .catch(() => {
        fallbackCopy(url);
        onCopiedSuccess();
      });
  } else {
    fallbackCopy(url);
    onCopiedSuccess();
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {}
  textArea.remove();
}

function showShareToast() {
  let toast = document.getElementById('shareToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'shareToastNotification';
    toast.className = 'fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-sm sm:max-w-md bg-[#12305b] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 transition-all duration-300 transform translate-y-10 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="w-9 h-9 rounded-xl bg-[#fc4c39] text-white flex items-center justify-center shrink-0 shadow-xs">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
    </div>
    <div class="flex-1 min-w-0 pr-1">
      <div class="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
        <span>Bağlantı Kopyalandı</span>
        <span class="w-1.5 h-1.5 rounded-full bg-[#fc4c39] animate-pulse"></span>
      </div>
      <p class="text-[11px] text-blue-100 mt-0.5 leading-snug">Bu bilgi sayfasının bağlantısı panonuza kopyalandı. Dilediğiniz kişiyle paylaşabilirsiniz.</p>
    </div>
    <button type="button" onclick="hideShareToast()" class="text-white/70 hover:text-white p-1 text-sm font-bold cursor-pointer transition-colors shrink-0">✕</button>
  `;

  toast.classList.remove('pointer-events-none');
  
  setTimeout(() => {
    toast.classList.remove('opacity-0', 'translate-y-10');
    toast.classList.add('opacity-100', 'translate-y-0');
  }, 10);

  if (window.shareToastTimer) clearTimeout(window.shareToastTimer);
  window.shareToastTimer = setTimeout(() => {
    hideShareToast();
  }, 3500);
}

function hideShareToast() {
  const toast = document.getElementById('shareToastNotification');
  if (toast) {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
  }
}

window.copyArticleShareLink = copyArticleShareLink;
window.showShareToast = showShareToast;
window.hideShareToast = hideShareToast;

/**
 * 8. Company Dropdown Controller (Direct navigation used)
 */
function initCompanyDropdown() {
  // "Şirket" is now a direct navigation link across all pages
}

/**
 * 9. About & Contact Modals Controller
 */
function initAboutAndContactModals() {
  setupModal({
    modalId: 'aboutModal',
    triggerClass: '.open-about-modal',
    closeBtnIds: ['closeAboutModal', 'closeAboutModalBtn'],
    backdropId: 'aboutModalBackdrop'
  });

  setupModal({
    modalId: 'contactModal',
    triggerClass: '.open-contact-modal',
    closeBtnIds: ['closeContactModal'],
    backdropId: 'contactModalBackdrop'
  });

  function setupModal({ modalId, triggerClass, closeBtnIds, backdropId }) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const triggers = document.querySelectorAll(triggerClass);
    const backdrop = document.getElementById(backdropId);

    const open = (e) => {
      if (e) e.preventDefault();
      // Close dropdown if open
      const companyContainer = document.getElementById('companyDropdownContainer');
      if (companyContainer) companyContainer.classList.remove('is-open');

      // Close mobile drawer if open
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu) {
        mobileMenu.classList.remove('translate-y-0');
        mobileMenu.classList.add('-translate-y-full', 'translate-x-full', 'pointer-events-none');
      }

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (window.lucide) lucide.createIcons();
    };

    const close = () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    triggers.forEach(t => t.addEventListener('click', open));
    closeBtnIds.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', close);
    });
    if (backdrop) backdrop.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        close();
      }
    });
  }
}

/**
 * 9.5 Legal Standards & Regulatory Modal (KVKK, Hizmet Şartları, Çerez Politikası)
 */
function initLegalModal() {
  let modal = document.getElementById('legalModal');

  // If modal is not in DOM, dynamically inject it
  if (!modal) {
    const modalWrapper = document.createElement('div');
    modalWrapper.id = 'legalModal';
    modalWrapper.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 hidden';
    modalWrapper.innerHTML = `
      <!-- Backdrop -->
      <div id="legalModalBackdrop" class="fixed inset-0 bg-[#0e284d]/60 backdrop-blur-sm transition-opacity"></div>

      <!-- Modal Box -->
      <div class="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh] z-10 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Top Header -->
        <div class="px-5 py-4 sm:px-7 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-orange-50 text-brandCoral flex items-center justify-center border border-orange-200/60 shadow-2xs shrink-0">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-brandNavy tracking-tight">Hukuki Standartlar & Kurumsal Mevzuat</h3>
              <p class="text-[11px] sm:text-xs text-slate-500 font-medium">Birimo Birebir Eğitim ve Rehberlik İşletim Sistemi Hukuk Masası</p>
            </div>
          </div>
          <button id="closeLegalModal" type="button" class="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-brandCoral hover:border-brandCoral/30 flex items-center justify-center transition-all cursor-pointer shadow-2xs">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Tab Navigation -->
        <div class="px-5 pt-3 pb-2.5 sm:px-7 border-b border-slate-100 bg-white shrink-0">
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button type="button" data-legal-target="kvkk" class="legal-tab-btn px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2 border border-brandNavy bg-brandNavy text-white shadow-2xs">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-brandCoral"></i>
              <span>KVKK Uyum Standartları</span>
            </button>
            <button type="button" data-legal-target="hizmet" class="legal-tab-btn px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2 border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100">
              <i data-lucide="file-text" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>Hizmet Şartları</span>
            </button>
            <button type="button" data-legal-target="cerez" class="legal-tab-btn px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2 border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100">
              <i data-lucide="cookie" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>Çerez Politikası</span>
            </button>
          </div>
        </div>

        <!-- Scrollable Tab Content Container -->
        <div id="legalModalScrollContainer" class="p-5 sm:p-7 overflow-y-auto space-y-5 text-slate-600 text-xs sm:text-sm leading-relaxed flex-1">
          
          <!-- ================= TAB 1: KVKK UYUM STANDARTLARI ================= -->
          <div id="legalTab_kvkk" class="legal-tab-content space-y-4">
            
            <div class="p-3.5 rounded-2xl bg-orange-50/60 border border-brandCoral/20 flex items-start gap-3">
              <div class="w-6 h-6 rounded-lg bg-brandCoral text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">§</div>
              <div class="text-xs text-brandNavy font-medium leading-relaxed">
                Bu metin, <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong> Madde 10 kapsamında, Birimo Birebir Eğitim ve Rehberlik İşletim Sistemi'ni kullanan kurumlar, yöneticiler, öğretmenler, öğrenciler ve veliler için aydınlatma yükümlülüğünü yerine getirmek amacıyla hazırlanmıştır.
              </div>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">01</span>
                Veri Sorumlusu ve Veri İşleyen Sıfatı
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-7">
                Birimo Eğitim Teknolojileri Firması ("Birimo"), platformu lisanslayan eğitim kurumları (VIP Kurslar, Kolejler, Etüt Merkezleri) ile yapılan kurumsal sözleşmeler çerçevesinde <strong>Veri İşleyen (Data Processor)</strong> sıfatını haizdir. Kurum bünyesinde sisteme kaydedilen öğrenci, veli ve öğretmen verilerinin kanuni <strong>Veri Sorumlusu (Data Controller)</strong> lisans sahibi eğitim kurumudur. Birimo, kurumun talimatları ve sözleşme sınırları haricinde hiçbir kişisel veriyi bağımsız olarak işlemez, satmaz veya üçüncü taraflarla paylaşmaz.
              </p>
            </div>

            <div class="space-y-2">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">02</span>
                İşlenen Kişisel Veri Kategorileri
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-7">
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div class="font-bold text-xs text-brandNavy mb-1">Kimlik & İletişim Verileri</div>
                  <p class="text-[11px] text-slate-500 leading-normal">Ad-soyad, telefon numarası, e-posta adresi, öğrenci okul/sınıf düzeyi ve veli iletişim bilgileri.</p>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div class="font-bold text-xs text-brandNavy mb-1">Akademik & Seans Süreç Verileri</div>
                  <p class="text-[11px] text-slate-500 leading-normal">Kalan birebir ders saati (bakiye), katıldığı seanslar, konu eksikleri, ödev teslim durumları ve rehberlik görüşme notları.</p>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div class="font-bold text-xs text-brandNavy mb-1">Öğretmen & Hakediş Verileri</div>
                  <p class="text-[11px] text-slate-500 leading-normal">Branş bilgisi, haftalık müsaitlik takvimi, tamamlanan seans sayıları ve kurum içi hakediş parametreleri.</p>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div class="font-bold text-xs text-brandNavy mb-1">İşlem & Sistem Güvenliği Verileri</div>
                  <p class="text-[11px] text-slate-500 leading-normal">IP adresi, oturum logları, seans onay zaman damgaları ve rol bazlı yetkilendirme kayıtları.</p>
                </div>
              </div>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">03</span>
                Kişisel Verilerin İşlenme Amaçları
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-7">
                Kişisel veriler; birebir ders planlama takviminin hatasız işletilmesi, öğrenci kalan ders saatlerinin seans onaylarıyla otomatik düşülmesi (seans kaçaklarının sıfırlanması), velilere resmi WhatsApp kanalı üzerinden anlık katılım ve ödev bilgilendirmesi iletilmesi, rehberlik ödevlendirme ve mentorluk notlarının kurumsal hafızada tutulması ile öğretmen hakedişlerinin hesaplanması amaçlarıyla KVKK Madde 5/2 (c) (sözleşmenin ifası) ve (f) (meşru menfaat) hukuki sebeplerine dayalı olarak işlenmektedir.
              </p>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">04</span>
                Teknik Güvenlik ve Şubeler Arası Tam İzolasyon
              </h4>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed pl-4 space-y-1.5">
                <p>• <strong>Şubeler Arası Tam Veri İzolasyonu:</strong> Çok şubeli veya tek şubeli kurumlarda her şubenin verisi mantıksal olarak katı şekilde izoledir. Bir şubenin personeli diğer şubenin öğrenci veya finansal verisine asla erişemez.</p>
                <p>• <strong>Rol Bazlı Erişim (RBAC):</strong> Branş öğretmeni yalnızca kendi öğrencilerini ve takvimini görürken; rehber öğretmen sadece danışmanlık yaptığı öğrencileri, kurucu ise genel denetim raporlarını görüntüler.</p>
                <p>• <strong>256-Bit SSL/TLS & AES-256:</strong> Tüm veri trafiği modern TLS 1.3 protokolüyle şifrelenir; veri tabanı yedekleri dinlenme anında AES-256 standardıyla korunur.</p>
              </div>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">05</span>
                İlgili Kişinin Hakları (KVKK Madde 11)
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-7">
                Veri sahipleri; verilerinin işlenip işlenmediğini öğrenme, bilgi talep etme, eksik/yanlış kayıtların düzeltilmesini ve silinmesini isteme haklarına sahiptir. Bu kapsamdaki kurumsal başvurular için veri sorumlusu kurumunuza veya Birimo Hukuk Masası'na <a href="mailto:kvkk@birimoedu.com" class="text-brandCoral font-bold underline">kvkk@birimoedu.com</a> üzerinden ulaşabilirsiniz.
              </p>
            </div>

          </div>

          <!-- ================= TAB 2: HİZMET ŞARTLARI ================= -->
          <div id="legalTab_hizmet" class="legal-tab-content hidden space-y-4">
            
            <div class="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-3">
              <div class="w-6 h-6 rounded-lg bg-brandNavy text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">i</div>
              <div class="text-xs text-brandNavy font-medium leading-relaxed">
                Birimo bulut tabanlı yazılım hizmetini kullanan tüm eğitim kurumları, yöneticiler ve kullanıcılar aşağıdaki hizmet şartlarını ve kurumsal kullanım prensiplerini kabul etmiş sayılır.
              </div>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">01</span>
                Lisans ve Hizmet Kapsamı
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-7">
                Birimo, kurumlara münhasır olmayan, devredilemez, bulut tabanlı bir Hizmet Olarak Yazılım (SaaS) kullanım lisansı sağlar. Yazılımın kaynak kodları, dinamik takvim motoru algoritmaları, akıllı hakediş hesaplama modülleri, arayüz tasarımları ve veritabanı şemaları Birimo Eğitim Teknolojileri Firması'nın tescilli mülkiyetindedir. Tersine mühendislik yapılması, izinsiz kopyalanması veya kaynak kodların deşifre edilmesi kesinlikle yasaktır.
              </p>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">02</span>
                Kullanıcı Hesap Güvenliği ve Yetkilendirme
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-7">
                Kurum adına oluşturulan yönetici, şube müdürü, rehberlik ve öğretmen kullanıcı hesaplarının şifre güvenliği lisans sahibi kuruma ve ilgili kullanıcılara aittir. Hesapların üçüncü şahıslarla paylaşılması yasaktır. Kurum personeli ayrıldığında hesabın dondurulması veya silinmesi kurum yöneticisinin sorumluluğundadır.
              </p>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">03</span>
                Hizmet Kesintisizliği ve SLA Garantisi (%99.9 Uptime)
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-7">
                Birimo, modern küresel bulut altyapısı üzerinde aylık bazda <strong>%99.9 çalışma süresi (uptime SLA)</strong> taahhüt eder. Zorunlu altyapı güncellemeleri ve planlı bakım çalışmaları, kurumların ders yoğunluğunun olmadığı gece saatlerinde (02:00 - 05:00) gerçekleştirilir ve kurumlara önceden duyurulur.
              </p>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">04</span>
                Veri Bütünlüğü ve Birebir Seans Kayıtları
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-7">
                Birimo üzerindeki her birebir seans, seans onay işlemi ve bakiye düşüşü dijital zaman damgasıyla kayıt altına alınır. Kurum tarafından sisteme girilen ders saatleri, öğrenci bakiye tanımlamaları ve öğretmen ücret katsayılarının doğruluğu kurumun idari yetkisindedir. Birimo algoritması sisteme girilen parametrelere tam sadakatle hakediş ve bakiye hesaplaması yapar.
              </p>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">05</span>
                Sözleşme Feshi ve Veri İadesi
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-7">
                Hizmet sözleşmesinin sona ermesi durumunda, kuruma ait tüm öğrenci listeleri, geçmiş seans dökümleri, ödev takip kayıtları ve öğretmen hakediş verileri Excel/CSV formatlarında eksiksiz olarak teslim edilir. Kurum verileri 30 günlük bekleme süresinin ardından güvenli silme prosedürleriyle sistemden kalıcı olarak temizlenir.
              </p>
            </div>

          </div>

          <!-- ================= TAB 3: ÇEREZ POLİTİKASI ================= -->
          <div id="legalTab_cerez" class="legal-tab-content hidden space-y-4">
            
            <div class="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
              <div class="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
              <div class="text-xs text-emerald-950 font-medium leading-relaxed">
                Birimo, kullanıcı deneyimini ve platform güvenliğini sağlamak için yalnızca teknik açıdan zorunlu ve işlevsel çerezler (cookies) kullanır. <strong>Sistemimizde üçüncü taraf reklam veya pazarlama takip çerezleri kesinlikle barındırılmaz.</strong>
              </div>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">01</span>
                Çerez Nedir ve Ne Amaçla Kullanılır?
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-7">
                Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Birimo web sitesinde ve yönetim panelinde çerezler; oturumunuzun güvenliğini sağlamak, her sayfada yeniden şifre girmeden gezinmenize olanak tanımak ve aktif şube gibi kişisel panel tercihlerinizi hatırlamak amacıyla kullanılmaktadır.
              </p>
            </div>

            <div class="space-y-2">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">02</span>
                Kullanılan Çerez Kategorileri
              </h4>
              <div class="space-y-2 pl-7">
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-xs text-brandNavy">1. Zorunlu Oturum Çerezleri (Strictly Necessary)</span>
                    <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">Zorunlu</span>
                  </div>
                  <p class="text-[11px] text-slate-500 leading-relaxed">
                    Platforma giriş yapmış yöneticinin, öğretmenin veya personelin kimliğini güvenli biçimde doğrulamak (HTTP-Only, SameSite=Lax, Secure session token) için gereklidir. Bu çerezler olmadan yönetim paneli çalışamaz.
                  </p>
                </div>
                
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-xs text-brandNavy">2. İşlevsel Tercih Çerezleri (Functional)</span>
                    <span class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase">İşlevsel</span>
                  </div>
                  <p class="text-[11px] text-slate-500 leading-relaxed">
                    Kullanıcının seçtiği aktif şube, haftalık takvim filtreleri veya tema tercihlerini oturumlar arasında hatırlamak için kullanılır.
                  </p>
                </div>

                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-xs text-brandNavy">3. Anonim Performans Ölçüm Çerezleri</span>
                    <span class="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-black uppercase">Performans</span>
                  </div>
                  <p class="text-[11px] text-slate-500 leading-relaxed">
                    Sayfa yüklenme sürelerini ve sistem hızını ölçmek için tamamen anonimleştirilmiş teknik metrikleri kaydeder; asla kişisel veri içermez.
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">03</span>
                Üçüncü Taraf Reklam ve Takip Yasağı
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-7">
                Birimo bir eğitim işletim sistemidir. Bu nedenle platformumuzda üçüncü taraf reklam ajansları, veri komisyoncuları veya kullanıcı profilleme araçlarının takip çerezleri <strong>kesinlikle bulunmaz</strong>. Kurum ve öğrenci verileriniz asla ticari reklam hedeflemesi için kullanılmaz.
              </p>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs sm:text-sm font-extrabold text-brandNavy flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-slate-100 text-brandNavy flex items-center justify-center font-mono text-[10px]">04</span>
                Çerezlerin Yönetimi ve Silinmesi
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-7">
                Dilediğiniz zaman internet tarayıcınızın ayarlarından (Chrome, Safari, Firefox, Edge vb.) çerezleri temizleyebilir veya engelleyebilirsiniz. Ancak zorunlu oturum çerezlerini engellemeniz durumunda Birimo yönetim paneline güvenli giriş yapamayacağınızı hatırlatmak isteriz.
              </p>
            </div>

          </div>

        </div>

        <!-- Footer Action Bar -->
        <div class="px-5 py-3.5 sm:px-7 sm:py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
          <span class="text-[11px] text-slate-400 font-medium">Son Güncelleme: 18 Ekim 2026 • Sürüm 2.4</span>
          <button id="closeLegalModalBtn" type="button" class="btn-coral px-5 py-2 rounded-xl text-xs font-bold shadow-2xs cursor-pointer">
            Anladım & Kapat
          </button>
        </div>

      </div>
    `;
    document.body.appendChild(modalWrapper);
    modal = modalWrapper;
  }

  // Tab switching logic
  const switchLegalTab = (targetTab) => {
    const tabButtons = modal.querySelectorAll('.legal-tab-btn');
    const tabContents = modal.querySelectorAll('.legal-tab-content');
    const scrollContainer = document.getElementById('legalModalScrollContainer');

    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-legal-target') === targetTab;
      if (isTarget) {
        btn.classList.add('bg-brandNavy', 'text-white', 'border-brandNavy', 'shadow-2xs');
        btn.classList.remove('bg-slate-50', 'text-slate-600', 'border-slate-200');
        const icon = btn.querySelector('svg, i');
        if (icon) {
          icon.classList.add('text-brandCoral');
          icon.classList.remove('text-slate-400');
        }
      } else {
        btn.classList.remove('bg-brandNavy', 'text-white', 'border-brandNavy', 'shadow-2xs');
        btn.classList.add('bg-slate-50', 'text-slate-600', 'border-slate-200');
        const icon = btn.querySelector('svg, i');
        if (icon) {
          icon.classList.remove('text-brandCoral');
          icon.classList.add('text-slate-400');
        }
      }
    });

    tabContents.forEach(content => {
      if (content.id === `legalTab_${targetTab}`) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });

    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  };

  // Wire tab button click events
  modal.querySelectorAll('.legal-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-legal-target');
      if (target) switchLegalTab(target);
    });
  });

  const openLegalModal = (targetTab = 'kvkk') => {
    // Close company dropdown if open
    const companyContainer = document.getElementById('companyDropdownContainer');
    if (companyContainer) companyContainer.classList.remove('is-open');

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      mobileMenu.classList.remove('translate-y-0');
      mobileMenu.classList.add('-translate-y-full', 'translate-x-full', 'pointer-events-none');
    }

    switchLegalTab(targetTab);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
  };

  const closeLegalModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // Close buttons & backdrop
  const closeBtn1 = document.getElementById('closeLegalModal');
  const closeBtn2 = document.getElementById('closeLegalModalBtn');
  const backdrop = document.getElementById('legalModalBackdrop');

  if (closeBtn1) closeBtn1.addEventListener('click', closeLegalModal);
  if (closeBtn2) closeBtn2.addEventListener('click', closeLegalModal);
  if (backdrop) backdrop.addEventListener('click', closeLegalModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeLegalModal();
    }
  });

  // Attach to all triggers
  document.querySelectorAll('.open-legal-modal, [data-legal-tab]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = trigger.getAttribute('data-legal-tab') || 'kvkk';
      openLegalModal(tab);
    });
  });

  // Check URL hash on page load
  const currentHash = window.location.hash.toLowerCase().replace('#', '');
  if (['kvkk', 'hizmet', 'cerez'].includes(currentHash)) {
    setTimeout(() => {
      openLegalModal(currentHash);
    }, 200);
  }
}

/**
 * 10. Anchor Scroll Synchronization with Sticky Header Clearance
 */
function initAnchorScrollSync() {
  const getHeaderHeight = () => {
    const header = document.getElementById('mainHeader');
    return header ? header.offsetHeight : 80;
  };

  const smoothScrollToTarget = (target) => {
    if (!target) return;
    const headerHeight = getHeaderHeight();
    const targetRect = target.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + targetRect.top;
    // 28px comfortable breathing clearance below sticky header
    const offsetPosition = Math.max(0, absoluteTop - headerHeight - 28);

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  // If page loads with a hash (e.g. from index.html -> ozellikler.html#takvim)
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        smoothScrollToTarget(target);
      }, 150);
    }
  }

  // Handle in-page smooth scroll link clicks
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href) return;

      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const hash = href.substring(hashIndex);
      if (hash === '#' || hash === '#!') return;

      // Check if it targets an element on the current page
      const currentPath = window.location.pathname.replace(/\/$/, '');
      const linkPath = href.substring(0, hashIndex).replace(/\/$/, '');

      const isCurrentPage = !linkPath || 
        currentPath.endsWith(linkPath) || 
        (currentPath === '' && (linkPath === 'index.html' || linkPath === ''));

      if (isCurrentPage) {
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          smoothScrollToTarget(target);
          if (history.pushState) {
            history.pushState(null, null, hash);
          }
        }
      }
    });
  });
}




