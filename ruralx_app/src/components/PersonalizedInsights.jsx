import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Send, Loader2, Languages } from 'lucide-react';
import { getAiInsights } from '../services/aiService';
import { ttsService } from '../services/ttsService';
import './PersonalizedInsights.css';

export default function PersonalizedInsights({ onContinue }) {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState('');
    const [insights, setInsights] = useState('');
    const [loading, setLoading] = useState(false);
    const selectedLanguage = i18n.language;

    React.useEffect(() => {
        return () => ttsService.stop();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setInsights('');

        try {
            const response = await getAiInsights(query, selectedLanguage);
            setInsights(response);
        } catch (error) {
            setInsights("An error occurred while fetching insights.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="insights-container">
            <div className="glass-card insights-card fade-in-up">
                <div className="insights-header">
                    <div className="icon-circle highlight">
                        <Sparkles className="header-icon" size={32} />
                    </div>
                    <h2>{t('personalizedInsights')}</h2>
                    <div className="language-badge">
                        <Languages size={16} className="mr-1" />
                        {selectedLanguage === 'en' ? 'English (Orca)' :
                            selectedLanguage === 'hi' ? 'Hindi (IndusF5)' : 'Telugu (IndusF5)'}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="insights-form">
                    <div className="input-group-vertical">
                        <label htmlFor="insight-query">{t('whatToLearn')}</label>
                        <textarea
                            id="insight-query"
                            className="insight-input"
                            placeholder={t('insightPlaceholder')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`primary-btn w-full mt-4 flex-center ${loading || !query.trim() ? 'disabled' : ''}`}
                        disabled={loading || !query.trim()}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                        <span className="ml-2">{t('getInsights')}</span>
                    </button>
                </form>

                {insights && (
                    <div className="insights-result mt-6 fade-in">
                        <h3>{t('aiInsights')}</h3>
                        <div className="result-text">
                            <p>{insights}</p>
                        </div>
                        <button
                            className="primary-btn mt-6 w-full"
                            onClick={() => onContinue && onContinue()}
                        >
                            {t('continue')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
