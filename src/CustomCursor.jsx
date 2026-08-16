import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRefs = useRef([]);
  
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const isHoverSupported = useRef(false);

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

      // Select magnetic elements (links, buttons, HUD widget, scroll icon)
      const targets = document.querySelectorAll('a, button, .magnetic-target, .hud, .scroll-icon');
      let closestDist = 99999;

      targets.forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = centerX - mx;
        const dy = centerY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Attraction threshold radius: 45px
        if (dist < 45) {
          if (dist < closestDist) {
            closestDist = dist;
            closestEl = el;

            // Pull strength decays as distance increases
            const pullRatio = 1 - (dist / 45);
            const strength = 0.55 * pullRatio;
            targetX = mx + (centerX - mx) * strength;
            targetY = my + (centerY - my) * strength;
          }
        }
      });

      // Update cursor position with spring animation
      xTo(targetX);
      yTo(targetY);

      // Update trail dot positions
      trailXTo.forEach(anim => anim(targetX));
      trailYTo.forEach(anim => anim(targetY));

      // Apply subtle physical pull to the magnetic elements themselves
      const prevMagnetics = document.querySelectorAll('.is-magnetic-active');
      prevMagnetics.forEach(el => {
        if (el !== closestEl) {
          el.classList.remove('is-magnetic-active');
          gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
        }
      });

      if (closestEl) {
        closestEl.classList.add('is-magnetic-active');
        const rect = closestEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Pull target element 20% of the distance to the mouse
        const pullX = (mx - centerX) * 0.20;
        const pullY = (my - centerY) * 0.20;
        gsap.to(closestEl, { x: pullX, y: pullY, duration: 0.3, overwrite: "auto" });
      }
    };

    // Custom hover state state matching
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

    // Velocity tracker in gsap.ticker loop (runs at 60 FPS)
    const updateVelocity = () => {
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      velocity.current = Math.sqrt(dx * dx + dy * dy);

      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;

      // Adjust particle trail opacity dynamically by mouse velocity
      // Fades out completely when mouse stops
      const targetOpacity = Math.min(Math.max((velocity.current - 3) / 17, 0), 1) * 0.4;
      trailRefs.current.forEach(dot => {
        if (dot) {
          gsap.to(dot, { opacity: targetOpacity, duration: 0.15, overwrite: "auto" });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    gsap.ticker.add(updateVelocity);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      gsap.ticker.remove(updateVelocity);

      // Clean up any remaining magnetic animations
      const prevMagnetics = document.querySelectorAll('.is-magnetic-active');
      prevMagnetics.forEach(el => {
        gsap.killTweensOf(el);
      });
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
