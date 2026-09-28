import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


const PARTICLES = [
  { size: 8,  radius: 60,  duration: 3.0, delay: 0,    color: "#a855f7", blur: 3 },
  { size: 5,  radius: 80,  duration: 4.2, delay: 0.5,  color: "#6d28d9", blur: 2 },
  { size: 10, radius: 50,  duration: 2.6, delay: 1.0,  color: "#c084fc", blur: 4 },
  { size: 4,  radius: 95,  duration: 5.0, delay: 1.5,  color: "#818cf8", blur: 2 },
  { size: 7,  radius: 70,  duration: 3.8, delay: 0.8,  color: "#e879f9", blur: 3 },
  { size: 6,  radius: 85,  duration: 4.5, delay: 2.0,  color: "#7c3aed", blur: 2 },
  { size: 9,  radius: 55,  duration: 3.2, delay: 0.3,  color: "#a78bfa", blur: 4 },
  { size: 4,  radius: 100, duration: 5.5, delay: 2.5,  color: "#c4b5fd", blur: 2 },
];


const Particle = ({ size, radius, duration, delay, color, blur }) => (
  <motion.div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      filter: `blur(${blur}px)`,
      boxShadow: `0 0 ${size * 2}px ${color}`,
      top: "50%",
      left: "50%",
      transformOrigin: `${-radius}px 0px`,
    }}
    animate={{ rotate: 360 }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);


const PageLoader = ({ text = "Loading…", show = true }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg)",
            gap: 32,
          }}
        >
          <div style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, rgba(168,85,247,0.08) 40%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", width: 220, height: 220 }}>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px solid rgba(168,85,247,0.15)",
              }}
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 20,
                borderRadius: "50%",
                border: "1px solid rgba(109,40,217,0.2)",
              }}
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 45,
                borderRadius: "50%",
                border: "1.5px dashed rgba(192,132,252,0.25)",
              }}
            />

            {PARTICLES.map((p, i) => (
              <Particle key={i} {...p} />
            ))}

            <div style={{
              position: "absolute",
              inset: "50%",
              transform: "translate(-50%, -50%)",
              width: 72,
              height: 72,
              top: "50%",
              left: "50%",
            }}>
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  inset: -16,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)",
                  filter: "blur(8px)",
                }}
              />

              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.3, 0.8] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                style={{
                  position: "absolute",
                  inset: -6,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(192,132,252,0.5) 0%, transparent 70%)",
                }}
              />

              <motion.div
                animate={{ boxShadow: [
                  "0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(109,40,217,0.5), inset 0 0 20px rgba(192,132,252,0.3)",
                  "0 0 35px rgba(168,85,247,1),   0 0 70px rgba(109,40,217,0.8), inset 0 0 30px rgba(192,132,252,0.5)",
                  "0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(109,40,217,0.5), inset 0 0 20px rgba(192,132,252,0.3)",
                ]}}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #c084fc 0%, #7c3aed 45%, #4c1d95 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "12%",
                  left: "18%",
                  width: "35%",
                  height: "25%",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.35)",
                  filter: "blur(4px)",
                }} />

                <motion.div
                  animate={{ top: ["-10%", "110%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                  }}
                />
              </motion.div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}
            >
              Fan Hub <span style={{
                background: "linear-gradient(135deg, #a855f7, #6d28d9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Plus</span>
            </motion.div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 10 }}>
              {text && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}
                >
                  {text}
                </motion.span>
              )}
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#a855f7",
                    display: "inline-block",
                  }}
                />
              ))}
            </div>
          </div>

          <motion.div
            style={{
              width: 180,
              height: 3,
              borderRadius: 999,
              background: "rgba(168,85,247,0.15)",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                height: "100%",
                width: "60%",
                borderRadius: 999,
                background: "linear-gradient(90deg, transparent, #a855f7, #c084fc, transparent)",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



export const withPageLoader = (Component, loaderText = "Loading…") => {
  return function WrappedPage(props) {
    const [ready, setReady] = useState(false);
    useEffect(() => {
      const t = setTimeout(() => setReady(true), 600);
      return () => clearTimeout(t);
    }, []);
    return (
      <>
        <PageLoader show={!ready} text={loaderText} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        >
          <Component {...props} />
        </motion.div>
      </>
    );
  };
};

export default PageLoader;
