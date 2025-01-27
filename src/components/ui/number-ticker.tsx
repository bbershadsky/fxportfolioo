"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { type ComponentPropsWithoutRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  direction?: "up" | "down";
  delay?: number; // delay in seconds
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // Start from 'value' if direction is "down", otherwise from 0
  const motionValue = useMotionValue(direction === "down" ? value : 0);

  // 1) Increase stiffness (200) => snappier / faster
  // 2) Decrease damping (50) => less "resistance" so it converges quickly
  // Feel free to adjust further as desired
  const springValue = useSpring(motionValue, {
    stiffness: 200,
    damping: 50,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  // Trigger the animation when in view + delay
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, delay, value, direction, motionValue]);

  // Keep the <span> text in sync with the spring value
  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)));
      }
    });
  }, [springValue, decimalPlaces]);

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tabular-nums tracking-wider text-black dark:text-white",
        className
      )}
      {...props}
    />
  );
}
