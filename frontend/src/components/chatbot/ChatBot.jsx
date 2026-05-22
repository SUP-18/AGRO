import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiRobot2Line, RiCloseLine, RiSendPlaneFill, RiLeafLine } from 'react-icons/ri';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const responses = {
  en: {
    default: "I'm AgroBot, your AI farming assistant! I can help with crop recommendations, pest control, irrigation scheduling, and more. Ask me anything about agriculture! 🌾",
    crop: "Based on your soil and climate conditions, I recommend considering Rice, Wheat, or Maize. Rice thrives in clay soil with good water availability. Wheat performs well in loamy soil during Rabi season. Would you like specific details about any of these crops?",
    irrigation: "For optimal irrigation scheduling: Water wheat every 7-10 days during growth stage. Rice paddies need continuous standing water of 5-7cm. Use drip irrigation for vegetables to save 40-60% water. Morning irrigation (6-8 AM) reduces evaporation losses.",
    pest: "For effective pest management: 1) Use neem oil spray (3-5ml/L) for aphids and whiteflies. 2) Install yellow sticky traps for monitoring. 3) Introduce beneficial insects like ladybugs. 4) Rotate crops to break pest cycles. 5) Apply organic mulch to suppress soil-borne pests.",
    fertilizer: "Fertilizer recommendations: For Rice - Apply NPK 120:60:60 kg/ha. Split nitrogen into 3 doses. For Wheat - NPK 100:50:40 kg/ha. Use zinc sulfate at 25 kg/ha for zinc deficiency. Always test soil before application to avoid over-fertilization.",
    soil: "For soil improvement: 1) Add organic compost (5-10 tonnes/ha) annually. 2) Practice green manuring with dhaincha or sunhemp. 3) Maintain proper pH (6.0-7.0) using lime for acidic soils. 4) Use cover crops to prevent erosion. 5) Avoid excessive tillage to preserve soil structure.",
    weather: "Weather-based farming tips: Plant heat-tolerant varieties during summer. Ensure proper drainage before monsoon season. Use mulching to conserve moisture in dry periods. Protect crops from frost using row covers. Monitor weather forecasts daily for irrigation planning.",
    disease: "For disease prevention: 1) Use certified disease-free seeds. 2) Practice crop rotation every 2-3 seasons. 3) Maintain proper plant spacing for air circulation. 4) Remove and destroy infected plant material. 5) Apply preventive fungicides during high-humidity periods.",
    welcome: "Hello! I'm AgroBot 🌱 Your AI farming assistant. How can I help you today?"
  },
  hi: {
    default: "मैं एग्रोबॉट हूं, आपका एआई खेती सहायक! मैं फसल की सिफारिशों, कीट नियंत्रण, सिंचाई समय-सारणी और बहुत कुछ में मदद कर सकता हूं। मुझे कृषि के बारे में कुछ भी पूछें! 🌾",
    crop: "आपकी मिट्टी और जलवायु परिस्थितियों के आधार पर, मैं धान, गेहूं या मक्का पर विचार करने की सलाह देता हूं। धान अच्छी पानी की उपलब्धता के साथ दोमट/मिट्टी में फलता-फूलता है। गेहूं रबी सीजन के दौरान दोमट मिट्टी में अच्छा प्रदर्शन करता है। क्या आप इनमें से किसी भी फसल के बारे में विशिष्ट विवरण चाहते हैं?",
    irrigation: "इष्टतम सिंचाई के लिए: वृद्धि चरण के दौरान गेहूं को हर 7-10 दिनों में पानी दें। धान के खेतों को 5-7 सेमी निरंतर खड़े पानी की आवश्यकता होती है। सब्जियों के लिए ड्रिप सिंचाई का उपयोग करें। सुबह की सिंचाई (सुबह 6-8 बजे) वाष्पीकरण के नुकसान को कम करती है।",
    pest: "प्रभावी कीट प्रबंधन के लिए: 1) एफिड्स और सफेद मक्खियों के लिए नीम के तेल का स्प्रे (3-5ml/L) उपयोग करें। 2) निगरानी के लिए पीले चिपचिपे जाल लगाएं। 3) लेडीबग्स जैसे लाभकारी कीड़ों को बढ़ावा दें। 4) कीट चक्रों को तोड़ने के लिए फसल चक्र अपनाएं।",
    fertilizer: "उर्वरक सिफारिशें: धान के लिए - NPK 120:60:60 किग्रा/हेक्टेयर डालें। नाइट्रोजन को 3 खुराकों में विभाजित करें। गेहूं के लिए - NPK 100:50:40 किग्रा/हेक्टेयर। जिंक की कमी के लिए 25 किग्रा/हेक्टेयर पर जिंक सल्फेट का उपयोग करें। हमेशा आवेदन से पहले मिट्टी का परीक्षण करें।",
    soil: "मिट्टी के सुधार के लिए: 1) सालाना जैविक खाद (5-10 टन/हेक्टेयर) जोड़ें। 2) ढैंचा या सनई के साथ हरी खाद का अभ्यास करें। 3) अम्लीय मिट्टी के लिए चूने का उपयोग करके उचित पीएच (6.0-7.0) बनाए रखें। 4) कटाव को रोकने के लिए कवर फसलों का उपयोग करें।",
    weather: "मौसम आधारित खेती के सुझाव: गर्मियों के दौरान गर्मी-सहनशील किस्में लगाएं। मानसून के मौसम से पहले उचित जल निकासी सुनिश्चित करें। सूखे समय में नमी के संरक्षण के लिए मल्चिंग का उपयोग करें। सिंचाई योजना के लिए दैनिक मौसम पूर्वानुमान की निगरानी करें।",
    disease: "रोग की रोकथाम के लिए: 1) प्रमाणित रोग-मुक्त बीजों का उपयोग करें। 2) हर 2-3 मौसमों में फसल चक्र का अभ्यास करें। 3) हवा के संचार के लिए पौधों के बीच उचित दूरी बनाए रखें। 4) संक्रमित पौधों की सामग्री को हटा दें और नष्ट कर दें।",
    welcome: "नमस्ते! मैं एग्रोबॉट हूँ 🌱 आपका एआई कृषि सहायक। आज मैं आपकी क्या मदद कर सकता हूँ?"
  },
  pa: {
    default: "ਮੈਂ ਐਗਰੋਬੋਟ ਹਾਂ, ਤੁਹਾਡਾ ਏਆਈ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ! ਮੈਂ ਫਸਲਾਂ ਦੀਆਂ ਸਿਫ਼ਾਰਸ਼ਾਂ, ਕੀਟ ਕੰਟਰੋਲ, ਸਿੰਚਾਈ ਦੇ ਸਮੇਂ ਅਤੇ ਹੋਰ ਬਹੁਤ ਕੁਝ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਮੈਨੂੰ ਖੇਤੀਬਾੜੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ! 🌾",
    crop: "ਤੁਹਾਡੀ ਮਿੱਟੀ ਅਤੇ ਜਲਵਾਯੂ ਸਥਿਤੀਆਂ ਦੇ ਅਧਾਰ ਤੇ, ਮੈਂ ਝੋਨਾ, ਕਣਕ ਜਾਂ ਮੱਕੀ ਬਾਰੇ ਵਿਚਾਰ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦਾ ਹਾਂ। ਝੋਨਾ ਚੰਗੇ ਪਾਣੀ ਦੀ ਉਪਲਬਧਤਾ ਦੇ ਨਾਲ ਚੀਕਣੀ ਮਿੱਟੀ ਵਿੱਚ ਵਧੀਆ ਹੁੰਦਾ ਹੈ। ਕਣਕ ਹਾੜੀ ਦੇ ਸੀਜ਼ਨ ਦੌਰਾਨ ਦੋਮਟ ਮਿੱਟੀ ਵਿੱਚ ਵਧੀਆ ਪ੍ਰਦਰਸ਼ਨ ਕਰਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹਨਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵੀ ਫਸਲ ਬਾਰੇ ਖਾਸ ਵੇਰਵੇ ਚਾਹੁੰਦੇ ਹੋ?",
    irrigation: "ਸਿੰਚਾਈ ਲਈ: ਕਣਕ ਨੂੰ ਵਾਧੇ ਦੇ ਪੜਾਅ ਦੌਰਾਨ ਹਰ 7-10 ਦਿਨਾਂ ਬਾਅਦ ਪਾਣੀ ਦਿਓ। ਝੋਨੇ ਦੇ ਖੇਤਾਂ ਨੂੰ 5-7 ਸੈਂਟੀਮੀਟਰ ਲਗਾਤਾਰ ਖੜ੍ਹੇ ਪਾਣੀ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਸਬਜ਼ੀਆਂ ਲਈ ਤੁਪਕਾ ਸਿੰਚਾਈ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਸਵੇਰੇ ਸਿੰਚਾਈ ਕਰਨ ਨਾਲ ਪਾਣੀ ਦੇ ਉੱਡਣ ਦਾ ਨੁਕਸਾਨ ਘਟਦਾ ਹੈ।",
    pest: "ਕੀਟ ਪ੍ਰਬੰਧਨ ਲਈ: 1) ਨੀਮ ਤੇਲ ਸਪਰੇਅ (3-5ml/L) ਦੀ ਵਰਤੋਂ ਕਰੋ। 2) ਨਿਗਰਾਨੀ ਲਈ ਪੀਲੇ ਚਿਪਕਣ ਵਾਲੇ ਜਾਲ ਲਗਾਓ। 3) ਲੇਡੀਬੱਗ ਵਰਗੇ ਲਾਭਕਾਰੀ ਕੀੜੇ ਵਧਾਓ। 4) ਫਸਲੀ ਚੱਕਰ ਅਪਣਾਓ।",
    fertilizer: "ਖਾਦ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ: ਝੋਨੇ ਲਈ - NPK 120:60:60 ਕਿਲੋਗ੍ਰਾਮ/ਹੈਕਟੇਅਰ। ਕਣਕ ਲਈ - NPK 100:50:40 ਕਿਲੋਗ੍ਰਾਮ/ਹੈਕਟੇਅਰ। ਜ਼ਿੰਕ ਦੀ ਘਾਟ ਲਈ 25 ਕਿਲੋਗ੍ਰਾਮ/ਹੈਕਟੇਅਰ ਜ਼ਿੰਕ ਸਲਫੇਟ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    soil: "ਮਿੱਟੀ ਸੁਧਾਰ ਲਈ: 1) ਹਰ ਸਾਲ ਜੈਵਿਕ ਖਾਦ ਪਾਓ। 2) ਹਰੀ ਖਾਦ ਦੀ ਵਰਤੋਂ ਕਰੋ। 3) ਮਿੱਟੀ ਦਾ ਪੀਐਚ (6.0-7.0) ਸਹੀ ਰੱਖੋ। 4) ਮਿੱਟੀ ਦੇ ਖੋਰ ਨੂੰ ਰੋਕੋ।",
    weather: "ਮੌਸਮ ਅਧਾਰਤ ਸੁਝਾਅ: ਗਰਮੀਆਂ ਵਿੱਚ ਗਰਮੀ ਸਹਿਣ ਵਾਲੀਆਂ ਕਿਸਮਾਂ ਬੀਜੋ। ਮਾਨਸੂਨ ਤੋਂ ਪਹਿਲਾਂ ਨਿਕਾਸੀ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ। ਨਮੀ ਬਚਾਉਣ ਲਈ ਮਲਚਿੰਗ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    disease: "ਬਿਮਾਰੀ ਦੀ ਰੋਕਥਾਮ: 1) ਪ੍ਰਮਾਣਿਤ ਬੀਜ ਵਰਤੋ। 2) ਫਸਲੀ ਚੱਕਰ ਅਪਣਾਓ। 3) ਬੂਟਿਆਂ ਵਿੱਚ ਸਹੀ ਦੂਰੀ ਰੱਖੋ। 4) ਪ੍ਰਭਾਵਿਤ ਬੂਟੇ ਨਸ਼ਟ ਕਰੋ।",
    welcome: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਐਗਰੋਬੋਟ ਹਾਂ 🌱 ਤੁਹਾਡਾ ਏਆਈ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?"
  },
  ta: {
    default: "நான் அக்ரோபாட், உங்கள் AI விவசாய உதவியாளர்! பயிர் பரிந்துரைகள், பூச்சி கட்டுப்பாடு, நீர்ப்பாசன அட்டவணை மற்றும் பலவற்றிற்கு நான் உதவ முடியும். விவசாயம் பற்றி என்னிடம் எதுவும் கேளுங்கள்! 🌾",
    crop: "உங்கள் மண் மற்றும் காலநிலை நிலைகளின் அடிப்படையில், நெல், கோதுமை அல்லது சோளம் ஆகியவற்றை பரிசீலிக்க பரிந்துரைக்கிறேன். நல்ல நீர் வசதியுடன் களிமண்ணில் நெல் செழித்து வளரும். கோதுமை பனி பருவத்தில் வண்டல் மண்ணில் நன்றாக வளரும்.",
    irrigation: "நீர்ப்பாசன உதவி: கோதுமைக்கு வளர்ச்சி காலத்தில் 7-10 நாட்களுக்கு ஒருமுறை நீர் பாய்ச்சவும். நெல் வயல்களுக்கு 5-7 செமீ தண்ணீர் தேங்கி நிற்க வேண்டும். சொட்டு நீர் பாசனம் மூலம் 40-60% தண்ணீர் சேமிக்கலாம்.",
    pest: "பூச்சி மேலாண்மை: 1) வேப்ப எண்ணெய் தெளிப்பு (3-5ml/L) பயன்படுத்தவும். 2) ஒட்டும் பொறிகளை அமைக்கவும். 3) நன்மை செய்யும் பூச்சிகளை வளர்க்கவும். 4) பயிர் சுழற்சி முறை பின்பற்றவும்.",
    fertilizer: "உர பரிந்துரைகள்: நெல்லுக்கு - NPK 120:60:60 கிலோ/ஹெக்டேர். கோதுமைக்கு - NPK 100:50:40 கிலோ/ஹெக்டேர். துத்தநாக குறைபாட்டிற்கு 25 கிலோ/ஹெக்டேர் துத்தநாக சல்பேட் பயன்படுத்தவும்.",
    soil: "மண் மேம்பாடு: 1) ஆண்டுதோறும் மட்கிய உரம் இடவும். 2) பசுந்தாள் உரம் பயன்படுத்தவும். 3) சரியான மண் அமிலத்தன்மை (6.0-7.0 pH) பராமரிக்கவும்.",
    weather: "வானிலை குறிப்புகள்: கோடையில் வெப்பத்தைத் தாங்கும் பயிர்களை நடவும். மழைக்காலத்திற்கு முன் வடிகால் வசதியை உறுதி செய்யவும். ஈரப்பதத்தை காக்க மூடாக்கு பயன்படுத்தவும்.",
    disease: "நோய் தடுப்பு: 1) சான்றளிக்கப்பட்ட விதை பயன்படுத்தவும். 2) பயிர் சுழற்சி மேற்கொள்ளவும். 3) போதிய இடைவெளி விட்டு நடவு செய்யவும்.",
    welcome: "வணக்கம்! நான் அக்ரோபாட் 🌱 உங்கள் AI விவசாய உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?"
  },
  te: {
    default: "నేను అగ్రోబాట్, మీ AI వ్యవసాయ సహాయకుడిని! పంట సిఫార్సులు, తెగుళ్ల నివారణ, నీటి పారుదల మరియు మరిన్నింటిలో నేను సహాయం చేయగలను. వ్యవసాయం గురించి నన్ను ఏదైనా అడగండి! 🌾",
    crop: "మీ నేల మరియు శీతోష్ణస్థితి ఆధారంగా, వరి, గోధుమ లేదా మొక్కజొన్నను నేను సిఫార్సు చేస్తున్నాను. క్లే నేలలో వరి బాగా పండుతుంది. గోధుమలు లోమ్ నేలలో రబీ సీజన్‌లో బాగా పెరుగుతాయి.",
    irrigation: "నీటి యాజమాన్యం: గోధుమలకు ప్రతి 7-10 రోజులకు నీరు పెట్టండి. వరి పొలాల్లో 5-7 సెం.మీ నీరు నిల్వ ఉండాలి. కూరగాయలకు డ్రిప్ ఇరిగేషన్ వాడితే 40-60% నీరు ఆదా అవుతుంది.",
    pest: "తెగుళ్ల నివారణ: 1) వేప నూనె స్ప్రే (3-5ml/L) వాడండి. 2) పసుపు జిగురు బోర్డులను అమర్చండి. 3) ఉపయోగకరమైన కీటకాలను పెంచండి. 4) పంట మార్పిడి చేయండి.",
    fertilizer: "ఎరువుల యాజమాన్యం: వరికి - NPK 120:60:60 కిలోలు/హెక్టారుకు. గోధుమలకు - NPK 100:50:40 కిలోలు/హెక్టారుకు. జింక్ లోపానికి జింక్ సల్ఫేట్ వాడండి.",
    soil: "నేల అభివృద్ధి: 1) ఏటా సేంద్రీయ ఎరువులు వేయండి. 2) పచ్చిరొట్ట ఎరువులు వాడండి. 3) నేల పీహెచ్ (6.0-7.0) సరిగ్గా ఉంచండి.",
    weather: "వాతావరణ వ్యవసాయ సూచనలు: వేసవిలో తట్టుకునే రకాలను ఎంచుకోండి. వర్షాకాలం ముందు నీటి నిల్వ లేకుండా చూసుకోండి. మల్చింగ్ ద్వారా తేమను కాపాడుకోండి.",
    disease: "వ్యాధి నివారణ: 1) ధృవీకరించిన విత్తనాలు వాడండి. 2) పంట మార్పిడి చేయండి. 3) మొక్కల మధ్య సరైన దూరం ఉంచండి.",
    welcome: "నమస్కారం! నేను అగ్రోబాట్ 🌱 మీ AI వ్యవసాయ సహాయకుడిని. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?"
  },
  mr: {
    default: "मी ॲग्रोबोट आहे, तुमचा AI शेती सल्लागार! मी पीक शिफारसी, कीड नियंत्रण, सिंचन नियोजन आणि बरेच काही यामध्ये मदत करू शकतो. शेतीबद्दल मला काहीही विचारा! 🌾",
    crop: "तुमच्या माती आणि हवामानानुसार, मी भात, गहू किंवा मका या पिकांची शिफारस करतो. चिकन मातीत भात चांगला येतो. गहू रब्बी हंगामात तांबड्या/लोम मातीत चांगला येतो.",
    irrigation: "सिंचन नियोजन: गव्हाला वाढीच्या काळात दर ७-१० दिवसांनी पाणी द्यावे. भात शेतामध्ये ५-७ सेमी पाणी सतत असावे. भाजीपाल्यासाठी ठिबक सिंचन वापरा.",
    pest: "कीड व्यवस्थापन: १) कडुनिंबाच्या तेलाची फवारणी (३-५ मिली/लीटर) करा. २) पिवळे चिकट सापळे लावा. ३) मित्रकिटकांचे संगोपन करा. ४) पीक फेरपालट करा.",
    fertilizer: "खत व्यवस्थापन: भातासाठी - NPK १२०:६०:६० किलो/हेक्टर. गव्हासाठी - NPK १००:५०:४० किलो/हेक्टर. जस्त कमतरतेसाठी झिंक सल्फेट वापरा.",
    soil: "जमीन सुधारणा: १) दरवर्षी सेंद्रिय खतांचा वापर करा. २) हिरवळीच्या खतांचा वापर करा. ३) मातीचा पीएच (६.०-७.०) योग्य ठेवा.",
    weather: "हवामान आधारित शेती: उन्हाळ्यात उष्णता सहन करणाऱ्या जाती लावा. पावसाळ्यापूर्वी शेतात पाणी साचणार नाही याची काळजी घ्या.",
    disease: "रोग प्रतिबंधक उपाय: १) प्रमाणित बियाणांचा वापर करा. २) पीक फेरपालट करा. ३) झाडांमध्ये योग्य अंतर ठेवा.",
    welcome: "नमस्कार! मी ॲग्रोबोट आहे 🌱 तुमचा AI शेती मदतनीस. आज मी तुम्हाला कशी मदत करू शकतो?"
  }
};

