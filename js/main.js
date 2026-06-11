/**
 * YanceEngine 主脚本
 * 上海衍策引擎AI科技有限公司
 */

(function () {
  'use strict';

  /* ----------------------------------------
     1. 头部滚动阴影效果（含平滑透明度过渡）
     ---------------------------------------- */
  var header = document.querySelector('.header') || document.querySelector('.site-header');

  function handleHeaderScroll() {
    if (!header) return;
    // 根据滚动位置计算导航栏背景不透明度（0~1），实现平滑过渡
    var scrollY = window.scrollY;
    var opacity = Math.min(scrollY / 80, 1);
    header.style.setProperty('--nav-bg-opacity', opacity);

    if (scrollY > 20) {
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
     4. 滚动渐入动画（IntersectionObserver）+ 交错延迟支持
     ---------------------------------------- */
  function initScrollAnimations() {
    // 支持 .fade-in, .fade-in-left, .fade-in-right 以及交错延迟类
    var fadeElements = document.querySelectorAll(
      '.fade-in, .fade-in-left, .fade-in-right, .fade-in-delay-1, .fade-in-delay-2, .fade-in-delay-3'
    );

    if (!fadeElements.length) return;

    // 交错延迟映射（毫秒）
    var delayMap = {
      'fade-in-delay-1': 100,
      'fade-in-delay-2': 200,
      'fade-in-delay-3': 300
    };

    // 检查浏览器是否支持 IntersectionObserver
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              // 检查元素是否带有交错延迟类
              var delay = 0;
              for (var cls in delayMap) {
                if (entry.target.classList.contains(cls)) {
                  delay = delayMap[cls];
                  break;
                }
              }
              // 如果有延迟，使用 setTimeout；否则直接添加
              if (delay > 0) {
                (function (target, d) {
                  setTimeout(function () {
                    target.classList.add('visible');
                  }, d);
                })(entry.target, delay);
              } else {
                entry.target.classList.add('visible');
              }
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

  /* ========================================
     ===== 以下为新增高级交互功能 =====
     ======================================== */

  /* ----------------------------------------
     9. Hero 区域视差滚动效果
     当用户向下滚动时，Hero 内容以较慢速度上移，
     营造层次感。使用 requestAnimationFrame 保证性能。
     ---------------------------------------- */
  (function initHeroParallax() {
    var hero = document.querySelector('.hero') || document.querySelector('.hero-section');
    if (!hero) return;

    var heroContent = hero.querySelector('.hero-content') || hero.querySelector('.hero-inner') || hero;
    var parallaxSpeed = 0.35; // 视差系数：值越小移动越慢

    function onScroll() {
      var scrollY = window.scrollY;
      var heroHeight = hero.offsetHeight;

      // 仅在 Hero 可见范围内计算视差
      if (scrollY <= heroHeight) {
        var offset = Math.round(scrollY * parallaxSpeed);
        heroContent.style.transform = 'translateY(' + offset + 'px)';
        // 随滚动轻微降低透明度以增强深度感
        heroContent.style.opacity = Math.max(1 - scrollY / (heroHeight * 1.2), 0);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* ----------------------------------------
     10. Hero Badge 淡入动画
     页面加载后，.badge 元素以渐入方式出现，
     延迟 300ms 启动，持续 600ms。
     ---------------------------------------- */
  (function initBadgeFadeIn() {
    var badge = document.querySelector('.hero .badge') ||
                document.querySelector('.hero-section .badge');
    if (!badge) return;

    // 初始状态设为透明
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(8px)';
    badge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    // 页面加载后延迟触发淡入
    setTimeout(function () {
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0)';
    }, 300);
  })();

  /* ----------------------------------------
     11. 单页模式下滚动高亮当前导航项
     针对 index.html 的单页布局，根据滚动位置
     自动为对应的导航链接添加 .active 类。
     ---------------------------------------- */
  (function initActiveSectionHighlight() {
    // 收集所有带 # 锚点的导航链接
    var sectionLinks = document.querySelectorAll(
      '.nav-links a[href^="#"], .main-nav a[href^="#"], .nav a[href^="#"]'
    );
    if (!sectionLinks.length) return;

    // 构建 section 列表
    var sections = [];
    sectionLinks.forEach(function (link) {
      var id = link.getAttribute('href');
      if (id && id !== '#') {
        var section = document.querySelector(id);
        if (section) {
          sections.push({ el: section, link: link, id: id });
        }
      }
    });

    if (!sections.length) return;

    var headerHeight = header ? header.offsetHeight : 0;
    var ticking = false;

    function updateActiveSection() {
      var scrollPos = window.scrollY + headerHeight + 100; // 偏移量让判定更自然

      var current = null;
      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el.offsetTop <= scrollPos) {
          current = sections[i];
          break;
        }
      }

      // 清除所有链接的 active 状态，再给当前项添加
      sectionLinks.forEach(function (l) { l.classList.remove('active'); });
      if (current) {
        current.link.classList.add('active');
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    }, { passive: true });

    // 初始化一次
    updateActiveSection();
  })();

  /* ----------------------------------------
     12. 图片懒加载（IntersectionObserver）
     对带有 data-src 属性的 <img> 元素进行懒加载，
     当图片进入视口附近时再加载真实资源。
     ---------------------------------------- */
  (function initLazyLoad() {
    var lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var img = entry.target;
              // 将 data-src 赋值给 src 触发加载
              img.src = img.getAttribute('data-src');

              // 可选：如果有 data-srcset 也一并设置
              if (img.getAttribute('data-srcset')) {
                img.srcset = img.getAttribute('data-srcset');
              }

              // 加载完成后添加 .loaded 类（可配合 CSS 做淡入效果）
              img.addEventListener('load', function () {
                img.classList.add('loaded');
              });

              // 移除 data 属性，防止重复加载
              img.removeAttribute('data-src');
              img.removeAttribute('data-srcset');

              imgObserver.unobserve(img);
            }
          });
        },
        {
          rootMargin: '200px 0px', // 提前 200px 开始加载
          threshold: 0.01
        }
      );

      lazyImages.forEach(function (img) {
        imgObserver.observe(img);
      });
    } else {
      // 降级：直接加载所有图片
      lazyImages.forEach(function (img) {
        img.src = img.getAttribute('data-src');
      });
    }
  })();

  /* ----------------------------------------
     13. 点击邮箱地址复制到剪贴板
     自动检测页面中的邮箱链接（mailto: 或含邮箱格式文本），
     点击后复制邮箱地址并显示"已复制"提示气泡。
     ---------------------------------------- */
  (function initCopyEmail() {
    // 查找所有 mailto 链接和包含邮箱格式的文本元素
    var emailRegex = /[\w.+-]+@[\w-]+\.[\w.]+/;
    var emailLinks = document.querySelectorAll('a[href^="mailto:"], [data-email]');

    // 如果没有显式的 mailto 链接，尝试从页面文本中查找
    if (!emailLinks.length) {
      var allElements = document.querySelectorAll('p, span, td, .email, .contact-email');
      allElements.forEach(function (el) {
        var text = (el.textContent || '').trim();
        if (emailRegex.test(text) && el.children.length === 0) {
          // 确保是叶子节点（无子元素），避免误匹配
          el.style.cursor = 'pointer';
          el.setAttribute('data-email', text.match(emailRegex)[0]);
          emailLinks = document.querySelectorAll('[data-email]');
        }
      });
    }

    if (!emailLinks.length) return;

    // 创建提示气泡元素
    var tooltip = document.createElement('span');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = '\u5DF2\u590D\u5236'; // "已复制"
    tooltip.style.cssText =
      'position:fixed;padding:4px 10px;background:#333;color:#fff;font-size:12px;' +
      'border-radius:4px;pointer-events:none;opacity:0;transition:opacity 0.25s ease;' +
      'z-index:99999;transform:translateX(-50%);white-space:nowrap;';
    document.body.appendChild(tooltip);

    var tooltipTimer = null;

    function showTooltip(anchorEl) {
      var rect = anchorEl.getBoundingClientRect();
      tooltip.style.left = (rect.left + rect.width / 2) + 'px';
      tooltip.style.top = (rect.top - 30) + 'px';
      tooltip.style.opacity = '1';

      clearTimeout(tooltipTimer);
      tooltipTimer = setTimeout(function () {
        tooltip.style.opacity = '0';
      }, 1200);
    }

    emailLinks.forEach(function (el) {
      el.style.cursor = 'pointer';

      el.addEventListener('click', function (e) {
        var email = el.getAttribute('data-email') ||
                    (el.getAttribute('href') || '').replace('mailto:', '') ||
                    (el.textContent.match(emailRegex) || [])[0];

        if (!email) return;

        // 使用 Clipboard API 复制
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(function () {
            showTooltip(el);
          });
        } else {
          // 降级方案：使用临时 textarea
          var ta = document.createElement('textarea');
          ta.value = email;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); showTooltip(el); } catch (err) { /* ignore */ }
          document.body.removeChild(ta);
        }
      });
    });
  })();

})();
