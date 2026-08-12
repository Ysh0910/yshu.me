import { useState, useEffect, useRef, useCallback } from "react";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import { createPortal } from "react-dom";
import "./project-card.css";

const CLOSE_EVENT = "pc:close-all";

function PanelContent({ image, name, description, contribution, liveUrl, githubUrl }) {
  return (
    <>
      <img src={image} alt={`${name} detail`} className="pc-panel__screenshot" />
      <h3 className="pc-panel__title">{name}</h3>
      <p className="pc-panel__desc">{description}</p>
      <p className="pc-panel__contrib">
        <strong>Contribution:&nbsp;</strong>{contribution}
      </p>
      <div className="pc-panel__actions">
        {liveUrl && (
          <a
            href={liveUrl}
            className="pc-panel__btn pc-panel__btn--live"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Live Demo</span>
            <FiExternalLink size={13} />
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            className="pc-panel__btn pc-panel__btn--gh"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <FiGithub size={14} />
            <span>GitHub</span>
          </a>
        )}
      </div>
    </>
  );
}

export function ProjectCard({
  name,
  image,
  status,
  description,
  contribution,
  liveUrl,
  githubUrl,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [nudge, setNudge] = useState(""); // "", "left", "right"
  const [isMobile, setIsMobile] = useState(false);
  const wrapRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close when another card opens
  useEffect(() => {
    const handler = (e) => {
      if (e.detail !== name) setIsOpen(false);
    };
    window.addEventListener(CLOSE_EVENT, handler);
    return () => window.removeEventListener(CLOSE_EVENT, handler);
  }, [name]);

  // Lock body scroll when mobile modal is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isMobile, isOpen]);

  // Edge detection for desktop panel
  useEffect(() => {
    if (!isOpen || isMobile || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    if (rect.left < 80) {
      setNudge("left");
    } else if (vw - rect.right < 80) {
      setNudge("right");
    } else {
      setNudge("");
    }
  }, [isOpen, isMobile]);

  const open = useCallback(() => {
    window.dispatchEvent(new CustomEvent(CLOSE_EVENT, { detail: name }));
    setIsOpen(true);
  }, [name]);

  const close = useCallback(() => setIsOpen(false), []);

  const handlePointerEnter = (e) => {
    if (e.pointerType === "mouse") open();
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType === "mouse") close();
  };

  const handleClick = (e) => {
    // Mobile tap toggle
    if (e.detail === 0) return; // ignore programmatic clicks
    if (isMobile) {
      if (isOpen) close();
      else open();
    }
  };

  const tagClass = status === "Solo Build" ? "pc-card__tag--solo" : "pc-card__tag--team";

  const panelClasses = [
    "pc-panel",
    isOpen ? "pc-panel--visible" : "",
    nudge === "left" ? "pc-panel--nudge-left" : "",
    nudge === "right" ? "pc-panel--nudge-right" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      {/* Background scrim — rendered via portal to body */}
      {createPortal(
        <div
          className={`pc-scrim ${isOpen ? "pc-scrim--visible" : ""}`}
          onClick={close}
        />,
        document.body
      )}

      <div
        ref={wrapRef}
        className={`pc-wrap ${isOpen ? "pc-wrap--open" : ""}`}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        {/* The resting card */}
        <div className="pc-card">
          <img src={image} alt={`${name} preview`} className="pc-card__img" />
          <div className="pc-card__bar">
            <h3 className="pc-card__name">{name}</h3>
            <span className={`pc-card__tag ${tagClass}`}>{status}</span>
          </div>
        </div>

        {/* Desktop detail panel */}
        <div className={panelClasses}>
          <PanelContent
            image={image}
            name={name}
            description={description}
            contribution={contribution}
            liveUrl={liveUrl}
            githubUrl={githubUrl}
          />
        </div>
      </div>

      {/* Mobile modal — rendered via portal */}
      {isMobile && createPortal(
        <div className={`pc-modal ${isOpen ? "pc-modal--visible" : ""}`}>
          <button className="pc-modal__close" onClick={(e) => { e.stopPropagation(); close(); }} aria-label="Close">
            <FiX />
          </button>
          <PanelContent
            image={image}
            name={name}
            description={description}
            contribution={contribution}
            liveUrl={liveUrl}
            githubUrl={githubUrl}
          />
        </div>,
        document.body
      )}
    </>
  );
}
