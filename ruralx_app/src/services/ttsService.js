import axios from 'axios';

/**
 * TTS Service
 * Uses Hugging Face API for Indian languages (Hindi/Telugu)
 * and Web Speech API as fallback/English.
 */

const HF_TOKEN = import.meta.env.VITE_HF_API_KEY;
// Using ai4bharat/indic-parler-tts for its ease of use via API
const HF_TTS_URL = "https://api-inference.huggingface.co/models/ai4bharat/indic-parler-tts";

class TtsService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.audio = new Audio();
        this.isUnlocked = false;
    }

    /**
     * Unlocks audio on first user interaction to bypass browser autoplay blocks
     */
    unlockAudio() {
        if (this.isUnlocked) return;

        // Play and immediately pause a silent sound
        const silent = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
        this.audio.src = silent;
        this.audio.play().then(() => {
            this.audio.pause();
            this.isUnlocked = true;
            console.log("Audio Unlocked");
        }).catch(e => console.error("Audio Unlock Failed:", e));
    }

    /**
     * Speak text in specified language
     * @param {string} text 
     * @param {string} lang ('en', 'hi', 'te', 'mr', 'bn', 'gu', 'kn', 'ml', 'pa', 'ta')
     */
    async speak(text, lang) {
        if (!text) return;

        // Ensure audio is unlocked on first speak attempt if not already
        this.unlockAudio();

        console.log(`Speaking [${lang}]: ${text}`);

        const indicLangs = ['hi', 'te', 'mr', 'bn', 'gu', 'kn', 'ml', 'pa', 'ta'];

        if (lang === 'en') {
            this.speakWebSpeech(text, 'en-US', true);
        } else if (indicLangs.includes(lang)) {
            try {
                await this.speakHF(text, lang);
            } catch (err) {
                console.warn("HF TTS failed, falling back to Web Speech:", err.message);
                const codes = {
                    hi: 'hi-IN', te: 'te-IN', mr: 'mr-IN', bn: 'bn-IN',
                    gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', ta: 'ta-IN'
                };
                this.speakWebSpeech(text, codes[lang] || 'hi-IN', false);
            }
        }
    }

    async speakHF(text, lang) {
        if (!HF_TOKEN) throw new Error("Missing HF Token");

        const langNames = {
            hi: 'Hindi', te: 'Telugu', mr: 'Marathi', bn: 'Bengali',
            gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi', ta: 'Tamil'
        };

        const description = `A clear and helpful female voice speaking ${langNames[lang]}.`;

        const response = await axios.post(
            HF_TTS_URL,
            { inputs: text, parameters: { description } },
            {
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                responseType: 'blob'
            }
        );

        const url = URL.createObjectURL(response.data);
        this.audio.src = url;
        await this.audio.play();
    }

    speakWebSpeech(text, langCode, isEnglish) {
        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;

        const voices = this.synth.getVoices();
        if (isEnglish) {
            const femaleVoice = voices.find(v =>
                ['female', 'google us english', 'zira', 'samantha', 'victoria'].some(k => v.name.toLowerCase().includes(k))
            );
            if (femaleVoice) utterance.voice = femaleVoice;
        } else {
            const langVoice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
            if (langVoice) utterance.voice = langVoice;
        }

        utterance.rate = 1.0;
        this.synth.speak(utterance);
    }


    stop() {
        this.synth.cancel();
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}

export const ttsService = new TtsService();
