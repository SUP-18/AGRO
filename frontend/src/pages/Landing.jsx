import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  RiSeedlingLine, RiPlantLine, RiSearchEyeLine, RiCloudLine,
  RiDropLine, RiBrainLine, RiBarChart2Line, RiArrowRightLine,
  RiMenuLine, RiCloseLine, RiLeafLine, RiShieldCheckLine,
  RiSmartphoneLine, RiGlobalLine, RiMailLine, RiPhoneLine,
  RiMapPinLine, RiTwitterXLine, RiLinkedinLine, RiGithubLine,
  RiArrowDownSLine, RiCheckLine,
  RiAwardLine, RiTimeLine
} from 'react-icons/ri';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' } }),
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const features = [
  { icon: RiPlantLine, title: 'Crop Yield Prediction', desc: 'AI-powered predictions with 95%+ accuracy using advanced machine learning models trained on vast agricultural datasets.' },
  { icon: RiSearchEyeLine, title: 'Disease Detection', desc: 'Upload crop leaf images for instant AI-based disease identification with treatment recommendations.' },
  { icon: RiCloudLine, title: 'Weather Integration', desc: 'Real-time weather data with intelligent farming advisories tailored to your crop and region.' },
  { icon: RiDropLine, title: 'Smart Irrigation', desc: 'Optimized water management schedules based on soil moisture, weather forecasts, and crop requirements.' },
  { icon: RiBrainLine, title: 'AI Recommendations', desc: 'Personalized farming advice on fertilizers, pest control, and best practices powered by artificial intelligence.' },
  { icon: RiBarChart2Line, title: 'Advanced Analytics', desc: 'Comprehensive dashboards with yield trends, regional analysis, and seasonal performance insights.' },
];

const stats = [
  { value: '95.8%', label: 'Prediction Accuracy', icon: RiAwardLine },
  { value: '50+', label: 'Crop Types', icon: RiLeafLine },
  { value: '24/7', label: 'AI Support', icon: RiTimeLine },
];

const steps = [
  { num: '01', title: 'Input Data', desc: 'Enter your crop, soil, and environmental parameters into our intuitive dashboard.' },
  { num: '02', title: 'AI Analysis', desc: 'Our advanced ML models analyze your data against millions of agricultural data points.' },
  { num: '03', title: 'Get Predictions', desc: 'Receive accurate yield predictions with confidence scores and actionable insights.' },
  { num: '04', title: 'Optimize Farming', desc: 'Apply AI recommendations to maximize yields and minimize resource waste.' },
];

const faqs = [
  { q: 'How accurate are the crop yield predictions?', a: 'Our AI models achieve 95.8% prediction accuracy by analyzing historical data, weather patterns, soil conditions, and crop-specific parameters. The models are continuously retrained with new data to improve accuracy.' },
  { q: 'What crops does AgroPredict support?', a: 'AgroPredict supports 50+ crop types including rice, wheat, maize, cotton, sugarcane, potato, tomato, and many more. We are constantly adding support for regional crop varieties.' },
  { q: 'Do I need technical knowledge to use the platform?', a: 'Not at all! AgroPredict is designed for farmers of all technical levels. Our intuitive interface makes it easy to input data and understand predictions without any technical expertise.' },
];

export default function Landing() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <RiSeedlingLine className="text-white text-lg" />
              </div>
              <span className="font-display font-bold text-lg">Agro<span className="text-primary-400">Predict</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {['Home', 'About', 'Features', 'Contact'].map(item => (
                <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-sm text-dark-300 hover:text-primary-400 transition-colors font-medium">
                  {item}
                </Link>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-sm">Login</Link>
              <Link to="/signup" className="btn-primary text-sm !py-2 !px-5">Sign Up</Link>
            </div>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-dark-300">
              {mobileMenu ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-dark-900 border-t border-dark-800 px-4 py-4 space-y-3">
            {['Home', 'About', 'Features', 'Contact'].map(item => (
              <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="block text-dark-300 hover:text-primary-400 py-2" onClick={() => setMobileMenu(false)}>
                {item}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="btn-secondary text-sm flex-1 text-center">Login</Link>
              <Link to="/signup" className="btn-primary text-sm flex-1 text-center">Sign Up</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center pt-16 hero-gradient overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, delay: i * 0.8 }}
              className="absolute text-primary-500/10"
              style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            >
              <RiLeafLine size={40 + i * 10} />
            </motion.div>
          ))}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-6">
                <RiSeedlingLine /> AI-Powered Agriculture Intelligence
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
                AI-Powered Smart Farming for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Future</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-dark-300 mt-6 max-w-2xl leading-relaxed">
                Harness the power of artificial intelligence to maximize crop yields, detect diseases early, and make data-driven farming decisions.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 mt-8 justify-center">
                <Link to="/signup" className="btn-primary text-base flex items-center gap-2 group">
                  Get Started Free <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/features" className="btn-secondary text-base">
                  Explore Features
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-dark-500">
          <RiArrowDownSLine size={24} />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 relative" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-primary-400 font-medium text-sm mb-3">POWERFUL FEATURES</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-display font-bold">
              Everything You Need for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Modern Agriculture</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-dark-400 mt-4 max-w-2xl mx-auto">
              Comprehensive tools powered by AI to revolutionize your farming practices
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="glass-card p-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center mb-4 group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300">
                  <f.icon className="text-primary-400 text-2xl group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 font-display">{f.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-900/50 border-y border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-primary-400 text-2xl" />
                </div>
                <p className="text-3xl md:text-4xl font-bold font-display text-white">{stat.value}</p>
                <p className="text-dark-400 mt-1 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-primary-400 font-medium text-sm mb-3">HOW IT WORKS</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-display font-bold">
              Simple Steps to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Smarter Farming</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="relative text-center">
                {i < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-500/30 to-transparent" />}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center mx-auto mb-4 text-white font-display font-bold text-lg shadow-lg shadow-primary-500/25">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 font-display">{step.title}</h3>
                <p className="text-sm text-dark-400">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-primary-400 font-medium text-sm mb-3">FAQ</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-display font-bold">
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-medium pr-4">{faq.q}</span>
                  <RiArrowDownSLine className={`text-dark-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180 text-primary-400' : ''}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-dark-400 leading-relaxed">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-primary-800/10" />
            <div className="relative z-10">
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-display font-bold mb-4">
                Start Your Smart Farming Journey
              </motion.h2>
              <motion.p variants={fadeUp} className="text-dark-300 mb-8 max-w-lg mx-auto">
                Join thousands of farmers who are already using AI to transform their agricultural practices.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
                <Link to="/signup" className="btn-primary text-base flex items-center gap-2">
                  Get Started Now <RiArrowRightLine />
                </Link>
                <Link to="/contact" className="btn-secondary text-base">Contact Us</Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800/50 py-16 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <RiSeedlingLine className="text-white text-lg" />
                </div>
                <span className="font-display font-bold text-lg">Agro<span className="text-primary-400">Predict</span></span>
              </div>
              <p className="text-sm text-dark-400 leading-relaxed mb-4">AI-Powered Agriculture Intelligence</p>
              <div className="flex gap-3">
                {[RiTwitterXLine, RiLinkedinLine, RiGithubLine].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center text-dark-400 hover:text-primary-400 hover:bg-dark-700 transition-all">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API Docs', 'Changelog'] },
              { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-white mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-sm text-dark-400 hover:text-primary-400 transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-dark-800/50 mt-12 pt-8 text-center">
            <p className="text-sm text-dark-500">© 2026 AgroPredict. All rights reserved. Built with ❤️ for farmers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
