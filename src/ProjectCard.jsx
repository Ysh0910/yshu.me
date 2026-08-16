import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import "./project-card.css";

const SPRING = { type: "spring", stiffness: 300, damping: 30 };

// Helper to determine grid column index for left-to-right staggered wave
function getColIndex(idx) {
  if (typeof window === "undefined") return idx % 4;
  const w = window.innerWidth;
  if (w <= 599) return 0;       // 1 column layout
  if (w <= 899) return idx % 2; // 2 column layout
  if (w <= 1199) return idx % 3;// 3 column layout
  return idx % 4;               // 4 column layout
}

/* ─── Collapsed grid card ─── */
export function ProjectCard({ project, index = 0, isExpanded, isFaded, onExpand }) {
  const status = project.team === "solo" ? "Solo Build" : "Team Build";
  const tagClass = project.team === "solo" ? "sp-card__tag--solo" : "sp-card__tag--team";

  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "0px 0px -15% 0px", amount: 0.15 });
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (isInView && !hasRevealed) {
      const col = getColIndex(index);
      const delayMs = col * 140 + 1200;
      const timer = setTimeout(() => {
        setHasRevealed(true);
      }, delayMs);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasRevealed, index]);

  /* When this card is the expanded one, render a ghost placeholder to hold grid space */
  if (isExpanded) {
    return <div className="sp-ghost" />;
  }

  const colIndex = getColIndex(index);
  const staggerDelay = colIndex * 0.14; // 140ms rhythmic stagger per column for an unhurried, wave-like reveal

  const initialValues = hasRevealed
    ? { opacity: isFaded ? 0.22 : 1, y: 0, scale: isFaded ? 0.95 : 1, filter: "blur(0px)" }
    : { opacity: 0, y: 40, scale: 0.94, filter: "blur(10px)" };

  const animateValues = !hasRevealed
    ? isInView
      ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      : { opacity: 0, y: 40, scale: 0.94, filter: "blur(10px)" }
    : { opacity: isFaded ? 0.22 : 1, y: 0, scale: isFaded ? 0.95 : 1, filter: "blur(0px)" };

  const transitionValues = !hasRevealed
    ? {
        duration: 1.15,
        ease: [0.16, 1, 0.3, 1], // Ultra-luxurious quintic ease-out momentum
        delay: isInView ? staggerDelay : 0,
      }
    : {
        duration: 0.3,
        ease: [0.2, 0.8, 0.2, 1],
      };

  return (
    <motion.div
      ref={cardRef}
      layoutId={project.id}
      className={`sp-card ${isFaded ? "sp-card--faded" : ""}`}
      initial={initialValues}
      animate={animateValues}
      transition={transitionValues}
      onAnimationComplete={() => {
        if (isInView && !hasRevealed) {
          setHasRevealed(true);
        }
      }}
      onClick={() => !isFaded && onExpand(project.id)}
      style={{ cursor: isFaded ? "default" : "pointer", pointerEvents: isFaded ? "none" : "auto" }}
    >
      <img
        src={project.image}
        alt={`${project.name} preview`}
        className="sp-card__img"
      />
      <div className="sp-card__bar">
        <h3 className="sp-card__name">{project.name}</h3>
        <span className={`sp-card__tag ${tagClass}`}>{status}</span>
      </div>
    </motion.div>
  );
}

/* ─── Expanded spotlight card ─── */
export function ExpandedCard({ project, onCollapse }) {
  const status = project.team === "solo" ? "Solo Build" : "Team Build";
  const tagClass = project.team === "solo" ? "sp-expanded__tag--solo" : "sp-expanded__tag--team";

  /* Stagger config for body children */
  const staggerItem = (delay) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: "easeOut", delay },
  });

  return (
    <motion.div
      layoutId={project.id}
      className="sp-expanded"
      transition={SPRING}
      style={{ position: "relative" }}
    >
      <button
        className="sp-expanded__close"
        onClick={(e) => {
          e.stopPropagation();
          onCollapse();
        }}
        aria-label="Close"
      >
        <FiX />
      </button>

      <img
        src={project.image}
        alt={`${project.name} detail`}
        className="sp-expanded__screenshot"
      />

      <div className="sp-expanded__body">
        <motion.h3 className="sp-expanded__title" {...staggerItem(0.08)}>
          {project.name}
        </motion.h3>

        <motion.span
          className={`sp-expanded__tag ${tagClass}`}
          {...staggerItem(0.13)}
        >
          {status}
        </motion.span>

        <motion.p className="sp-expanded__desc" {...staggerItem(0.18)}>
          {project.description}
        </motion.p>

        <motion.p className="sp-expanded__contrib" {...staggerItem(0.24)}>
          <strong>Contribution:&nbsp;</strong>
          {project.contribution}
        </motion.p>

        <motion.div className="sp-expanded__actions" {...staggerItem(0.3)}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              className="sp-expanded__btn sp-expanded__btn--live"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Live Demo</span>
              <FiExternalLink size={14} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              className="sp-expanded__btn sp-expanded__btn--gh"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <FiGithub size={15} />
              <span>GitHub</span>
            </a>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
