import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiSeedlingLine, RiMailLine, RiArrowLeftLine, RiCheckLine } from 'react-icons/ri';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); toast.success('Reset link sent!'); }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-6 mesh-gradient">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
              <RiSeedlingLine className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">
              {sent ? t('auth.forgotTitle') : t('auth.forgotPassword')}
            </h2>
            <p className="text-dark-400 mt-2 text-sm">
              {sent ? `${t('auth.sendResetLink')} ${email}` : t('auth.forgotSubtitle')}
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto">
                <RiCheckLine className="text-primary-400 text-3xl" />
              </div>
              <p className="text-sm text-dark-400">Didn't receive the email? Check your spam folder or try again.</p>
              <button onClick={() => setSent(false)} className="btn-secondary w-full">{t('common.cancel')}</button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-dark-400 hover:text-primary-400 transition-colors">
                <RiArrowLeftLine /> {t('common.login')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('common.email')} className="input-field pl-11" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t('auth.sendResetLink')}
              </button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-dark-400 hover:text-primary-400 transition-colors">
                <RiArrowLeftLine /> {t('common.login')}
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
