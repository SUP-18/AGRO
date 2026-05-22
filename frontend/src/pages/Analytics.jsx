import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RiBarChart2Line, RiCompassLine, RiFilterOffLine, RiSearchLine, 
  RiCalendarEventLine, RiShieldStarLine, RiLineChartLine 
} from 'react-icons/ri';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { CROP_TYPES, REGIONS, CHART_COLORS } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import AnimatedCard from '../components/common/AnimatedCard';

export default function Analytics() {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');

  // Realistic mock data structures for complex visualizations
  const yieldTrendsData = [
    { year: '2019', Rice: 3.2, Wheat: 2.8, Maize: 3.6, Cotton: 1.5, Sugarcane: 65.0 },
    { year: '2020', Rice: 3.3, Wheat: 2.9, Maize: 3.8, Cotton: 1.6, Sugarcane: 68.0 },
    { year: '2021', Rice: 3.5, Wheat: 3.1, Maize: 4.0, Cotton: 1.8, Sugarcane: 70.0 },
    { year: '2022', Rice: 3.6, Wheat: 3.2, Maize: 4.1, Cotton: 1.7, Sugarcane: 71.0 },
    { year: '2023', Rice: 3.8, Wheat: 3.4, Maize: 4.3, Cotton: 1.9, Sugarcane: 73.0 },
    { year: '2024', Rice: 3.9, Wheat: 3.5, Maize: 4.5, Cotton: 2.0, Sugarcane: 75.0 }
  ];

  const regionalData = [
    { name: 'Punjab', Rice: 4.2, Wheat: 3.8, Maize: 4.5 },
    { name: 'Haryana', Rice: 4.0, Wheat: 3.6, Maize: 4.3 },
    { name: 'Uttar Pradesh', Rice: 3.7, Wheat: 3.4, Maize: 4.1 },
    { name: 'Madhya Pradesh', Rice: 3.3, Wheat: 3.1, Maize: 3.8 },
    { name: 'Maharashtra', Rice: 3.1, Wheat: 2.9, Maize: 3.6 },
    { name: 'Gujarat', Rice: 2.9, Wheat: 2.8, Maize: 3.5 }
  ];

  const modelAccuracy = [
    { date: 'Jan', randomForest: 91.2, neuralNet: 88.5, baseline: 82.0 },
    { date: 'Feb', randomForest: 91.8, neuralNet: 89.2, baseline: 82.3 },
    { date: 'Mar', randomForest: 92.5, neuralNet: 90.1, baseline: 82.5 },
    { date: 'Apr', randomForest: 93.1, neuralNet: 91.0, baseline: 83.1 },
    { date: 'May', randomForest: 93.8, neuralNet: 92.3, baseline: 83.2 },
    { date: 'Jun', randomForest: 94.2, neuralNet: 93.0, baseline: 83.5 }
  ];

  // Filtering trends based on selected crop
  const getActiveTrends = () => {
    if (selectedCrop === 'All') return yieldTrendsData;
    return yieldTrendsData.map(item => ({
      year: item.year,
      [selectedCrop]: item[selectedCrop] || 3.0
    }));
  };

  const getActiveRegional = () => {
    if (selectedCrop === 'All') return regionalData;
    return regionalData.map(item => ({
      name: item.name,
      [selectedCrop]: item[selectedCrop] || 3.0
    }));
  };

  const resetFilters = () => {
    setSelectedCrop('All');
    setSelectedRegion('All');
  };

  return (
    <div className="space-y-8 p-1">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-white tracking-tight flex items-center gap-3">
            <RiBarChart2Line className="text-primary-500 animate-pulse-slow" />
            {t('analytics.title')}
          </h1>
          <p className="text-slate-400 mt-2">{t('analytics.subtitle')}</p>
        </div>
        
        {/* Reset button */}
        {(selectedCrop !== 'All' || selectedRegion !== 'All') && (
          <button 
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 border border-rose-500/30 bg-rose-950/20 text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-950/40 transition duration-300"
          >
            <RiFilterOffLine /> Clear Active Filters
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <AnimatedCard className="glass p-6 border border-white/5 rounded-2xl bg-dark-900/40 shadow-xl flex flex-wrap gap-6 items-center">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-2">
          <RiSearchLine className="text-primary-500" /> {t('common.search')}
        </span>
        
        {/* Crop Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">{t('prediction.cropType')}:</span>
          <select 
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
          >
            <option value="All">All Crops</option>
            <option value="Rice">Rice</option>
            <option value="Wheat">Wheat</option>
            <option value="Maize">Maize</option>
            <option value="Cotton">Cotton</option>
            <option value="Sugarcane">Sugarcane</option>
          </select>
        </div>

        {/* Region Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">{t('analytics.regionalAnalysis')}:</span>
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
          >
            <option value="All">All Regions</option>
            {REGIONS.slice(0, 6).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </AnimatedCard>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 1. Yield Trends Over Time */}
        <div className="lg:col-span-12">
          <AnimatedCard delay={0.1} className="glass p-6 border border-white/5 rounded-2xl shadow-xl h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <RiLineChartLine className="text-emerald-500 w-5 h-5" />
              <div>
                <h3 className="text-white font-bold font-outfit text-sm uppercase tracking-wider">{t('analytics.yieldTrends')}</h3>
                <p className="text-slate-500 text-xs mt-0.5">Year-over-year production average in Tonnes per Hectare.</p>
              </div>
            </div>
            
            <div className="h-72 w-full flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getActiveTrends()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {selectedCrop === 'All' ? (
                    ['Rice', 'Wheat', 'Maize', 'Cotton'].map((crop, idx) => (
                      <Line 
                        key={crop} type="monotone" dataKey={crop} 
                        stroke={CHART_COLORS[idx]} strokeWidth={2.5} 
                        activeDot={{ r: 6 }} dot={{ r: 3 }}
                      />
                    ))
                  ) : (
                    <Line 
                      type="monotone" dataKey={selectedCrop} 
                      stroke="#10b981" strokeWidth={3} 
                      activeDot={{ r: 7 }} dot={{ r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        {/* 3. Regional Yield Bar Chart */}
        <div className="lg:col-span-6">
          <AnimatedCard delay={0.3} className="glass p-6 border border-white/5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <RiCompassLine className="text-emerald-500 w-5 h-5" />
              <div>
                <h3 className="text-white font-bold font-outfit text-sm uppercase tracking-wider">{t('analytics.regionalAnalysis')}</h3>
                <p className="text-slate-500 text-xs mt-0.5">Average yield levels compared across state borders.</p>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getActiveRegional()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {selectedCrop === 'All' ? (
                    ['Rice', 'Wheat', 'Maize'].map((crop, idx) => (
                      <Bar key={crop} dataKey={crop} fill={CHART_COLORS[idx]} radius={[4, 4, 0, 0]} />
                    ))
                  ) : (
                    <Bar dataKey={selectedCrop} fill="#10b981" radius={[6, 6, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
        </div>

        {/* 4. Model Accuracy Projections */}
        <div className="lg:col-span-6">
          <AnimatedCard delay={0.4} className="glass p-6 border border-white/5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <RiShieldStarLine className="text-emerald-500 w-5 h-5" />
              <div>
                <h3 className="text-white font-bold font-outfit text-sm uppercase tracking-wider">{t('analytics.predictionAccuracy')}</h3>
                <p className="text-slate-500 text-xs mt-0.5">R² fitting accuracy progress across model updates.</p>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={modelAccuracy} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[70, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <defs>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" name="Random Forest (AgroPredict)" dataKey="randomForest" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAcc)" />
                  <Area type="monotone" name="Neural Network (Test)" dataKey="neuralNet" stroke="#3b82f6" strokeWidth={1.5} fill="transparent" />
                  <Line type="monotone" name="Baseline Regression" dataKey="baseline" stroke="#f59e0b" strokeWidth={1} dot={false} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
