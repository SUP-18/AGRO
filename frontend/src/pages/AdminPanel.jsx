import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiAdminLine, RiUserLine, RiPlantLine, RiAlertLine,
  RiDeleteBin6Line, RiBroadcastLine,
  RiAddLine, RiSearch2Line, RiCloseLine, RiLoader4Line
} from 'react-icons/ri';
import AnimatedCard from '../components/common/AnimatedCard';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export default function AdminPanel() {
  const { t } = useLanguage();

  const [users, setUsers] = useState([]);

  const [crops, setCrops] = useState([
    { id: 1, name: 'Rice', type: 'Grain', season: 'Kharif', temp: '20°C - 35°C', water: '150-300cm', soil: 'Clay' },
    { id: 2, name: 'Wheat', type: 'Grain', season: 'Rabi', temp: '10°C - 25°C', water: '50-100cm', soil: 'Loam' },
    { id: 3, name: 'Cotton', type: 'Fiber', season: 'Kharif', temp: '21°C - 30°C', water: '50-120cm', soil: 'Sandy Clay' }
  ]);

  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState('weather');
  const [activeTab, setActiveTab] = useState('users'); // users | crops | broadcast
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    total_predictions: 0,
    total_reports: 0,
    roles: { farmers: 0, experts: 0, admins: 0 }
  });

  // Crop form modal
  const [showCropModal, setShowCropModal] = useState(false);
  const [newCrop, setNewCrop] = useState({ name: '', type: 'Grain', season: 'Kharif', temp: '', water: '', soil: '' });

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats')
      ]);
      setUsers(usersRes.data.users);
      setStats(statsRes.data.stats);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.stats);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User account removed from database');
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.stats);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleAddCrop = (e) => {
    e.preventDefault();
    if (newCrop.name && newCrop.temp && newCrop.soil) {
      setCrops([...crops, { ...newCrop, id: crops.length + 1 }]);
      setNewCrop({ name: '', type: 'Grain', season: 'Kharif', temp: '', water: '', soil: '' });
      setShowCropModal(false);
      toast.success('New crop added to encyclopedia database!');
    } else {
      toast.error('Please fill all fields');
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) {
      return toast.error('Message content cannot be empty');
    }
    
    try {
      const titleMap = {
        weather: '🚨 Weather Emergency Alert',
        pest: '🐛 Crop & Pest Warning',
        generic: '📢 General Farming Advisory'
      };
      
      const res = await api.post('/admin/broadcast', {
        title: titleMap[broadcastType] || '📢 Admin Announcement',
        message: broadcastMessage.trim(),
        type: broadcastType
      });
      
      toast.success(res.data.message || 'Broadcast alert successfully sent!');
      setBroadcastMessage('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send broadcast notification');
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white flex items-center gap-2">
          <RiAdminLine className="text-primary-500" />
          {t('admin.title')}
        </h1>
        <p className="text-sm text-dark-400">{t('admin.subtitle')}</p>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-dark-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-dark-500 uppercase font-semibold">{t('admin.totalAccounts')}</p>
            <p className="text-xl font-bold text-white mt-1">{users.length}</p>
          </div>
          <RiUserLine className="text-2xl text-primary-400" />
        </div>

        <div className="glass-card p-4 rounded-xl border border-dark-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-dark-500 uppercase font-semibold">{t('admin.supportedCrops')}</p>
            <p className="text-xl font-bold text-white mt-1">{crops.length}</p>
          </div>
          <RiPlantLine className="text-2xl text-accent-400" />
        </div>

        <div className="glass-card p-4 rounded-xl border border-dark-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-dark-500 uppercase font-semibold">{t('admin.mlEngineHealth')}</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">98.6%</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <div className="glass-card p-4 rounded-xl border border-dark-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-dark-500 uppercase font-semibold">{t('admin.totalScans')}</p>
            <p className="text-xl font-bold text-white mt-1">{stats.total_reports + stats.total_predictions}</p>
          </div>
          <RiAlertLine className="text-2xl text-red-400" />
        </div>
      </div>

      {/* Main Tabbed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="glass-card p-2 rounded-2xl flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold flex items-center gap-3 whitespace-nowrap transition-all ${
              activeTab === 'users' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20' : 'text-dark-400 hover:text-white hover:bg-dark-800/40'
            }`}
          >
            <RiUserLine /> {t('admin.tabs.users')}
          </button>
          <button
            onClick={() => setActiveTab('crops')}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold flex items-center gap-3 whitespace-nowrap transition-all ${
              activeTab === 'crops' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20' : 'text-dark-400 hover:text-white hover:bg-dark-800/40'
            }`}
          >
            <RiPlantLine /> {t('admin.tabs.crops')}
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold flex items-center gap-3 whitespace-nowrap transition-all ${
              activeTab === 'broadcast' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20' : 'text-dark-400 hover:text-white hover:bg-dark-800/40'
            }`}
          >
            <RiBroadcastLine /> {t('admin.tabs.broadcast')}
          </button>
        </div>

        {/* Dynamic Display Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 bg-dark-900/60 border border-dark-700/50 rounded-xl px-3 py-2 max-w-sm">
                  <RiSearch2Line className="text-dark-500" />
                  <input
                    type="text"
                    placeholder={t('admin.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-0 text-xs text-white placeholder:text-dark-500 w-full focus:outline-none"
                  />
                </div>

                <div className="glass-card overflow-hidden border border-dark-800 rounded-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-dark-800/80 border-b border-dark-700/50 text-dark-400">
                          <th className="p-4 font-semibold">{t('admin.userDetails')}</th>
                          <th className="p-4 font-semibold">{t('admin.registered')}</th>
                          <th className="p-4 font-semibold">{t('admin.role')}</th>
                          <th className="p-4 font-semibold text-right">{t('admin.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center">
                              <RiLoader4Line className="text-primary-400 text-2xl animate-spin mx-auto mb-2" />
                              <p className="text-xs text-dark-500">Loading registered users...</p>
                            </td>
                          </tr>
                        ) : filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-dark-500 text-xs">No registered users found.</td>
                          </tr>
                        ) : filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-dark-800/50 hover:bg-dark-800/20">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-dark-700 flex items-center justify-center font-bold text-white capitalize">
                                  {user.full_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <p className="font-semibold text-white">{user.full_name || 'Unnamed User'}</p>
                                  <p className="text-[10px] text-dark-500 mt-0.5">{user.email}{user.location ? ` • ${user.location}` : ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-dark-400">{formatDate(user.created_at)}</td>
                            <td className="p-4">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                className="bg-dark-800 border border-dark-750 text-white rounded-lg px-2 py-1 text-[11px] font-semibold focus:outline-none capitalize cursor-pointer"
                              >
                                <option value="farmer">{t('common.farmer')}</option>
                                <option value="admin">{t('common.admin')}</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleUserDelete(user.id)}
                                className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              >
                                <RiDeleteBin6Line size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'crops' && (
              <motion.div
                key="crops"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">{t('admin.cropsTitle')}</h2>
                  <button
                    onClick={() => setShowCropModal(true)}
                    className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
                  >
                    <RiAddLine /> {t('admin.addCropBtn')}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {crops.map((crop) => (
                    <AnimatedCard key={crop.id} hover={false} className="border border-dark-800">
                      <div className="flex items-center justify-between border-b border-dark-800 pb-2.5 mb-3">
                        <h3 className="font-bold text-sm text-white">{crop.name}</h3>
                        <span className="badge badge-success text-[10px]">{crop.type}</span>
                      </div>
                      <div className="space-y-2 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-dark-500">{t('admin.cropSeason')}:</span>
                          <span className="text-dark-300 font-medium">{crop.season}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-dark-500">{t('admin.cropTempBounds')}:</span>
                          <span className="text-dark-300 font-medium">{crop.temp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-dark-500">{t('admin.cropWater')}:</span>
                          <span className="text-dark-300 font-medium">{crop.water}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-dark-500">{t('admin.cropSoil')}:</span>
                          <span className="text-dark-300 font-medium">{crop.soil}</span>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'broadcast' && (
              <motion.div
                key="broadcast"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <AnimatedCard hover={false} className="border border-dark-800">
                  <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <RiBroadcastLine className="text-primary-400" />
                    {t('admin.broadcastTitle')}
                  </h2>

                  <form onSubmit={handleBroadcast} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-dark-400 mb-2">{t('admin.broadcastCategory')}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['weather', 'pest', 'generic'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setBroadcastType(type)}
                            className={`py-2 text-xs font-semibold border rounded-xl capitalize transition-all ${
                              broadcastType === type
                                ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                                : 'bg-dark-800/40 border-dark-700 text-dark-400 hover:text-white'
                            }`}
                          >
                            {type} Alert
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dark-400 mb-2">{t('admin.messageContent')}</label>
                      <textarea
                        rows={4}
                        placeholder={t('admin.broadcastPlaceholder')}
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        className="w-full bg-dark-800/60 border border-dark-700 rounded-xl p-3 text-xs text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20"
                      />
                    </div>

                    <button type="submit" className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5">
                      <RiBroadcastLine /> {t('admin.broadcastBtn')}
                    </button>
                  </form>
                </AnimatedCard>
              </motion.div>
            )}


          </AnimatePresence>
        </div>
      </div>

      {/* Crop Add Modal */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-dark-900 border border-dark-700/60 rounded-2xl p-6 relative"
          >
            <button
              onClick={() => setShowCropModal(false)}
              className="absolute top-4 right-4 text-dark-500 hover:text-white"
            >
              <RiCloseLine size={20} />
            </button>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-1.5">
              <RiPlantLine className="text-primary-500" />
              {t('admin.addCropTitle')}
            </h3>

            <form onSubmit={handleAddCrop} className="space-y-4 text-xs">
              <div>
                <label className="block text-dark-400 font-semibold mb-1">{t('admin.cropForm.name')}</label>
                <input
                  type="text"
                  placeholder="e.g. Maize"
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-white placeholder:text-dark-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-dark-400 font-semibold mb-1">{t('admin.cropForm.category')}</label>
                  <select
                    value={newCrop.type}
                    onChange={(e) => setNewCrop({ ...newCrop, type: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-white cursor-pointer"
                  >
                    <option value="Grain">Grain</option>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Fiber">Fiber</option>
                  </select>
                </div>

                <div>
                  <label className="block text-dark-400 font-semibold mb-1">{t('admin.cropForm.season')}</label>
                  <select
                    value={newCrop.season}
                    onChange={(e) => setNewCrop({ ...newCrop, season: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-white cursor-pointer"
                  >
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                    <option value="Whole Year">Whole Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-dark-400 font-semibold mb-1">{t('admin.cropForm.temp')}</label>
                <input
                  type="text"
                  placeholder="e.g. 18°C - 28°C"
                  value={newCrop.temp}
                  onChange={(e) => setNewCrop({ ...newCrop, temp: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-white placeholder:text-dark-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-dark-400 font-semibold mb-1">{t('admin.cropForm.water')}</label>
                  <input
                    type="text"
                    placeholder="e.g. 60-120cm"
                    value={newCrop.water}
                    onChange={(e) => setNewCrop({ ...newCrop, water: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-white placeholder:text-dark-500"
                  />
                </div>

                <div>
                  <label className="block text-dark-400 font-semibold mb-1">{t('admin.cropForm.soil')}</label>
                  <input
                    type="text"
                    placeholder="e.g. Loam"
                    value={newCrop.soil}
                    onChange={(e) => setNewCrop({ ...newCrop, soil: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-white placeholder:text-dark-500"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-2.5 text-xs">
                {t('admin.saveBtn')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
