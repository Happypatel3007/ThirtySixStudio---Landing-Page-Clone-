import React, { useEffect, useRef, useState } from "react";
import canvasImages from "../canvasImages";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function canvas({ details, redprop }) {
  const { startIndex, numImages, duration, size, top, left, zIndex } = details;
  const [index, setIndex] = useState({ value: startIndex });
  const canvasRef = useRef(null);
  const isRed = redprop;

  useGSAP(() => {
    gsap.to(index, {
      value: startIndex + numImages - 1,
      duration: duration,
      ease: "linear",
      repeat: -1,
      onUpdate: () => {
        setIndex({ value: Math.round(index.value) });
      },
    });
  });

  useEffect(() => {
    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = canvasImages[index.value];
    img.onload = () => {
      canvas.width = canvas.offsetWidth * scale;
      canvas.height = canvas.offsetHeight * scale;
      canvas.style.width = canvas.offsetWidth + "px";
      canvas.style.height = canvas.offsetHeight + "px";
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
    };
  }, [index]);

  return (
    <canvas
      data-scroll
      data-scroll-speed={Math.random().toFixed(2)}
      ref={canvasRef}
      className={`absolute pointer-events-none ${isRed ? "opacity-100" : "opacity-0 pointer-events-none"}`}

      style={{
        width: `${size * 1.4}px`,
        height: `${size * 1.4}px`,
        top: `${top}%`,
        left: `${left}%`,
        zIndex: `${zIndex}`,
      }}
      id="canvas"
    ></canvas>
  );
}

export default canvas;
