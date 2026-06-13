"use client";

import React, { type ReactNode, useState, useEffect } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  delay = 0,
  staggerDelay = 0.1,
  ...props
}: StaggerContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // delay is provided in milliseconds by callers; framer-motion expects seconds
  const delaySeconds = delay / 1000;

  return (
    <motion.div
      initial={mounted ? "hidden" : false}
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delaySeconds,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  y?: number;
  x?: number;
}

export function StaggerItem({
  children,
  y = 15,
  x = 0,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y, x },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 80,
            damping: 15,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ScaleFadeItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  initialScale?: number;
  targetScale?: number;
  rotate?: number;
}

export function ScaleFadeItem({
  children,
  initialScale = 0.4,
  targetScale = 1,
  rotate = 0,
  ...props
}: ScaleFadeItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: initialScale, rotate: rotate },
        visible: {
          opacity: 1,
          scale: targetScale,
          rotate: 0,
          transition: {
            type: "spring",
            stiffness: 70,
            damping: 14,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