function getResponse(message, lang = 'en') {
  const lower = message.toLowerCase();
  const db = responses[lang] || responses['en'];
  
  const declineMessages = {
    en: "🌾 **AgroBot Assistant:**\n\nI am designed specifically to assist with agricultural and farming-related questions. Please ask me about crops, soil, pests, weather, irrigation, or fertilizers!",
    hi: "🌾 **एग्रोबॉट सहायक:**\n\nमुझे विशेष रूप से कृषि और खेती से संबंधित प्रश्नों में मदद करने के लिए डिज़ाइन किया गया है। कृपया मुझसे फसलों, मिट्टी, कीटों, मौसम, सिंचाई या उर्वरकों के बारे में पूछें!",
    pa: "🌾 **ਐਗਰੋਬੌਟ ਸਹਾਇਕ:**\n\nਮੈਨੂੰ ਖਾਸ ਤੌਰ 'ਤੇ ਖੇਤੀਬਾੜੀ ਅਤੇ ਖੇਤੀ ਨਾਲ ਸਬੰਧਤ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਮਦਦ ਕਰਨ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਫਸਲਾਂ, ਮਿੱਟੀ, ਕੀੜਿਆਂ, ਮੌਸਮ, ਸਿੰਚਾਈ ਜਾਂ ਖਾਦਾਂ ਬਾਰੇ ਪੁੱਛੋ!",
    ta: "🌾 **அக்ரோபாட் உதவியாளர்:**\n\nநான் குறிப்பாக விவசாயம் மற்றும் விவசாயம் சார்ந்த கேள்விகளுக்கு பதிலளிக்க வடிவமைக்கப்பட்டுள்ளேன். தயவுசெய்து பயிர்கள், மண், பூச்சிகள், வானிலை, நீர்ப்பாசனம் அல்லது உரங்கள் பற்றி கேளுங்கள்!",
    te: "🌾 **ఆగ్రోబాట్ సహాయకుడు:**\n\nనేను వ్యవసాయం మరియు వ్యవసాయానికి సంబంధించిన ప్రశ్నలకు సహాయం చేయడానికి ప్రత్యేకంగా రూపొందబడ్డాను. దయచేసి పంటలు, నేల, తెగుళ్లు, వాతావరణం, నీటిపారుదల లేదా ఎరువుల గురించి అడగండి!",
    mr: "🌾 **ॲग्रोबोट सहाय्यक:**\n\nमला विशेषतः शेती आणि शेतीशी संबंधित प्रश्नांमध्ये मदत करण्यासाठी डिझाइन केले गेले आहे. कृपया मला पिके, माती, कीड, हवामान, सिंचन किंवा खतांबद्दल विचारा!"
  };

  const offlineNotes = {
    en: "\n\n---\n💡 *Note: AgroBot is running in **Offline Mode**. Add your `GEMINI_API_KEY` to the `backend/.env` file to enable dynamic AI responses.*",
    hi: "\n\n---\n💡 *नोट: एग्रोबॉट **ऑफ़लाइन मोड** में चल रहा है। गतिशील AI उत्तरों को सक्षम करने के लिए `backend/.env` फ़ाइल में `GEMINI_API_KEY` जोड़ें।*",
    pa: "\n\n---\n💡 *ਨੋਟ: ਐਗਰੋਬੌਟ **ਔਫਲਾਈਨ ਮੋਡ** ਵਿੱਚ ਚੱਲ ਰਿਹਾ ਹੈ। ਡਾਇਨਾਮਿਕ AI ਜਵਾਬਾਂ ਨੂੰ ਚਾਲੂ ਕਰਨ ਲਈ `backend/.env` ਫਾਈਲ ਵਿੱਚ `GEMINI_API_KEY` ਜੋੜੋ।*",
    ta: "\n\n---\n💡 *குறிப்பு: அக்ரோபாட் **ஆஃப்லைன் பயன்முறையில்** இயங்குகிறது. டைனமிக் AI பதில்களைப் பெற `backend/.env` கோப்பில் `GEMINI_API_KEY`-ஐச் சேர்க்கவும்.*",
    te: "\n\n---\n💡 *గమనిక: అగ్రోబాట్ **ఆఫ్‌లైన్ మోడ్**లో రన్ అవుతోంది. డైనమిక్ AI సమాధానాలను ప్రారంభించడానికి `backend/.env` ఫైల్‌లో `GEMINI_API_KEY` జోడించండి.*",
    mr: "\n\n---\n💡 *टीप: ॲग्रोबोट **ऑफलाईन मोड** मध्ये चालू आहे. डायनॅमिक AI उत्तरे सक्रिय करण्यासाठी `backend/.env` फाईलमध्ये `GEMINI_API_KEY` जोडा.*"
  };

  const note = offlineNotes[lang] || offlineNotes['en'];
  const decline = declineMessages[lang] || declineMessages['en'];

  const greetKeywords = [
    'hello', 'hi', 'hey', 'greetings', 'start', 'welcome',
    'नमस्ते', 'सत श्री अकाल', 'வணக்கம்', 'నమస్కారం', 'नमस्कार'
  ];

  const agriKeywords = [
    // English
    'crop', 'plant', 'grow', 'seed', 'harvest', 'yield', 'agri', 'farm', 'cultivat',
    'pest', 'bug', 'insect', 'worm', 'spray', 'pesticide', 'weed', 'herbicide',
    'water', 'irrigate', 'irrigation', 'dry', 'moisture', 'rain', 'weather', 'temp', 'humidity', 'monsoon', 'climate',
    'fertilizer', 'npk', 'nitrogen', 'phosphorus', 'potassium', 'soil', 'nutrient', 'compost', 'manure', 'organic',
    'disease', 'leaf', 'blight', 'mildew', 'rot', 'spot', 'fungus', 'virus', 'bacterial', 'mold', 'rust',
    // Hindi
    'फसल', 'पौध', 'बीज', 'उपज', 'खेती', 'कृषि', 'कीट', 'कीड़', 'स्प्रे', 'दवा', 'पानी', 'सिंचाई', 'सूखा', 'बारिश', 'मौसम', 'तापमान', 'खाद', 'मिट्टी', 'बीमारी', 'रोग',
    // Telugu
    'పంట', 'నెల', 'నీరు', 'తెగుళ్లు', 'పురుగు', 'ఎరువు', 'వాతావరణం',
    // Tamil
    'பயிர்', 'மண்', 'நீர்', 'பூச்சி', 'உரம்', 'வானிலை', 'நோய்',
    // Punjabi
    'ਫ਼ਸਲ', 'ਮਿੱਟੀ', 'ਪਾਣੀ', 'ਕੀਟ', 'ਖਾਦ', 'ਮੌਸਮ', 'ਬਿਮਾਰੀ',
    // Marathi
    'पीक', 'माती', 'पाणी', 'कीड', 'खत', 'हवामान', 'रोग'
  ];

  // 1. Check Greetings first
  const isGreeting = greetKeywords.some(kw => lower.includes(kw));
  if (isGreeting) {
    return db.welcome || db.default;
  }

  // 2. Check if message is agriculture related
  const isAgri = agriKeywords.some(kw => lower.includes(kw));
  if (!isAgri) {
    return decline;
  }

  // 3. Match categories
  const isCrop = lower.includes('crop') || lower.includes('plant') || lower.includes('grow') || lower.includes('best') ||
                 lower.includes('फसल') || lower.includes('पौधा') || lower.includes('उगाएं') ||
                 lower.includes('ਫ਼ਸਲ') || lower.includes('பயிர்') || lower.includes('பயிர்கள்') ||
                 lower.includes('పంట') || lower.includes('పంటలు') || lower.includes('पीक') || lower.includes('झाड');
                 
  const isIrrigation = lower.includes('irrigat') || lower.includes('water') || lower.includes('watering') ||
                       lower.includes('पानी') || lower.includes('सिंचाई') || lower.includes('ਸਿੰਚਾਈ') ||
                       lower.includes('நீர்') || lower.includes('பாசனம்') || lower.includes('నీరు') ||
                       lower.includes('నీటి') || lower.includes('पाणी') || lower.includes('सिंचन');
                       
  const isPest = lower.includes('pest') || lower.includes('insect') || lower.includes('bug') ||
                 lower.includes('कीट') || lower.includes('कीड़ा') || lower.includes('कीड़े') ||
                 lower.includes('ਕੀੜੇ') || lower.includes('பூச்சி') || lower.includes('பூச்சிகள்') ||
                 lower.includes('పురుగులు') || lower.includes('కీటకాలు') || lower.includes('कीड');
                 
  const isFertilizer = lower.includes('fertili') || lower.includes('npk') || lower.includes('nutrient') ||
                       lower.includes('उर्वरक') || lower.includes('खाद') || lower.includes('ਖਾਦ') ||
                       lower.includes('உரம்') || lower.includes('உரங்கள்') || lower.includes('ఎరువులు') ||
                       lower.includes('खत');
                       
  const isSoil = lower.includes('soil') || lower.includes('compost') || lower.includes('mulch') ||
                 lower.includes('मिट्टी') || lower.includes('मृदा') || lower.includes('ਮਿੱਟੀ') ||
                 lower.includes('மண்') || lower.includes('नेला') || lower.includes('మట్టి') ||
                 lower.includes('माती');
                 
  const isWeather = lower.includes('weather') || lower.includes('rain') || lower.includes('temperature') ||
                    lower.includes('मौसम') || lower.includes('बारिश') || lower.includes('तापमान') ||
                    lower.includes('ਮੀਂਹ') || lower.includes('ਮੌਸਮ') || lower.includes('மழை') ||
                    lower.includes('வானிலை') || lower.includes('వాతావరణం') || lower.includes('వర్షం') ||
                    lower.includes('पाऊस') || lower.includes('हवामान');
                    
  const isDisease = lower.includes('disease') || lower.includes('blight') || lower.includes('fungus') || lower.includes('rot') ||
                    lower.includes('बीमारी') || lower.includes('रोग') || lower.includes('ਬਿਮਾਰੀ') ||
                    lower.includes('நோய்') || lower.includes('వ్యాధి') || lower.includes('रोग');

  if (isCrop) return db.crop + note;
  if (isIrrigation) return db.irrigation + note;
  if (isPest) return db.pest + note;
  if (isFertilizer) return db.fertilizer + note;
  if (isSoil) return db.soil + note;
  if (isWeather) return db.weather + note;
  if (isDisease) return db.disease + note;
  
  return db.default + note;
}

