import os
import re
import requests
from flask import Blueprint, request, jsonify

chatbot_bp = Blueprint('chatbot', __name__)

AGRI_KNOWLEDGE_BASE = [
    {
        'keywords': [r'crop', r'plant', r'grow', r'seed', r'harvest', r'yield', r'agriculture', r'farming', r'फसलों', r'पेंट', r'పంట', r'ਫ਼ਸਲ', r'पीक'],
        'response': (
            "🌱 **AgroPredict Crop Advisory:**\n\n"
            "- **Rice:** Thrives in clay soil with good water availability.\n"
            "- **Wheat:** Performs well in loamy soil during Rabi season.\n"
            "- **Maize:** Requires well-drained loamy soil and moderate rainfall.\n"
            "- **Sugarcane:** Needs deep, rich loamy soil and heavy watering.\n\n"
            "Use our **Yield Predictor** tool in the sidebar for personalized crop recommendations based on your local soil NPK and climate data."
        )
    },
    {
        'keywords': [r'pest', r'bug', r'insect', r'worm', r'spray', r'pesticide', r'कीट', r'कीड़ा', r'कीड़े', r'పురుగు', r'பூச்சி', r'ਕੀਟ', r'कीड'],
        'response': (
            "🌱 **AgroPredict Integrated Pest Management (IPM) Advisory:**\n\n"
            "1. **Identification:** Inspect the underside of leaves for eggs, webbing, or larvae. Aphids, whiteflies, and cutworms are common crop pests.\n"
            "2. **Organic Remediation:** Spray **Neem Oil Extract (3-5%)** mixed with a few drops of liquid dish soap as a natural repellent. Introduce natural predators like ladybugs.\n"
            "3. **Chemical Solution:** For severe infestations, apply **Imidacloprid 17.8 SL** (0.5 mL per Litre of water) or **Chlorpyrifos 20 EC** under calm weather conditions to prevent wind drift.\n"
            "4. **Farming Tip:** Water plants in the early morning so leaves dry by midday, which helps prevent fungal leaf blights from developing on insect-bitten areas."
        )
    },
    {
        'keywords': [r'water', r'irrigate', r'irrigation', r'dry', r'moisture', r'rain', r'सिंचाई', r'पानी', r'సించాయి', r'பாசனம்', r'ਸਿੰਚਾਈ', r'सिंचन'],
        'response': (
            "💧 **AgroPredict Irrigation & Water Management Advisory:**\n\n"
            "- **Clay Soils:** Clay retains moisture extremely well. Irrigate deeply but less frequently (every 8-10 days) to prevent waterlogging and root rot.\n"
            "- **Sandy Soils:** Drains water rapidly. Apply smaller, more frequent watering cycles (every 2-3 days) or utilize drip irrigation tubes directly in root zones.\n"
            "- **Loam Soils:** The ideal agricultural balance. Target 25-30 mm of water weekly.\n"
            "- **Weather Integration:** If rainfall forecast exceeds 30 mm in the next 48 hours, suspend irrigation cycles to prevent washing away vital soil nutrients."
        )
    },
    {
        'keywords': [r'fertilizer', r'npk', r'nitrogen', r'phosphorus', r'potassium', r'nutrient', r'खाद', r'उर्वरक', r'ఎరువులు', r'உரம்', r'ਖਾਦ', r'खत'],
        'response': (
            "🧪 **AgroPredict Fertilizer & Soil Nutrient Advisory:**\n\n"
            "Primary soil nutrients have distinct roles in crop health:\n"
            "- **Nitrogen (N):** Drives leafy green vegetative growth. Deficiency causes yellowing of lower leaves (chlorosis).\n"
            "- **Phosphorus (P):** Stimulates early root establishment and strong blooms.\n"
            "- **Potassium (K):** Enhances disease resistance, water regulation, and fruit quality.\n\n"
            "**Optimization Tip:** Split Nitrogen applications into 3 doses instead of single heavy sittings (1/3 basal at sowing, 1/3 at active tillering, and 1/3 at panicle/flowering stages) to minimize nitrogen leaching."
        )
    },
    {
        'keywords': [r'disease', r'leaf', r'blight', r'mildew', r'rot', r'spot', r'fungus', r'virus', r'bacterial', r'रोग', r'बीमारी', r'వ్యాధి', r'நோய்', r'ਬਿਮਾਰੀ'],
        'response': (
            "🍂 **AgroPredict Crop Disease Diagnostics Advisory:**\n\n"
            "- **Fungal Blights/Mildews:** Characterized by powdery white blankets or dark spots with yellow rings. Spray **Mancozeb 75 WP** (2g/L of water) or apply organic copper oxychloride sprays.\n"
            "- **Bacterial Blights:** Look for water-soaked, translucent margins on leaves that eventually dry. Treat seeds with **Streptocycline** (0.1g/L).\n"
            "- **Viral Mosaics:** Visualized as mottled yellow leaves or curled shoestring shapes. There are no direct viral cures. Control vector insects (aphids and whiteflies) using systemic insecticides."
        )
    },
    {
        'keywords': [r'weather', r'temp', r'humidity', r'monsoon', r'forecast', r'climate', r'मौसम', r'बारिश', r'तापमान', r'వాతావరణం', r'வானிலை', r'ਮੌਸਮ', r'हवामान'],
        'response': (
            "🌤️ **AgroPredict Weather & Climate Advisory:**\n\n"
            "- **Rainy/Monsoon:** Ensure proper field drainage to prevent waterlogging. Postpone fertilizer/pesticide spraying if rain is expected within 24 hours.\n"
            "- **Dry/Summer:** Practice mulching to conserve soil moisture. Apply light irrigation in early morning or late evening.\n"
            "- **Winter/Frost:** Protect sensitive plants with row covers or create a light smoke barrier in the morning to increase ambient temperature."
        )
    },
    {
        'keywords': [r'soil', r'clay', r'sand', r'loam', r'silt', r'organic', r'compost', r'manure', r'मिट्टी', r'మట్టి', r'மண்', r'ਮਿੱਟੀ', r'माती'],
        'response': (
            "🌱 **AgroPredict Soil Management Advisory:**\n\n"
            "- **Soil Improvement:** Add organic compost or farmyard manure (5-10 tonnes/ha) annually to improve structure and microbial activity.\n"
            "- **Green Manuring:** Grow green manure crops like Sesbania (dhaincha) or Sunhemp and plow them back into the soil before flowering.\n"
            "- **Soil pH Management:** Maintain pH between 6.0-7.0. Apply agricultural lime for acidic soils and gypsum for alkaline soils."
        )
    },
    {
        'keywords': [r'\bhello\b', r'\bhi\b', r'\bhey\b', r'\bgreetings\b', r'\bstart\b', r'\bwelcome\b', r'नमस्ते', r'सत श्री अकाल', r'வணக்கம்', r'నమస్కారం', r'नमस्कार'],
        'response': (
            "🌾 **Welcome to AgroPredict AI Assistant!**\n\n"
            "I am your expert digital farming consultant. I can help you with:\n"
            "- **Crop Recommendations** (Best crops for your soil)\n"
            "- **Pest & Disease Control** (Organic recipes, chemical treatments)\n"
            "- **Irrigation Schedules** (Soil-specific suggestions, weather matching)\n"
            "- **Fertilizer Optimization** (NPK split applications, nutrient deficiencies)\n"
            "- **Weather & Soil Management** (Field preparation, erosion control)\n\n"
            "How can I support your agricultural operations today?"
        )
    }
]

