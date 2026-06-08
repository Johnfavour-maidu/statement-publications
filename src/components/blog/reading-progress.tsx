"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setVisible(v > 0.02);
    });
  }, [scrollYProgress]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100"
    >
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: scrollYProgress,
          background: "linear-gradient(90deg, #D8B27A, #EBC9A8, #F2D8BE)",
        }}
      />
    </motion.div>
  );
}
