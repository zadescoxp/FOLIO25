import { cubicBezier } from "motion/react";

const textVar = {
  initial: {
    top: 100,
    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
  },
  whileInView: {
    top: 0,
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    transition: {
      ease: cubicBezier(0, 0.55, 0.45, 1),
      duration: 0.75,
    },
  },

  viewport: { once: true },
};

const imageVar = {
  initial: {
    top: 100,
    scale: 0.75,
    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
  },
  whileInView: {
    top: 0,
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    scale: 1,
    transition: {
      ease: cubicBezier(0, 0.55, 0.45, 1),
      duration: 0.75,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      ease: cubicBezier(0, 0.55, 0.45, 1),
      duration: 0.75,
    },
  },
};

export { textVar, imageVar };