DEFAULT_AGRI_RESPONSE = (
    "🚜 **AgroPredict Digital Advisory:**\n\n"
    "Thank you for reaching out! To help me provide the best agricultural recommendation, try asking about specific topics such as:\n"
    "- *\"How do I control leaf blight on tomato?\"*\n"
    "- *\"What is the best irrigation schedule for clay soil?\"*\n"
    "- *\"How do I optimize NPK split doses for wheat?\"*\n"
    "- *\"What are organic treatments for aphid pests?\"*\n\n"
    "For advanced, automated predictions, use our **Prediction** or **Disease Detection** scanners from the sidebar menu."
)

OFFLINE_DECLINE_RESPONSE = (
    "🌾 **AgroBot Assistant:**\n\n"
    "I am designed specifically to assist with agricultural and farming-related questions. "
    "Please ask me about crops, soil, pests, weather, irrigation, or fertilizers!"
)

OFFLINE_NOTE = (
    "\n\n---\n"
    "💡 *Note: AgroBot is running in **Offline Mode**. Add your `GEMINI_API_KEY` to the `backend/.env` file to enable dynamic AI responses.*"
)

AGRI_KEYWORDS = [
    # English
    r'crop', r'plant', r'grow', r'seed', r'harvest', r'yield', r'agri', r'farm', r'cultivat',
    r'pest', r'bug', r'insect', r'worm', r'spray', r'pesticide', r'weed', r'herbicide',
    r'water', r'irrigate', r'irrigation', r'dry', r'moisture', r'rain', r'weather', r'temp', r'humidity', r'monsoon', r'climate',
    r'fertilizer', r'npk', r'nitrogen', r'phosphorus', r'potassium', r'soil', r'nutrient', r'compost', r'manure', r'organic',
    r'disease', r'leaf', r'blight', r'mildew', r'rot', r'spot', r'fungus', r'virus', r'bacterial', r'mold', r'rust',
    # Hindi
    r'फसल', r'पौध', r'बीज', r'उपज', r'खेती', r'कृषि',
    r'कीट', r'कीड़', r'स्प्रे', r'दवा',
    r'पानी', r'सिंचाई', r'सूखा', r'बारिश', r'मौसम', r'तापमान',
    r'खाद', r'मिट्टी',
    r'बीमारी', r'रोग',
    # Telugu
    r'పంట', r'నెల', r'నీరు', r'తెగుళ్లు', r'పురుగు', r'ఎరువు', r'వాతావరణం',
    # Tamil
    r'பயிர்', r'மண்', r'நீர்', r'பூச்சி', r'உரம்', r'வானிலை', r'நோய்',
    # Punjabi
    r'ਫ਼ਸल', r'ਮਿੱਟੀ', r'ਪਾਣੀ', r'ਕੀਟ', r'ਖਾਦ', r'ਮੌਸਮ', r'ਬਿਮਾਰੀ',
    # Marathi
    r'पीक', r'माती', r'पाणी', r'कीड', r'खत', r'हवामान', r'रोग'
]

