import React, { useState, useEffect } from 'react';
import { Camera, MapPin, AlertTriangle, ShieldCheck, ThermometerSun, Leaf, Volume2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getCropSuitability } from '../utils/cropData';
import { ttsService } from '../services/ttsService';

export default function Home() {
    const { t, i18n } = useTranslation();
    const [showReport, setShowReport] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    // Entry Narration
    useEffect(() => {
        ttsService.speak(t('homeWelcome'), i18n.language);
    }, []);

    // Location States
    const [locationData, setLocationData] = useState({
        regionName: t('detectingLocation'),
        favorableCrops: ["-"],
        unfavorableCrops: ["-"],
        isLoading: true,
        error: null
    });

    useEffect(() => {
        let isMounted = true;

        const fetchLocation = () => {
            if (!("geolocation" in navigator)) {
                if (isMounted) {
                    setLocationData(prev => ({ ...prev, regionName: "Geolocation Not Supported", isLoading: false, error: "Browser not supported." }));
                }
                return;
            }

            if (isMounted) {
                setLocationData(prev => ({ ...prev, isLoading: true, error: null, regionName: t('detectingLocation') }));
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    try {
                        // Using BigDataCloud for more accurate free client-side Reverse Geocoding
                        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
                        const data = await response.json();

                        const stateName = data.principalSubdivision || data.adminArea || "Unknown Region";
                        const city = data.city || data.locality || "";

                        let displayName = stateName;
                        if (city && city !== stateName) {
                            displayName = `${city}, ${stateName}`;
                        }

                        const crops = getCropSuitability(stateName);

                        if (isMounted) {
                            setLocationData({
                                regionName: displayName,
                                favorableCrops: crops.favorable,
                                unfavorableCrops: crops.unfavorable,
                                isLoading: false,
                                error: null
                            });
                        }
                    } catch (error) {
                        console.error("Geocoding failed:", error);
                        if (isMounted) {
                            setLocationData(prev => ({ ...prev, regionName: t('locationUnavailable'), isLoading: false, error: "Failed to fetch exact area." }));
                        }
                    }
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    let errorMsg = "Please allow location access.";
                    if (err.code === err.PERMISSION_DENIED) errorMsg = "Location permission denied.";

                    if (isMounted) {
                        setLocationData(prev => ({
                            ...prev,
                            regionName: t('locationDisabled'),
                            isLoading: false,
                            error: errorMsg,
                            favorableCrops: [t('enableLocation')],
                            unfavorableCrops: [t('enableLocation')]
                        }));
                    }
                },
                { timeout: 10000 }
            );
        };

        fetchLocation();

        // Listen for permission changes to auto-refresh when granted
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
                permissionStatus.onchange = () => {
                    if (permissionStatus.state === 'granted') {
                        fetchLocation();
                    }
                };
            }).catch(e => console.error("Permission API error:", e));
        }

        return () => {
            isMounted = false;
        };
    }, []);

    const diseaseReport = {
        disease: "Leaf Blight",
        confidence: "94%",
        severity: "High",
        reason: "High humidity combined with low soil nitrogen levels.",
        pesticides: ["Fungicide X by AgroTech", "Mancozeb 75% WP"],
        contacts: ["AgroTech Cure: +91 9876543211", "Kisan Care: 1800-123-4567"],
        precautions: ["Ensure proper plant spacing", "Avoid overhead irrigation", "Test soil nitrogen regularly"]
    };

    const simulateScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setShowReport(true);
        }, 2000);
    };

    const handleTTS = () => {
        const text = `Disease detected: ${diseaseReport.disease}. Severity is ${diseaseReport.severity}. Reason: ${diseaseReport.reason}.`;
        ttsService.speak(text, i18n.language);
    };

    return (
        <div className="page-container fade-in-up">
            {/* Location Intelligence Banner */}
            <div className="location-banner glass-card mb-6">
                <div className="location-header">
                    {locationData.isLoading ? (
                        <Loader2 size={20} className="text-primary animate-spin" />
                    ) : (
                        <MapPin size={20} className="text-primary" />
                    )}
                    <h3>{locationData.regionName}</h3>
                </div>

                {locationData.error ? (
                    <p className="subtitle mt-2 text-error" style={{ fontSize: "0.85rem" }}>{locationData.error}</p>
                ) : (
                    <div className="crops-info mt-2">
                        <div className="crop-badge favorable">
                            <Leaf size={14} className="mr-1" />
                            <strong>{t('favorable')}</strong> {locationData.favorableCrops.join(', ')}
                        </div>
                        <div className="crop-badge unfavorable mt-2">
                            <AlertTriangle size={14} className="mr-1" />
                            <strong>{t('avoid')}</strong> {locationData.unfavorableCrops.join(', ')}
                        </div>
                    </div>
                )}
            </div>

            <div className="page-header">
                <h1>{t('homeWelcome')}</h1>
                <p className="subtitle">{t('homeSubtitle')}</p>
            </div>

            {/* Action Grid (Android Adaptive) */}
            <div className="action-grid mt-6">
                <div className="action-card" onClick={simulateScan}>
                    <div className="action-icon-wrapper scan">
                        <Camera size={32} />
                    </div>
                    <div className="action-card-text">
                        <h3>{t('cropScan')}</h3>
                        <p>{t('cropScanDesc')}</p>
                    </div>
                </div>
            </div>


            {/* Scanning Simulation */}
            {isScanning && (
                <div className="scanning-overlay fade-in-up mt-6 glass-card">
                    <div className="scanner-line"></div>
                    <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('analyzingCrop')}</p>
                </div>
            )}

            {/* Disease Diagnosis Report */}
            {showReport && !isScanning && (
                <div className="report-card glass-card slide-in-top mt-6" style={{ borderTop: '6px solid var(--error)' }}>
                    <div className="report-header">
                        <div className="report-title-row">
                            <ShieldCheck size={28} className="text-error mr-2" />
                            <h2>{diseaseReport.disease}</h2>
                            <button className="back-btn tts-btn ml-auto" onClick={handleTTS} aria-label="Listen to report">
                                <Volume2 size={20} />
                            </button>
                        </div>
                        <div className="severity-badges mt-4">
                            <span className="badge confidence">AI Confidence: {diseaseReport.confidence}</span>
                            <span className="badge severity error">Severity: {diseaseReport.severity}</span>
                        </div>
                    </div>

                    <div className="report-body mt-6">
                        <div className="report-section">
                            <h4><AlertTriangle size={18} className="inline-icon" /> Reason & Soil Impact</h4>
                            <p>{diseaseReport.reason}</p>
                        </div>

                        <div className="report-section">
                            <h4><ThermometerSun size={18} className="inline-icon" /> Recommended Pesticides</h4>
                            <ul className="custom-list">
                                {diseaseReport.pesticides.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                            <div className="contacts-box mt-4 glass-card" style={{ padding: '0.75rem' }}>
                                <strong style={{ fontSize: '0.9rem', color: 'white' }}>Cleaning & Curing Contacts:</strong>
                                {diseaseReport.contacts.map((c, i) => <div key={i} className="contact-item" style={{ color: 'var(--primary)', fontWeight: 700 }}>{c}</div>)}
                            </div>
                        </div>

                        <div className="report-section">
                            <h4><ShieldCheck size={18} className="inline-icon" /> Precautions</h4>
                            <ul className="custom-list">
                                {diseaseReport.precautions.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                    </div>

                    <button className="primary-btn mt-6" onClick={() => setShowReport(false)}>
                        {t('closeReport')}
                    </button>
                </div>
            )}

        </div>
    );
}
