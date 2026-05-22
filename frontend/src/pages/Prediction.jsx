import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiSeedlingLine, RiWaterFlashLine, RiTempHotLine, RiMistLine, 
  RiFlaskLine, RiRuler2Line, RiCompass3Line, RiHistoryLine, 
  RiLoader4Line, RiDownloadLine, RiCheckDoubleLine 
} from 'react-icons/ri';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { predictYield, getPredictionHistory } from '../services/predictions';
import { CROP_TYPES, SOIL_TYPES } from '../utils/constants';
import AnimatedCard from '../components/common/AnimatedCard';

const PREDICTIONS_STORAGE_KEY = 'agropredict-predictions';

// Helper to read persisted predictions from localStorage
function loadStoredPredictions() {
  try {
    const stored = localStorage.getItem(PREDICTIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Helper to persist predictions to localStorage
function savePredictions(predictions) {
  try {
    localStorage.setItem(PREDICTIONS_STORAGE_KEY, JSON.stringify(predictions));
  } catch {
    // Storage full or unavailable – silently ignore
  }
}

export default function Prediction() {
  const { token } = useAuth();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    crop_type: 'Rice',
    soil_type: 'Loam',
    rainfall: 150,
    temperature: 26,
    humidity: 70,
    fertilizer_usage: 120,
    land_area: 2.0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('predict');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getPredictionHistory(1, 50);
      const preds = res.predictions || [];
      setHistory(preds);
      // Also mirror backend data to localStorage so Dashboard can read it
      savePredictions(preds);
    } catch (err) {
      console.warn("Prediction history API fetch failed:", err);
      // Fallback: try loading from localStorage
      const stored = loadStoredPredictions();
      if (stored.length > 0) {
        setHistory(stored);
      }
    }
  };

  const handleInputChange = (name, val) => {
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await predictYield(formData);
      setResult(res.prediction);
      // Refresh history from backend after a new prediction
      fetchHistory();
      toast.success(t('prediction.predictedYield') + '!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to connect to ML Model. Try starting the backend.');
    } finally {
      setLoading(false);
    }
  };

  const round = (num, places) => {
    return +(Math.round(num + "e+" + places)  + "e-" + places);
  };

  // Yield Chart setup (Predicted vs Regional Benchmarks)
  const chartData = result ? [
    { name: t('prediction.predictedYield'), yield: result.yield_per_hectare, fill: '#059669' },
    { name: 'Regional Average', yield: formData.crop_type === 'Rice' ? 3.5 : (formData.crop_type === 'Wheat' ? 3.1 : 2.8), fill: '#1f2937' },
    { name: 'Peak Harvest Yield', yield: formData.crop_type === 'Rice' ? 4.9 : (formData.crop_type === 'Wheat' ? 4.2 : 3.8), fill: '#34d399' }
  ] : [];

  return (
    <div className="space-y-8 p-1">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold font-outfit text-white tracking-tight flex items-center gap-3">
          <RiSeedlingLine className="text-primary-500 animate-pulse-slow" />
          {t('prediction.title')}
        </h1>
        <p className="text-slate-400 mt-2">{t('prediction.subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-4">
        <button 
          onClick={() => setActiveTab('predict')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-300 ${activeTab === 'predict' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          {t('prediction.predictYield')}
        </button>
        <button 
          onClick={() => { setActiveTab('history'); fetchHistory(); }}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-300 ${activeTab === 'history' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          {t('prediction.predictionHistory')}
        </button>
      </div>

      {activeTab === 'predict' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Panel */}
          <div className="lg:col-span-7">
            <AnimatedCard delay={0.1} className="glass p-8 border border-white/5 rounded-2xl bg-dark-900/50 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Crop selection */}
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
                      <RiSeedlingLine className="text-emerald-500" />
                      {t('prediction.cropType')}
                    </label>
                    <select 
                      value={formData.crop_type}
                      onChange={(e) => handleInputChange('crop_type', e.target.value)}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
                    >
                      {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Soil selection */}
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
                      <RiCompass3Line className="text-emerald-500" />
                      {t('prediction.soilType')}
                    </label>
                    <select 
                      value={formData.soil_type}
                      onChange={(e) => handleInputChange('soil_type', e.target.value)}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
                    >
                      {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Sliders and fields */}
                <div className="space-y-6 pt-2">
                  {/* Rainfall */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <RiWaterFlashLine className="text-cyan-500" />
                        {t('prediction.rainfall')}
                      </label>
                      <span className="text-primary-400 font-bold font-outfit text-sm">{formData.rainfall} mm</span>
                    </div>
                    <input 
                      type="range" min="30" max="450" step="5"
                      value={formData.rainfall}
                      onChange={(e) => handleInputChange('rainfall', e.target.value)}
                      className="w-full accent-primary-500 h-1.5 bg-dark-950 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Temperature */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <RiTempHotLine className="text-amber-500" />
                        {t('prediction.temperature')}
                      </label>
                      <span className="text-primary-400 font-bold font-outfit text-sm">{formData.temperature} °C</span>
                    </div>
                    <input 
                      type="range" min="5" max="45" step="1"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                      className="w-full accent-primary-500 h-1.5 bg-dark-950 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Humidity */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <RiMistLine className="text-sky-500" />
                        {t('prediction.humidity')}
                      </label>
                      <span className="text-primary-400 font-bold font-outfit text-sm">{formData.humidity} %</span>
                    </div>
                    <input 
                      type="range" min="20" max="100" step="1"
                      value={formData.humidity}
                      onChange={(e) => handleInputChange('humidity', e.target.value)}
                      className="w-full accent-primary-500 h-1.5 bg-dark-950 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fertilizer */}
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
                      <RiFlaskLine className="text-indigo-500" />
                      {t('prediction.fertilizerUsage')}
                    </label>
                    <input 
                      type="number" min="0" max="500"
                      value={formData.fertilizer_usage}
                      onChange={(e) => handleInputChange('fertilizer_usage', e.target.value)}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition font-outfit"
                    />
                  </div>

                  {/* Land Area */}
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
                      <RiRuler2Line className="text-rose-500" />
                      {t('prediction.landArea')}
                    </label>
                    <input 
                      type="number" step="0.1" min="0.1" max="100"
                      value={formData.land_area}
                      onChange={(e) => handleInputChange('land_area', e.target.value)}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition font-outfit"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-emerald-500 hover:from-primary-500 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary-950/20 hover:shadow-primary-950/40 transform hover:-translate-y-0.5 flex justify-center items-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RiLoader4Line className="w-5 h-5 animate-spin" />
                      {t('prediction.predicting')}
                    </>
                  ) : (
                    <>
                      <RiSeedlingLine className="w-5 h-5" />
                      {t('prediction.predictYield')}
                    </>
                  )}
                </button>
              </form>
            </AnimatedCard>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {/* Summary Card */}
                  <div className="glass p-8 border border-primary-500/20 rounded-3xl bg-gradient-to-b from-primary-950/25 to-dark-950/50 backdrop-blur-md relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                      <RiSeedlingLine className="w-48 h-48 text-primary-500" />
                    </div>
                    
                    <span className="bg-primary-950/80 border border-primary-500/30 text-primary-400 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider font-outfit">
                      {t('prediction.result')}
                    </span>
                    
                    <div className="mt-6 space-y-2">
                      <h3 className="text-slate-400 font-medium">{t('prediction.predictedYield')}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold font-outfit text-white tracking-tight bg-clip-text bg-gradient-to-r from-white to-slate-200">
                          {result.predicted_yield}
                        </span>
                        <span className="text-lg font-bold text-primary-400 font-outfit">Tonnes</span>
                      </div>
                      <p className="text-slate-400 text-sm">{result.yield_per_hectare} t/ha × {formData.land_area} ha</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                      {/* Confidence Circle */}
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <svg className="w-16 h-16">
                            <circle className="text-slate-800" strokeWidth="4" stroke="currentColor" fill="transparent" r="24" cx="32" cy="32" />
                            <circle className="text-primary-500" strokeWidth="4" strokeDasharray={`${2 * Math.PI * 24}`} strokeDashoffset={`${2 * Math.PI * 24 * (1 - result.confidence/100)}`} strokeLinecap="round" stroke="currentColor" fill="transparent" r="24" cx="32" cy="32" />
                          </svg>
                          <span className="absolute text-[11px] font-extrabold font-outfit text-white">{result.confidence}%</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-xs">{t('prediction.confidenceScore')}</h4>
                          <p className="text-slate-400 text-[10px]">High fitting rate</p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-primary-400">
                          <RiCheckDoubleLine className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-xs">{t('prediction.soilType')}</h4>
                          <p className="text-primary-400 text-[10px] font-semibold">{formData.soil_type}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benchmark Chart */}
                  <AnimatedCard className="glass p-6 border border-white/5 rounded-2xl shadow-xl">
                    <h3 className="text-white font-bold text-sm mb-4 font-outfit uppercase tracking-wider">Yield Comparison (t/ha)</h3>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                          <Bar dataKey="yield" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Bar key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AnimatedCard>

                  {/* AI Recommendations link reminder */}
                  <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-xl flex items-center gap-3 text-xs text-slate-300">
                    <span className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400">💡</span>
                    <p>NPK fertilization and watering schedule recommendations have been generated and saved under the <strong>{t('nav.smartFarming')}</strong> tab.</p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center glass p-10 border border-white/5 rounded-3xl text-center min-h-[350px]">
                  <RiSeedlingLine className="w-16 h-16 text-slate-700 animate-pulse mb-4" />
                  <h3 className="text-white font-bold text-lg font-outfit">{t('prediction.predictYield')}</h3>
                  <p className="text-slate-400 text-sm max-w-xs mt-2">{t('prediction.subtitle')}</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* History logs */
        <AnimatedCard delay={0.1} className="glass p-8 border border-white/5 rounded-2xl bg-dark-900/50 backdrop-blur-md shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-bold font-outfit text-lg flex items-center gap-2">
              <RiHistoryLine className="text-primary-500" />
              {t('prediction.predictionHistory')}
            </h2>
            <button className="text-xs flex items-center gap-1 text-primary-400 font-semibold hover:underline">
              <RiDownloadLine /> Download CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400 border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-300">
                  <th className="py-4 px-4 font-semibold">{t('dashboard.crop')}</th>
                  <th className="py-4 px-4 font-semibold">{t('prediction.soilType')}</th>
                  <th className="py-4 px-4 font-semibold">Climate (T/R/H)</th>
                  <th className="py-4 px-4 font-semibold">{t('prediction.landArea')}</th>
                  <th className="py-4 px-4 font-semibold">{t('prediction.predictedYield')}</th>
                  <th className="py-4 px-4 font-semibold">{t('prediction.confidenceScore')}</th>
                  <th className="py-4 px-4 font-semibold">{t('dashboard.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.length > 0 ? (
                  history.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition duration-150">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        {log.crop_type}
                      </td>
                      <td className="py-4 px-4">{log.soil_type}</td>
                      <td className="py-4 px-4 text-xs font-outfit">
                        {log.temperature}°C / {log.rainfall}mm / {log.humidity}%
                      </td>
                      <td className="py-4 px-4 font-outfit">{log.land_area} ha</td>
                      <td className="py-4 px-4 text-primary-400 font-bold font-outfit">{log.predicted_yield} t</td>
                      <td className="py-4 px-4 text-xs font-semibold">{log.confidence}%</td>
                      <td className="py-4 px-4 text-xs font-outfit">
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-500">
                      {t('prediction.noPredictions')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </AnimatedCard>
      )}
    </div>
  );
}