const parseBold = (text) => {
  const parts = [];
  let lastIndex = 0;
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    const before = text.substring(lastIndex, match.index);
    if (before) parts.push(before);
    parts.push(<strong key={match.index} className="font-semibold text-primary-400">{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  
  const after = text.substring(lastIndex);
  if (after) parts.push(after);
  
  return parts.length > 0 ? parts : text;
};

const formatMessage = (text) => {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, index) => {
    let cleanLine = line;
    let isBullet = false;

    // Detect list items
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      isBullet = true;
      cleanLine = line.trim().substring(2);
    } else if (/^\d+\.\s+/.test(line.trim())) {
      const numMatch = line.trim().match(/^(\d+\.)\s+/);
      const prefix = numMatch ? numMatch[1] + ' ' : '';
      cleanLine = line.trim().replace(/^\d+\.\s+/, '');
      
      return (
        <div key={index} className="pl-6 relative min-h-[1.25rem] text-dark-200 mt-1">
          <span className="absolute left-1 text-primary-400 font-semibold">{prefix}</span>
          {parseBold(cleanLine)}
        </div>
      );
    }

    return (
      <div key={index} className={`${isBullet ? 'pl-6 relative before:content-["•"] before:absolute before:left-2 before:text-primary-400 before:font-bold mt-1' : ''} ${line.trim() === '' ? 'h-2' : 'min-h-[1.25rem] text-dark-200'}`}>
        {parseBold(cleanLine)}
      </div>
    );
  });
};

