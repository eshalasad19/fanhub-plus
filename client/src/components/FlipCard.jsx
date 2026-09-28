import { useState } from "react";

const FlipCard = ({ front, back, height = 300 }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      style={{ perspective: 1200, height }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onTouchStart={() => setFlipped((f) => !f)}
    >
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 16, overflow: "hidden" }}>
          {front}
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 16, overflow: "hidden" }}>
          {back}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
