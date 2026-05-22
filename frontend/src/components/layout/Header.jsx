import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiNotification3Line, RiMoonLine,
  RiMenuLine, RiArrowDownSLine, RiUserLine, RiSettings4Line, RiLogoutBoxLine
} from 'react-icons/ri';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import api from '../../services/api';

const pageTitleKeys = {
  '/dashboard': 'pageTitles.dashboard',
  '/prediction': 'pageTitles.prediction',
  '/analytics': 'pageTitles.analytics',
  '/disease-detection': 'pageTitles.diseaseDetection',
  '/smart-farming': 'pageTitles.smartFarming',
  '/weather': 'pageTitles.weather',
  '/admin': 'pageTitles.admin',
  '/profile': 'pageTitles.profile',
};

export default function Header({ onMenuToggle }) {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const { language, changeLanguage, t, languages, currentLanguageMeta } = useLanguage();
  const location = useLocation();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLangSelector, setShowLangSelector] = useState(false);
  const [hasNewNotifs, setHasNewNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifsLoading, setNotifsLoading] = useState(false);
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const langRef = useRef(null);

  const pageTitle = t(pageTitleKeys[location.pathname]) || 'AgroPredict';

  const timeAgo = (isoStr) => {
    if (!isoStr) return '';
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const fetchNotifications = useCallback(async () => {
    try {
      setNotifsLoading(true);
      const res = await api.get('/notifications/');
      const items = res.data.notifications || [];
      setNotifications(items);
      setHasNewNotifs(items.some(n => !n.read));
    } catch (err) {
      // Silently fail — keep whatever we have
    } finally {
      setNotifsLoading(false);
    }
  }, []);

  // Fetch notifications on mount and every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (langRef.current && !langRef.current.contains(e.target)) setShowLangSelector(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangChange = (code) => {
    changeLanguage(code);
    setShowLangSelector(false);
    toast.success(`Language changed to ${languages.find(l => l.code === code).name}`, {
      style: {
        background: '#111827',
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }
    });
  };

  const typeColors = { weather: 'text-accent-400', info: 'text-blue-400', danger: 'text-red-400', success: 'text-primary-400', pest: 'text-accent-400', fertilizer: 'text-primary-400', generic: 'text-blue-400', disease: 'text-red-400', irrigation: 'text-blue-400', warning: 'text-accent-400' };

  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="glass-dark px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-all">
            <RiMenuLine size={20} />
          </button>
          <div>
            <h2 className="text-lg font-display font-semibold text-white">{pageTitle}</h2>
            <p className="text-xs text-dark-400 hidden sm:block">
              {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>



        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setShowLangSelector(!showLangSelector); setShowNotifications(false); setShowProfile(false); }}
              className="flex items-center gap-1.5 p-2 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800 transition-all font-medium text-xs border border-transparent hover:border-dark-700/50"
            >
              <span className="text-base">{currentLanguageMeta.flag}</span>
              <span className="uppercase text-[11px] font-semibold text-dark-300 hidden xs:inline">{language}</span>
              <RiArrowDownSLine className={`text-dark-500 transition-transform ${showLangSelector ? 'rotate-180' : ''}`} size={14} />
            </motion.button>

            <AnimatePresence>
              {showLangSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 glass-dark rounded-2xl border border-dark-700/50 shadow-2xl overflow-hidden z-50 p-1.5"
                >
                  <div className="px-3 py-2 border-b border-dark-800/50 mb-1">
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider">{t('header.settings')}</p>
                  </div>
                  <div className="space-y-0.5 max-h-64 overflow-y-auto no-scrollbar">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangChange(lang.code)}
                        className={`flex items-center justify-between w-full px-3 py-1.5 rounded-xl text-sm transition-all
                          ${language === lang.code
                            ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20 font-medium'
                            : 'text-dark-300 hover:text-white hover:bg-dark-800/60 border border-transparent'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{lang.flag}</span>
                          <div className="text-left">
                            <p className="text-xs font-medium">{lang.nativeName}</p>
                            <p className="text-[9px] text-dark-400">{lang.name}</p>
                          </div>
                        </div>
                        {language === lang.code && (
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toast(t('header.themeLockedMsg'), { icon: '🌙' })}
            className="p-2 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800 transition-all"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <RiMoonLine size={18} />
            </motion.div>
          </motion.button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); setShowLangSelector(false); if (!showNotifications) fetchNotifications(); setHasNewNotifs(false); }}
              className="p-2 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800 transition-all relative"
            >
              <RiNotification3Line size={18} />
              {hasNewNotifs && <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 glass-dark rounded-2xl border border-dark-700/50 shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-dark-700/50">
                    <h3 className="font-semibold text-white">{t('header.notifications')}</h3>
                    <p className="text-xs text-dark-400">{notifications.length} {t('header.newAlerts')}</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifsLoading ? (
                      <div className="p-6 text-center">
                        <div className="w-5 h-5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center text-dark-500 text-xs">No notifications yet</div>
                    ) : notifications.slice(0, 8).map((n) => (
                      <div key={n.id} className={`p-3 hover:bg-dark-800/50 transition-colors cursor-pointer border-b border-dark-800/50 last:border-0 ${!n.read ? 'bg-primary-500/5' : ''}`}>
                        <div className="flex justify-between items-start">
                          <p className={`text-sm font-medium ${typeColors[n.type] || 'text-blue-400'}`}>{n.title}</p>
                          <span className="text-[10px] text-dark-500">{timeAgo(n.created_at)}</span>
                        </div>
                        <p className="text-xs text-dark-400 mt-1">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-dark-700/50 text-center">
                    <button className="text-xs text-primary-400 hover:text-primary-300 font-medium">{t('header.viewAllNotifications')}</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowLangSelector(false); }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-dark-800 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <RiArrowDownSLine className={`text-dark-400 transition-transform hidden sm:block ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 glass-dark rounded-2xl border border-dark-700/50 shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-dark-700/50">
                    <p className="font-medium text-white text-sm">{user?.full_name || 'User'}</p>
                    <p className="text-xs text-dark-400">{user?.email || 'user@email.com'}</p>
                    <span className="badge badge-success mt-1 capitalize">{t(`common.${user?.role || 'farmer'}`)}</span>
                  </div>
                  <div className="p-2">
                    <a href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800/60 transition-all text-sm">
                      <RiUserLine /> {t('header.myProfile')}
                    </a>
                    <a href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800/60 transition-all text-sm">
                      <RiSettings4Line /> {t('header.settings')}
                    </a>
                    <button onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-300 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm w-full">
                      <RiLogoutBoxLine /> {t('common.logout')}
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}


