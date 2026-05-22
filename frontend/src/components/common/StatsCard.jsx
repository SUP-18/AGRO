import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ icon: Icon, label, value, trend, trendLabel, color = 'primary', delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(() => requestAnimationFrame(animate), delay * 1000);
    return () => clearTimeout(timer);
  }, [numericValue, delay]);

  const colorClasses = {
    primary: 'from-primary-500 to-primary-700 shadow-primary-500/25',
    accent: 'from-accent-500 to-accent-700 shadow-accent-500/25',
    blue: 'from-blue-500 to-blue-700 shadow-blue-500/25',
    purple: 'from-purple-500 to-purple-700 shadow-purple-500/25',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1 font-display">
            {typeof value === 'string' && value.includes('%') ? `${displayValue}%` : displayValue.toLocaleString()}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${trend >= 0 ? 'text-primary-400' : 'text-red-400'}`}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-xs text-dark-500">{trendLabel || 'vs last month'}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg flex items-center justify-center`}>
          {Icon && <Icon className="text-white text-xl" />}
        </div>
      </div>
    </motion.div>
  );
}
