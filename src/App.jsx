import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CustomCursor } from './CustomCursor';
import TechOrb from './TechOrb';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ROLES = [
  { line1: "Software", line2: "Developer" },
  { line1: "Product", line2: "Builder" },
  { line1: "Fitness", line2: "Enthusiast" },
  { line1: "Curious", line2: "Mind" }
];

function App() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const scrimRef = useRef(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useGSAP(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();

    const initScrollTrigger = () => {
      const duration = video.duration;
      if (isNaN(duration) || duration === 0) return;

      // 1. Sync full-page scroll progress to background video currentTime
      const videoTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      videoTimeline.to(video, {
        currentTime: duration,
        ease: 'none'
      });

      // 2. Top Progress Bar Animation
      gsap.to(progressBarRef.current, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      // 3. Services Grid Card Entrances
      gsap.fromTo(".service-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".services-grid",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 4. Skills Section Scrim Opacity Rhythm (0 at top heading -> 1 solid over grid -> 0 approaching projects)
      if (scrimRef.current) {
        gsap.timeline({
          scrollTrigger: {
            trigger: "#stack",
            start: "top 60%",
            end: "bottom 35%",
            scrub: true
          }
        })
        .to(scrimRef.current, { opacity: 0, duration: 0.08 })
        .to(scrimRef.current, { opacity: 1, ease: "power1.inOut", duration: 0.35 })
        .to(scrimRef.current, { opacity: 1, duration: 0.42 })
        .to(scrimRef.current, { opacity: 0, ease: "power1.inOut", duration: 0.15 });
      }

      // 5. Skills Section Reveal Animations
      gsap.fromTo(".skills-header-animate",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#stack",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(".skill-card-animate",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".skills-wrapper",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(".outro-animate",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".skills-outro-banner",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 7. Portfolio Showcase Cards Entrance
      gsap.fromTo(".project-card",
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    };

    if (video.readyState >= 1) {
      initScrollTrigger();
    } else {
      video.addEventListener('loadedmetadata', initScrollTrigger);
    }

    return () => {
      video.removeEventListener('loadedmetadata', initScrollTrigger);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: containerRef });

  // Glitch-free 2-line title animation cycle
  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      }
    });

    // 1. Entrance: Line 1 enters from top (-100%), Line 2 enters from bottom (100%)
    tl.fromTo(".line-1-word",
      { yPercent: -100, opacity: 0, rotateX: 15 },
      { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.85, ease: "back.out(1.3)" }
    );

    tl.fromTo(".line-2-word",
      { yPercent: 100, opacity: 0, rotateX: -15 },
      { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.85, ease: "back.out(1.3)" },
      "<"
    );

    // 2. Hold text on screen
    tl.to({}, { duration: 3.2 });

    // 3. Exit: Line 1 exits down (100%), Line 2 exits up (-100%)
    tl.to(".line-1-word", {
      yPercent: 100,
      opacity: 0,
      rotateX: -15,
      duration: 0.65,
      ease: "power2.inOut"
    });

    tl.to(".line-2-word", {
      yPercent: -100,
      opacity: 0,
      rotateX: 15,
      duration: 0.65,
      ease: "power2.inOut"
    }, "<");

  }, { dependencies: [roleIndex], scope: containerRef });

  return (
    <div ref={containerRef} className="scroll-container">
      {/* Fixed Page Background Layer */}
      <div className="fixed-background-layer" />

      {/* Premium Custom Cursor System */}
      <CustomCursor />

      {/* Top progress bar */}
      <div ref={progressBarRef} className="progress-bar"></div>

      {/* Background Video Wrapper */}
      <div className="video-wrapper">
        <div className="overlay"></div>
        <video
          ref={videoRef}
          src="/hero-optimized-1080p.mp4"
          type="video/mp4"
          playsInline
          muted
          preload="auto"
        />
      </div>

      {/* Fixed Navigation Header */}
      <header className="header-nav">
        <div className="nav-container">
          <div className="logo magnetic-target">Yashwanth</div>
          <nav className="nav-links">
            <a href="#home" className="nav-item magnetic-target">Home</a>
            <a href="#stack" className="nav-item magnetic-target">Stack</a>
            <a href="#projects" className="nav-item magnetic-target">Projects</a>
          </nav>
          <button className="btn-get-touch magnetic-target">
            <span>Get in touch</span>
            <div className="arrow-circle">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* Scrollable Layout Content (Full-Bleed 100vw) */}
      <main className="layout-content">

        {/* Section 1: Hero */}
        <section id="home" className="hero-section-content">
          <div className="hero-inner">
            <div className="hero-grid">

              {/* Main Headline */}
              <div className="hero-headline-wrapper hero-animate">
                <span className="hero-subtitle">Hey, I'm a</span>
                <h2 className="hero-main-title">
                  <span className="title-line-mask">
                    <span className="title-word line-1-word">{ROLES[roleIndex].line1}</span>
                  </span>
                  <span className="title-line-mask">
                    <span className="title-word line-2-word">{ROLES[roleIndex].line2}</span>
                  </span>
                </h2>
              </div>

              {/* Mission Statement Block */}
              <div className="hero-mission hero-animate">
                <p className="mission-text">
                  Ideas deserve to become products.
                </p>
                <p className="mission-subtext">
                  From concept to deployment, I enjoy building intelligent systems that people can actually use .
                </p>
              </div>

              {/* Services List Grid */}
              <div className="services-grid">
                <div className="service-card">
                  <span className="service-num">#01</span>
                  <span className="service-title">Full-Stack Development</span>
                </div>
                <div className="service-card">
                  <span className="service-num">#02</span>
                  <span className="service-title">AI Engineering</span>
                </div>
                <div className="service-card">
                  <span className="service-num">#03</span>
                  <span className="service-title">Backend Architecture</span>
                </div>
                <div className="service-card">
                  <span className="service-num">#04</span>
                  <span className="service-title">Product Development</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2: SKILLS / STACK ("WHAT'S UNDER THE HOOD?") */}
        <section id="stack" className="skills-section">
          {/* Scroll-Driven Scrim Overlay */}
          <div ref={scrimRef} className="skills-scrim" />

          <div className="skills-inner">

            {/* Section Header */}
            <div className="skills-header">
              <span className="skills-subtitle skills-header-animate">MY STACK</span>
              <h2 className="skills-main-title skills-header-animate">
                WHAT'S UNDER<br />THE HOOD?
              </h2>
              <p className="skills-intro-text skills-header-animate">
                "I don't just use tools. I build with them."
              </p>
            </div>

          {/* Master 3-Column Layout: Left Cards | Center Rotating Wheel | Right Cards */}
          <div className="skills-wrapper">

            {/* Left Column (4 Cards) */}
            <div className="skills-col skills-col-left">

              {/* Card 01 */}
              <div className="skill-card skill-card-animate magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">01</span>
                  <span className="skill-card-title">LANGUAGES</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag">JavaScript</span>
                  <span className="skill-tag">C++</span>
                  <span className="skill-tag">Java</span>
                  <span className="skill-tag">SQL</span>
                </div>
              </div>

              {/* Card 02 */}
              <div className="skill-card skill-card-animate magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">02</span>
                  <span className="skill-card-title">FRONTEND</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag">React.js</span>
                  <span className="skill-tag">Next.js</span>
                  <span className="skill-tag">HTML</span>
                  <span className="skill-tag">CSS</span>
                  <span className="skill-tag">Tailwind CSS</span>
                  <span className="skill-tag">Bootstrap</span>
                </div>
              </div>

              {/* Card 05 */}
              <div className="skill-card skill-card-animate magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">05</span>
                  <span className="skill-card-title">AI / ML</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag">Pandas</span>
                  <span className="skill-tag">scikit-learn</span>
                  <span className="skill-tag">NLTK</span>
                  <span className="skill-tag">TensorFlow</span>
                  <span className="skill-tag">Vosk</span>
                </div>
              </div>

              {/* Card 06 */}
              <div className="skill-card skill-card-animate magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">06</span>
                  <span className="skill-card-title">BLOCKCHAIN</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag">Solidity</span>
                  <span className="skill-tag">Ether.js</span>
                  <span className="skill-tag">MetaMask</span>
                </div>
              </div>

            </div>

            {/* Centerpiece: 3D Rotating Tech Globe (Three.js) + Circuit Connections */}
            <div className="skills-centerpiece skill-card-animate">
              
              {/* Radial Soft Glass Backplate */}
              <div className="wheel-glass-backplate"></div>

              {/* 3D Tech Globe Component (Three.js WebGL Renderer) */}
              <TechOrb />

              {/* Electric Current SVG Lines connecting Globe to Cards */}
              <div className="technical-wheel-container">
                <svg className="technical-wheel-svg" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="electricOrangePulse" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff5722" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ff007f" stopOpacity="1" />
                    </linearGradient>
                  </defs>

                  <g className="filament-lines">
                    {/* Path 1: Top Left Card 01 */}
                    <path d="M 126 126 L 100 130" stroke="rgba(226, 232, 240, 0.18)" strokeWidth="1.2" />
                    <path d="M 126 126 L 100 130" stroke="url(#electricOrangePulse)" strokeWidth="2.2" className="pulse-line pulse-line-1" strokeLinecap="round" />
                    <circle cx="100" cy="130" r="3" fill="#ff5722" />

                    {/* Path 2: Mid Left Card 02 */}
                    <path d="M 62 230 L 80 230" stroke="rgba(226, 232, 240, 0.18)" strokeWidth="1.2" />
                    <path d="M 62 230 L 80 230" stroke="url(#electricOrangePulse)" strokeWidth="2.2" className="pulse-line pulse-line-2" strokeLinecap="round" />
                    <circle cx="80" cy="230" r="3" fill="#ff007f" />

                    {/* Path 3: Lower Left Card 05 */}
                    <path d="M 62 370 L 80 370" stroke="rgba(226, 232, 240, 0.18)" strokeWidth="1.2" />
                    <path d="M 62 370 L 80 370" stroke="url(#electricOrangePulse)" strokeWidth="2.2" className="pulse-line pulse-line-3" strokeLinecap="round" />
                    <circle cx="80" cy="370" r="3" fill="#ff5722" />

                    {/* Path 4: Bottom Left Card 06 */}
                    <path d="M 126 474 L 100 470" stroke="rgba(226, 232, 240, 0.18)" strokeWidth="1.2" />
                    <path d="M 126 474 L 100 470" stroke="url(#electricOrangePulse)" strokeWidth="2.2" className="pulse-line pulse-line-4" strokeLinecap="round" />
                    <circle cx="100" cy="470" r="3" fill="#ff007f" />

                    {/* Path 5: Top Right Card 03 */}
                    <path d="M 474 126 L 500 130" stroke="rgba(226, 232, 240, 0.18)" strokeWidth="1.2" />
                    <path d="M 474 126 L 500 130" stroke="url(#electricOrangePulse)" strokeWidth="2.2" className="pulse-line pulse-line-5" strokeLinecap="round" />
                    <circle cx="500" cy="130" r="3" fill="#ff5722" />

                    {/* Path 6: Mid Right Card 04 */}
                    <path d="M 538 230 L 520 230" stroke="rgba(226, 232, 240, 0.18)" strokeWidth="1.2" />
                    <path d="M 538 230 L 520 230" stroke="url(#electricOrangePulse)" strokeWidth="2.2" className="pulse-line pulse-line-6" strokeLinecap="round" />
                    <circle cx="520" cy="230" r="3" fill="#ff007f" />

                    {/* Path 7: Lower Right Card 07 */}
                    <path d="M 538 370 L 520 370" stroke="rgba(226, 232, 240, 0.18)" strokeWidth="1.2" />
                    <path d="M 538 370 L 520 370" stroke="url(#electricOrangePulse)" strokeWidth="2.2" className="pulse-line pulse-line-7" strokeLinecap="round" />
                    <circle cx="520" cy="370" r="3" fill="#ff5722" />

                    {/* Path 8: Bottom Right Card 08 */}
                    <path d="M 474 474 L 500 470" stroke="rgba(226, 232, 240, 0.18)" strokeWidth="1.2" />
                    <path d="M 474 474 L 500 470" stroke="url(#electricOrangePulse)" strokeWidth="2.2" className="pulse-line pulse-line-8" strokeLinecap="round" />
                    <circle cx="500" cy="470" r="3" fill="#ff007f" />
                  </g>
                </svg>
              </div>

            </div>

            {/* Right Column (4 Cards) */}
            <div className="skills-col skills-col-right">

              {/* Card 03 */}
              <div className="skill-card skill-card-animate magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">03</span>
                  <span className="skill-card-title">BACKEND</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">Express.js</span>
                  <span className="skill-tag">FastAPI</span>
                </div>
              </div>

              {/* Card 04 */}
              <div className="skill-card skill-card-animate magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">04</span>
                  <span className="skill-card-title">DATABASES</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag">MongoDB</span>
                  <span className="skill-tag">PostgreSQL</span>
                </div>
              </div>

              {/* Card 07 */}
              <div className="skill-card skill-card-animate magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">07</span>
                  <span className="skill-card-title">TOOLS & TECHNOLOGIES</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag">Git</span>
                  <span className="skill-tag">Docker</span>
                  <span className="skill-tag">Cloudinary</span>
                  <span className="skill-tag">Google Colab</span>
                  <span className="skill-tag">Claude Code</span>
                </div>
              </div>

              {/* Card 08 */}
              <div className="skill-card skill-card-animate magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">08</span>
                  <span className="skill-card-title">METHODOLOGIES</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag">Agile</span>
                  <span className="skill-tag">SDLC</span>
                </div>
              </div>

            </div>

            </div>

          </div>

          {/* Outro Transition Banner to Projects Section */}
          <div className="skills-outro-banner outro-animate">
            <span className="outro-subtitle">NOW LET ME SHOW YOU</span>
            <h3 className="outro-main-title">WHAT I'VE BUILT.</h3>
          </div>

        </section>

        {/* Section 4: Projects Showcase Grid */}
        <section id="projects" className="projects-section">
          <div className="projects-inner">
            <div className="projects-grid">

              <div className="project-card magnetic-target">
                <div className="project-image-wrapper">
                  <img src="/puffer-jacket.png" alt="Black puffer jacket" />
                </div>
              </div>

              <div className="project-card magnetic-target">
                <div className="project-image-wrapper">
                  <img src="/headphones.png" alt="Minimalist headphones editorial" />
                </div>
              </div>

              <div className="project-card magnetic-target">
                <div className="project-image-wrapper">
                  <img src="/cosmetic-bottle.png" alt="Cosmetic glass dropper bottle" />
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

    </div>
  );
}

export default App;