export default function ChatBot() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize welcome message in correct language
  useEffect(() => {
    const welcomeText = responses[language]?.welcome || responses['en'].welcome;
    setMessages([
      { id: 1, text: welcomeText, sender: 'bot' }
    ]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    { label: t('chatbot.quickActions.cropAdvice'), query: t('chatbot.quickActions.cropAdvice') },
    { label: t('chatbot.quickActions.weatherTips'), query: t('chatbot.quickActions.weatherTips') },
    { label: t('chatbot.quickActions.pestControl'), query: t('chatbot.quickActions.pestControl') },
    { label: t('chatbot.quickActions.irrigationHelp'), query: t('chatbot.quickActions.irrigationHelp') },
  ];

  const sendMessage = async (text) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    setMessages(prev => [...prev, { id: Date.now(), text: msgText, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      // Call backend API first
      const response = await api.post('/chatbot/message', { message: msgText });
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response.data.response, sender: 'bot' }]);
    } catch (error) {
      console.log('Chatbot API offline or errored, falling back to localized frontend simulation.');
      // Localized fallback response
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: getResponse(msgText, language), sender: 'bot' }]);
      }, 1000 + Math.random() * 1000);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-dark-800 text-dark-300 rotate-0'
            : 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-primary-500/40'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <RiCloseLine size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <RiRobot2Line size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] h-[500px] glass-dark rounded-2xl border border-dark-700/50 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <RiLeafLine className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{t('chatbot.title')}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  <span className="text-primary-100 text-xs">{t('chatbot.subtitle')}</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : 'bg-dark-800 text-dark-200 rounded-bl-md border border-dark-700/50'
                  }`}>
                    {msg.sender === 'user' ? msg.text : formatMessage(msg.text)}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-dark-800 border border-dark-700/50 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5">
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(action.query)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-primary-500/30 text-primary-400 hover:bg-primary-500/10 transition-all whitespace-nowrap"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-dark-700/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={t('chatbot.placeholder')}
                  className="flex-1 bg-dark-800/60 border border-dark-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 transition-all"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-500 transition-colors disabled:opacity-40"
                >
                  <RiSendPlaneFill size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
