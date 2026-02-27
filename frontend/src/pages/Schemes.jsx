import React from 'react';
import { useTranslation } from 'react-i18next';
import { ttsService } from '../services/ttsService';

export default function Schemes() {
    const { t, i18n } = useTranslation();

    React.useEffect(() => {
        ttsService.speak(t('schemesTitle'), i18n.language);
    }, [t, i18n.language]);

    return (
        <div className="page-container fade-in-up">
            <div className="page-header">
                <h1>{t('schemesTitle')}</h1>
                <p className="subtitle">{t('schemesSubtitle')}</p>
            </div>

            <div className="list-container mt-6">
                <div className="scheme-card glass-card">
                    <div className="scheme-badge urgent">{t('deadlineApproaching')}</div>
                    <h3>PM-Kisan Samman Nidhi</h3>
                    <p>Financial benefit of ₹6,000 per year to eligible farmer families.</p>
                    <button className="primary-btn mt-4" style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}>{t('applyNow')}</button>
                </div>

                <div className="scheme-card glass-card">
                    <div className="scheme-badge">{t('newScheme')}</div>
                    <h3>Pradhan Mantri Fasal Bima Yojana</h3>
                    <p>Crop insurance scheme to provide financial support to farmers.</p>
                    <button className="primary-btn mt-4" style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}>{t('applyNow')}</button>
                </div>
            </div>
        </div>
    );
}
