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

            <div className="alert-card glass-card mt-6">
                <div className="alert-header">
                    <AlertCircle size={24} className="text-error" />
                    <h3>{t('noCyclones')}</h3>
                </div>
                <p>{t('weatherOptimal')}</p>
            </div>

            <div className="list-container mt-6">
                <h3 style={{ marginBottom: '1rem' }}>{t('contactHelplines')}</h3>

                <div className="helpline-card glass-card">
                    <div className="helpline-info">
                        <h4>{t('kisanCallCenter')}</h4>
                        <p>1800-180-1551</p>
                    </div>
                    <button className="icon-btn success"><Phone size={24} /></button>
                </div>

                <div className="helpline-card glass-card">
                    <div className="helpline-info">
                        <h4>{t('disasterMgmt')}</h4>
                        <p>1270</p>
                    </div>
                    <button className="icon-btn error"><Phone size={24} /></button>
                </div>
            </div>
        </div>
    );
}
