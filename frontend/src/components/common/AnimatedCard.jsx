import { motion } from 'framer-motion';

export default function AnimatedCard({ children, className = '', delay = 0, hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`glass-card p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}
