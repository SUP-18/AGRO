import os
import csv
import random
import pandas as pd
from crop_yield_model import CropYieldPredictor

def generate_synthetic_data(file_path):
    print(f"Generating synthetic agricultural dataset at {file_path}...")
    
    crops = [
        'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane',
        'Soybean', 'Barley', 'Millet', 'Potato', 'Tomato',
        'Groundnut', 'Sunflower', 'Mustard', 'Chickpea', 'Lentil'
    ]
    
    soils = [
        'Clay', 'Sandy', 'Loam', 'Silt', 'Peat', 'Chalky', 'Red', 'Black', 'Alluvial', 'Laterite'
    ]
    
    # Baselines for crops (yield per hectare in tonnes)
    base_yields = {
        'Rice': 3.8, 'Wheat': 3.3, 'Maize': 4.2, 'Cotton': 1.9, 'Sugarcane': 72.0,
        'Soybean': 2.6, 'Barley': 2.9, 'Millet': 1.3, 'Potato': 23.0, 'Tomato': 26.0,
        'Groundnut': 2.1, 'Sunflower': 1.9, 'Mustard': 1.5, 'Chickpea': 1.7, 'Lentil': 1.4
    }
    
    # Preferred climates
    preferences = {
        'Rice': {'temp': (22, 32), 'rain': (150, 300), 'fert': (100, 150)},
        'Wheat': {'temp': (12, 22), 'rain': (50, 120), 'fert': (80, 140)},
        'Maize': {'temp': (18, 30), 'rain': (60, 150), 'fert': (100, 160)},
        'Sugarcane': {'temp': (20, 32), 'rain': (120, 250), 'fert': (200, 300)},
        'Potato': {'temp': (12, 20), 'rain': (40, 90), 'fert': (100, 150)},
        'Tomato': {'temp': (16, 28), 'rain': (50, 100), 'fert': (80, 140)}
    }
    
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    with open(file_path, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['crop_type', 'soil_type', 'rainfall', 'temperature', 'humidity', 'fertilizer_usage', 'land_area', 'yield'])
        
        # Write 350 rows of synthetic data
        for _ in range(350):
            crop = random.choice(crops)
            soil = random.choice(soils)
            
            # Base values
            base = base_yields.get(crop, 3.0)
            
            # Draw realistic climate features based on crop profile
            pref = preferences.get(crop, {'temp': (15, 30), 'rain': (50, 150), 'fert': (50, 150)})
            temp = round(random.uniform(pref['temp'][0] - 5, pref['temp'][1] + 5), 1)
            rain = round(random.uniform(pref['rain'][0] - 20, pref['rain'][1] + 50), 1)
            fert = round(random.uniform(pref['fert'][0] - 20, pref['fert'][1] + 50), 1)
            hum = round(random.uniform(40.0, 90.0), 1)
            area = round(random.uniform(0.5, 10.0), 2)
            
            # Adjust yield dynamically
            soil_mods = {'Clay': 0.9, 'Sandy': 0.7, 'Loam': 1.1, 'Silt': 1.0, 'Peat': 0.95, 'Black': 1.2, 'Alluvial': 1.25}
            mod = soil_mods.get(soil, 1.0)
            
            # Suitability scores
            t_pref = pref['temp']
            t_mid = (t_pref[0] + t_pref[1]) / 2
            t_suit = 1.0 - (abs(temp - t_mid) / (t_pref[1] - t_pref[0] + 5))
            t_suit = max(0.4, min(t_suit, 1.1))
            
            r_pref = pref['rain']
            r_mid = (r_pref[0] + r_pref[1]) / 2
            r_suit = 1.0 - (abs(rain - r_mid) / (r_pref[1] - r_pref[0] + 30))
            r_suit = max(0.4, min(r_suit, 1.1))
            
            # Yield calculation
            yield_per_ha = base * mod * t_suit * r_suit * (0.8 + fert / 300.0)
            # Add subtle natural noise (crop failures or peak harvests)
            yield_per_ha += random.uniform(-0.15 * base, 0.15 * base)
            yield_per_ha = max(0.2, yield_per_ha)
            
            writer.writerow([crop, soil, rain, temp, hum, fert, area, round(yield_per_ha, 3)])
            
    print("Dataset generation complete!")

def train_and_evaluate():
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(backend_dir, 'app', 'data', 'crop_data.csv')
    
    # Generate CSV first
    generate_synthetic_data(data_path)
    
    # Train model
    predictor = CropYieldPredictor()
    print("Training RandomForestRegressor model...")
    r2_score = predictor.train(data_path)
    
    print(f"Model successfully trained and saved!")
    print(f"R² Validation Score: {r2_score:.4f}")
    
    # Verify predictions
    sample_input = {
        'crop_type': 'Rice',
        'soil_type': 'Alluvial',
        'rainfall': 200.0,
        'temperature': 28.0,
        'humidity': 80.0,
        'fertilizer_usage': 120.0,
        'land_area': 2.5
    }
    pred_res = predictor.predict(sample_input)
    print(f"Sample prediction check: {sample_input['crop_type']} on {sample_input['soil_type']} soil with land area {sample_input['land_area']}ha")
    print(f" => Forecast: {pred_res['predicted_yield']} tonnes total ({pred_res['yield_per_hectare']} t/ha) with confidence {pred_res['confidence']}%")

if __name__ == '__main__':
    train_and_evaluate()
