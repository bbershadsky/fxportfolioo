"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  decimalPlaces?: number;
  animationSpeed?: number;
}

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  animationSpeed = 3000,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<React.ReactNode>(null);

  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      const formattedNumber = Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(Number(latest.toFixed(decimalPlaces)));

      const [integerPart, decimalPart] = formattedNumber.split(".");
      const integerSegments = integerPart.split(",");

      const integerElements = integerSegments.reduce<React.ReactNode[]>((acc, segment, idx) => {
        if (idx === 0) {
          return [segment];
        } else {
          return [
            ...acc,
            <span className="thousands-separator" key={`comma-${idx}`}>,</span>,
            segment,
          ];
        }
      }, []);

      let finalElements: React.ReactNode[] = integerElements;
      if (decimalPart && decimalPart.length > 0) {
        finalElements = [
          ...finalElements,
          <span className="decimal-separator" key="decimal">.</span>,
          decimalPart,
        ];
      }

      setDisplayValue(finalElements);
    });

    return () => {
      unsubscribe();
    };
  }, [springValue, decimalPlaces]);

  return (
    <span
      className={cn(
        "inline-block tabular-nums text-black dark:text-white tracking-wider",
        className
      )}
      ref={ref}
    >
      {displayValue}
    </span>
  );
}
