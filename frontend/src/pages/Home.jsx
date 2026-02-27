import React, { useState, useEffect } from 'react';
import { Camera, MapPin, AlertTriangle, ShieldCheck, ThermometerSun, Leaf, Volume2, Loader2, Cloud, Droplets, Wind, Thermometer } from 'lucide-react';
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

    const [locationData, setLocationData] = useState({
        regionName: t('detectingLocation'),
        favorableCrops: ["-"],
        unfavorableCrops: ["-"],
        isLoading: true,
        error: null
    });

    const [climateData, setClimateData] = useState({
        temperature: null,
        humidity: null,
        windSpeed: null,
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

                    try {
                        // Fetching real climatic conditions from Open-Meteo
                        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);
                        const weatherJson = await weatherRes.json();
                        if (isMounted && weatherJson.current) {
                            setClimateData({
                                temperature: weatherJson.current.temperature_2m,
                                humidity: weatherJson.current.relative_humidity_2m,
                                windSpeed: weatherJson.current.wind_speed_10m,
                                isLoading: false,
                                error: null
                            });
                        }
                    } catch (weatherErr) {
                        console.error("Weather fetch failed:", weatherErr);
                        if (isMounted) {
                            setClimateData(prev => ({ ...prev, isLoading: false, error: "Failed to fetch climate data." }));
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
                        setClimateData(prev => ({ ...prev, isLoading: false, error: errorMsg }));
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
            {/* Full Width Climate & Location Container */}
            <div className="climate-container glass-card mb-6 mt-4" style={{ width: '100%', padding: '1.5rem', borderRadius: '24px' }}>
                <div className="location-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {locationData.isLoading ? (
                            <Loader2 size={24} className="text-primary animate-spin" />
                        ) : (
                            <MapPin size={24} className="text-primary" />
                        )}
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                            {locationData.regionName}
                        </h2>
                    </div>
                </div>

                <div className="climate-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                    background: 'rgba(0,0,0,0.15)',
                    padding: '1rem',
                    borderRadius: '16px'
                }}>
                    <div className="climate-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <Thermometer size={20} style={{ color: '#fb923c' }} />
                        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                            {climateData.isLoading ? '-' : (climateData.error ? 'N/A' : `${climateData.temperature}°C`)}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Temp</span>
                    </div>
                    <div className="climate-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>
                        <Droplets size={20} style={{ color: '#38bdf8' }} />
                        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                            {climateData.isLoading ? '-' : (climateData.error ? 'N/A' : `${climateData.humidity}%`)}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Humidity</span>
                    </div>
                    <div className="climate-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <Wind size={20} style={{ color: '#a78bfa' }} />
                        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                            {climateData.isLoading ? '-' : (climateData.error ? 'N/A' : `${climateData.windSpeed} km/h`)}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Wind</span>
                    </div>
                </div>

                {locationData.error ? (
                    <p className="subtitle text-error" style={{ fontSize: "0.9rem", margin: 0 }}>{locationData.error}</p>
                ) : (
                    <div className="crops-info">
                        <div className="crop-badge favorable" style={{ marginBottom: '0.5rem' }}>
                            <Leaf size={16} className="mr-1" />
                            <strong>{t('favorable')}</strong> {locationData.favorableCrops.join(', ')}
                        </div>
                        <div className="crop-badge unfavorable">
                            <AlertTriangle size={16} className="mr-1" />
                            <strong>{t('avoid')}</strong> {locationData.unfavorableCrops.join(', ')}
                        </div>
                    </div>
                )}
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
                            <h4><AlertTriangle size={20} className="inline-icon" /> Reason & Soil Impact</h4>
                            <p>{diseaseReport.reason}</p>
                        </div>

                        <div className="report-section">
                            <h4><ThermometerSun size={20} className="inline-icon" /> Recommended Pesticides</h4>
                            <ul className="custom-list">
                                {diseaseReport.pesticides.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                            <div className="contacts-box mt-4 glass-card">
                                <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Cleaning & Curing Contacts:</strong>
                                {diseaseReport.contacts.map((c, i) => <div key={i} className="contact-item" style={{ color: 'var(--primary)', fontWeight: 700 }}>{c}</div>)}
                            </div>
                        </div>

                        <div className="report-section">
                            <h4><ShieldCheck size={20} className="inline-icon" /> Precautions</h4>
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
