import { ReactNode } from "react";
import { motion } from "framer-motion";

export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const pageTransition = { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] };

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden: { opacity: 1 },
  show: { transition: { staggerChildren: 0.08, delayChildren: 0 } },
};

export const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
    {children}
  </motion.div>
);

export const Motion = motion;

export default {};
