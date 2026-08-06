import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CustomCursor } from './CustomCursor';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  useGSAP(() => {
    const video = videoRef.current;
    if (!video) return;

    // Forces video to load metadata
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
          scrub: 1.0, // Smooth interpolation lag
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Direct DOM updates for 60fps top progress bar
            const progressPercent = Math.round(self.progress * 100);
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${progressPercent}%`;
            }
          },
        },
      });

      videoTimeline.fromTo(
        video,
        { currentTime: 0 },
        { currentTime: duration, ease: 'none' }
      );

      // 2. Hero Section Element Entrances (Plays immediately on load)
      gsap.fromTo(".hero-animate",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power3.out" }
      );

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

      // 4. Brand Logos Grid Entrance
      gsap.fromTo(".brand-animate",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".brands-strip",
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 5. Behind the Designs (About Section) Entrance
      gsap.fromTo(".about-animate",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 6. Portfolio Showcase Cards Entrance
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

  return (
    <div ref={containerRef} className="scroll-container">
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
            <a href="#about" className="nav-item magnetic-target">About</a>
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

      {/* Scrollable Layout Content */}
      <main className="layout-content">

        {/* Section 1: Hero */}
        <section id="home" className="hero-section-content">
          <div className="hero-grid">

            {/* Main Headline */}
            <div className="hero-headline-wrapper hero-animate">
              <span className="hero-subtitle">Hey, I'm a</span>
              <h2 className="hero-main-title">Software<br />Developer</h2>
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
        </section>

        {/* Section 2: Brand Strip */}
        <section className="brands-strip">
          <div className="brands-container">
            <div className="brands-grid">

              <div className="brand-item brand-animate magnetic-target">
                <div className="brand-logo-icon circle-icon"></div>
                <span>Supa Blox</span>
              </div>

              <div className="brand-item brand-animate magnetic-target">
                <div className="brand-logo-icon triangle-icon"></div>
                <span>Hype Blox</span>
              </div>

              <div className="brand-item brand-animate magnetic-target">
                <div className="brand-logo-icon half-circle-icon"></div>
                <span>Frame Blox</span>
              </div>

              <div className="brand-item brand-animate magnetic-target">
                <div className="brand-logo-icon double-circle-icon"></div>
                <span>Ultra Blox</span>
              </div>

            </div>
            <p className="brands-subheading">Trusted by Brands I've Helped Shape</p>
          </div>
        </section>

        {/* Section 3: Behind the Designs (About/Work Details) */}
        <section id="about" className="about-section">
          <div className="about-container">

            <div className="about-left-col about-animate">
              <span className="about-tag">Behind the Designs</span>
              <h3 className="about-title">
                Shaping Experiences That Make Life Simpler
              </h3>
            </div>

            <div className="about-right-col about-animate">
              <p className="about-description">
                I'm a product designer focused on building clean, intuitive interfaces that solve real-world problems.
              </p>

              <div className="about-action-group">
                <a href="#projects" className="about-link-action magnetic-target">
                  Let's Build Something Meaningful Together
                </a>
                <button className="btn-get-touch magnetic-target orange-btn">
                  <span>Get in touch</span>
                  <div className="arrow-circle">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Section 4: Projects Showcase Grid */}
        <section id="projects" className="projects-section">
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
        </section>

      </main>

      {/* Scroll indicator prompt */}
      <div className="scroll-indicator">
        <span>Scroll Down to Explore</span>
        <div className="scroll-icon"></div>
      </div>
    </div>
  );
}

export default App;
