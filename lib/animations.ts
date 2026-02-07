import { Variants } from "framer-motion";

// Smooth fade up animation for sections and cards
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } // Custom easing for "luxury" feel
  }
};

// Simple fade in
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

// Stagger effect for containers (grids, lists)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Micro-interaction for buttons
export const buttonClick: Variants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

// Image hover effect
export const imageHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.6, ease: "easeOut" } }
};