import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiMailLine, RiPhoneLine, RiMapPinLine, RiSendPlaneLine,
  RiQuestionLine, RiArrowDownSLine, RiCheckboxCircleLine,
  RiGlobalLine, RiTimeLine, RiCustomerServiceLine
} from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t('common.error', 'Error'));
      return;
    }
    setSubmitted(true);
    toast.success(t('contact.formSuccess'));
  };

  const contactInfo = [
    { icon: RiMailLine, title: 'Email', main: t('contact.email'), sub: 'partnerships@agropredict.com', color: 'text-primary-400' },
    { icon: RiPhoneLine, title: 'Phone', main: t('contact.phone'), sub: 'Mon-Sat, 9:00 AM — 6:00 PM', color: 'text-blue-400' },
    { icon: RiMapPinLine, title: 'Address', main: t('contact.address'), sub: 'Innovation Valley', color: 'text-accent-400' },
    { icon: RiGlobalLine, title: 'Social', main: 'twitter.com/agropredict', sub: 'github.com/agropredict', color: 'text-purple-400' }
  ];

  const faqs = [
    { q: t('contact.faq1Q'), a: t('contact.faq1A') },
    { q: t('contact.faq2Q'), a: t('contact.faq2A') },
    { q: t('contact.faq3Q'), a: t('contact.faq3A') },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-xs font-semibold mb-6">
              <RiCustomerServiceLine /> {t('contact.title')}
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              {t('contact.title')}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-dark-300 text-sm max-w-xl mx-auto">
              {t('contact.subtitle')}
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark-950 to-transparent" />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 md:p-8 rounded-2xl border border-dark-800"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary-500/20 flex items-center justify-center mb-4">
                    <RiCheckboxCircleLine className="text-3xl text-primary-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{t('common.success')}</h3>
                  <p className="text-xs text-dark-400 max-w-sm mx-auto mb-6">
                    {t('contact.formSuccess')}
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-secondary text-xs py-2 px-4">
                    {t('common.back')}
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                    <RiSendPlaneLine className="text-primary-400" /> {t('contact.formTitle')}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('contact.formName')} *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-dark-800/60 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('contact.formEmail')} *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-dark-800/60 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('contact.formSubject')}</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full bg-dark-800/60 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 cursor-pointer"
                      >
                        <option value="">...</option>
                        <option value="technical">Tech</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('contact.formMessage')} *</label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-dark-800/60 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all resize-none"
                      />
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                      <RiSendPlaneLine /> {t('contact.formSubmit')}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            {contactInfo.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="glass-card p-5 rounded-xl border border-dark-800 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center flex-shrink-0">
                  <item.icon className={`text-xl ${item.color}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-dark-300 mt-1">{item.main}</p>
                  <p className="text-[10px] text-dark-500">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-title text-center mb-10">
          {t('contact.faqTitle')}
        </motion.h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-xl border border-dark-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-dark-800/20 transition-colors"
              >
                <span className="flex items-center gap-3 text-xs font-semibold text-white">
                  <RiQuestionLine className="text-primary-400 flex-shrink-0" />
                  {faq.q}
                </span>
                <RiArrowDownSLine className={`text-dark-400 flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pl-11 text-xs text-dark-300 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
