import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiSeedlingLine, RiMailLine, RiLockLine, RiUserLine, RiPhoneLine, RiMapPinLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirmPassword: '', role: 'farmer', phone: '', location: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { signup, demoLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const getStrength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strength = getStrength(form.password);
  const strengthColors = ['bg-dark-700', 'bg-red-500', 'bg-accent-500', 'bg-accent-400', 'bg-primary-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) return toast.error('Please fill required fields');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!agreed) return toast.error('Please agree to the terms');
    setLoading(true);
    const res = await signup({ ...form, username: form.email });
    setLoading(false);
    if (res.success) {
      toast.success('Account created!');
      navigate('/prediction');
    } else {
      toast.error(res.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-950">
      <div className="hidden lg:flex lg:w-1/2 relative hero-gradient items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} animate={{ y: [0, -20, 0] }} transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.5 }}
              className="absolute text-primary-500/10" style={{ left: `${15 + i * 18}%`, top: `${10 + (i % 3) * 30}%` }}>
              <RiSeedlingLine size={50 + i * 15} />
            </motion.div>
          ))}
        </div>
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <RiSeedlingLine className="text-white text-2xl" />
            </div>
            <span className="font-display font-bold text-2xl text-white">Agro<span className="text-primary-400">Predict</span></span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">{t('auth.signupTitle')}</h2>
          <p className="text-dark-300 leading-relaxed">{t('landing.heroSubtitle')}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <RiSeedlingLine className="text-white text-lg" />
            </div>
            <span className="font-display font-bold text-lg text-white">Agro<span className="text-primary-400">Predict</span></span>
          </div>

          <h2 className="text-2xl font-display font-bold text-white mb-2">{t('common.signup')}</h2>
          <p className="text-dark-400 mb-6">{t('auth.signupSubtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input type="text" value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder={`${t('profile.fullName')} *`} className="input-field pl-11" />
            </div>
            <div className="relative">
              <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder={`${t('common.email')} *`} className="input-field pl-11" />
            </div>
            <div className="relative">
              <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder={`${t('common.password')} *`} className="input-field pl-11 pr-11" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
            {form.password && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : 'bg-dark-700'}`} />)}
                </div>
                <p className="text-xs text-dark-500">Password strength: <span className={strength >= 3 ? 'text-primary-400' : 'text-accent-400'}>{strengthLabels[strength]}</span></p>
              </div>
            )}
            <div className="relative">
              <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder={`${t('profile.confirmPassword')} *`} className="input-field pl-11" />
            </div>
            <select value={form.role} onChange={e => update('role', e.target.value)} className="input-field">
              <option value="farmer">🌾 {t('common.farmer')}</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <RiPhoneLine className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder={t('profile.phone')} className="input-field pl-11" />
              </div>
              <div className="relative">
                <RiMapPinLine className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                <input type="text" value={form.location} onChange={e => update('location', e.target.value)} placeholder={t('profile.location')} className="input-field pl-11" />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/30 mt-0.5" />
              <span className="text-sm text-dark-400">I agree to the <a href="#" className="text-primary-400">Terms of Service</a> and <a href="#" className="text-primary-400">Privacy Policy</a></span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t('common.signup')}
            </button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-6">
            {t('auth.haveAccount')} <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">{t('common.login')}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
