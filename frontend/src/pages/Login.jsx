import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiSeedlingLine, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiGoogleLine, RiGithubLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login, demoLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      toast.success('Welcome back!');
      navigate('/prediction');
    } else {
      toast.error(res.error);
    }
  };

  const handleDemo = async (role) => {
    const res = await demoLogin(role);
    if (res.success) {
      toast.success(`Logged in as demo ${role}`);
      navigate('/prediction');
    } else {
      toast.error(res.error || 'Demo login failed. Make sure the backend is running.');
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-950">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative hero-gradient items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.5 }}
              className="absolute text-primary-500/10" style={{ left: `${15 + i * 18}%`, top: `${10 + (i % 3) * 30}%` }}>
              <RiSeedlingLine size={50 + i * 15} />
            </motion.div>
          ))}
        </div>
        <div className="relative z-10 max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <RiSeedlingLine className="text-white text-2xl" />
              </div>
              <span className="font-display font-bold text-2xl text-white">Agro<span className="text-primary-400">Predict</span></span>
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">{t('auth.loginTitle')}</h2>
            <p className="text-dark-300 leading-relaxed">{t('landing.heroSubtitle')}</p>
            <div className="mt-10 space-y-4">
              {[t('prediction.title'), t('disease.title'), t('smartFarming.irrigationSchedule')].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 text-dark-300">
                  <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary-400" />
                  </div>
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <RiSeedlingLine className="text-white text-lg" />
            </div>
            <span className="font-display font-bold text-lg text-white">Agro<span className="text-primary-400">Predict</span></span>
          </div>

          <h2 className="text-2xl font-display font-bold text-white mb-2">{t('common.login')}</h2>
          <p className="text-dark-400 mb-8">{t('auth.loginSubtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('common.email')}
                className="input-field pl-11" />
            </div>
            <div className="relative">
              <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={t('common.password')}
                className="input-field pl-11 pr-11" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/30" />
                <span className="text-sm text-dark-400">{t('auth.rememberMe')}</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">{t('auth.forgotPassword')}</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t('common.login')}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-700" /></div>
              <div className="relative flex justify-center"><span className="px-4 text-sm text-dark-500 bg-dark-950">{t('landing.learnMore')}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="btn-secondary flex items-center justify-center gap-2 !py-2.5 text-sm"><RiGoogleLine /> Google</button>
              <button className="btn-secondary flex items-center justify-center gap-2 !py-2.5 text-sm"><RiGithubLine /> GitHub</button>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs text-dark-500 text-center mb-2">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: 'farmer', label: t('common.farmer') },
                { role: 'admin', label: t('common.admin') }
              ].map(item => (
                <button key={item.role} onClick={() => handleDemo(item.role)}
                  className="text-xs py-2 px-3 rounded-lg border border-dark-700 text-dark-400 hover:text-primary-400 hover:border-primary-500/30 transition-all capitalize">
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-dark-400 text-sm mt-8">
            {t('auth.noAccount')} <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium">{t('common.signup')}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
