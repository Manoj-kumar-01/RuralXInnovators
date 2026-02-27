import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, CheckCircle2 } from 'lucide-react';
import { ttsService } from '../services/ttsService';
import './LanguageSelector.css';

const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
];

export default function LanguageSelector({ onLanguageSelect }) {
    const { t, i18n } = useTranslation();
    const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');

    const handleSelect = (langCode) => {
        ttsService.unlockAudio(); // Important: Unlock on first click
        setSelectedLang(langCode);
        i18n.changeLanguage(langCode);
        ttsService.speak(t('selectLanguage'), langCode);
    };

    const handleContinue = () => {
        ttsService.unlockAudio();
        if (onLanguageSelect) {
            onLanguageSelect(selectedLang);
        }
    };


    return (
        <div className="lang-container">
            <div className="glass-card lang-card fade-in-up">
                <div className="lang-header">
                    <Globe className="globe-icon" size={48} />
                    <h2>{t('selectLanguage')}</h2>
                    <p className="subtitle">{t('subtitle')}</p>
                </div>

                <div className="lang-options">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`lang-btn ${selectedLang === lang.code ? 'selected' : ''}`}
                            onClick={() => handleSelect(lang.code)}
                        >
                            <div className="lang-btn-content">
                                <span className="lang-native">{lang.native}</span>
                                <span className="lang-name">{lang.name}</span>
                            </div>
                            {selectedLang === lang.code && (
                                <CheckCircle2 className="check-icon slide-in-right" size={24} />
                            )}
                        </button>
                    ))}
                </div>

                <button
                    className="primary-btn mt-6 w-full"
                    onClick={handleContinue}
                >
                    {t('continue')}
                </button>
            </div>
        </div>
    );
}