GREET_KEYWORDS = [
    r'\bhello\b', r'\bhi\b', r'\bhey\b', r'\bgreetings\b', r'\bstart\b', r'\bwelcome\b',
    r'नमस्ते', r'सत श्री अकाल', r'வணக்கம்', r'నమస్కారం', r'नमस्कार'
]

def call_gemini_api(message):
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return None
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {
        "Content-Type": "application/json"
    }
    
    system_instruction = (
        "You are AgroBot, an expert digital farming and agricultural assistant. "
        "You must answer agricultural and farming related questions (e.g., crop recommendations, soil management, "
        "pest and disease control, irrigation, fertilizers, weather tips for crops, crop planning, sustainable agriculture, etc.) "
        "with correct, concise, and helpful answers in markdown format. "
        "Crucially: If a question is NOT about agriculture, farming, crops, soil, pests, irrigation, weather, "
        "or general agricultural operations, you must politely decline to answer, explaining that you are "
        "specifically designed to assist with agricultural and farming queries only. "
        "Respond in the same language as the user's message."
    )
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": message}
                ]
            }
        ],
        "systemInstruction": {
            "parts": [
                {"text": system_instruction}
            ]
        }
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=12)
        if response.status_code == 200:
            res_data = response.json()
            candidates = res_data.get("candidates", [])
            if candidates:
                content = candidates[0].get("content", {})
                parts = content.get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
        print(f"Gemini API Error (status {response.status_code}): {response.text}")
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
    return None

@chatbot_bp.route('/message', methods=['POST'])
def handle_chat_message():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    
    if not message:
        return jsonify({'response': 'Please enter a farming question.'}), 400
        
    msg_lower = message.lower()
    
    # 1. Try Gemini API first (if API key is present)
    gemini_response = call_gemini_api(message)
    if gemini_response:
        return jsonify({'response': gemini_response}), 200
        
    # 2. Offline Fallback Mode
    # 2a. Greetings check
    if any(re.search(kw, msg_lower) for kw in GREET_KEYWORDS):
        for item in AGRI_KNOWLEDGE_BASE:
            if r'\bhello\b' in item['keywords'] or 'welcome' in item['keywords'] or any(kw in item['keywords'] for kw in GREET_KEYWORDS):
                return jsonify({'response': item['response']}), 200
        # Default welcome fallback
        return jsonify({'response': AGRI_KNOWLEDGE_BASE[-1]['response']}), 200
        
    # 2b. Check if it's agricultural in nature
    is_agri = any(re.search(kw, msg_lower) for kw in AGRI_KEYWORDS)
    if not is_agri:
        return jsonify({'response': OFFLINE_DECLINE_RESPONSE}), 200
        
    # 2c. Match specific categories
    for item in AGRI_KNOWLEDGE_BASE:
        # Skip welcome/greeting item in general match
        if r'\bhello\b' in item['keywords'] or r'\bhi\b' in item['keywords']:
            continue
        if any(re.search(kw, msg_lower) for kw in item['keywords']):
            return jsonify({'response': item['response'] + OFFLINE_NOTE}), 200
            
    # 2d. General agriculture fallback
    return jsonify({'response': DEFAULT_AGRI_RESPONSE + OFFLINE_NOTE}), 200
