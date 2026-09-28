import { useState } from "react";
import { FiStar, FiCheck } from "react-icons/fi";
import axios from "axios";

const RatingStars = ({
  value = 0,
  count = 0,
  size = 14,
  interactive = false,
  targetType,
  targetId,
  onRate,
}) => {
  const [currentVal, setCurrentVal] = useState(value);
  const [currentCount, setCurrentCount] = useState(count);
  const [hoverVal, setHoverVal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [rated, setRated] = useState(false);

  const isInteractive = interactive && targetType && targetId;

  const handleRate = async (ratingVal) => {
    if (!isInteractive || submitting || rated) return;
    setSubmitting(true);
    try {
      const res = await axios.post("/api/ratings", {
        targetType,
        targetId,
        value: ratingVal,
      });
      const newAvg = res.data?.ratingAvg ?? ratingVal;
      const newCount = res.data?.ratingCount ?? (currentCount + 1);
      setCurrentVal(newAvg);
      setCurrentCount(newCount);
      setRated(true);
      if (onRate) onRate({ ratingAvg: newAvg, ratingCount: newCount });
    } catch (err) {
      console.error("Failed to submit rating", err);
    } finally {
      setSubmitting(false);
    }
  };

  const displayVal = hoverVal || currentVal;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <div
        style={{ display: "flex", alignItems: "center", gap: 3, cursor: isInteractive ? "pointer" : "default" }}
        onMouseLeave={() => isInteractive && setHoverVal(0)}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const starNum = i + 1;
          const isFilled = starNum <= Math.round(displayVal);
          return (
            <span
              key={i}
              onClick={() => isInteractive && handleRate(starNum)}
              onMouseEnter={() => isInteractive && !rated && setHoverVal(starNum)}
              title={isInteractive && !rated ? `Rate ${starNum} star${starNum > 1 ? "s" : ""}` : ""}
              style={{
                display: "inline-flex",
                transition: "transform 0.15s ease",
                transform: isInteractive && hoverVal >= starNum ? "scale(1.2)" : "scale(1)",
              }}
            >
              <FiStar
                size={size}
                color={isFilled ? "#f5b301" : "var(--text-muted)"}
                fill={isFilled ? "#f5b301" : "none"}
              />
            </span>
          );
        })}
      </div>
      <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>
        {currentVal ? Number(currentVal).toFixed(1) : "—"} {currentCount ? `(${currentCount})` : ""}
      </span>
      {rated && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 11, color: "#22c55e", marginLeft: 4 }}>
          <FiCheck size={12} /> Rated!
        </span>
      )}
    </div>
  );
};

export default RatingStars;
