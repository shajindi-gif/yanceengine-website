/**
 * YanceEngine 主脚本 — SpaceX 风格暗色主题
 * 上海衍策引擎AI科技有限公司
 * 纯原生 JS，无任何依赖
 */

/* ============================================================
   1. 粒子画布 — Hero 区域星空粒子 + 连线 + 鼠标交互
   ============================================================ */
(function initParticleCanvas() {
  'use strict';

  const hero = document.querySelector('.hero');
  if (!hero) return;

  // 创建画布并插入 Hero 区域
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  canvas.style.cssText =
    'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
  hero.style.position = 'relative';
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let width, height, particles, animationId;
  let mouse = { x: -9999, y: -9999 };

  // 根据设备能力决定粒子数量
  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 50 : 100;
  const CONNECT_DIST = 120;       // 连线最大距离
  const MOUSE_RADIUS = 200;       // 鼠标影响半径
  const MOUSE_FORCE = 8;          // 鼠标推力

  /** 调整画布尺寸 */
  function resize() {
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }

  /** 初始化粒子 */
  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1 + 1,                              // 半径 1-2px
        alpha: Math.random() * 0.3 + 0.3                        // 透明度 0.3-0.6
      });
    }
  }

  /** 动画帧循环 */
  function tick() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // 鼠标排斥力
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_FORCE;
        p.vx += (dx / dist) * force * 0.05;
        p.vy += (dy / dist) * force * 0.05;
      }

      // 速度阻尼
      p.vx *= 0.98;
      p.vy *= 0.98;

      // 更新位置
      p.x += p.vx;
      p.y += p.vy;

      // 边界反弹
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > width) { p.x = width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > height) { p.y = height; p.vy *= -1; }

      // 绘制粒子（天蓝色）
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14,165,233,' + p.alpha + ')';
      ctx.fill();

      // 连线 — 仅与后续粒子比较，避免重复
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const cx = p.x - q.x;
        const cy = p.y - q.y;
        const cd = Math.sqrt(cx * cx + cy * cy);
        if (cd < CONNECT_DIST) {
          const lineAlpha = (1 - cd / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(14,165,233,' + Math.max(lineAlpha, 0.08).toFixed(3) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(tick);
  }

  // 监听鼠标移动（相对于 Hero）
  hero.addEventListener('mousemove', function (e) {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  hero.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  }, { passive: true });

  // 窗口尺寸变化时重建
  window.addEventListener('resize', function () {
    resize();
    createParticles();
  }, { passive: true });

  resize();
  createParticles();
  tick();
})();

/* ============================================================
   2. 头部滚动 — 背景透明度过渡 + .scrolled 切换
   ============================================================ */
