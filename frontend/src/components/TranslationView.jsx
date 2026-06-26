import React, { useState, useEffect } from 'react';
import { Languages, Volume2, Mic, MicOff, BookOpen, MessageSquare, Copy, Check } from 'lucide-react';

export default function TranslationView() {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [translationDirection, setTranslationDirection] = useState('en-to-hi'); // en-to-hi or hi-to-en
  const [isRecording, setIsRecording] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Common travel phrases database
  const phrases = [
    {
      category: "Bargaining",
      items: [
        { english: "How much is this?", translations: { hi: "यह कितने का है? (Yeh kitne ka hai?)", ta: "இது என்ன விலை? (Ithu enna vilai?)", bn: "এটার দাম কত? (Etar dam koto?)" } },
        { english: "Too expensive! Reduce price.", translations: { hi: "बहुत महंगा है! दाम कम करो। (Bahut mehanga hai! Daam kam karo.)", ta: "விலையை குறைக்கவும். (Vilayai kuraikkavum.)", bn: "অনেক দাম! একটু কমান। (Onek dam! Ektu koman.)" } },
        { english: "I don't want it, thank you.", translations: { hi: "मुझे नहीं चाहिए, धन्यवाद। (Mujhe nahi chahiye, dhanyawad.)", ta: "எனக்கு வேண்டாம், நன்றி. (Enakku vendaam, nandri.)", bn: "আমার লাগবে না, धन्यवाद।" } }
      ]
    },
    {
      category: "Food & Dining",
      items: [
        { english: "Please make it less spicy.", translations: { hi: "कृपया इसे कम तीखा बनाएं। (Kripya ise kam teekha banayein.)", ta: "காரம் குறைவாக செய்யவும். (Thayavuseithu kaaram kuraivaaga seiyavum.)", bn: "ঝাল কম দেবেন।" } },
        { english: "Do you have bottled water?", translations: { hi: "क्या आपके पास सीलबंद पानी है? (Kya aapke paas sealband paani hai?)", ta: "உங்களிடம் பாட்டில் தண்ணீர் இருக்கிறதா?", bn: "বোতলের জল আছে?" } }
      ]
    },
    {
      category: "Directions",
      items: [
        { english: "Where is the station?", translations: { hi: "स्टेशन कहाँ है? (Station kahan hai?)", ta: "நிலையம் எங்கே இருக்கிறது?", bn: "স্টেশন কোথায়?" } },
        { english: "Turn right / left.", translations: { hi: "दाएं मुड़ें / बाएं मुड़ें। (Daayein mudein / Baayein mudein.)", ta: "திரும்பவும்.", bn: "ডান / বাম যান।" } }
      ]
    },
    {
      category: "Emergency Help",
      items: [
        { english: "Please help me.", translations: { hi: "कृपया मेरी मदद करें। (Kripya meri madad karein.)", ta: "உதவுங்கள்.", bn: "সাহায্য করুন।" } },
        { english: "Where is the hospital?", translations: { hi: "अस्पताल कहाँ है? (Aspatal kahan hai?)", ta: "மருத்துவமனை எங்கே?", bn: "হাসপাতাল কোথায়?" } }
      ]
    }
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsRecording(true);
      rec.onend = () => setIsRecording(false);
      rec.onerror = (e) => {
        console.error('Speech recognition error:', e);
        setIsRecording(false);
      };
      
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setSourceText(transcript);
      };

      setRecognition(rec);
    }
  }, []);

  const processTranslation = (text, direction) => {
    if (!text.trim()) {
      setTargetText('');
      return;
    }

    const lowerText = text.toLowerCase().trim();
    
    for (const cat of phrases) {
      for (const item of cat.items) {
        if (direction === 'en-to-hi') {
          if (item.english.toLowerCase().includes(lowerText) || lowerText.includes(item.english.toLowerCase())) {
            setTargetText(item.translations.hi);
            return;
          }
        }
      }
    }

    const enToHiDb = {
      "hello": "नमस्ते (Namaste)",
      "thank you": "धन्यवाद (Dhanyawad)",
      "how are you": "आप कैसे हैं? (Aap kaise hain?)",
      "water": "पानी (Paani)",
      "food": "खाना (Khana)",
      "medicine": "दवाई (Dawai)",
      "taxi": "टैक्सी (Taxi)",
      "station": "स्टेशन (Station)",
      "bill": "बिल (Bill)",
      "how much": "कितने का है? (Kitne ka hai?)"
    };

    const hiToEnDb = {
      "नमस्ते": "Hello / Hi",
      "धन्यवाद": "Thank you",
      "पानी": "Water",
      "खाना": "Food / Meal",
      "दवाई": "Medicine",
      "टैक्सी": "Taxi / Cab",
      "कितना": "How much?",
      "किराया": "Fare / Price",
      "मदद": "Help / Support"
    };

    if (direction === 'en-to-hi') {
      const matchKey = Object.keys(enToHiDb).find(k => lowerText.includes(k));
      if (matchKey) {
        setTargetText(enToHiDb[matchKey]);
      } else {
        setTargetText(`[Hindi] ${text}`);
      }
    } else {
      const matchKey = Object.keys(hiToEnDb).find(k => lowerText.includes(k));
      if (matchKey) {
        setTargetText(hiToEnDb[matchKey]);
      } else {
        setTargetText(`[English] ${text}`);
      }
    }
  };

  useEffect(() => {
    processTranslation(sourceText, translationDirection);
  }, [sourceText, translationDirection]);

  const handleMicToggle = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please type instead.");
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.lang = translationDirection === 'en-to-hi' ? 'en-US' : 'hi-IN';
      recognition.start();
    }
  };

  const speakText = (text, lang) => {
    if (!window.speechSynthesis) {
      alert("Audio playback not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.split('(')[0].trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fade-in">
      <h1>Translator</h1>
      <p style={{ color: 'var(--text-sub)', marginBottom: '1.5rem' }}>
        Translate speech or text instantly between English and Hindi.
      </p>

      {/* Direction select */}
      <div className="flex gap-2" style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
        <button
          className={`btn ${translationDirection === 'en-to-hi' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}
          onClick={() => {
            setTranslationDirection('en-to-hi');
            setSourceText('');
            setTargetText('');
          }}
        >
          English to Hindi
        </button>
        <button
          className={`btn ${translationDirection === 'hi-to-en' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}
          onClick={() => {
            setTranslationDirection('hi-to-en');
            setSourceText('');
            setTargetText('');
          }}
        >
          Hindi to English
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
        {/* Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel">
            <h3 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-sub)' }}>
              {translationDirection === 'en-to-hi' ? "Input text or tap mic" : "Input Hindi text or tap mic"}
            </h3>

            {/* Input area */}
            <div className="form-group" style={{ position: 'relative' }}>
              <textarea
                className="form-control"
                style={{ height: '110px', resize: 'none', paddingRight: '3.5rem', fontSize: '0.95rem' }}
                placeholder={translationDirection === 'en-to-hi' ? "Type here..." : "Type here..."}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
              <button
                className={`btn ${isRecording ? 'btn-danger' : 'btn-secondary'}`}
                style={{ position: 'absolute', bottom: '10px', right: '10px', borderRadius: '50%', width: '38px', height: '38px', padding: 0 }}
                onClick={handleMicToggle}
                type="button"
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            {isRecording && (
              <div className="audio-visualizer mb-2">
                <div className="audio-bar animating"></div>
                <div className="audio-bar animating"></div>
                <div className="audio-bar animating"></div>
                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginLeft: '8px' }}>Recording...</span>
              </div>
            )}

            {/* Translation Output */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', minHeight: '120px', position: 'relative' }}>
              <div style={{ color: 'var(--text-light)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                Translation
              </div>
              <div style={{ fontSize: '1.25rem', color: 'var(--text-main)', paddingRight: '4rem', fontWeight: 'bold' }}>
                {targetText || <span style={{ color: 'var(--text-light)', fontStyle: 'italic', fontWeight: 'normal', fontSize: '0.9rem' }}>Translation...</span>}
              </div>

              {targetText && (
                <div className="flex gap-1" style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '0.45rem 0.75rem', display: 'flex', gap: '0.2rem', alignItems: 'center', fontSize: '0.75rem' }}
                    onClick={() => speakText(targetText, translationDirection === 'en-to-hi' ? 'hi' : 'en')}
                  >
                    <Volume2 size={14} />
                    <span>Listen</span>
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)' }}
                    onClick={() => copyToClipboard(targetText)}
                  >
                    {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phrases Quick Dictionary */}
        <div>
          <div className="glass-panel" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} style={{ color: 'var(--secondary)' }} />
              Quick Phrase Book
            </h2>
            
            {phrases.map((cat, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.5px', marginBottom: '0.35rem', borderBottom: '1px solid var(--border-color)' }}>
                  {cat.category}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {cat.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx} 
                      className="flex justify-between align-center" 
                      style={{ background: 'white', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                      onClick={() => {
                        setSourceText(item.english);
                        setTranslationDirection('en-to-hi');
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{item.english}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '1px' }}>
                          {item.translations.hi}
                        </div>
                      </div>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.2rem', minWidth: 'auto', background: 'transparent', border: 'none', boxShadow: 'none' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(item.translations.hi, 'hi');
                        }}
                      >
                        <Volume2 size={12} style={{ color: 'var(--primary)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
