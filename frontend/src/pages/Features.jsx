import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  RiPlantLine, RiBarChart2Line, RiSearchEyeLine, RiLeafLine,
  RiCloudLine, RiBrainLine, RiShieldCheckLine, RiRocketLine,
  RiSmartphoneLine, RiDatabase2Line, RiNotification3Line, RiTeamLine,
  RiArrowRightLine, RiCheckLine, RiSeedlingLine, RiFlaskLine
} from 'react-icons/ri';
import { useLanguage } from '../context/LanguageContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } })
};

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: RiPlantLine,
      title: t('features.cropPrediction'),
      desc: t('features.cropPredictionDesc'),
      highlights: ['Multi-crop support', 'Real-time scoring', 'Historical trends'],
      color: 'from-primary-500 to-emerald-600',
      accent: 'text-primary-400'
    },
    {
      icon: RiSearchEyeLine,
      title: t('features.diseaseDetection'),
      desc: t('features.diseaseDetectionDesc'),
      highlights: ['12+ plant species', '40+ disease profiles', 'Treatment guides'],
      color: 'from-red-500 to-rose-600',
      accent: 'text-red-400'
    },
    {
      icon: RiBarChart2Line,
      title: t('features.marketAnalysis'),
      desc: t('features.marketAnalysisDesc'),
      highlights: ['Predictive pricing', 'Export visualizations', 'Trend analysis'],
      color: 'from-blue-500 to-indigo-600',
      accent: 'text-blue-400'
    },
    {
      icon: RiLeafLine,
      title: t('features.iotIntegration'),
      desc: t('features.iotIntegrationDesc'),
      highlights: ['Soil tracking', 'NPK optimization', 'Sensor telemetry'],
      color: 'from-emerald-500 to-teal-600',
      accent: 'text-emerald-400'
    },
    {
      icon: RiCloudLine,
      title: t('features.weatherIntelligence'),
      desc: t('features.weatherIntelligenceDesc'),
      highlights: ['Hourly charts', 'Rain tracking', 'Severe alerts'],
      color: 'from-cyan-500 to-blue-600',
      accent: 'text-cyan-400'
    },
    {
      icon: RiBrainLine,
      title: t('features.smartIrrigation'),
      desc: t('features.smartIrrigationDesc'),
      highlights: ['Automated schedules', 'Soil monitoring', 'Weather synced'],
      color: 'from-purple-500 to-violet-600',
      accent: 'text-purple-400'
    }
  ];

  const comparisonRows = [
    { feature: t('features.cropPrediction'), agro: true, basic: false, manual: false },
    { feature: t('features.diseaseDetection'), agro: true, basic: false, manual: false },
    { feature: t('features.weatherIntelligence'), agro: true, basic: true, manual: false },
    { feature: t('features.iotIntegration'), agro: true, basic: false, manual: false },
    { feature: t('features.marketAnalysis'), agro: true, basic: true, manual: false },
    { feature: t('features.smartIrrigation'), agro: true, basic: false, manual: false }
  ];

  const stats = [
    { value: '94%', label: 'Prediction Accuracy' },
    { value: '10+', label: 'Crop Varieties' },
    { value: '40+', label: 'Disease Profiles' },
    { value: '<2s', label: 'Response Time' }
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-xs font-semibold mb-6">
              <RiFlaskLine /> {t('features.title')}
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              {t('features.title')}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-dark-300 text-sm md:text-base max-w-2xl mx-auto">
              {t('features.subtitle')}
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-950 to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="glass-card p-6 rounded-2xl border border-dark-800 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-display font-bold text-gradient">{stat.value}</p>
              <p className="text-[10px] text-dark-400 uppercase tracking-wider mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-card p-6 rounded-2xl border border-dark-800 group relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className={`absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white text-xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon />
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-dark-400 leading-relaxed mb-4">{feat.desc}</p>

                <ul className="space-y-1.5">
                  {feat.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px] text-dark-300">
                      <RiCheckLine className={`flex-shrink-0 ${feat.accent}`} />
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* More Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-title text-center mb-10">
          And Much More
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: RiShieldCheckLine, title: 'JWT Authentication', color: 'text-emerald-400' },
            { icon: RiNotification3Line, title: 'Smart Alerts', color: 'text-blue-400' },
            { icon: RiSmartphoneLine, title: 'Responsive Design', color: 'text-purple-400' },
            { icon: RiDatabase2Line, title: 'SQLite Database', color: 'text-cyan-400' },
            { icon: RiRocketLine, title: 'Fast Performance', color: 'text-accent-400' },
            { icon: RiTeamLine, title: 'Admin Dashboard', color: 'text-pink-400' },
            { icon: RiSeedlingLine, title: 'Crop Encyclopedia', color: 'text-primary-400' },
            { icon: RiLeafLine, title: 'Dark Mode Default', color: 'text-emerald-400' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="glass-card p-4 rounded-xl text-center border border-dark-800 hover:border-primary-500/30 transition-all group"
            >
              <item.icon className={`text-2xl ${item.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
              <p className="text-[11px] font-bold text-white">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-title text-center mb-3">
          Platform Comparison
        </motion.h2>
        <p className="text-center text-xs text-dark-400 mb-8">How AgroPredict stacks up against basic tools and traditional farming methods</p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl border border-dark-800 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-dark-800/80 border-b border-dark-700/50">
                  <th className="p-4 text-left text-dark-400 font-semibold">Feature</th>
                  <th className="p-4 text-center font-bold text-primary-400">AgroPredict</th>
                  <th className="p-4 text-center text-dark-400 font-semibold">Basic Apps</th>
                  <th className="p-4 text-center text-dark-400 font-semibold">Manual</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="border-b border-dark-800/50 hover:bg-dark-800/20">
                    <td className="p-3.5 text-white font-medium">{row.feature}</td>
                    <td className="p-3.5 text-center">
                      {row.agro === true ? (
                        <RiCheckLine className="text-primary-400 mx-auto text-base" />
                      ) : row.agro === 'Soon' ? (
                        <span className="badge badge-warning text-[9px]">Soon</span>
                      ) : (
                        <span className="text-dark-600">—</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      {row.basic ? <RiCheckLine className="text-dark-500 mx-auto" /> : <span className="text-dark-600">—</span>}
                    </td>
                    <td className="p-3.5 text-center">
                      {row.manual ? <RiCheckLine className="text-dark-500 mx-auto" /> : <span className="text-dark-600">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 rounded-3xl border border-primary-500/20 relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <RiRocketLine className="text-4xl text-primary-400 mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3">{t('landing_extra.ctaTitle')}</h3>
            <p className="text-xs text-dark-400 mb-6 max-w-lg mx-auto">
              {t('landing_extra.ctaSubtitle')}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/signup" className="btn-primary inline-flex items-center gap-2 text-sm">
                {t('landing_extra.ctaButton')} <RiArrowRightLine />
              </Link>
              <Link to="/about" className="btn-secondary inline-flex items-center gap-2 text-sm">
                {t('landing.learnMore')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
