export const CROP_TYPES = [
  'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane',
  'Soybean', 'Barley', 'Millet', 'Potato', 'Tomato',
  'Groundnut', 'Sunflower', 'Mustard', 'Chickpea', 'Lentil'
];

export const SOIL_TYPES = [
  'Clay', 'Sandy', 'Loam', 'Silt', 'Peat', 'Chalky', 'Red', 'Black', 'Alluvial', 'Laterite'
];

export const SEASONS = ['Kharif', 'Rabi', 'Zaid'];

export const REGIONS = [
  'Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Karnataka',
  'Tamil Nadu', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'West Bengal',
  'Andhra Pradesh', 'Telangana', 'Bihar', 'Odisha', 'Kerala'
];

export const DISEASE_DATABASE = [
  { name: 'Bacterial Leaf Blight', crops: ['Rice'], severity: 'High', treatment: 'Apply copper-based bactericides. Use resistant varieties. Ensure proper drainage.' },
  { name: 'Powdery Mildew', crops: ['Wheat', 'Barley'], severity: 'Medium', treatment: 'Apply sulfur-based fungicides. Improve air circulation. Remove infected leaves.' },
  { name: 'Corn Smut', crops: ['Maize'], severity: 'Medium', treatment: 'Remove infected ears immediately. Rotate crops. Use resistant hybrids.' },
  { name: 'Cotton Leaf Curl', crops: ['Cotton'], severity: 'High', treatment: 'Control whitefly vectors. Use resistant varieties. Apply neem-based pesticides.' },
  { name: 'Red Rot', crops: ['Sugarcane'], severity: 'Critical', treatment: 'Use disease-free seed cane. Treat setts with fungicide. Practice crop rotation.' },
  { name: 'Late Blight', crops: ['Potato', 'Tomato'], severity: 'High', treatment: 'Apply fungicides preventively. Remove infected plants. Ensure proper spacing.' },
  { name: 'Rust', crops: ['Wheat', 'Soybean'], severity: 'High', treatment: 'Apply propiconazole fungicide. Plant resistant varieties. Monitor fields regularly.' },
  { name: 'Downy Mildew', crops: ['Millet', 'Sunflower'], severity: 'Medium', treatment: 'Apply metalaxyl-based fungicides. Use seed treatment. Avoid overhead irrigation.' },
  { name: 'Anthracnose', crops: ['Mango', 'Chickpea'], severity: 'Medium', treatment: 'Apply copper fungicides. Prune infected parts. Maintain field hygiene.' },
  { name: 'Fusarium Wilt', crops: ['Tomato', 'Cotton', 'Chickpea'], severity: 'Critical', treatment: 'Use resistant varieties. Soil solarization. Apply biocontrol agents like Trichoderma.' },
  { name: 'Mosaic Virus', crops: ['Tomato', 'Potato'], severity: 'High', treatment: 'Control aphid vectors. Remove infected plants. Use virus-free seeds.' },
  { name: 'Brown Spot', crops: ['Rice'], severity: 'Medium', treatment: 'Apply mancozeb fungicide. Use balanced fertilization. Improve drainage.' },
];

export const WEATHER_CONDITIONS = [
  { condition: 'Sunny', icon: '☀️', tip: 'Great day for field work and harvesting.' },
  { condition: 'Partly Cloudy', icon: '⛅', tip: 'Good conditions for planting and transplanting.' },
  { condition: 'Cloudy', icon: '☁️', tip: 'Ideal for pesticide application - less evaporation.' },
  { condition: 'Rainy', icon: '🌧️', tip: 'Avoid spraying. Check drainage systems.' },
  { condition: 'Thunderstorm', icon: '⛈️', tip: 'Stay indoors. Secure farm equipment.' },
  { condition: 'Windy', icon: '💨', tip: 'Avoid aerial spraying. Check crop supports.' },
];

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'RiDashboardLine' },
  { path: '/prediction', label: 'Prediction', icon: 'RiPlantLine' },
  { path: '/analytics', label: 'Analytics', icon: 'RiBarChart2Line' },
  { path: '/disease-detection', label: 'Disease Detection', icon: 'RiSearchEyeLine' },
  { path: '/smart-farming', label: 'Smart Farming', icon: 'RiLeafLine' },
  { path: '/weather', label: 'Weather', icon: 'RiCloudLine' },
  { path: '/admin', label: 'Admin Panel', icon: 'RiAdminLine' },
  { path: '/profile', label: 'Profile', icon: 'RiUserLine' },
];

export const CHART_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857', '#fbbf24', '#f59e0b', '#3b82f6'];
