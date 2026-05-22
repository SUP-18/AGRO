import random

class RecommendationEngine:
    def __init__(self):
        pass

    def suggest_crops(self, soil_type, rainfall, temperature, humidity):
        """Recommends a list of crops that best fit the environmental conditions"""
        soil = soil_type.lower()
        temp = float(temperature)
        rain = float(rainfall)
        hum = float(humidity)

        suggestions = []

        # Rice suitabilities
        if soil in ['clay', 'loam', 'silt', 'alluvial', 'black'] and rain > 120 and temp > 20:
            suggestions.append({
                'crop': 'Rice',
                'suitability': 'Excellent',
                'score': 95,
                'tips': 'Sow during early monsoon. Maintain standing water of 2-5 cm in fields during early growth stage.'
            })
        elif rain > 80 and temp > 18:
            suggestions.append({
                'crop': 'Rice',
                'suitability': 'Good',
                'score': 82,
                'tips': 'Utilize supplemental drip/sprinkler systems or rainwater harvesting reservoirs.'
            })

        # Wheat suitabilities
        if soil in ['loam', 'clay', 'silt', 'alluvial', 'black'] and 50 <= rain <= 100 and 10 <= temp <= 22:
            suggestions.append({
                'crop': 'Wheat',
                'suitability': 'Excellent',
                'score': 93,
                'tips': 'Ideal for winter Rabi sowing. Administer irrigation at crown root initiation stage (21 days post-sowing).'
            })
        elif 10 <= temp <= 25:
            suggestions.append({
                'crop': 'Wheat',
                'suitability': 'Moderate',
                'score': 70,
                'tips': 'Ensure proper soil leveling and apply nitrogen fertilizer split doses.'
            })

        # Maize suitabilities
        if soil in ['loam', 'sandy', 'alluvial', 'black', 'red'] and 18 <= temp <= 32:
            score = 90 if 60 <= rain <= 120 else 75
            suggestions.append({
                'crop': 'Maize',
                'suitability': 'Excellent' if score == 90 else 'Good',
                'score': score,
                'tips': 'Provide adequate drainage. Maize is highly sensitive to waterlogging at young stages.'
            })

        # Potato suitabilities
        if soil in ['loam', 'sandy', 'alluvial'] and 12 <= temp <= 20 and 40 <= rain <= 80:
            suggestions.append({
                'crop': 'Potato',
                'suitability': 'Excellent',
                'score': 94,
                'tips': 'Ensure loose, well-aerated sandy loam. Practice earthing-up (hilling) around stems at 30 days.'
            })

        # Tomato suitabilities
        if soil in ['loam', 'sandy', 'red', 'black'] and 18 <= temp <= 30:
            suggestions.append({
                'crop': 'Tomato',
                'suitability': 'Excellent',
                'score': 89,
                'tips': 'Staking is essential to prevent soil-contact disease. Maintain uniform moisture to prevent blossom end rot.'
            })

        # Cotton suitabilities
        if soil in ['black', 'alluvial', 'laterite'] and 20 <= temp <= 35 and rain < 100:
            suggestions.append({
                'crop': 'Cotton',
                'suitability': 'Excellent',
                'score': 91,
                'tips': 'Ideal for deep black cotton soils with good water-holding capacities. Control bollworms during square formation.'
            })

        # Fallback if no specialized suitabilities match
        if not suggestions:
            suggestions.append({
                'crop': 'Millet',
                'suitability': 'Excellent',
                'score': 88,
                'tips': 'Extremely drought-resilient. Requires minimal fertilizer inputs and thrives in sandy soils.'
            })
            suggestions.append({
                'crop': 'Barley',
                'suitability': 'Good',
                'score': 80,
                'tips': 'Highly tolerant to saline conditions. Thrives in cool-weather climates.'
            })

        return sorted(suggestions, key=lambda x: x['score'], reverse=True)

    def get_irrigation_schedule(self, crop, soil, temp=25.0, rainfall=100.0):
        """Generates a weekly smart irrigation schedule"""
        soil = soil.lower()
        temp = float(temp)
        rain = float(rainfall)

        # Baseline watering frequency based on climate
        if temp > 32:
            freq = 'Every 2-3 Days'
            vol = 'High (35-45 mm)'
        elif temp < 15:
            freq = 'Every 10-12 Days'
            vol = 'Low (15-20 mm)'
        else:
            freq = 'Every 6-8 Days'
            vol = 'Medium (25-30 mm)'

        # Soil adjustments
        if soil == 'sandy':
            freq = 'Every 2-3 Days (Sandy soil drains rapidly)'
            vol = 'Lower volume, higher frequency'
        elif soil in ['clay', 'black']:
            freq = 'Every 8-10 Days (Clay soil holds moisture)'
            vol = 'Deep watering, lower frequency'

        # Monsoon adjustment
        if rain > 150:
            freq = 'Suspended (Sufficient rainfall)'
            vol = 'None (Monitor fields for drainage issues)'

        schedule = [
            {'day': 'Monday', 'action': 'Irrigate' if 'Suspended' not in freq else 'Skip', 'volume': vol if 'Suspended' not in freq else '0 mm', 'notes': 'Check soil moisture before starting.'},
            {'day': 'Tuesday', 'action': 'Skip', 'volume': '0 mm', 'notes': 'None'},
            {'day': 'Wednesday', 'action': 'Irrigate' if 'Every 2-3 Days' in freq else 'Skip', 'volume': vol if 'Every 2-3 Days' in freq else '0 mm', 'notes': 'Sandy soils require midday check.'},
            {'day': 'Thursday', 'action': 'Skip', 'volume': '0 mm', 'notes': 'None'},
            {'day': 'Friday', 'action': 'Irrigate' if 'Every 2-3' in freq or 'Every 6-8' in freq else 'Skip', 'volume': vol if 'Every 2-3' in freq or 'Every 6-8' in freq else '0 mm', 'notes': 'Weekend watering cycle preparation.'},
            {'day': 'Saturday', 'action': 'Skip', 'volume': '0 mm', 'notes': 'None'},
            {'day': 'Sunday', 'action': 'Skip', 'volume': '0 mm', 'notes': 'Review weekly soil aeration.'}
        ]

        return {
            'crop': crop,
            'soil': soil.capitalize(),
            'recommended_frequency': freq,
            'recommended_volume': vol,
            'weekly_calendar': schedule
        }

    def get_fertilizer_plan(self, crop, soil):
        """Generates dynamic NPK and micro-fertilization parameters"""
        crop_npk = {
            'Rice': {'N': 120, 'P': 60, 'K': 40, 'tips': 'Apply Nitrogen in 3 split doses (1/3 basal, 1/3 tillering, 1/3 panicle initiation).'},
            'Wheat': {'N': 120, 'P': 60, 'K': 60, 'tips': 'Apply full P and K at sowing. Split N between sowing and first node appearance.'},
            'Maize': {'N': 150, 'P': 75, 'K': 50, 'tips': 'Highly responsive to zinc sulfate. Apply ZnSO4 at 25 kg/ha basal.'},
            'Cotton': {'N': 100, 'P': 50, 'K': 50, 'tips': 'Foliar spray of 2% Urea at flowering enhances fiber length.'},
            'Sugarcane': {'N': 250, 'P': 80, 'K': 120, 'tips': 'Enormous nitrogen consumer. Add heavy compost/organic manure alongside splits.'},
            'Potato': {'N': 120, 'P': 100, 'K': 120, 'tips': 'Requires rich potassium levels for large tuber sizes. Apply muriate of potash.'},
            'Tomato': {'N': 100, 'P': 80, 'K': 100, 'tips': 'Calcium nitrate sprays prevent blossom-end rot.'}
        }

        npk = crop_npk.get(crop, {'N': 100, 'P': 50, 'K': 50, 'tips': 'Ensure standard balanced NPK ratios based on local soil diagnostics.'})
        
        # Adjust for soil type
        soil_lower = soil.lower()
        if soil_lower == 'sandy':
            npk['tips'] += ' Sandy soils leach nitrogen quickly. Split fertilizer doses into 4-5 smaller applications.'
        elif soil_lower in ['clay', 'black']:
            npk['tips'] += ' High phosphorus binding capacity. Apply P-fertilizers near root zones.'

        return {
            'crop': crop,
            'soil': soil.capitalize(),
            'nitrogen': npk['N'],
            'phosphorus': npk['P'],
            'potassium': npk['K'],
            'guidelines': npk['tips']
        }

    def get_soil_tips(self, soil):
        """Returns standard restoration guidelines for a specific soil type"""
        tips = {
            'Clay': [
                'Incorporate rich organic humus, compost, or gypsum to break up dense clay structures.',
                'Avoid working or tilling soil while extremely wet to prevent severe compaction.',
                'Utilize raised cultivation beds to allow natural gravity drainage.'
            ],
            'Sandy': [
                'Incorporate rich organic manure, peat, or green compost to boost soil moisture holding ability.',
                'Use mulching (straw, woodchips) to block severe sunlight evaporation.',
                'Deploy cover crops (alfalfa, clover) to lock in nutrients.'
            ],
            'Loam': [
                'Thrives naturally. Maintain quality with crop rotations and periodic cover crops.',
                'Add light annual organic compost to maintain dynamic bio-action.',
                'Minimize excessive heavy tillage to conserve structural balance.'
            ],
            'Black': [
                'Excellent for deep-rooted crops, but susceptible to deep cracking when dried.',
                'Ensure sound aeration and do not allow water stagnancy.',
                'Incorporate deep-plowing methods once every two years.'
            ],
            'Laterite': [
                'Generally acidic with high iron/aluminum. Apply agricultural lime (CaCO3) to neutralize acidity.',
                'Suffer from high phosphate binding. Supplement with organic compost.',
                'Cultivate acid-tolerant crops (tea, coffee, rubber, cashews).'
            ]
        }

        return tips.get(soil.capitalize(), [
            'Add rich compost annually to sustain standard soil microbial activity.',
            'Practice crop rotation to prevent specific nutrient depletion.',
            'Deploy mulch to protect soil structural health and retain moisture.'
        ])
