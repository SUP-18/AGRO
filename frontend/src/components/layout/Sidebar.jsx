import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiDashboardLine, RiPlantLine, RiBarChart2Line, RiSearchEyeLine,
  RiLeafLine, RiCloudLine, RiAdminLine, RiUserLine, RiLogoutBoxLine,
  RiMenuFoldLine, RiMenuUnfoldLine, RiSeedlingLine
} from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const navItems = [
  { path: '/prediction', labelKey: 'nav.prediction', icon: RiPlantLine },
  { path: '/dashboard', labelKey: 'nav.dashboard', icon: RiDashboardLine },
  { path: '/analytics', labelKey: 'nav.analytics', icon: RiBarChart2Line },
  { path: '/disease-detection', labelKey: 'nav.diseaseDetection', icon: RiSearchEyeLine },
  { path: '/smart-farming', labelKey: 'nav.smartFarming', icon: RiLeafLine },
  { path: '/weather', labelKey: 'nav.weather', icon: RiCloudLine },
  { path: '/admin', labelKey: 'nav.adminPanel', icon: RiAdminLine },
  { path: '/profile', labelKey: 'nav.profile', icon: RiUserLine },
];

export default function Sidebar({ isOpen, onToggle }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col
          ${isOpen ? 'w-64' : 'w-20'}
          bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/50
          transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-dark-700/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 flex-shrink-0">
            <RiSeedlingLine className="text-white text-xl" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <h1 className="font-display font-bold text-lg text-white whitespace-nowrap">
                  Agro<span className="text-primary-400">Predict</span>
                </h1>
                <p className="text-[10px] text-dark-400 whitespace-nowrap">{t('common.tagline')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-800 border border-dark-600 items-center justify-center text-dark-400 hover:text-primary-400 hover:border-primary-500/50 transition-all z-10"
        >
          {isOpen ? <RiMenuFoldLine size={12} /> : <RiMenuUnfoldLine size={12} />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            if (item.path === '/admin' && user?.role !== 'admin') return null;
            const Icon = item.icon;
            const labelText = t(item.labelKey);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-600/20 to-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary-500"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={`text-xl flex-shrink-0 ${isActive ? 'text-primary-400' : 'group-hover:text-primary-400'}`} />
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-sm font-medium whitespace-nowrap"
                        >
                          {labelText}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-dark-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-dark-600">
                        {labelText}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User info & Logout */}
        <div className="p-3 border-t border-dark-700/50">
          {isOpen ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-dark-800/60 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user?.full_name || 'User'}</p>
                <p className="text-[10px] text-dark-400 truncate capitalize">{t(`common.${user?.role || 'farmer'}`)}</p>
              </div>
            </div>
          ) : null}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ${!isOpen ? 'justify-center' : ''}`}
          >
            <RiLogoutBoxLine className="text-xl flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">{t('common.logout')}</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

