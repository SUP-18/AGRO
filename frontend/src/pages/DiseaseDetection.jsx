import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiSearchEyeLine, RiUploadCloud2Line, RiLoader4Line, RiHistoryLine, 
  RiShieldCheckLine, RiAlertLine, RiVirusLine, RiCapsuleLine, 
  RiSeedlingLine, RiLightbulbLine 
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import AnimatedCard from '../components/common/AnimatedCard';
import FileUpload from '../components/common/FileUpload';

export default function DiseaseDetection() {
  const { token } = useAuth();
  const { t } = useLanguage();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('scan');
  const [treatmentTab, setTreatmentTab] = useState('chemical');

  const statusSteps = [
    t('disease.statusInitializing', 'Initializing advanced agricultural engine...'),
    t('disease.statusAnalyzing', 'Analyzing chlorophyll density ratios...'),
    t('disease.statusVeins', 'Scanning leaf vein deformities...'),
    t('disease.statusNeural', 'Running deep neural networks (ResNet-50)...'),
    t('disease.statusReport', 'Generating botanical diagnosis report...')
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/disease/reports');
      setHistory(res.data.reports || []);
    } catch (err) {
      console.warn("Disease report history API failed.", err);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const startScan = async () => {
    if (!selectedFile) {
      toast.error(t('disease.selectImagePrompt', 'Please select or drop a leaf image first.'));
      return;
    }

    setScanning(true);
    setResult(null);

    // Dynamic scanning status text animation
    let stepIdx = 0;
    setScanStatus(statusSteps[0]);
    const statusInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < statusSteps.length) {
        setScanStatus(statusSteps[stepIdx]);
      }
    }, 900);

    // Connect to Flask backend (Gemini Vision API)
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await api.post('/disease/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearInterval(statusInterval);
      setResult({
        disease_name: response.data.report.disease_name,
        confidence: response.data.report.confidence,
        severity: response.data.details.severity,
        description: response.data.details.description,
        treatment: response.data.report.treatment
      });
      fetchHistory();
      toast.success(t('disease.analysisCompleted', 'Leaf analysis completed!'));
    } catch (err) {
      clearInterval(statusInterval);
      toast.error(err.response?.data?.error || t('disease.failedToAnalyze', 'Failed to analyze leaf. Ensure your backend is running.'));
    } finally {
      setScanning(false);
    }
  };

  const getSeverityColor = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return 'bg-rose-950/80 border-rose-500/30 text-rose-400';
      case 'high': return 'bg-amber-950/80 border-amber-500/30 text-amber-400';
      default: return 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400';
    }
  };

  // Helper parser for database responses
  const parseTreatment = (txt) => {
    if (!txt) return { symptoms: '', chemical: '', organic: '', prevention: '' };
    
    const cleanTxt = txt.replace(/\r\n/g, '\n').trim();
    const sections = {
      symptoms: '',
      chemical: '',
      organic: '',
      prevention: ''
    };
    
    const patterns = [
      { key: 'symptoms', regex: /(?:\*\*|##)?\s*(?:Symptoms|Symptoms:)\s*(?:\*\*|##)?/i },
      { key: 'chemical', regex: /(?:\*\*|##)?\s*(?:Chemical Solution|Chemical Solution:)\s*(?:\*\*|##)?/i },
      { key: 'organic', regex: /(?:\*\*|##)?\s*(?:Organic\/Biological Solution|Organic\/Biological Solution:|Organic Solution|Organic Solution:)\s*(?:\*\*|##)?/i },
      { key: 'prevention', regex: /(?:\*\*|##)?\s*(?:Prevention Measures|Prevention Measures:|Prevention|Prevention:)\s*(?:\*\*|##)?/i }
    ];
    
    const matches = [];
    patterns.forEach(({ key, regex }) => {
      const match = cleanTxt.match(regex);
      if (match) {
        matches.push({
          key,
          index: match.index,
          length: match[0].length
        });
      }
    });
    
    matches.sort((a, b) => a.index - b.index);
    
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index + matches[i].length;
      const end = (i + 1 < matches.length) ? matches[i+1].index : cleanTxt.length;
      
      let content = cleanTxt.slice(start, end).trim();
      content = content.replace(/^[:\-\s\n]+/, '').trim();
      sections[matches[i].key] = content;
    }
    
    if (!sections.symptoms && !sections.chemical && !sections.organic && !sections.prevention) {
      sections.chemical = cleanTxt;
    }
    
    return sections;
  };

  const parsedTreatment = result ? parseTreatment(result.treatment) : null;

  return (
    <div className="space-y-8 p-1">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold font-outfit text-white tracking-tight flex items-center gap-3">
          <RiSearchEyeLine className="text-primary-500 animate-pulse-slow" />
          {t('disease.title')}
        </h1>
        <p className="text-slate-400 mt-2">{t('disease.subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-4">
        <button 
          onClick={() => setActiveTab('scan')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-300 ${activeTab === 'scan' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          {t('disease.diagnoseLeaf', 'Diagnose Leaf Image')}
        </button>
        <button 
          onClick={() => { setActiveTab('history'); fetchHistory(); }}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-300 ${activeTab === 'history' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          {t('disease.reports')}
        </button>
      </div>

      {activeTab === 'scan' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Scanner / Upload Block */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatedCard delay={0.1} className="glass p-8 border border-white/5 rounded-2xl bg-dark-900/50 shadow-2xl relative overflow-hidden">
              {!previewUrl ? (
                /* File upload */
                <div className="space-y-4">
                  <FileUpload onFileSelect={handleFileSelect} acceptedTypes={{ 'image/*': ['.png', '.jpg', '.jpeg'] }} />
                  <div className="text-center">
                    <p className="text-xs text-slate-500">{t('disease.supportedLeaves', 'Supports Rice, Wheat, Tomato, Potato, Maize, and Cotton leaves.')}</p>
                  </div>
                </div>
              ) : (
                /* Scanner View with Laser sweep */
                <div className="space-y-6">
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-dark-950 aspect-[4/3] flex items-center justify-center">
                    <img src={previewUrl} alt="Leaf preview" className="w-full h-full object-cover" />
                    
                    {/* Glowing Green Laser Scanning Sweeper */}
                    {scanning && (
                      <>
                        <motion.div 
                          initial={{ y: '0%' }}
                          animate={{ y: ['0%', '100%', '0%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-500/50 z-10"
                        />
                        <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] animate-pulse" />
                      </>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); setResult(null); }}
                      disabled={scanning}
                      className="flex-1 bg-dark-950 border border-white/10 text-slate-300 font-bold py-3.5 px-6 rounded-xl hover:bg-dark-900 transition duration-300 disabled:opacity-50"
                    >
                      {t('common.cancel')}
                    </button>
                    <button 
                      onClick={startScan}
                      disabled={scanning}
                      className="flex-[2] bg-gradient-to-r from-primary-600 to-emerald-500 hover:from-primary-500 hover:to-emerald-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-primary-950/20 hover:shadow-primary-950/40 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {scanning ? (
                        <>
                          <RiLoader4Line className="w-5 h-5 animate-spin" />
                          {t('disease.detecting')}
                        </>
                      ) : (
                        <>
                          <RiSearchEyeLine className="w-5 h-5" />
                          {t('disease.startScan', 'Start Scanning Diagnosis')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </AnimatedCard>

            {/* Live scanning progress steps display */}
            <AnimatePresence>
              {scanning && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass p-5 border border-primary-500/10 bg-primary-950/5 rounded-xl flex items-center gap-4 text-xs font-semibold text-primary-400 shadow-lg"
                >
                  <RiLoader4Line className="w-5 h-5 animate-spin text-primary-500 flex-shrink-0" />
                  <p className="font-outfit animate-pulse">{scanStatus}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Diagnosis Results Card */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Summary Box */}
                  <div className="glass p-8 border border-white/5 rounded-2xl bg-gradient-to-b from-dark-900/50 to-dark-950/50 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className={`border text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider font-outfit ${getSeverityColor(result.severity)}`}>
                          {t('disease.severity', 'Severity')}: {result.severity}
                        </span>
                        <h2 className="text-2xl font-bold font-outfit text-white tracking-tight mt-4 flex items-center gap-2">
                          <RiVirusLine className="text-rose-500" />
                          {result.disease_name}
                        </h2>
                        <p className="text-slate-400 text-xs mt-3 leading-relaxed">{result.description}</p>
                      </div>
                      
                      {/* Confidence meter */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="relative w-16 h-16">
                          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="4" />
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#10b981" strokeWidth="4"
                              strokeDasharray={`${(result.confidence / 100) * 175.93} 175.93`}
                              strokeLinecap="round" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold font-outfit text-white">{result.confidence}%</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold mt-2">{t('disease.confidence')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Plan tabs */}
                  <AnimatedCard className="glass p-6 border border-white/5 rounded-2xl shadow-xl">
                    <div className="flex border-b border-white/5 gap-2 mb-6 text-xs uppercase tracking-wider font-bold">
                      <button 
                        onClick={() => setTreatmentTab('symptoms')}
                        className={`pb-2.5 px-2.5 transition duration-200 border-b-2 ${treatmentTab === 'symptoms' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                      >
                        {t('disease.tabSymptoms', 'Symptoms')}
                      </button>
                      <button 
                        onClick={() => setTreatmentTab('chemical')}
                        className={`pb-2.5 px-2.5 transition duration-200 border-b-2 ${treatmentTab === 'chemical' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                      >
                        {t('disease.tabChemical', 'Chemical Cure')}
                      </button>
                      <button 
                        onClick={() => setTreatmentTab('organic')}
                        className={`pb-2.5 px-2.5 transition duration-200 border-b-2 ${treatmentTab === 'organic' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                      >
                        {t('disease.tabOrganic', 'Organic DIY')}
                      </button>
                      <button 
                        onClick={() => setTreatmentTab('prevention')}
                        className={`pb-2.5 px-2.5 transition duration-200 border-b-2 ${treatmentTab === 'prevention' ? 'border-primary-500 text-primary-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                      >
                        {t('disease.tabPrevention', 'Prevention')}
                      </button>
                    </div>

                    <div className="text-slate-300 text-xs leading-relaxed font-normal min-h-[120px]">
                      {treatmentTab === 'symptoms' && (
                        <div className="space-y-2">
                          <h4 className="text-white font-bold flex items-center gap-1.5 text-xs uppercase"><RiAlertLine className="text-amber-500" /> {t('disease.keySymptoms', 'Key Plant Symptoms')}</h4>
                          <p className="whitespace-pre-line text-slate-400 mt-2">{parsedTreatment?.symptoms || t('disease.symptomsPlaceholder', 'Symptoms logs seed parameters...')}</p>
                        </div>
                      )}
                      {treatmentTab === 'chemical' && (
                        <div className="space-y-2">
                          <h4 className="text-white font-bold flex items-center gap-1.5 text-xs uppercase"><RiCapsuleLine className="text-indigo-400" /> {t('disease.chemicalFormulations', 'Prescribed Chemical Formulations')}</h4>
                          <p className="text-slate-400 mt-2">{parsedTreatment?.chemical || t('disease.noChemical', 'No chemical treatment specified.')}</p>
                        </div>
                      )}
                      {treatmentTab === 'organic' && (
                        <div className="space-y-2">
                          <h4 className="text-white font-bold flex items-center gap-1.5 text-xs uppercase"><RiSeedlingLine className="text-emerald-400" /> {t('disease.organicAlternatives', 'Homemade Organic Alternatives')}</h4>
                          <p className="text-slate-400 mt-2">{parsedTreatment?.organic || t('disease.noOrganic', 'No organic treatment specified.')}</p>
                        </div>
                      )}
                      {treatmentTab === 'prevention' && (
                        <div className="space-y-2">
                          <h4 className="text-white font-bold flex items-center gap-1.5 text-xs uppercase"><RiLightbulbLine className="text-yellow-400" /> {t('disease.preventativeMeasures', 'Preventative Soil & Seed Measures')}</h4>
                          <p className="text-slate-400 mt-2">{parsedTreatment?.prevention || t('disease.noPrevention', 'No prevention tips specified.')}</p>
                        </div>
                      )}
                    </div>
                  </AnimatedCard>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center glass p-10 border border-white/5 rounded-2xl text-center min-h-[350px]">
                  <RiSearchEyeLine className="w-16 h-16 text-slate-700 animate-pulse mb-4" />
                  <h3 className="text-white font-bold text-lg font-outfit">{t('disease.readyToScan', 'Ready to Scan')}</h3>
                  <p className="text-slate-400 text-sm max-w-xs mt-2">{t('disease.readySubtitle', 'Upload a leaf image to test chlorophyll textures, evaluate vein spots, and generate dynamic remediation schedules.')}</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* History lists */
        <AnimatedCard delay={0.1} className="glass p-8 border border-white/5 rounded-2xl bg-dark-900/50 backdrop-blur-md shadow-2xl">
          <h2 className="text-white font-bold font-outfit text-lg flex items-center gap-2 mb-6">
            <RiHistoryLine className="text-primary-500" />
            {t('disease.reports')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.length > 0 ? (
              history.map((log) => (
                <div key={log.id} className="p-4 border border-white/5 rounded-xl bg-dark-950/30 flex items-center justify-between hover:border-primary-500/20 transition duration-150">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-950/30 border border-rose-500/20 flex items-center justify-center text-rose-500">
                      <RiVirusLine className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm font-outfit">{log.disease_name}</h4>
                      <p className="text-slate-500 text-[10px] mt-0.5">{new Date(log.created_at).toLocaleDateString()} • {log.confidence}% {t('disease.confidence')}</p>
                    </div>
                  </div>
                  <span className="p-2 rounded-lg bg-emerald-950/50 text-primary-400 text-[10px] font-bold uppercase tracking-wider font-outfit flex items-center gap-1 border border-emerald-500/10">
                    <RiShieldCheckLine /> {t('disease.diagnosticSaved', 'Diagnostic Saved')}
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 text-slate-500">
                {t('disease.noReportsDetail', 'No leaf diagnostics found. Perform your first scan to view pathology reports.')}
              </div>
            )}
          </div>
        </AnimatedCard>
      )}
    </div>
  );
}