(function initHeaderScroll() {
  'use strict';

  const header = document.querySelector('.site-header') || document.querySelector('.header');
  if (!header) return;

  function onScroll() {
    const scrollY = window.scrollY;
    // 不透明度 0→1，在 80px 内完成过渡
    const opacity = Math.min(scrollY / 80, 1);
    header.style.setProperty('--nav-bg-opacity', opacity);

    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================================
   3. 移动端导航 — 汉堡菜单开关 + 关闭逻辑
   ============================================================ */
(function initMobileNav() {
  'use strict';

  const hamburger = document.querySelector('.nav-toggle') || document.querySelector('.hamburger');
  const nav = document.querySelector('.nav') || document.querySelector('.main-nav');
  const overlay = document.querySelector('.nav-overlay');
  const links = document.querySelectorAll('.nav a, .nav-links a, .main-nav a');

  if (!hamburger || !nav) return;

  function toggle() {
    const isActive = nav.classList.contains('active');
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = isActive ? '' : 'hidden';
  }

  function close() {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggle);

  if (overlay) overlay.addEventListener('click', close);

  links.forEach(function (link) {
    link.addEventListener('click', close);
  });
})();

/* ============================================================
   4. 滚动渐入动画 — IntersectionObserver + 交错延迟
   ============================================================ */
(function initScrollAnimations() {
  'use strict';

  const selectors = '.fade-in, .fade-in-left, .fade-in-right, .fade-in-delay-1, .fade-in-delay-2, .fade-in-delay-3';
  const elements = document.querySelectorAll(selectors);
  if (!elements.length) return;

  // 延迟映射（毫秒）
  const delayMap = {
    'fade-in-delay-1': 100,
    'fade-in-delay-2': 200,
    'fade-in-delay-3': 300
  };

  if (!('IntersectionObserver' in window)) {
    // 降级：直接显示
    elements.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const target = entry.target;
      let delay = 0;

      // 检查是否带有延迟类
      for (const cls in delayMap) {
        if (target.classList.contains(cls)) {
          delay = delayMap[cls];
          break;
        }
      }

      if (delay > 0) {
        setTimeout(function () { target.classList.add('visible'); }, delay);
      } else {
        target.classList.add('visible');
      }

      observer.unobserve(target);
    });
  }, { threshold: 0.15 });

  elements.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   5. 数字计数器 — data-count 属性动画，easeOutQuart 缓动
   ============================================================ */
(function initNumberCounter() {
  'use strict';

  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  /** 千分位格式化 */
  function formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /** 单个计数器动画 */
  function animate(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    const duration = 2000;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutQuart 缓动
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * target);

      el.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   6. Hero 视差滚动 — 内容上移 + 透明度衰减
   ============================================================ */
(function initHeroParallax() {
  'use strict';

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const content = hero.querySelector('.hero-content');
  if (!content) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;

    if (scrollY <= heroHeight) {
      // translateY 视差偏移
      content.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
      // 超过 Hero 高度后逐渐透明
      content.style.opacity = Math.max(1 - scrollY / heroHeight, 0);
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

/* ============================================================
   7. Hero Badge 淡入 — 延迟 300ms 后 600ms 过渡
   ============================================================ */
(function initBadgeFadeIn() {
  'use strict';

  const badge = document.querySelector('.hero .badge');
  if (!badge) return;

  // 初始隐藏状态
  badge.style.opacity = '0';
  badge.style.transform = 'translateY(8px)';
  badge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

  setTimeout(function () {
    badge.style.opacity = '1';
    badge.style.transform = 'translateY(0)';
  }, 300);
})();

/* ============================================================
   8. 当前区域导航高亮 — 滚动时匹配 section
   ============================================================ */
(function initActiveSectionHighlight() {
  'use strict';

  const sectionLinks = document.querySelectorAll('a[href^="#"]');
  if (!sectionLinks.length) return;

  // 构建 section 映射
  const sections = [];
  sectionLinks.forEach(function (link) {
    const id = link.getAttribute('href');
    if (id && id !== '#') {
      const section = document.querySelector(id);
      if (section) {
        sections.push({ el: section, link: link });
      }
    }
  });

  if (!sections.length) return;

  const header = document.querySelector('.site-header') || document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 64;
  let ticking = false;

  function update() {
    const scrollPos = window.scrollY + headerHeight + 100;
    let current = null;

    // 从后往前找第一个 offsetTop <= scrollPos 的区域
    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].el.offsetTop <= scrollPos) {
        current = sections[i];
        break;
      }
    }

    sectionLinks.forEach(function (l) { l.classList.remove('active'); });
    if (current) current.link.classList.add('active');

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();

/* ============================================================
   9. 锚点平滑滚动 — 考虑 64px 头部偏移
   ============================================================ */
(function initSmoothAnchorScroll() {
  'use strict';

  const HEADER_OFFSET = 64;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
})();

/* ============================================================
   10. 回到顶部按钮 — scrollY > 500 时显示
   ============================================================ */
(function initBackToTop() {
  'use strict';

  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  function onScroll() {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   11. 联系表单提交 — 阻止默认，显示成功提示
   ============================================================ */
(function initFormSubmit() {
  'use strict';

  const form = document.querySelector('.contact-form') || document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const success = document.querySelector('.form-success');
    if (success) {
      form.style.display = 'none';
      success.classList.add('show');
    } else {
      alert('感谢您的提交！我们将尽快与您联系。');
      form.reset();
    }
  });
})();

/* ============================================================
   12. 复制邮箱地址 — mailto 链接点击复制 + "已复制" 提示
   ============================================================ */
(function initCopyEmail() {
  'use strict';

  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (!emailLinks.length) return;

  // 创建浮动提示气泡
  const tooltip = document.createElement('span');
  tooltip.className = 'copy-tooltip';
  tooltip.textContent = '已复制';
  tooltip.style.cssText =
    'position:fixed;padding:4px 10px;background:rgba(14,165,233,0.9);color:#fff;font-size:12px;' +
    'border-radius:4px;pointer-events:none;opacity:0;transition:opacity 0.25s ease;' +
    'z-index:99999;transform:translateX(-50%);white-space:nowrap;';
  document.body.appendChild(tooltip);

  let tooltipTimer = null;

  function showTooltip(el) {
    const rect = el.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - 32) + 'px';
    tooltip.style.opacity = '1';

    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(function () {
      tooltip.style.opacity = '0';
    }, 1200);
  }

  emailLinks.forEach(function (el) {
    el.style.cursor = 'pointer';

    el.addEventListener('click', function (e) {
      e.preventDefault();
      const email = (el.getAttribute('href') || '').replace('mailto:', '');
      if (!email) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          showTooltip(el);
        });
      } else {
        // 降级方案
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.cssText = 'position:fixed;left:-9999px;';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showTooltip(el); } catch (_) { /* 忽略 */ }
        document.body.removeChild(ta);
      }
    });
  });
})();

/* ============================================================
   13. 图片懒加载 — IntersectionObserver + 200px 预加载
   ============================================================ */
(function initLazyLoad() {
  'use strict';

  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  if (!('IntersectionObserver' in window)) {
    // 降级：直接加载
    images.forEach(function (img) { img.src = img.getAttribute('data-src'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      img.src = img.getAttribute('data-src');

      // 如果有 data-srcset 也一并设置
      const srcset = img.getAttribute('data-srcset');
      if (srcset) img.srcset = srcset;

      img.addEventListener('load', function () {
        img.classList.add('loaded');
      });

      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
      observer.unobserve(img);
    });
  }, { rootMargin: '200px 0px', threshold: 0.01 });

  images.forEach(function (img) { observer.observe(img); });
})();

/* ============================================================
   14. 技术层逐层动画 — .tech-layer 按顺序 200ms 间隔入场
   ============================================================ */
(function initTechLayerAnimation() {
  'use strict';

  const container = document.querySelector('.tech-layers');
  if (!container) return;

  const layers = container.querySelectorAll('.tech-layer');
  if (!layers.length) return;

  if (!('IntersectionObserver' in window)) {
    layers.forEach(function (layer) { layer.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      // 找到当前容器内所有层，逐个延迟显示
      const parentLayers = entry.target.querySelectorAll
        ? entry.target.querySelectorAll('.tech-layer')
        : [entry.target];

      const targets = parentLayers.length ? parentLayers : layers;

      targets.forEach(function (layer, index) {
        setTimeout(function () {
          layer.classList.add('visible');
        }, index * 200);
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  // 观察容器本身，而非单个层
  observer.observe(container);
})();
