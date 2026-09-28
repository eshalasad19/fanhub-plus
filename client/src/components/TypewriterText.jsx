import { useState, useEffect } from "react";

export const TypewriterText = ({
  phrases = [],
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseTime = 2000,
  className = "",
  style = {},
  cursorColor = "var(--primary)",
  prefix = "",
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const currentPhrase = phrases[phraseIndex] || "";

    let timeout;
    if (!isDeleting && charIndex < currentPhrase.length) {
      // Typing next character
      timeout = setTimeout(() => {
        setText(currentPhrase.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at full text before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && charIndex > 0) {
      // Deleting character
      timeout = setTimeout(() => {
        setText(currentPhrase.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      // Move to next phrase
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={className} style={{ display: "inline-block", ...style }}>
      {prefix && <span>{prefix} </span>}
      <span className="gradient-text" style={{ fontWeight: 900 }}>{text}</span>
      <span
        style={{
          display: "inline-block",
          width: "2.5px",
          height: "1em",
          background: cursorColor,
          marginLeft: "3px",
          verticalAlign: "baseline",
          animation: "blinkCursor 0.8s infinite ease-in-out",
          boxShadow: "0 0 8px var(--primary)",
        }}
      />
      <style>{`
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0; transform: scaleY(0.7); }
        }
      `}</style>
    </span>
  );
};

export default TypewriterText;
