import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRefs = useRef([]);
  
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const isHoverSupported = useRef(false);
  const activeMagneticRef = useRef(null);
  const targetsCacheRef = useRef([]);

  const [hoverState, setHoverState] = useState(null); // 'button' | 'link' | null

  useEffect(() => {
    // Check if device supports hover interactions (exclude mobile/tablet devices)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    isHoverSupported.current = mediaQuery.matches;

    if (!isHoverSupported.current) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Set initial position out of view to prevent pop-in
    gsap.set(cursor, { x: -100, y: -100, opacity: 0 });
    trailRefs.current.forEach(dot => {
      if (dot) gsap.set(dot, { x: -100, y: -100, opacity: 0 });
    });

    let hasMoved = false;

    // Create quickTo animators for smooth spring-like translation
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power2.out" });

    // Staggered quickTo animators for the trail dots (more delay for later dots)
    const trailXTo = trailRefs.current.map((dot, i) => 
      gsap.quickTo(dot, "x", { duration: 0.08 * (i + 1), ease: "power2.out" })
    );
    const trailYTo = trailRefs.current.map((dot, i) => 
      gsap.quickTo(dot, "y", { duration: 0.08 * (i + 1), ease: "power2.out" })
    );

    // Cache magnetic targets and their geometries to eliminate layout thrashing
    const updateMagneticCache = () => {
      const elements = document.querySelectorAll('a, button, .magnetic-target, .hud, .scroll-icon');
      const cache = [];
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Ignore hidden / zero-sized elements
        if (rect.width === 0 && rect.height === 0) return;
        cache.push({
          el,
          // Store document coordinates
          docCenterX: rect.left + scrollX + rect.width / 2,
          docCenterY: rect.top + scrollY + rect.height / 2,
          width: rect.width,
          height: rect.height
        });
      });
      targetsCacheRef.current = cache;
    };

    // Initial cache populate
    updateMagneticCache();

    // Schedule throttled updates on scroll / resize / DOM changes
    let cacheUpdatePending = false;
    const scheduleCacheUpdate = () => {
      if (!cacheUpdatePending) {
        cacheUpdatePending = true;
        requestAnimationFrame(() => {
          updateMagneticCache();
          cacheUpdatePending = false;
        });
      }
    };

    const handleMouseMove = (e) => {
      const mx = e.clientX;
      const my = e.clientY;
      mouse.current = { x: mx, y: my };

      if (!hasMoved) {
        hasMoved = true;
        gsap.to(cursor, { opacity: 1, duration: 0.25 });
      }

      let targetX = mx;
      let targetY = my;
      let closestEl = null;
      let closestCenterX = 0;
      let closestCenterY = 0;

      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      const pageMouseX = mx + scrollX;
      const pageMouseY = my + scrollY;

      const targets = targetsCacheRef.current;
      let closestDist = 99999;

      // Pure memory loop - ZERO DOM reads / layout thrashing
      for (let i = 0; i < targets.length; i++) {
        const item = targets[i];
        const dx = item.docCenterX - pageMouseX;
        const dy = item.docCenterY - pageMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Attraction threshold radius: 45px
        if (dist < 45 && dist < closestDist) {
          closestDist = dist;
          closestEl = item.el;
          // Viewport relative center
          closestCenterX = item.docCenterX - scrollX;
          closestCenterY = item.docCenterY - scrollY;

          // Pull strength decays as distance increases
          const pullRatio = 1 - (dist / 45);
          const strength = 0.55 * pullRatio;
          targetX = mx + (closestCenterX - mx) * strength;
          targetY = my + (closestCenterY - my) * strength;
        }
      }

      // Update cursor position with spring animation
      xTo(targetX);
      yTo(targetY);

      // Update trail dot positions
      for (let i = 0; i < trailXTo.length; i++) {
        trailXTo[i](targetX);
        trailYTo[i](targetY);
      }

      // Manage magnetic pull on active element via direct ref (zero querySelectorAll)
      const prevActive = activeMagneticRef.current;
      if (prevActive && prevActive !== closestEl) {
        prevActive.classList.remove('is-magnetic-active');
        gsap.to(prevActive, { x: 0, y: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        activeMagneticRef.current = null;
      }

      if (closestEl) {
        if (prevActive !== closestEl) {
          closestEl.classList.add('is-magnetic-active');
          activeMagneticRef.current = closestEl;
        }
        // Pull target element 20% of the distance to the mouse
        const pullX = (mx - closestCenterX) * 0.20;
        const pullY = (my - closestCenterY) * 0.20;
        gsap.to(closestEl, { x: pullX, y: pullY, duration: 0.3, overwrite: "auto" });
      }
    };

    // Custom hover state state matching via fast event delegation
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .magnetic-target, .scroll-icon, .hud');
      if (!target) {
        setHoverState(null);
        return;
      }
      
      const isButton = 
        target.tagName === 'BUTTON' || 
        target.classList.contains('counter') || 
        target.classList.contains('scroll-icon') ||
        target.classList.contains('hud');
        
      if (isButton) {
        setHoverState('button');
      } else if (target.tagName === 'A') {
        setHoverState('link');
      }
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.75, duration: 0.1, ease: "power2.out" });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" });
    };

    // Velocity tracker in gsap.ticker loop (runs at refresh rate)
    const updateVelocity = () => {
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      velocity.current = Math.sqrt(dx * dx + dy * dy);

      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;

      // Adjust particle trail opacity dynamically by mouse velocity
      // Fades out completely when mouse stops
      const targetOpacity = Math.min(Math.max((velocity.current - 3) / 17, 0), 1) * 0.4;
      const trail = trailRefs.current;
      for (let i = 0; i < trail.length; i++) {
        const dot = trail[i];
        if (dot) {
          gsap.to(dot, { opacity: targetOpacity, duration: 0.15, overwrite: "auto" });
        }
      }
    };

    // MutationObserver to refresh magnetic cache when projects expand/collapse or DOM updates
    const observer = new MutationObserver(() => {
      scheduleCacheUpdate();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('resize', scheduleCacheUpdate, { passive: true });
    window.addEventListener('scroll', scheduleCacheUpdate, { passive: true });
    gsap.ticker.add(updateVelocity);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', scheduleCacheUpdate);
      window.removeEventListener('scroll', scheduleCacheUpdate);
      gsap.ticker.remove(updateVelocity);
      observer.disconnect();

      if (activeMagneticRef.current) {
        gsap.killTweensOf(activeMagneticRef.current);
        gsap.set(activeMagneticRef.current, { x: 0, y: 0 });
      }
    };
  }, []);

  // Server-side safety check and mobile device escape hatch
  if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      <div 
        ref={cursorRef} 
        className={`custom-cursor ${
          hoverState === 'button' ? 'hover-button' : 
          hoverState === 'link' ? 'hover-link' : ''
        }`}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={i} 
          ref={el => trailRefs.current[i] = el} 
          className="cursor-trail-dot"
        />
      ))}
    </>
  );
}
