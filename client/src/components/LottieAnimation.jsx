import { useState, useEffect } from "react";
import { useLottie } from "lottie-react";

// Subcomponent that renders with useLottie hook
const LottieRenderer = ({ animationData, loop, autoplay, style, className }) => {
  const options = {
    animationData,
    loop,
    autoplay,
  };

  const { View } = useLottie(options, style);
  return <div className={className} style={{ display: "contents" }}>{View}</div>;
};

export const LottieAnimation = ({
  animationData,
  src,
  loop = true,
  autoplay = true,
  style = {},
  className = "",
  fallbackIcon = null,
}) => {
  const [data, setData] = useState(animationData || null);
  const [loading, setLoading] = useState(Boolean(src && !animationData));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (animationData) {
      setData(animationData);
      setLoading(false);
      return;
    }

    if (src) {
      let isMounted = true;
      setLoading(true);
      fetch(src)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load Lottie animation");
          return res.json();
        })
        .then((json) => {
          if (isMounted) {
            setData(json);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.warn("Lottie fetch fallback:", err.message);
          if (isMounted) {
            setError(true);
            setLoading(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }
  }, [src, animationData]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          minHeight: 80,
          ...style,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "3px solid rgba(236,72,153,0.2)",
            borderTopColor: "var(--primary)",
            animation: "spinSlow 1s linear infinite",
          }}
        />
      </div>
    );
  }

  if (error || !data) {
    return fallbackIcon ? (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
        {fallbackIcon}
      </div>
    ) : null;
  }

  return (
    <LottieRenderer
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      style={style}
      className={className}
    />
  );
};

export default LottieAnimation;
