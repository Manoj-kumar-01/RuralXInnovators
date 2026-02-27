import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ttsService } from '../services/ttsService';
import './Login.css';

export default function Login({ onLoginComplete }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digit OTP mock

    // Voice narration on step change
    React.useEffect(() => {
        const message = step === 1 ? t('enterPhone') : t('enterOtp');
        ttsService.speak(message, i18n.language);
    }, [step, t, i18n.language]);

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        if (phone.length === 10) {
            setStep(2);
            console.log("OTP Sent");
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length === 6) {
            if (onLoginComplete) onLoginComplete();
            else navigate('/dashboard');
        }
    };

    return (
        <div className="login-container">
            <div className="glass-card login-card fade-in-up">
                {step === 1 ? (
                    <>
                        <div className="login-header">
                            <div className="icon-circle">
                                <Phone className="header-icon" size={32} />
                            </div>
                            <h2>{t('enterPhone')}</h2>
                            <p className="subtitle">{t('subtitle')}</p>
                        </div>

                        <form onSubmit={handlePhoneSubmit} className="login-form">
                            <div className="phone-input-container glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                                <div className="input-row">
                                    <div className="country-chip">
                                        <img src="https://flagcdn.com/w40/in.png" alt="IN" width="24" />
                                        <span>+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        className="phone-field"
                                        placeholder={t('phonePlaceholder')}
                                        value={phone}
                                        maxLength={10}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setPhone(val);
                                        }}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`primary-btn ${phone.length !== 10 ? 'disabled' : ''}`}
                                disabled={phone.length !== 10}
                                style={{ marginTop: '1rem' }}
                            >
                                {t('sendOtp')}
                                <ArrowRight size={22} />
                            </button>
                        </form>


                        <p className="auth-link" style={{ "textAlign": "center", "marginTop": "1.5rem", "color": "var(--text-muted)", "fontWeight": 500 }}>
                            Don't have an account? <span onClick={() => navigate('/register')} style={{ "color": "var(--primary)", "fontWeight": 700, "cursor": "pointer" }}>Register here</span>
                        </p>
                    </>
                ) : (
                    <>
                        <div className="login-header">
                            <div className="icon-circle success">
                                <ShieldCheck className="header-icon" size={32} />
                            </div>
                            <h2>{t('enterOtp')}</h2>
                            <p className="subtitle">{t('otpSentMessage')}: {phone}</p>
                        </div>

                        <form onSubmit={handleOtpSubmit} className="login-form">
                            <div className="otp-container">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className="otp-input"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                                const prevInput = document.getElementById(`otp-${index - 1}`);
                                                if (prevInput) prevInput.focus();
                                            }
                                        }}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className={`primary-btn w-full mt-6 flex-center ${otp.join('').length < 6 ? 'disabled' : ''}`}
                                disabled={otp.join('').length < 6}
                            >
                                {t('verifyOtp')}
                                <ArrowRight size={20} className="ml-2" />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
