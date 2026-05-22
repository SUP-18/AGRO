import random
from flask import Blueprint, request, jsonify

weather_bp = Blueprint('weather', __name__)

# Sample farm tips based on meteorological inputs
FARM_METEO_TIPS = {
    'Sunny': 'Excellent day for crop harvesting, grain drying, and tractor operations. Ensure irrigation levels are standard.',
    'Partly Cloudy': 'Very good conditions for sowing seeds, general weeding, and transplanting seedlings.',
    'Cloudy': 'Lower solar evaporation. Excellent time to apply fertilizers and liquid nutrients.',
    'Rainy': 'Natural water feed. Suspend all chemical spraying operations and check fields for waterlogging.',
    'Thunderstorm': 'High risk! Secure field equipment, turn off irrigation pumps, and remain indoors.',
    'Windy': 'Avoid applying granular pesticides or aerial sprays. Secure high-climbing plants.'
}

def generate_mock_weather(city):
    """Generates comprehensive, realistic mock weather parameters for a city"""
    # Deterministic seed based on city name to keep it relatively stable
    random.seed(hash(city) % 10000)
    
    conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Windy']
    condition = random.choice(conditions)
    
    temp = round(random.uniform(22.0, 36.0), 1)
    humidity = round(random.uniform(50.0, 85.0), 1)
    wind_speed = round(random.uniform(5.0, 22.0), 1)
    rainfall_prob = 80 if condition == 'Rainy' else (40 if condition == 'Cloudy' or condition == 'Partly Cloudy' else 10)
    
    wind_directions = ['NE', 'N', 'NW', 'W', 'SW', 'S', 'SE', 'E']
    condition_desc = {
        'Sunny': 'Sunny & Warm',
        'Partly Cloudy': 'Mostly Sunny',
        'Cloudy': 'Scattered Clouds',
        'Rainy': 'Heavy Thunderstorms',
        'Windy': 'Strong Winds'
    }
    
    return {
        'city': city.capitalize(),
        'temperature': temp,
        'humidity': humidity,
        'wind_speed': wind_speed,
        'wind_direction': random.choice(wind_directions),
        'description': condition_desc[condition],
        'condition': condition,
        'rainfall_probability': rainfall_prob,
        'precip_chance': rainfall_prob,
        'uv_index': random.randint(3, 9),
        'pressure': round(random.uniform(1008.0, 1016.0), 1),
        'visibility': round(random.uniform(8.0, 10.0), 1),
        'solar_radiation': random.randint(400, 750),
        'soil_temp': round(temp - random.uniform(2.0, 5.0), 1),
        'tip': FARM_METEO_TIPS[condition]
    }

@weather_bp.route('/current', methods=['GET'])
def get_current_weather():
    city = request.args.get('city', 'punjab')
    weather_data = generate_mock_weather(city)
    return jsonify(weather_data), 200

@weather_bp.route('/forecast', methods=['GET'])
def get_forecast():
    city = request.args.get('city', 'punjab')
    days = request.args.get('days', 5, type=int)
    
    # Secure seed
    random.seed(hash(city) % 10000 + 42)
    
    day_names = ['Today', 'Tomorrow', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday']
    conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy']
    condition_icons = {
        'Sunny': 'sunny',
        'Partly Cloudy': 'cloudy',
        'Cloudy': 'cloudy',
        'Rainy': 'rainy'
    }
    condition_desc = {
        'Sunny': 'Sunny & Warm',
        'Partly Cloudy': 'Mostly Sunny',
        'Cloudy': 'Scattered Clouds',
        'Rainy': 'Heavy Thunderstorms'
    }
    
    days_list = []
    base_temp = round(random.uniform(24.0, 32.0), 1)
    for i in range(days):
        day_temp_max = round(base_temp + random.uniform(1.0, 5.0), 1)
        day_temp_min = round(base_temp - random.uniform(1.0, 5.0), 1)
        day_cond = random.choice(conditions)
        rain_chance = 85 if day_cond == 'Rainy' else (45 if day_cond == 'Cloudy' or day_cond == 'Partly Cloudy' else 10)
        
        days_list.append({
            'date': day_names[i] if i < len(day_names) else f"Day {i+1}",
            'temp_max': int(day_temp_max),
            'temp_min': int(day_temp_min),
            'rain_chance': rain_chance,
            'wind': round(random.uniform(8.0, 24.0), 1),
            'icon': condition_icons[day_cond],
            'desc': condition_desc[day_cond]
        })
        
    # Hourly list for 24-hour forecast chart
    hourly_list = []
    times = ['08:00', '11:00', '14:00', '17:00', '20:00', '23:00']
    for t in times:
        hourly_list.append({
            'time': t,
            'temp': round(base_temp + random.uniform(-4.0, 4.0), 1),
            'rain': random.randint(10, 90)
        })
        
    return jsonify({
        'city': city.capitalize(),
        'forecast': days_list,
        'days': days_list,
        'hourly': hourly_list
    }), 200

@weather_bp.route('/alerts', methods=['GET'])
def get_alerts():
    alerts = [
        {
            'id': 1,
            'severity': 'Warning',
            'title': 'High Temperature Warning',
            'message': 'Severe heatwave forecast in northern regions over the next 48 hours. Ensure crop hydration.',
            'crop_impact': 'High risk of transpiration burn in Rice and Tomato. Increase watering cycles.',
            'created_at': 'Just now'
        },
        {
            'id': 2,
            'severity': 'Alert',
            'title': 'Sudden Rainfall Expected',
            'message': 'Scattered thunderstorms expected this weekend with localized wind gusts.',
            'crop_impact': 'Postpone all chemical, pesticide, and open-fertilizer foliar spray operations.',
            'created_at': '3 hours ago'
        }
    ]
    return jsonify({'alerts': alerts}), 200
