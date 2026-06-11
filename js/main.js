/**
 * YanceEngine 主脚本
 * 上海衍策引擎AI科技有限公司
 */

(function () {
  'use strict';

  /* ----------------------------------------
     1. 头部滚动阴影效果
     ---------------------------------------- */
  var header = document.querySelector('.header') || document.querySelector('.site-header');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  // 页面加载时执行一次
  handleHeaderScroll();

  /* ----------------------------------------
     2. 移动端导航切换（汉堡菜单）
     ---------------------------------------- */
  var hamburger = document.querySelector('.hamburger') || document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav') || document.querySelector('.main-nav');
  var navOverlay = document.querySelector('.nav-overlay');
  var navLinks = document.querySelectorAll('.nav-links a, .main-nav ul li a, .nav a');

  function toggleMobileNav() {
    if (!hamburger || !nav) return;

    const isActive = nav.classList.contains('active');

    hamburger.classList.toggle('active');
    nav.classList.toggle('active');

    if (navOverlay) {
      navOverlay.classList.toggle('active');
    }

    // 切换 body 滚动锁定
    document.body.style.overflow = isActive ? '' : 'hidden';
  }

  function closeMobileNav() {
    if (!hamburger || !nav) return;

    hamburger.classList.remove('active');
    nav.classList.remove('active');

    if (navOverlay) {
      navOverlay.classList.remove('active');
    }

    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileNav);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileNav);
  }

  // 点击导航链接后关闭移动端菜单
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* ----------------------------------------
     3. 当前页面导航高亮
     ---------------------------------------- */
  function highlightCurrentPage() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      } else if (currentPage === '' && href === 'index.html') {
        link.classList.add('active');
      }
    });
  }

  highlightCurrentPage();

  /* ----------------------------------------
     4. 滚动渐入动画（IntersectionObserver）
     ---------------------------------------- */
  function initScrollAnimations() {
    var fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

    if (!fadeElements.length) return;

    // 检查浏览器是否支持 IntersectionObserver
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      fadeElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // 降级处理：直接显示
      fadeElements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  initScrollAnimations();

  /* ----------------------------------------
     5. 数字计数器动画
     ---------------------------------------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000; // 动画时长（毫秒）
    var startTime = null;

    if (isNaN(target)) return;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      // 使用 easeOutQuart 缓动
      var eased = 1 - Math.pow(1 - progress, 4);
      var current = Math.floor(eased * target);

      el.innerHTML = current + (suffix ? '<span class="suffix">' + suffix + '</span>' : '');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.innerHTML = target + (suffix ? '<span class="suffix">' + suffix + '</span>' : '');
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach(function (counter) {
        observer.observe(counter);
      });
    } else {
      counters.forEach(function (counter) {
        animateCounter(counter);
      });
    }
  }

  initCounters();

  /* ----------------------------------------
     6. 联系表单提交处理
     ---------------------------------------- */
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // 隐藏表单，显示成功消息
      var formSuccess = document.querySelector('.form-success');
      if (formSuccess) {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      } else {
        alert('感谢您的提交！我们将尽快与您联系。');
        contactForm.reset();
      }
    });
  }

  /* ----------------------------------------
     7. 锚点平滑滚动
     ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ----------------------------------------
     8. 回到顶部按钮
     ---------------------------------------- */
  var backToTopBtn = document.querySelector('.back-to-top');

  function handleBackToTop() {
    if (!backToTopBtn) return;

    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });
  handleBackToTop();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

})();
