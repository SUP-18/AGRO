import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card p-5 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-white font-display">{title}</h3>}
          {subtitle && <p className="text-sm text-dark-400 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
