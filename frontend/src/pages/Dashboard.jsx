import { motion } from 'framer-motion';
import {
  RiPlantLine, RiBarChart2Line, RiDropLine, RiTempColdLine,
  RiLineChartLine, RiCheckboxCircleLine, RiArrowRightUpLine,
  RiCalendarLine, RiAlertLine, RiSeedlingLine, RiCloudLine, RiSearchEyeLine
} from 'react-icons/ri';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import StatsCard from '../components/common/StatsCard';
import ChartCard from '../components/common/ChartCard';
import AnimatedCard from '../components/common/AnimatedCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import api from '../services/api';

const PREDICTIONS_STORAGE_KEY = 'agropredict-predictions';

// Helper to read persisted predictions from localStorage (shared with Prediction.jsx)
function loadStoredPredictions() {
  try {
    const stored = localStorage.getItem(PREDICTIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const yieldData = [
  { month: 'Jan', rice: 3200, wheat: 2800, maize: 2100 },
  { month: 'Feb', rice: 3400, wheat: 2900, maize: 2300 },
  { month: 'Mar', rice: 3100, wheat: 3200, maize: 2500 },
  { month: 'Apr', rice: 3600, wheat: 3000, maize: 2700 },
  { month: 'May', rice: 3900, wheat: 2700, maize: 2900 },
  { month: 'Jun', rice: 4200, wheat: 2500, maize: 3100 },
];

const cropProduction = [
  { crop: 'Rice', production: 4200, fill: '#10b981' },
  { crop: 'Wheat', production: 3800, fill: '#34d399' },
  { crop: 'Maize', production: 3100, fill: '#6ee7b7' },
  { crop: 'Cotton', production: 2400, fill: '#059669' },
  { crop: 'Sugarcane', production: 5100, fill: '#047857' },
];

const soilData = [
  { name: 'Clay', value: 28, color: '#10b981' },
  { name: 'Loam', value: 35, color: '#34d399' },
  { name: 'Sandy', value: 18, color: '#6ee7b7' },
  { name: 'Silt', value: 12, color: '#059669' },
  { name: 'Other', value: 7, color: '#047857' },
];

const weatherTrend = [
  { day: 'Mon', temp: 28, humidity: 65, rainfall: 2 },
  { day: 'Tue', temp: 30, humidity: 60, rainfall: 0 },
  { day: 'Wed', temp: 27, humidity: 72, rainfall: 15 },
  { day: 'Thu', temp: 29, humidity: 68, rainfall: 5 },
  { day: 'Fri', temp: 31, humidity: 55, rainfall: 0 },
  { day: 'Sat', temp: 26, humidity: 80, rainfall: 22 },
  { day: 'Sun', temp: 28, humidity: 70, rainfall: 8 },
];



const customTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-dark px-4 py-3 rounded-xl border border-dark-700/50 shadow-xl">
      <p className="text-white font-medium text-sm mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString()} {p.name === 'temp' ? '°C' : p.name === 'humidity' ? '%' : 'kg/ha'}
        </p>
      ))}
    </div>
  );
};

