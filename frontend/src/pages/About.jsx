import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  RiSeedlingLine, RiTeamLine, RiRocketLine, RiShieldCheckLine,
  RiBarChart2Line, RiPlantLine, RiCloudLine, RiBrainLine,
  RiGlobalLine, RiAwardLine, RiCodeSSlashLine, RiDatabase2Line,
  RiArrowRightLine, RiLeafLine
} from 'react-icons/ri';
import { useLanguage } from '../context/LanguageContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } })
};

export default function About() {
  const { t } = useLanguage();

  const team = [
    { name: t('about.team.member1.name'), role: t('about.team.member1.role'), expertise: t('about.team.member1.expertise'), initials: 'PS', color: 'from-primary-500 to-primary-700' },
    { name: t('about.team.member2.name'), role: t('about.team.member2.role'), expertise: t('about.team.member2.expertise'), initials: 'AM', color: 'from-blue-500 to-blue-700' },
    { name: t('about.team.member3.name'), role: t('about.team.member3.role'), expertise: t('about.team.member3.expertise'), initials: 'SJ', color: 'from-purple-500 to-purple-700' },
    { name: t('about.team.member4.name'), role: t('about.team.member4.role'), expertise: t('about.team.member4.expertise'), initials: 'VP', color: 'from-accent-500 to-accent-700' }
  ];

  const milestones = [
    { year: '2024', title: t('about.milestones.m1.title'), desc: t('about.milestones.m1.desc') },
    { year: '2025', title: t('about.milestones.m2.title'), desc: t('about.milestones.m2.desc') },
    { year: '2026', title: t('about.milestones.m3.title'), desc: t('about.milestones.m3.desc') }
  ];

  const techStack = [
    { name: 'React 18', desc: t('about.techStack.react'), icon: RiCodeSSlashLine },
    { name: 'Flask API', desc: t('about.techStack.flask'), icon: RiDatabase2Line },
    { name: 'Scikit-Learn', desc: t('about.techStack.scikit'), icon: RiBrainLine },
    { name: 'SQLite', desc: t('about.techStack.sqlite'), icon: RiDatabase2Line },
    { name: 'Recharts', desc: t('about.techStack.recharts'), icon: RiBarChart2Line },
    { name: 'Framer Motion', desc: t('about.techStack.framer'), icon: RiRocketLine }
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative z-10">
          <motion.div initial="hidden" animate="visible" className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-xs font-semibold mb-6">
              <RiSeedlingLine /> {t('about.title')}
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              {t('about.subtitle')}
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-dark-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              {t('about.desc')}
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-950 to-transparent" />
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: RiPlantLine, title: t('about.missionTitle'), desc: t('about.missionDesc'), color: 'text-primary-400' },
            { icon: RiGlobalLine, title: t('about.visionTitle'), desc: t('about.visionDesc'), color: 'text-blue-400' },
            { icon: RiAwardLine, title: t('about.valuesTitle'), desc: t('about.valuesDesc'), color: 'text-accent-400' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="glass-card p-6 rounded-2xl border border-dark-800"
            >
              <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center mb-4">
                <item.icon className={`text-2xl ${item.color}`} />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-dark-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-title text-center mb-12">
          {t('about.journeyTitle')}
        </motion.h2>

        <div className="relative pl-8">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-500 via-primary-600 to-dark-800" />
          {milestones.map((ms, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="relative mb-10 last:mb-0"
            >
              <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-dark-900 border-2 border-primary-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary-400" />
              </div>
              <div className="glass-card p-5 rounded-xl border border-dark-800">
                <span className="badge badge-success text-[10px] mb-2">{ms.year}</span>
                <h4 className="text-sm font-bold text-white mb-1">{ms.title}</h4>
                <p className="text-xs text-dark-400 leading-relaxed">{ms.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-title text-center mb-3">
          {t('about.teamTitle')}
        </motion.h2>
        <p className="text-center text-dark-400 text-xs mb-10">{t('about.teamSubtitle')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-card p-6 rounded-2xl text-center border border-dark-800 group"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                {member.initials}
              </div>
              <h4 className="text-sm font-bold text-white">{member.name}</h4>
              <p className="text-[10px] text-primary-400 font-semibold mt-0.5">{member.role}</p>
              <p className="text-[10px] text-dark-500 mt-2">{member.expertise}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-title text-center mb-10">
          {t('about.techTitle')}
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="glass-card p-4 rounded-xl text-center border border-dark-800 hover:border-primary-500/30 transition-all"
            >
              <tech.icon className="text-2xl text-primary-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-white">{tech.name}</p>
              <p className="text-[9px] text-dark-500 mt-0.5">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
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
            <RiLeafLine className="text-4xl text-primary-400 mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3">{t('about.ctaTitle')}</h3>
            <p className="text-xs text-dark-400 mb-6 max-w-lg mx-auto">{t('about.ctaDesc')}</p>
            <Link to="/signup" className="btn-primary inline-flex items-center gap-2 text-sm">
              {t('landing.getStarted')} <RiArrowRightLine />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
