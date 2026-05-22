import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RiHome5Line, RiArrowLeftLine, RiLeafLine } from 'react-icons/ri';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();
  // Floating botanical element configurations
  const floatingLeaves = [
    { id: 1, size: 24, top: '15%', left: '10%', delay: 0, duration: 8 },
    { id: 2, size: 36, top: '25%', left: '80%', delay: 1, duration: 12 },
    { id: 3, size: 16, top: '65%', left: '15%', delay: 2, duration: 10 },
    { id: 4, size: 28, top: '75%', left: '75%', delay: 0.5, duration: 14 },
    { id: 5, size: 20, top: '45%', left: '85%', delay: 3, duration: 9 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-dark-950 flex flex-col items-center justify-center p-6 text-slate-100 font-outfit select-none">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Floating botanical elements */}
      {floatingLeaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-primary-500/20 pointer-events-none hidden md:block"
          style={{ top: leaf.top, left: leaf.left }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 360],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "easeInOut"
          }}
        >
          <RiLeafLine size={leaf.size} />
        </motion.div>
      ))}

      {/* Main glassmorphic card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-lg w-full text-center z-10 glass-dark border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md"
      >
        {/* Animated glowing border or rings */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <RiLeafLine size={44} className="text-dark-950 animate-pulse" />
        </div>

        {/* 404 Header */}
        <div className="mt-8 mb-4 relative">
          <motion.h1
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-8xl md:text-9xl font-black bg-gradient-to-r from-primary-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tighter"
          >
            404
          </motion.h1>
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary-500 to-emerald-500 opacity-20 blur-xl -z-10 animate-pulse-slow" />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-100">
          {t('notFound.glowTitle')}
        </h2>

        {/* Description */}
        <p className="text-slate-400 text-sm md:text-base mb-8 max-w-sm mx-auto leading-relaxed">
          {t('notFound.desc')}
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-500 hover:to-emerald-500 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30 hover:scale-[1.02]"
          >
            <RiHome5Line size={18} />
            {t('notFound.goDashboard')}
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <RiArrowLeftLine size={18} />
            {t('notFound.goBack')}
          </button>
        </div>
      </motion.div>

      {/* Footer copyright style */}
      <div className="absolute bottom-6 text-slate-500 text-xs text-center z-10">
        &copy; {new Date().getFullYear()} {t('common.appName')}. {t('notFound.growingInsights')}
      </div>
    </div>
  );
}