// Compute stats from an array of prediction objects
function computeStatsFromPredictions(preds) {
  if (!preds || preds.length === 0) {
    return {
      total_predictions: 0, average_yield: 0, active_crops: 0, accuracy_rate: 0,
      predictions_trend: 0, yield_trend: 0, crops_trend: 0, accuracy_trend: 0
    };
  }
  const totalPreds = preds.length;
  const avgYield = preds.reduce((sum, p) => sum + (p.predicted_yield || 0), 0) / totalPreds;
  const avgConfidence = preds.reduce((sum, p) => sum + (p.confidence || 0), 0) / totalPreds;
  const uniqueCrops = new Set(preds.map(p => p.crop_type)).size;

  return {
    total_predictions: totalPreds,
    average_yield: Math.round(avgYield * 100) / 100,
    active_crops: uniqueCrops,
    accuracy_rate: Math.round(avgConfidence * 10) / 10,
    predictions_trend: 5.0,
    yield_trend: 2.5,
    crops_trend: 0.0,
    accuracy_trend: 1.0
  };
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const { t, language } = useLanguage();
  
  const [stats, setStats] = useState({
    total_predictions: 0, average_yield: 0, active_crops: 0, accuracy_rate: 0,
    predictions_trend: 0, yield_trend: 0, crops_trend: 0, accuracy_trend: 0
  });
  const [predictions, setPredictions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      // --- Fetch from backend API ---
      try {
        setIsLoading(true);
        const [statsRes, predsRes, recsRes] = await Promise.all([
          api.get('/analytics/dashboard-stats').catch(() => ({ data: {} })),
          api.get('/predictions/').catch(() => ({ data: { predictions: [] } })),
          api.get('/recommendations/').catch(() => ({ data: { recommendations: [] } }))
        ]);
        
        if (statsRes.data && statsRes.data.total_predictions !== undefined) {
          setStats(statsRes.data);
        } else {
          // Fallback: compute stats from fetched predictions
          const preds = predsRes.data?.predictions || [];
          setStats(computeStatsFromPredictions(preds));
        }
        
        const fetchedPreds = predsRes.data?.predictions || [];
        if (fetchedPreds.length > 0) {
          setPredictions(fetchedPreds.slice(0, 5));
        } else {
          // Fallback: try localStorage
          const storedPreds = loadStoredPredictions();
          setPredictions(storedPreds.slice(0, 5));
          if (storedPreds.length > 0) {
            setStats(computeStatsFromPredictions(storedPreds));
          }
        }
        
        if (recsRes.data && recsRes.data.recommendations) {
          setRecommendations(recsRes.data.recommendations.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching dynamic dashboard data:", error);
        // Fallback: try localStorage
        const storedPreds = loadStoredPredictions();
        setPredictions(storedPreds.slice(0, 5));
        setStats(computeStatsFromPredictions(storedPreds));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, token]);

  const localizedQuickActions = [
    { title: t('dashboard.newPrediction'), desc: t('dashboard.predictCropYield'), icon: RiPlantLine, path: '/prediction', color: 'from-primary-500 to-primary-700' },
    { title: t('dashboard.checkWeather'), desc: t('dashboard.viewForecast'), icon: RiCloudLine, path: '/weather', color: 'from-blue-500 to-blue-700' },
    { title: t('dashboard.scanDisease'), desc: t('dashboard.uploadLeafImage'), icon: RiSearchEyeLine, path: '/disease-detection', color: 'from-accent-500 to-accent-700' },
    { title: t('dashboard.viewAnalytics'), desc: t('dashboard.insightsAndTrends'), icon: RiBarChart2Line, path: '/analytics', color: 'from-purple-500 to-purple-700' },
  ];

  const localizedRecommendations = [
    { title: t('dashboard.increaseIrrigation'), desc: 'Wheat field Zone-B requires 20% more water due to dry conditions.', priority: 'high', icon: RiDropLine },
    { title: t('dashboard.applyFertilizer'), desc: 'Rice paddy needs nitrogen top-dressing within 3 days for optimal growth.', priority: 'medium', icon: RiSeedlingLine },
    { title: t('dashboard.weatherAlert'), desc: 'Heavy rainfall expected Thursday. Ensure proper drainage in all fields.', priority: 'high', icon: RiAlertLine },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-800/40 via-primary-700/20 to-dark-900 border border-primary-500/10 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
              {t('dashboard.welcomeBack')} <span className="text-gradient">{user?.full_name || t('common.farmer')}!</span>
            </h1>
            <p className="text-dark-300 mt-2 flex items-center gap-2">
              <RiCalendarLine /> {new Date().toLocaleDateString(language, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-dark-400">
              <span className="flex items-center gap-1"><RiTempColdLine className="text-accent-400" /> 28°C {t('dashboard.sunny')}</span>
              <span className="flex items-center gap-1"><RiDropLine className="text-blue-400" /> 65% {t('dashboard.humidity')}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="/prediction" className="btn-primary text-sm flex items-center gap-2">
              <RiPlantLine /> {t('dashboard.newPrediction')}
            </a>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={RiLineChartLine} label={t('dashboard.totalPredictions')} value={stats.total_predictions} trend={stats.predictions_trend} color="primary" delay={0.1} />
        <StatsCard icon={RiPlantLine} label={t('dashboard.averageYield')} value={stats.average_yield} trend={stats.yield_trend} trendLabel="kg/ha avg" color="accent" delay={0.2} />
        <StatsCard icon={RiSeedlingLine} label={t('dashboard.activeCrops')} value={stats.active_crops} trend={stats.crops_trend} color="blue" delay={0.3} />
        <StatsCard icon={RiCheckboxCircleLine} label={t('dashboard.accuracyRate')} value={`${stats.accuracy_rate}%`} trend={stats.accuracy_trend} color="purple" delay={0.4} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title={t('dashboard.yieldOverTime')} subtitle={t('dashboard.yieldOverTimeSub')} delay={0.2}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={customTooltip} />
              <Legend />
              <Line type="monotone" dataKey="rice" name="Rice" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="wheat" name="Wheat" stroke="#34d399" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="maize" name="Maize" stroke="#6ee7b7" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('dashboard.cropProduction')} subtitle={t('dashboard.cropProductionSub')} delay={0.3}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cropProduction}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="crop" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={customTooltip} />
              <Bar dataKey="production" name="Production" radius={[6, 6, 0, 0]}>
                {cropProduction.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title={t('dashboard.soilDistribution')} subtitle={t('dashboard.soilDistributionSub')} delay={0.3}>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie data={soilData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {soilData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {soilData.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-dark-300">{s.name}</span>
                  <span className="text-xs text-dark-500">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title={t('dashboard.weatherTrends')} subtitle={t('dashboard.weatherTrendsSub')} delay={0.4}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weatherTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={customTooltip} />
              <Area type="monotone" dataKey="temp" name="temp" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="rainfall" name="rainfall" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-display font-semibold text-white mb-4">{t('dashboard.quickActions')}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {localizedQuickActions.map((action, i) => (
            <motion.a key={i} href={action.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              whileHover={{ y: -4 }} className="glass-card p-4 group cursor-pointer">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <action.icon className="text-white text-lg" />
              </div>
              <h4 className="text-white font-medium text-sm">{action.title}</h4>
              <p className="text-xs text-dark-500 mt-0.5">{action.desc}</p>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Recent Predictions & Recommendations */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title={t('dashboard.recentPredictions')} subtitle={t('dashboard.latestYieldPredictions')} className="lg:col-span-2" delay={0.2}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="text-left py-3 px-2 text-dark-400 font-medium">{t('dashboard.crop')}</th>
                  <th className="text-left py-3 px-2 text-dark-400 font-medium">{t('dashboard.date')}</th>
                  <th className="text-right py-3 px-2 text-dark-400 font-medium">{t('dashboard.yieldKgHa')}</th>
                  <th className="text-right py-3 px-2 text-dark-400 font-medium">{t('dashboard.confidence')}</th>
                  <th className="text-right py-3 px-2 text-dark-400 font-medium">{t('dashboard.status')}</th>
                </tr>
              </thead>
              <tbody>
                {predictions.length > 0 ? predictions.map((p) => (
                  <tr key={p.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                    <td className="py-3 px-2 text-white font-medium flex items-center gap-2">
                      <RiPlantLine className="text-primary-400" /> {p.crop_type}
                    </td>
                    <td className="py-3 px-2 text-dark-400">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-2 text-right text-white">{p.predicted_yield?.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-primary-400">{p.confidence}%</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className={`badge ${p.confidence > 90 ? 'badge-success' : 'badge-warning'}`}>{p.confidence > 90 ? 'High' : 'Medium'}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-dark-400">
                      No predictions found. Head to the Predictor to start!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <div className="space-y-4">
          <h3 className="text-lg font-display font-semibold text-white">{t('dashboard.aiRecommendations')}</h3>
          {localizedRecommendations.map((rec, i) => (
            <AnimatedCard key={i} delay={0.1 * i} className="!p-4">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  rec.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-accent-500/20 text-accent-400'
                }`}>
                  <rec.icon size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium text-sm">{rec.title}</h4>
                    <span className={`badge text-[10px] ${rec.priority === 'high' ? 'badge-danger' : 'badge-warning'}`}>{rec.priority}</span>
                  </div>
                  <p className="text-xs text-dark-400 mt-1 leading-relaxed">{rec.desc}</p>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
}
