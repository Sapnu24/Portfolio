// src/components/VantaBackground.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

const VantaBackground = ({ children, height }) => {
  const vantaRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    if (!effectRef.current) {
      effectRef.current = NET({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.1,
        color: 0xffffff,
        backgroundColor: 0x0A7A7A,
        points: window.innerWidth < 768 ? 10 : 16,
        maxDistance: window.innerWidth < 768 ? 24 : 32,
        spacing: window.innerWidth < 768 ? 20 : 28,
        showDots: true,
      });
    }

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* Canvas confined to this section (will scroll away with the page) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: height || "100vh",
          overflow: "hidden",
        }}
      >
        <div
          ref={vantaRef}
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        />

        {/* Content wrapper sits above the canvas */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            minHeight: height || "100vh",
            color: "#fff",
            textAlign: "center",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};


export default VantaBackground;
