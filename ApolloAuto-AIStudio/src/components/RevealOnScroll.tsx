import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  y = 32,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -48px 0px' }}
      transition={{
        type: 'spring',
        stiffness: 90,
        damping: 18,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
