import React from 'react';
import { AlertCircle, Phone, Navigation } from 'lucide-react';
import { useTranslation } from '../../node_modules/react-i18next';
import { ttsService } from '../services/ttsService';

export default function Emergency() {
    const { t, i18n } = useTranslation();

    React.useEffect(() => {
        ttsService.speak(t('emergencyTitle'), i18n.language);
    }, [t, i18n.language]);

    return (
        <div className="page-container fade-in-up">
            <div className="page-header error">
                <h1>{t('emergencyTitle')}</h1>
                <p className="subtitle text-error">{t('emergencySubtitle')}</p>
            </div>

            <div className="alert-card glass-card mt-6" style={{ background: '#ffdad6', border: 'none' }}>
                <div className="alert-header">
                    <AlertCircle size={24} style={{ color: '#ba1a1a' }} />
                    <h3 style={{ color: '#410002' }}>{t('noCyclones')}</h3>
                </div>
                <p style={{ color: '#410002' }}>{t('weatherOptimal')}</p>
            </div>

            <div className="list-container mt-6">
                <h3 style={{ marginBottom: '1rem' }}>{t('contactHelplines')}</h3>

                <div className="helpline-card glass-card">
                    <div className="helpline-info">
                        <h4>{t('kisanCallCenter')}</h4>
                        <p>1800-180-1551</p>
                    </div>
                    <button className="icon-btn success" style={{ background: '#006d3e' }}><Phone size={20} /></button>
                </div>

                <div className="helpline-card glass-card">
                    <div className="helpline-info">
                        <h4>{t('disasterMgmt')}</h4>
                        <p>1270</p>
                    </div>
                    <button className="icon-btn error" style={{ background: '#ba1a1a' }}><Phone size={20} /></button>
                </div>
            </div>
        </div>
    );
}
