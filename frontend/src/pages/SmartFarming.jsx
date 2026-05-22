import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiLeafLine, RiDropLine, RiDashboardLine, RiCpuLine, 
  RiSensorLine, RiCalendarTodoLine, RiDashboard3Line, RiFocus2Line, 
  RiCameraLensLine, RiAlertLine, RiSettings4Line, RiCheckboxCircleLine 
} from 'react-icons/ri';
import { useLanguage } from '../context/LanguageContext';
import AnimatedCard from '../components/common/AnimatedCard';

export default function SmartFarming() {
  const { t } = useLanguage();
  const [activePanel, setActivePanel] = useState('iot');
  const [selectedCrop, setSelectedCrop] = useState('Rice');
  
  // IoT live sensor state with periodic update ticks
  const [telemetry, setTelemetry] = useState({
    moisture: 42.5,
    soilTemp: 23.4,
    ph: 6.3,
    sunlight: 14500,
    npk_n: 110,
    npk_p: 55,
    npk_k: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => ({
        moisture: +(prev.moisture + (Math.random() - 0.5) * 0.4).toFixed(1),
        soilTemp: +(prev.soilTemp + (Math.random() - 0.5) * 0.2).toFixed(1),
        ph: +(prev.ph + (Math.random() - 0.5) * 0.05).toFixed(2),
        sunlight: Math.floor(prev.sunlight + (Math.random() - 0.5) * 200),
        npk_n: prev.npk_n,
        npk_p: prev.npk_p,
        npk_k: prev.npk_k
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Standard crop recommendations
  const cropGuidelines = {
    Rice: { N: 120, P: 60, K: 40, water: 'High (30-40 mm)', freq: 'Every 2 days', phRange: '6.0 - 7.0' },
    Wheat: { N: 120, P: 60, K: 60, water: 'Medium (20-25 mm)', freq: 'Every 8 days', phRange: '6.0 - 7.5' },
    Maize: { N: 150, P: 75, K: 50, water: 'Medium (25-30 mm)', freq: 'Every 6 days', phRange: '5.5 - 7.0' },
    Sugarcane: { N: 250, P: 80, K: 120, water: 'High (40-50 mm)', freq: 'Every 4 days', phRange: '6.5 - 7.5' },
    Potato: { N: 120, P: 100, K: 120, water: 'Low (15-20 mm)', freq: 'Every 5 days', phRange: '5.2 - 6.4' }
  };

  const currentGuide = cropGuidelines[selectedCrop] || cropGuidelines['Rice'];

  // Day translation helper
  const translateDay = (day) => {
    switch (day) {
      case 'Monday': return t('common.days.monday', 'Monday');
      case 'Tuesday': return t('common.days.tuesday', 'Tuesday');
      case 'Wednesday': return t('common.days.wednesday', 'Wednesday');
      case 'Thursday': return t('common.days.thursday', 'Thursday');
      case 'Friday': return t('common.days.friday', 'Friday');
      case 'Saturday': return t('common.days.saturday', 'Saturday');
      case 'Sunday': return t('common.days.sunday', 'Sunday');
      default: return day;
    }
  };

  // Task translation helper
  const translateTask = (task) => {
    switch (task) {
      case 'Deep Watering Cycle': return t('smartFarming.taskDeepWatering', 'Deep Watering Cycle');
      case 'Aeration Inspection': return t('smartFarming.taskAeration', 'Aeration Inspection');
      case 'Soil Moisture Check': return t('smartFarming.taskMoistureCheck', 'Soil Moisture Check');
      case 'Secondary Watering Cycle': return t('smartFarming.taskSecondaryWatering', 'Secondary Watering Cycle');
      case 'NPK Nutrition Feed': return t('smartFarming.taskNpkFeed', 'NPK Nutrition Feed');
      case 'Field Drainage Clearance': return t('smartFarming.taskDrainageClearance', 'Field Drainage Clearance');
      case 'Drone Aerial Survey Run': return t('smartFarming.taskDroneSurvey', 'Drone Aerial Survey Run');
      default: return task;
    }
  };

  // Smart watering calendar items
  const calendarSchedule = [
    { day: 'Monday', task: 'Deep Watering Cycle', volume: currentGuide.water, done: true },
    { day: 'Tuesday', task: 'Aeration Inspection', volume: '0 mm', done: true },
    { day: 'Wednesday', task: 'Soil Moisture Check', volume: '0 mm', done: false },
    { day: 'Thursday', task: 'Secondary Watering Cycle', volume: currentGuide.freq === 'Every 2 days' ? currentGuide.water : '0 mm', done: false },
    { day: 'Friday', task: 'NPK Nutrition Feed', volume: '5 mm (nutrient mix)', done: false },
    { day: 'Saturday', task: 'Field Drainage Clearance', volume: '0 mm', done: false },
    { day: 'Sunday', task: 'Drone Aerial Survey Run', volume: '0 mm', done: false }
  ];

  return (
    <div className="space-y-8 p-1">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold font-outfit text-white tracking-tight flex items-center gap-3">
          <RiLeafLine className="text-primary-500 animate-pulse-slow" />
          {t('smartFarming.title')}
        </h1>
        <p className="text-slate-400 mt-2">{t('smartFarming.subtitle')}</p>
      </div>

      {/* Nav Panels */}
      <div className="flex flex-wrap border-b border-white/5 gap-4">
        <button 
          onClick={() => setActivePanel('iot')}
          className={`pb-3 text-sm font-semibold border-b-2 transition duration-200 ${activePanel === 'iot' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          {t('smartFarming.iotSensorTelemetry', 'IoT Sensor Telemetry')}
        </button>
        <button 
          onClick={() => setActivePanel('npk')}
          className={`pb-3 text-sm font-semibold border-b-2 transition duration-200 ${activePanel === 'npk' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          {t('smartFarming.npkFertilizerGauges', 'NPK Fertilizer Gauges')}
        </button>
        <button 
          onClick={() => setActivePanel('irrigation')}
          className={`pb-3 text-sm font-semibold border-b-2 transition duration-200 ${activePanel === 'irrigation' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          {t('smartFarming.irrigationSchedule')}
        </button>
        <button 
          onClick={() => setActivePanel('drone')}
          className={`pb-3 text-sm font-semibold border-b-2 transition duration-200 ${activePanel === 'drone' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          {t('smartFarming.ndviDroneSurveys', 'NDVI Drone Surveys')}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Panel 1: IoT Sensor HUD */}
        {activePanel === 'iot' && (
          <motion.div 
            key="iot" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Moisture */}
            <div className="glass p-6 border border-white/5 rounded-2xl bg-dark-900/50 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-slate-400 font-bold uppercase font-outfit">{t('smartFarming.soilMoisture', 'Soil Moisture')}</span>
                <RiDropLine className="text-sky-500 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-4xl font-extrabold font-outfit text-white tracking-tight">{telemetry.moisture}%</h3>
                <p className="text-[10px] text-primary-400 font-semibold mt-2">{t('smartFarming.optimalWaterBalance', 'Optimal Water Balance')}</p>
              </div>
            </div>

            {/* Temperature */}
            <div className="glass p-6 border border-white/5 rounded-2xl bg-dark-900/50 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-slate-400 font-bold uppercase font-outfit">{t('smartFarming.soilTemperature', 'Soil Temperature')}</span>
                <RiSensorLine className="text-amber-500 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-4xl font-extrabold font-outfit text-white tracking-tight">{telemetry.soilTemp}°C</h3>
                <p className="text-[10px] text-primary-400 font-semibold mt-2">{t('smartFarming.idealRootWarming', 'Ideal Root Warming')}</p>
              </div>
            </div>

            {/* pH */}
            <div className="glass p-6 border border-white/5 rounded-2xl bg-dark-900/50 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-slate-400 font-bold uppercase font-outfit">{t('smartFarming.soilPhReaction', 'Soil pH Reaction')}</span>
                <RiCpuLine className="text-indigo-500 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-4xl font-extrabold font-outfit text-white tracking-tight">{telemetry.ph}</h3>
                <p className="text-[10px] text-amber-500 font-semibold mt-2">{t('smartFarming.phStatusNormal', 'Slightly Acidic (Normal)')}</p>
              </div>
            </div>

            {/* Sunlight */}
            <div className="glass p-6 border border-white/5 rounded-2xl bg-dark-900/50 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-slate-400 font-bold uppercase font-outfit">{t('smartFarming.activeSolarLight', 'Active Solar Light')}</span>
                <RiFocus2Line className="text-yellow-500 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-4xl font-extrabold font-outfit text-white tracking-tight">{telemetry.sunlight} lx</h3>
                <p className="text-[10px] text-primary-400 font-semibold mt-2">{t('smartFarming.peakPhotosynthesis', 'Peak Photosynthesis Rate')}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Panel 2: NPK Gauges */}
        {activePanel === 'npk' && (
          <motion.div 
            key="npk" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Form & details */}
            <div className="lg:col-span-5 space-y-6">
              <AnimatedCard className="glass p-8 border border-white/5 rounded-2xl bg-dark-900/50">
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">{t('smartFarming.cropNutrientTarget', 'Crop Nutrient Target')}</label>
                <select 
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 transition mb-6"
                >
                  <option value="Rice">{t('crops.rice', 'Rice')}</option>
                  <option value="Wheat">{t('crops.wheat', 'Wheat')}</option>
                  <option value="Maize">{t('crops.maize', 'Maize')}</option>
                  <option value="Sugarcane">{t('crops.sugarcane', 'Sugarcane')}</option>
                  <option value="Potato">{t('crops.potato', 'Potato')}</option>
                </select>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400 font-medium">{t('smartFarming.optimalSoilPh', 'Optimal Soil pH:')}</span>
                    <span className="text-white font-bold">{currentGuide.phRange}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400 font-medium">{t('smartFarming.wateringFrequency', 'Watering frequency:')}</span>
                    <span className="text-white font-bold">{currentGuide.freq}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400 font-medium">{t('smartFarming.targetVolume', 'Target volume:')}</span>
                    <span className="text-primary-400 font-bold">{currentGuide.water}</span>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Gauges display */}
            <div className="lg:col-span-7">
              <AnimatedCard className="glass p-8 border border-white/5 rounded-2xl bg-dark-900/50 shadow-xl">
                <h3 className="text-white font-bold font-outfit text-sm uppercase tracking-wider mb-6">{t('smartFarming.targetNpkOptimization', 'Target NPK Optimization (kg/hectare)')}</h3>
                
                <div className="space-y-6">
                  {/* Nitrogen */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-rose-400 font-bold font-outfit">{t('smartFarming.nitrogenLabel', 'Nitrogen (N) - Leafy Growth')}</span>
                      <span className="text-white font-extrabold">{currentGuide.N} kg/ha</span>
                    </div>
                    <div className="w-full bg-dark-950 h-3.5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(currentGuide.N / 280) * 100}%` }} />
                    </div>
                  </div>

                  {/* Phosphorus */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-sky-400 font-bold font-outfit">{t('smartFarming.phosphorusLabel', 'Phosphorus (P) - Root Systems')}</span>
                      <span className="text-white font-extrabold">{currentGuide.P} kg/ha</span>
                    </div>
                    <div className="w-full bg-dark-950 h-3.5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(currentGuide.P / 150) * 100}%` }} />
                    </div>
                  </div>

                  {/* Potassium */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-amber-400 font-bold font-outfit">{t('smartFarming.potassiumLabel', 'Potassium (K) - Disease Resistance')}</span>
                      <span className="text-white font-extrabold">{currentGuide.K} kg/ha</span>
                    </div>
                    <div className="w-full bg-dark-950 h-3.5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(currentGuide.K / 150) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </motion.div>
        )}

        {/* Panel 3: Irrigation calendar */}
        {activePanel === 'irrigation' && (
          <motion.div 
            key="irrigation" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            className="glass p-8 border border-white/5 rounded-2xl bg-dark-900/50 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold font-outfit text-sm uppercase tracking-wider flex items-center gap-2">
                <RiCalendarTodoLine className="text-primary-500" /> {t('smartFarming.smartIrrigationSchedule', 'Smart Irrigation Schedule')} ({t('crops.' + selectedCrop.toLowerCase(), selectedCrop)})
              </h3>
              <span className="text-[10px] bg-primary-950/80 border border-primary-500/20 text-primary-400 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                {t('smartFarming.weatherSynchronized', 'Weather Synchronized')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {calendarSchedule.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between min-h-[140px] transition duration-200 ${item.done ? 'bg-primary-950/20 border-primary-500/20' : 'bg-dark-950/30 border-white/5 hover:border-white/10'}`}>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase font-outfit">{translateDay(item.day)}</span>
                      {item.done && <RiCheckboxCircleLine className="text-primary-400 w-4 h-4" />}
                    </div>
                    <h4 className="text-white font-bold text-xs leading-snug">{translateTask(item.task)}</h4>
                  </div>
                  <div className="text-[10px] font-bold font-outfit text-primary-400 mt-4">
                    {t('smartFarming.vol', 'Vol')}: {item.volume}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Panel 4: Drone Aerial NDVI scan mockup */}
        {activePanel === 'drone' && (
          <motion.div 
            key="drone" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Viewfinder Mockup */}
            <div className="lg:col-span-8">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[16/10] bg-dark-950 shadow-2xl flex items-center justify-center">
                {/* Visual scan image - high end mock aerial view */}
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800')" }} />
                
                {/* NDVI Biomass heatmap color gradient layers */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-primary-500/20 to-transparent" />
                
                {/* Grid Camera overlay */}
                <div className="absolute inset-0 border-[2px] border-emerald-500/30 m-8 rounded-2xl flex flex-col justify-between p-6">
                  {/* Viewfinder brackets */}
                  <div className="flex justify-between text-xs text-emerald-400 font-bold uppercase font-outfit tracking-wider">
                    <span className="flex items-center gap-1.5"><RiCameraLensLine className="animate-spin-slow text-sm" /> {t('smartFarming.liveDroneScan', 'REC • LIVE DRONE SCAN')}</span>
                    <span>HD 1080P</span>
                  </div>
                  
                  {/* Center brackets */}
                  <div className="self-center border border-dashed border-emerald-400/40 w-16 h-16 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  </div>

                  {/* Telemetry data overlays */}
                  <div className="flex justify-between items-end text-[10px] text-emerald-400 font-mono">
                    <div className="space-y-1">
                      <p>ALT: 120 METERS</p>
                      <p>WND: 8.4 KM/H</p>
                      <p>BAT: 78%</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p>NDVI BIOMASS INDEX: 0.84</p>
                      <p>HEALTH LEVEL: OPTIMAL</p>
                      <p>COORDS: 30.9010° N, 75.8573° E</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drone Controls / details panel */}
            <div className="lg:col-span-4 space-y-6">
              <AnimatedCard className="glass p-6 border border-white/5 rounded-2xl bg-dark-900/50 shadow-xl">
                <h3 className="text-white font-bold font-outfit text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <RiSettings4Line className="animate-spin-slow" /> {t('smartFarming.ndviSurveillanceDiagnostic', 'NDVI Surveillance Diagnostic')}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">{t('smartFarming.ndviExplanation', 'NDVI (Normalized Difference Vegetation Index) uses drone multispectral imagery to measure active crop chlorophyll biomass health levels.')}</p>

                <div className="space-y-4 pt-6 border-t border-white/5 text-xs">
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center justify-between">
                      <span>{t('smartFarming.surveillanceStatus', 'Surveillance Status')}</span>
                      <span className="text-primary-400 font-bold">{t('smartFarming.active', 'ACTIVE')}</span>
                    </h4>
                    <div className="w-full bg-dark-950 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-xl flex items-center gap-3 text-xs text-slate-300">
                    <RiAlertLine className="text-primary-400 w-5 h-5 flex-shrink-0" />
                    <p className="text-[10px] leading-relaxed">{t('smartFarming.weedAlertMessage', 'Surrounding weeds identified in quadrant B-4. High chlorophyll spikes indicate localized thistle patches.')}</p>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
