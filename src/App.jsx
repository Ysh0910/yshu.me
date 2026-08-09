import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TechOrb from './TechOrb';
import { CustomCursor } from './CustomCursor';
import { PROJECTS_DATA, DEFAULT_PROJECT_IMAGE } from './data/projectsData';
import {
  SiPython, SiJavascript, SiCplusplus, SiReact, SiNextdotjs, SiHtml5,
  SiTailwindcss, SiBootstrap, SiNodedotjs, SiExpress, SiFastapi, SiMongodb,
  SiPostgresql, SiPandas, SiScikitlearn, SiTensorflow, SiSolidity, SiEthereum,
  SiGit, SiDocker, SiCloudinary, SiGooglecolab, SiAnthropic
} from 'react-icons/si';
import { TbBrandCss3 } from 'react-icons/tb';
import { FaJava, FaDatabase, FaDiagramProject, FaCodeBranch } from 'react-icons/fa6';
import { FiExternalLink, FiGithub, FiChevronDown, FiChevronUp } from 'react-icons/fi';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTouchCardId, setActiveTouchCardId] = useState(null);

  const displayedProjects = isExpanded ? PROJECTS_DATA : PROJECTS_DATA.slice(0, 4);

  const handleCardTouch = (id) => {
    setActiveTouchCardId((prev) => (prev === id ? null : id));
  };

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
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".skills-outro-banner",
            start: "top 92%",
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

  // 2-line center-split baseline blink animation cycle
  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      }
    });

    // 1. ENTRANCE: Words expand out from the middle line (Line 1 expands UP, Line 2 expands DOWN)
    tl.fromTo(".line-1-word",
      { yPercent: 100, opacity: 0, rotateX: 10 },
      { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.85, ease: "power2.out" }
    );

    tl.fromTo(".line-2-word",
      { yPercent: -100, opacity: 0, rotateX: -10 },
      { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.85, ease: "power2.out" },
      "<"
    );

    // 2. HOLD text on screen
    tl.to({}, { duration: 3.2 });

    // 3. EXIT: Words collapse into the middle line (Line 1 collapses DOWN, Line 2 collapses UP)
    tl.to(".line-1-word", {
      yPercent: 100,
      opacity: 0,
      rotateX: -10,
      duration: 0.65,
      ease: "power2.inOut"
    });

    tl.to(".line-2-word", {
      yPercent: -100,
      opacity: 0,
      rotateX: 10,
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
              <div className="skill-card skill-card-animate skill-card-charge-1 magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">01</span>
                  <span className="skill-card-title">LANGUAGES</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag"><SiPython /> Python</span>
                  <span className="skill-tag"><SiJavascript /> JavaScript</span>
                  <span className="skill-tag"><SiCplusplus /> C++</span>
                  <span className="skill-tag"><FaJava /> Java</span>
                  <span className="skill-tag"><FaDatabase /> SQL</span>
                </div>
              </div>

              {/* Card 02 */}
              <div className="skill-card skill-card-animate skill-card-charge-2 magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">02</span>
                  <span className="skill-card-title">FRONTEND</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag"><SiReact /> React.js</span>
                  <span className="skill-tag"><SiNextdotjs /> Next.js</span>
                  <span className="skill-tag"><SiHtml5 /> HTML</span>
                  <span className="skill-tag"><TbBrandCss3 /> CSS</span>
                  <span className="skill-tag"><SiTailwindcss /> Tailwind CSS</span>
                  <span className="skill-tag"><SiBootstrap /> Bootstrap</span>
                </div>
              </div>

              {/* Card 05 */}
              <div className="skill-card skill-card-animate skill-card-charge-3 magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">05</span>
                  <span className="skill-card-title">AI / ML</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag"><SiPandas /> Pandas</span>
                  <span className="skill-tag"><SiScikitlearn /> scikit-learn</span>
                  <span className="skill-tag"><SiPython /> NLTK</span>
                  <span className="skill-tag"><SiTensorflow /> TensorFlow</span>
                  <span className="skill-tag">Vosk</span>
                </div>
              </div>

              {/* Card 06 */}
              <div className="skill-card skill-card-animate skill-card-charge-4 magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">06</span>
                  <span className="skill-card-title">BLOCKCHAIN</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag"><SiSolidity /> Solidity</span>
                  <span className="skill-tag"><SiEthereum /> Ether.js</span>
                  <span className="skill-tag"><SiEthereum /> MetaMask</span>
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
                    <linearGradient id="electricSilverPulse" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  <g className="filament-lines">
                    {/* Path 1: Top Left Card 01 */}
                    <path d="M 165 165 L -30 65" stroke="rgba(226, 232, 240, 0.22)" strokeWidth="1.5" />
                    <path d="M 165 165 L -30 65" stroke="url(#electricSilverPulse)" strokeWidth="2.5" className="pulse-line pulse-line-1" strokeLinecap="round" />
                    <circle cx="-30" cy="65" r="3.5" fill="#ffffff" />

                    {/* Path 2: Mid Left Card 02 */}
                    <path d="M 111 249 L -30 200" stroke="rgba(226, 232, 240, 0.22)" strokeWidth="1.5" />
                    <path d="M 111 249 L -30 200" stroke="url(#electricSilverPulse)" strokeWidth="2.5" className="pulse-line pulse-line-2" strokeLinecap="round" />
                    <circle cx="-30" cy="200" r="3.5" fill="#e2e8f0" />

                    {/* Path 3: Lower Left Card 05 */}
                    <path d="M 111 351 L -30 400" stroke="rgba(226, 232, 240, 0.22)" strokeWidth="1.5" />
                    <path d="M 111 351 L -30 400" stroke="url(#electricSilverPulse)" strokeWidth="2.5" className="pulse-line pulse-line-3" strokeLinecap="round" />
                    <circle cx="-30" cy="400" r="3.5" fill="#ffffff" />

                    {/* Path 4: Bottom Left Card 06 */}
                    <path d="M 165 435 L -30 535" stroke="rgba(226, 232, 240, 0.22)" strokeWidth="1.5" />
                    <path d="M 165 435 L -30 535" stroke="url(#electricSilverPulse)" strokeWidth="2.5" className="pulse-line pulse-line-4" strokeLinecap="round" />
                    <circle cx="-30" cy="535" r="3.5" fill="#e2e8f0" />

                    {/* Path 5: Top Right Card 03 */}
                    <path d="M 435 165 L 630 65" stroke="rgba(226, 232, 240, 0.22)" strokeWidth="1.5" />
                    <path d="M 435 165 L 630 65" stroke="url(#electricSilverPulse)" strokeWidth="2.5" className="pulse-line pulse-line-5" strokeLinecap="round" />
                    <circle cx="630" cy="65" r="3.5" fill="#ffffff" />

                    {/* Path 6: Mid Right Card 04 */}
                    <path d="M 489 249 L 630 200" stroke="rgba(226, 232, 240, 0.22)" strokeWidth="1.5" />
                    <path d="M 489 249 L 630 200" stroke="url(#electricSilverPulse)" strokeWidth="2.5" className="pulse-line pulse-line-6" strokeLinecap="round" />
                    <circle cx="630" cy="200" r="3.5" fill="#e2e8f0" />

                    {/* Path 7: Lower Right Card 07 */}
                    <path d="M 489 351 L 630 400" stroke="rgba(226, 232, 240, 0.22)" strokeWidth="1.5" />
                    <path d="M 489 351 L 630 400" stroke="url(#electricSilverPulse)" strokeWidth="2.5" className="pulse-line pulse-line-7" strokeLinecap="round" />
                    <circle cx="630" cy="400" r="3.5" fill="#ffffff" />

                    {/* Path 8: Bottom Right Card 08 */}
                    <path d="M 435 435 L 630 535" stroke="rgba(226, 232, 240, 0.22)" strokeWidth="1.5" />
                    <path d="M 435 435 L 630 535" stroke="url(#electricSilverPulse)" strokeWidth="2.5" className="pulse-line pulse-line-8" strokeLinecap="round" />
                    <circle cx="630" cy="535" r="3.5" fill="#e2e8f0" />
                  </g>
                </svg>
              </div>

            </div>

            {/* Right Column (4 Cards) */}
            <div className="skills-col skills-col-right">

              {/* Card 03 */}
              <div className="skill-card skill-card-animate skill-card-charge-5 magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">03</span>
                  <span className="skill-card-title">BACKEND</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag"><SiNodedotjs /> Node.js</span>
                  <span className="skill-tag"><SiExpress /> Express.js</span>
                  <span className="skill-tag"><SiFastapi /> FastAPI</span>
                </div>
              </div>

              {/* Card 04 */}
              <div className="skill-card skill-card-animate skill-card-charge-6 magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">04</span>
                  <span className="skill-card-title">DATABASES</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag"><SiMongodb /> MongoDB</span>
                  <span className="skill-tag"><SiPostgresql /> PostgreSQL</span>
                </div>
              </div>

              {/* Card 07 */}
              <div className="skill-card skill-card-animate skill-card-charge-7 magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">07</span>
                  <span className="skill-card-title">TOOLS & TECHNOLOGIES</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag"><SiGit /> Git</span>
                  <span className="skill-tag"><SiDocker /> Docker</span>
                  <span className="skill-tag"><SiCloudinary /> Cloudinary</span>
                  <span className="skill-tag"><SiGooglecolab /> Google Colab</span>
                  <span className="skill-tag"><SiAnthropic /> Claude Code</span>
                </div>
              </div>

              {/* Card 08 */}
              <div className="skill-card skill-card-animate skill-card-charge-8 magnetic-target">
                <div className="skill-card-header">
                  <span className="skill-card-num">08</span>
                  <span className="skill-card-title">METHODOLOGIES</span>
                </div>
                <div className="skill-tags-wrapper">
                  <span className="skill-tag"><FaDiagramProject /> Agile</span>
                  <span className="skill-tag"><FaCodeBranch /> SDLC</span>
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

        {/* Section 4: Projects Showcase Grid (#070912 Ink-Blue Theme) */}
        <section id="projects" className="projects-section">
          <div className="projects-inner">
            <div className="projects-grid">
              {displayedProjects.map((project) => {
                const isActive = activeTouchCardId === project.id;
                return (
                  <div
                    key={project.id}
                    className={`f1-project-card magnetic-target ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleCardTouch(project.id)}
                  >
                    {/* Main Clipped Image & Curtain Container (Notched Corner Shape) */}
                    <div className="f1-card-image-box">
                      <img
                        src={project.image || DEFAULT_PROJECT_IMAGE}
                        alt={project.name}
                        className="f1-card-image"
                      />

                      {/* Curtain Slide-Down Reveal Overlay (Slides down INSIDE the notched shape) */}
                      <div className="f1-card-curtain">
                        <div className="curtain-header-block">
                          <h4 className="curtain-project-name">{project.name}</h4>
                          <p className="curtain-desc">{project.description}</p>
                        </div>

                        <div className="curtain-contrib-block">
                          <span className="curtain-contrib-label">Key Contribution</span>
                          <span className="curtain-contrib-text">{project.contribution}</span>
                        </div>

                        <div className="curtain-actions">
                          <a href={project.liveUrl} className="btn-project-action btn-live" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
                            <span>Live Demo</span>
                            <FiExternalLink />
                          </a>
                          <a href={project.githubUrl} className="btn-project-action btn-github" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
                            <span>GitHub</span>
                            <FiGithub />
                          </a>
                        </div>
                      </div>

                      {/* Card Footer Bar inside Notched Frame */}
                      <div className="f1-card-footer">
                        <h3 className="f1-card-title">{project.name}</h3>
                        <span className={`f1-status-badge ${project.team === 'solo' ? 'badge-solo' : 'badge-team'}`}>
                          {project.team === 'solo' ? 'Solo Build' : 'Team Build'}
                        </span>
                      </div>
                    </div>

                    {/* Absolute Responsive SVG Border Outline Overlay */}
                    <svg className="f1-card-svg-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d="M 5,2 L 95,2 A 4,4 0 0 1 99,6 L 99,95 A 4,4 0 0 1 95,99 L 64,99 C 57,99 55,92 48,92 L 5,92 A 4,4 0 0 1 1,88 L 1,6 A 4,4 0 0 1 5,2 Z"
                        vectorEffect="non-scaling-stroke"
                        stroke="rgba(226, 189, 209, 0.4)"
                        strokeWidth="1.8"
                        fill="none"
                      />
                    </svg>
                  </div>
                );
              })}
            </div>

            {/* "See All Projects" Expansion Button */}
            <div className="btn-see-all-wrapper">
              <button
                className="btn-see-all-projects magnetic-target"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                <span>{isExpanded ? 'Show Less' : 'See All Projects'}</span>
                {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
          </div>
        </section>


      </main>

    </div>
  );
}

export default App;
