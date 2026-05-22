import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RiUserLine, RiLockLine, RiNotification3Line, RiHistoryLine,
  RiMailLine, RiPhoneLine, RiMapPinLine, RiEdit2Line, RiSaveLine,
  RiAlertLine, RiDeleteBin6Line, RiShieldCheckLine, RiEyeLine, RiEyeOffLine,
  RiCheckboxCircleLine, RiPlantLine, RiCloudLine, RiSearchEyeLine
} from 'react-icons/ri';
import AnimatedCard from '../components/common/AnimatedCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('info');
  const [editing, setEditing] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [profile, setProfile] = useState({
    full_name: user?.full_name || 'User',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    role: user?.role || 'farmer',
    bio: 'Progressive farmer specializing in rice and wheat cultivation with 12+ years of experience in sustainable agriculture practices.'
  });

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        full_name: user.full_name || 'User',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        role: user.role || 'farmer'
      }));
    }
  }, [user]);

  const [passwords, setPasswords] = useState({ old: '', new_pw: '', confirm: '' });

  const [notifPrefs, setNotifPrefs] = useState({
    weather_alerts: true,
    irrigation_reminders: true,
    disease_warnings: true,
    yield_updates: true,
    system_announcements: false,
    email_digest: true
  });

  const activityTimeline = [
    { id: 1, action: t('profile.activity.yieldPrediction', 'Crop Yield Prediction'), detail: t('profile.activity.riceForecast', 'Rice yield forecast — 4.8 tonnes/ha (92% confidence)'), time: t('time.hoursAgo2', '2 hours ago'), icon: RiPlantLine, color: 'text-primary-400' },
    { id: 2, action: t('profile.activity.diseaseScan', 'Disease Scan Uploaded'), detail: t('profile.activity.riceBlast', 'Leaf image analyzed — Rice Blast detected (87% match)'), time: t('time.hoursAgo5', '5 hours ago'), icon: RiSearchEyeLine, color: 'text-red-400' },
    { id: 3, action: t('profile.activity.weatherQuery', 'Weather Query'), detail: t('profile.activity.punjabForecast', 'Checked 5-day forecast for Punjab region'), time: t('time.dayAgo1', '1 day ago'), icon: RiCloudLine, color: 'text-blue-400' },
    { id: 4, action: t('profile.activity.profileUpdated', 'Profile Updated'), detail: t('profile.activity.locationChanged', 'Location changed to Punjab, India'), time: t('time.daysAgo3', '3 days ago'), icon: RiEdit2Line, color: 'text-accent-400' },
    { id: 5, action: t('profile.activity.yieldPrediction', 'Yield Prediction'), detail: t('profile.activity.wheatForecast', 'Wheat yield forecast — 3.2 tonnes/ha (89% confidence)'), time: t('time.weekAgo1', '1 week ago'), icon: RiPlantLine, color: 'text-primary-400' },
    { id: 6, action: t('profile.activity.accountCreated', 'Account Created'), detail: t('profile.activity.registeredFarmer', 'Registered as farmer on AgroPredict platform'), time: t('time.monthsAgo2', '2 months ago'), icon: RiCheckboxCircleLine, color: 'text-emerald-400' }
  ];

  const notifPrefDescriptions = {
    weather_alerts: t('profile.notifDesc.weather', 'Severe weather and rain forecasts affecting your farm region'),
    irrigation_reminders: t('profile.notifDesc.irrigation', 'Smart irrigation scheduling reminders from IoT sensors'),
    disease_warnings: t('profile.notifDesc.disease', 'Disease outbreak reports for your registered crop types'),
    yield_updates: t('profile.notifDesc.yield', 'New yield prediction results and comparative analytics'),
    system_announcements: t('profile.notifDesc.system', 'Platform updates, maintenance windows, and new features'),
    email_digest: t('profile.notifDesc.email', 'Weekly email summary of all farming activities and insights')
  };

  const notifPrefLabels = {
    weather_alerts: t('profile.notifLabel.weather', 'Weather Alerts'),
    irrigation_reminders: t('profile.notifLabel.irrigation', 'Irrigation Reminders'),
    disease_warnings: t('profile.notifLabel.disease', 'Disease Warnings'),
    yield_updates: t('profile.notifLabel.yield', 'Yield Updates'),
    system_announcements: t('profile.notifLabel.system', 'System Announcements'),
    email_digest: t('profile.notifLabel.email', 'Email Digest')
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const res = await updateProfile({
      full_name: profile.full_name,
      phone: profile.phone,
      location: profile.location,
    });
    if (res.success) {
      setEditing(false);
      toast.success(t('profile.updatedSuccess', 'Profile updated successfully!'));
    } else {
      toast.error(res.error || 'Failed to update profile');
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.new_pw !== passwords.confirm) {
      toast.error(t('profile.passwordsNoMatch', 'New passwords do not match'));
      return;
    }
    if (passwords.new_pw.length < 6) {
      toast.error(t('profile.passwordTooShort', 'Password must be at least 6 characters'));
      return;
    }
    setPasswords({ old: '', new_pw: '', confirm: '' });
    toast.success(t('profile.passwordChangedSuccess', 'Password changed successfully!'));
  };

  const sections = [
    { id: 'info', label: t('profile.personalInfo', 'Personal Info'), icon: RiUserLine },
    { id: 'activity', label: t('profile.activityLog', 'Activity Log'), icon: RiHistoryLine },
    { id: 'notifications', label: t('profile.notificationsTab', 'Notifications'), icon: RiNotification3Line },
    { id: 'security', label: t('profile.securityTab', 'Security'), icon: RiLockLine }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white flex items-center gap-2">
          <RiUserLine className="text-primary-500" />
          {t('profile.title')}
        </h1>
        <p className="text-sm text-dark-400">{t('profile.subtitle', 'Manage your account, security, and notification preferences')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: User Card + Nav */}
        <div className="space-y-4">
          {/* Avatar Card */}
          <AnimatedCard hover={false} className="text-center border border-dark-800">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-primary-500/25 mb-3">
              {profile.full_name.charAt(0)}
            </div>
            <h3 className="text-sm font-bold text-white">{profile.full_name}</h3>
            <p className="text-[10px] text-dark-400 mt-0.5">{profile.email}</p>
            <span className="badge badge-success mt-2 capitalize text-[10px]">{t('common.' + profile.role, profile.role)}</span>

            <div className="mt-4 pt-4 border-t border-dark-800/80 grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-white">24</p>
                <p className="text-[9px] text-dark-500 uppercase">{t('profile.predictionsCount', 'Predictions')}</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">8</p>
                <p className="text-[9px] text-dark-500 uppercase">{t('profile.scansCount', 'Scans')}</p>
              </div>
            </div>
          </AnimatedCard>

          {/* Section Nav */}
          <div className="glass-card p-2 rounded-2xl space-y-1">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left py-3 px-4 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                    activeSection === sec.id
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20'
                      : 'text-dark-400 hover:text-white hover:bg-dark-800/40'
                  }`}
                >
                  <Icon /> {sec.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Dynamic Content */}
        <div className="lg:col-span-3">
          {activeSection === 'info' && (
            <AnimatedCard hover={false} className="border border-dark-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-white">{t('profile.personalInfo')}</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn-ghost text-xs flex items-center gap-1.5"
                >
                  <RiEdit2Line /> {editing ? t('common.cancel') : t('profile.editProfile', 'Edit Profile')}
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('profile.fullName')}</label>
                    <div className="relative">
                      <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        disabled={!editing}
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-800/60 border border-dark-700 rounded-xl text-sm text-white disabled:opacity-60 focus:outline-none focus:border-primary-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('profile.email')}</label>
                    <div className="relative">
                      <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        disabled={!editing}
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-800/60 border border-dark-700 rounded-xl text-sm text-white disabled:opacity-60 focus:outline-none focus:border-primary-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('profile.phone')}</label>
                    <div className="relative">
                      <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!editing}
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-800/60 border border-dark-700 rounded-xl text-sm text-white disabled:opacity-60 focus:outline-none focus:border-primary-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('profile.location')}</label>
                    <div className="relative">
                      <RiMapPinLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        disabled={!editing}
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-800/60 border border-dark-700 rounded-xl text-sm text-white disabled:opacity-60 focus:outline-none focus:border-primary-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('profile.bio', 'Bio')}</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!editing}
                    className="w-full bg-dark-800/60 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60 focus:outline-none focus:border-primary-500/50 resize-none"
                  />
                </div>

                {editing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <button type="submit" className="btn-primary py-2.5 px-6 text-xs flex items-center gap-1.5">
                      <RiSaveLine /> {t('profile.saveChanges', 'Save Changes')}
                    </button>
                  </motion.div>
                )}
              </form>
            </AnimatedCard>
          )}

          {activeSection === 'activity' && (
            <AnimatedCard hover={false} className="border border-dark-800">
              <h2 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                <RiHistoryLine className="text-primary-400" /> {t('profile.activityTimeline', 'Activity Timeline')}
              </h2>

              <div className="relative pl-6 space-y-6">
                {/* Vertical line */}
                <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-dark-800" />

                {activityTimeline.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="relative"
                    >
                      {/* Dot */}
                      <div className={`absolute -left-6 top-1 w-[18px] h-[18px] rounded-full bg-dark-900 border-2 border-dark-700 flex items-center justify-center`}>
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                      </div>

                      <div className="glass-card p-4 rounded-xl border border-dark-800/50 hover:border-primary-500/20 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <Icon className={`text-lg ${item.color}`} />
                            <div>
                              <p className="text-xs font-semibold text-white">{item.action}</p>
                              <p className="text-[11px] text-dark-400 mt-0.5">{item.detail}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-dark-500 whitespace-nowrap">{item.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatedCard>
          )}

          {activeSection === 'notifications' && (
            <AnimatedCard hover={false} className="border border-dark-800">
              <h2 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                <RiNotification3Line className="text-primary-400" /> {t('profile.notificationPreferences', 'Notification Preferences')}
              </h2>

              <div className="space-y-4">
                {Object.entries(notifPrefs).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-dark-800/30 rounded-xl border border-dark-800/50 hover:border-dark-700 transition-all">
                    <div>
                      <p className="text-xs font-semibold text-white capitalize">{notifPrefLabels[key] || key.replace(/_/g, ' ')}</p>
                      <p className="text-[10px] text-dark-500 mt-0.5">
                        {notifPrefDescriptions[key]}
                      </p>
                    </div>

                    <button
                      onClick={() => setNotifPrefs({ ...notifPrefs, [key]: !val })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${val ? 'bg-primary-500' : 'bg-dark-700'}`}
                    >
                      <motion.div
                        animate={{ x: val ? 20 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              {/* Password Change */}
              <AnimatedCard hover={false} className="border border-dark-800">
                <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                  <RiShieldCheckLine className="text-primary-400" /> {t('profile.changePassword')}
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('profile.currentPassword')}</label>
                    <div className="relative">
                      <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type={showOldPw ? 'text' : 'password'}
                        value={passwords.old}
                        onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                        className="w-full pl-10 pr-10 py-2.5 bg-dark-800/60 border border-dark-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500/50"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white">
                        {showOldPw ? <RiEyeOffLine /> : <RiEyeLine />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('profile.newPassword')}</label>
                    <div className="relative">
                      <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={passwords.new_pw}
                        onChange={(e) => setPasswords({ ...passwords, new_pw: e.target.value })}
                        className="w-full pl-10 pr-10 py-2.5 bg-dark-800/60 border border-dark-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500/50"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white">
                        {showNewPw ? <RiEyeOffLine /> : <RiEyeLine />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1.5">{t('profile.confirmPassword')}</label>
                    <div className="relative">
                      <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-800/60 border border-dark-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500/50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary py-2.5 px-6 text-xs flex items-center gap-1.5">
                    <RiSaveLine /> {t('profile.updatePassword', 'Update Password')}
                  </button>
                </form>
              </AnimatedCard>

              {/* Danger Zone */}
              <div className="glass-card p-5 rounded-2xl border border-red-500/20 relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-red-500" />
                <h2 className="text-base font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <RiAlertLine className="animate-pulse" /> {t('profile.dangerZone', 'Danger Zone')}
                </h2>
                <p className="text-xs text-dark-400 mb-4 leading-relaxed">
                  {t('profile.dangerZoneText', 'Permanently delete your account and all associated farming data, predictions, disease reports, and analytics history. This action is irreversible.')}
                </p>
                <button
                  onClick={() => toast.error(t('profile.deleteDisabledDemo', 'Account deletion is disabled in demo mode'))}
                  className="flex items-center gap-1.5 py-2 px-4 text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all"
                >
                  <RiDeleteBin6Line /> {t('profile.deleteAccountBtn', 'Delete My Account')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
