// 배민 스타일 풀페이지 스크롤
// 컨테이너가 translateY로 통째 이동, 0.9s ease 전환
// 태블릿/모바일(1024px 이하)에서는 일반 스크롤로 전환

(function () {
  const BREAKPOINT = 0; // 모바일에서도 풀페이지 스크롤 사용
  const container = document.querySelector('.page-container');
  const sections = document.querySelectorAll('.scroll-section');
  let currentIndex = 0;
  let isAnimating = false;
  let touchStartY = 0;
  let isDesktop = window.innerWidth > BREAKPOINT;
  const ANIMATION_DURATION = 900;

  function init() {
    if (isDesktop) {
      activateReveals(sections[0]);
      updateIndicator();
    } else {
      // 모바일: 모든 reveal 즉시 표시
      sections.forEach(s => activateReveals(s));
      updateMobileIndicator();
    }
  }

  // 모바일 스크롤 위치로 side-nav 인디케이터 업데이트
  function updateMobileIndicator() {
    const scrollY = window.scrollY + window.innerHeight * 0.4;
    let activeIdx = 0;
    sections.forEach((sec, i) => {
      if (sec.offsetTop <= scrollY) activeIdx = i;
    });
    document.querySelectorAll('.side-nav-item').forEach((item, i) => {
      item.classList.toggle('active', i === activeIdx);
    });

    // 다크 섹션 위일 때 side-nav 흰색 전환
    const darkSections = [9];
    const footer = document.querySelector('.section-footer');
    const footerIsDark = footer && !footer.classList.contains('footer-light');
    const isDark = darkSections.includes(activeIdx) || (activeIdx === 10 && footerIsDark);
    const sideNav = document.querySelector('.side-nav');
    if (sideNav) sideNav.classList.toggle('side-nav-on-dark', isDark);
  }

  function activateReveals(section) {
    const reveals = section.querySelectorAll('.scroll-reveal');
    reveals.forEach((el, i) => {
      if (isDesktop) {
        setTimeout(() => { el.classList.add('visible'); }, i * 150);
      } else {
        el.classList.add('visible');
      }
    });

    // 통계 섹션 카운트업 애니메이션
    if (section.classList.contains('section-summary')) {
      section.querySelectorAll('.stat-item strong').forEach(el => {
        const target = el.textContent;
        animateCount(el, target);
      });
    }
  }

  // 카운트업 애니메이션
  function animateCount(el, target) {
    const match = target.match(/^([\d,]+)/);
    if (!match) { el.textContent = target; return; }

    const numStr = match[1].replace(/,/g, '');
    const num = parseInt(numStr);
    const suffix = target.replace(match[1], '');
    const hasComma = match[1].includes(',');
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(num * eased);
      const formatted = hasComma ? current.toLocaleString() : current.toString();
      el.textContent = formatted + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function deactivateReveals(section) {
    section.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.remove('visible');
    });
  }

  function goTo(index) {
    if (!isDesktop) return;
    if (isAnimating) return;
    if (index < 0 || index >= sections.length) return;
    if (index === currentIndex) return;

    isAnimating = true;

    const prevIndex = currentIndex;
    currentIndex = index;

    container.style.transform = 'translateY(-' + (currentIndex * 100) + 'vh)';

    updateIndicator();

    setTimeout(() => {
      activateReveals(sections[currentIndex]);
    }, 200);

    setTimeout(() => {
      deactivateReveals(sections[prevIndex]);
      isAnimating = false;
    }, ANIMATION_DURATION);
  }

  function goNext() { goTo(currentIndex + 1); }
  function goPrev() { goTo(currentIndex - 1); }

  // Wheel (데스크톱만)
  let wheelAccumulator = 0;
  let wheelTimeout;

  function onWheel(e) {
    if (!isDesktop) return;
    e.preventDefault();
    wheelAccumulator += e.deltaY;
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      if (Math.abs(wheelAccumulator) > 60) {
        if (wheelAccumulator > 0) goNext();
        else goPrev();
      }
      wheelAccumulator = 0;
    }, 80);
  }

  // Touch (데스크톱만)
  function onTouchStart(e) {
    if (!isDesktop) return;
    touchStartY = e.touches[0].clientY;
  }

  function onTouchEnd(e) {
    if (!isDesktop) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }

  // 키보드 (데스크톱만)
  function onKeydown(e) {
    if (!isDesktop) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goPrev();
    }
  }

  // 이벤트 바인딩
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onKeydown);

  // 인디케이터 + 헤더
  function updateIndicator() {
    document.querySelectorAll('.side-nav-item').forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });
    document.querySelectorAll('.panel-item').forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });

    const header = document.querySelector('.header');
    if (currentIndex === 0) {
      header.classList.remove('header-scrolled');
    } else {
      header.classList.add('header-scrolled');
    }

    // 어두운 배경 섹션 위일 때 헤더/사이드네비 흰색 전환
    const darkSections = [9]; // summary 섹션
    const footer = document.querySelector('.section-footer');
    const footerIsDark = footer && !footer.classList.contains('footer-light');
    const isDark = darkSections.includes(currentIndex) || (currentIndex === 10 && footerIsDark);
    header.classList.toggle('header-on-dark', isDark);
    const sideNav = document.querySelector('.side-nav');
    if (sideNav) sideNav.classList.toggle('side-nav-on-dark', isDark);
  }

  // 사이드 네비 바 클릭
  document.querySelectorAll('.side-nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index);
      if (isDesktop) {
        goTo(idx);
      } else {
        // 모바일: 해당 섹션으로 스크롤
        const target = sections[idx];
        if (target) window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      }
    });
  });

  // 모바일 스크롤 리스너
  window.addEventListener('scroll', () => {
    if (!isDesktop) updateMobileIndicator();
  }, { passive: true });

  // 패널 아이템 클릭
  document.querySelectorAll('.panel-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(parseInt(item.dataset.index));
    });
  });

  // CTA 버튼 스크롤
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!isDesktop) return; // 모바일에서는 기본 동작
      e.preventDefault();
      goTo(parseInt(btn.dataset.goto));
    });
  });

  // 리사이즈 대응
  window.addEventListener('resize', () => {
    const wasDesktop = isDesktop;
    isDesktop = window.innerWidth > BREAKPOINT;

    if (wasDesktop && !isDesktop) {
      // 데스크톱 → 모바일 전환
      container.style.transform = '';
      container.style.transition = '';
      sections.forEach(s => activateReveals(s));
      currentIndex = 0;
    } else if (!wasDesktop && isDesktop) {
      // 모바일 → 데스크톱 전환
      window.scrollTo(0, 0);
      container.style.transition = 'transform 0.9s ease';
      container.style.transform = 'translateY(0)';
      sections.forEach(s => deactivateReveals(s));
      currentIndex = 0;
      activateReveals(sections[0]);
      updateIndicator();
    }
  });

  // 모바일 메뉴 토글
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });
  }

  // 푸터 시안 전환
  document.querySelectorAll('.footer-variant-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const theme = btn.dataset.theme;
      document.querySelectorAll('.footer-variant-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const footer = document.querySelector('.section-footer');
      footer.classList.toggle('footer-light', theme === 'light');
      if (isDesktop) updateIndicator();
    });
  });

  // 히어로 시안 전환
  document.querySelectorAll('.variant-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      // 버튼 활성화
      document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // 시안 전환
      document.querySelectorAll('.hero-variant').forEach(v => {
        v.classList.remove('hero-variant-active');
        v.querySelectorAll('.scroll-reveal').forEach(r => r.classList.remove('visible'));
      });
      const next = document.querySelector('.hero-variant[data-variant="' + target + '"]');
      next.classList.add('hero-variant-active');
      // reveal 애니메이션 재실행
      const reveals = next.querySelectorAll('.scroll-reveal');
      reveals.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    });
  });

  init();
})();
