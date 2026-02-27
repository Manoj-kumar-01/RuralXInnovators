import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ttsService } from '../services/ttsService';
import './Registration.css';

export default function Registration({ onRegisterComplete }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    React.useEffect(() => {
        ttsService.speak(t('createAccount'), i18n.language);
    }, [t, i18n.language]);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        state: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.fullName && formData.phone.length === 10 && formData.state) {
            if (onRegisterComplete) onRegisterComplete();
            else navigate('/dashboard');
        }
    };

    const isFormValid = formData.fullName && formData.phone.length === 10 && formData.state;

    return (
        <div className="register-container">
            <div className="glass-card register-card fade-in-up">
                <div className="register-header">
                    <div className="icon-circle">
                        <User className="header-icon" size={32} />
                    </div>
                    <h2>{t('createAccount')}</h2>
                    <p className="subtitle">{t('joinSubtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="input-field-group">
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            name="fullName"
                            className="form-input"
                            placeholder={t('fullName')}
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-field-group phone-chip-group">
                        <div className="country-chip">
                            <img src="https://flagcdn.com/w40/in.png" alt="IN" width="22" />
                            <span>+91</span>
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            className="form-input"
                            placeholder="9876543210"
                            value={formData.phone}
                            maxLength={10}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setFormData({ ...formData, phone: val });
                            }}
                            required
                        />
                    </div>


                    <div className="input-field-group">
                        <MapPin className="input-icon" size={20} />
                        <select
                            name="state"
                            className="form-input"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>{t('selectState')}</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className={`primary-btn w-full flex-center mt-6 ${!isFormValid ? 'disabled' : ''}`}
                        disabled={!isFormValid}
                    >
                        {t('register')}
                        <ArrowRight size={20} className="ml-2" />
                    </button>
                </form>

                <p className="auth-link" onClick={() => navigate('/login')}>
                    {t('alreadyHaveAccount')}
                </p>
            </div>
        </div>
    );
}
