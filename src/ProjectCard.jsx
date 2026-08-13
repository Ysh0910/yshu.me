import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import "./project-card.css";

const SPRING = { type: "spring", stiffness: 300, damping: 30 };

/* ─── Collapsed grid card ─── */
export function ProjectCard({ project, isExpanded, isFaded, onExpand }) {
  const status = project.team === "solo" ? "Solo Build" : "Team Build";
  const tagClass = project.team === "solo" ? "sp-card__tag--solo" : "sp-card__tag--team";

  /* When this card is the expanded one, render a ghost placeholder to hold grid space */
  if (isExpanded) {
    return <div className="sp-ghost" />;
  }

  return (
    <motion.div
      layoutId={project.id}
      className="sp-card"
      animate={{
        opacity: isFaded ? 0.3 : 1,
        scale: isFaded ? 0.95 : 1,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() => onExpand(project.id)}
      style={{ cursor: "pointer" }}
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
