// src/services/aiService.js

// 1. Definisikan API_KEY dari environment variable Vite
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// 2. Groq API Endpoint (Kompatibel dengan OpenAI SDK)
const URL = "https://api.groq.com/openai/v1/chat/completions";

export const getAiAdvice = async (weatherData, locationName) => {
    // 3. Validasi apakah API_KEY terbaca
    if (!API_KEY || API_KEY.startsWith('gsk_...')) {
        console.warn("VITE_GROQ_API_KEY belum diset. Menggunakan fallback lokal.");
        return getLocalFallback(weatherData);
    }

    const prompt = `
        User adalah Noor, atlet yang suka bersepeda, lari, calisthenics . 
        Lokasi: ${locationName}. 
        Cuaca: ${Math.round(weatherData.current.temperature_2m)}°C, angin ${weatherData.current.wind_speed_10m}km/h.
        Berikan saran latihan singkat (maks 15 kata) dengan nada memotivasi. Bahasa Indonesia gaul.
    `;

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Model Llama 3.3 Terbaru (Cepat & Cerdas)
                messages: [
                    { role: "system", content: "Kamu adalah pelatih sepeda profesional yang singkat dan padat." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 50
            })
        });

        const result = await response.json();

        // Debug untuk melihat hasil asli di Console Firefox
        // console.log("Groq Response:", result); // Commented out as per instruction, but good for debugging

        // Handle specific API errors with Fallback
        if (result.error) {
            console.warn("Groq API Error (Using Fallback):", result.error);
            return getLocalFallback(weatherData);
        }

        if (result.choices && result.choices[0]?.message?.content) {
            return result.choices[0].message.content.trim();
        }

        return getLocalFallback(weatherData);
    } catch (error) {
        console.error("AI Fetch Error (Using Fallback):", error);
        return getLocalFallback(weatherData);
    }
};

// --- Local Fallback Logic (Gratis & Unlimited) ---
const getLocalFallback = (data) => {
    const temp = data.current.temperature_2m;
    const wind = data.current.wind_speed_10m;
    const isRaining = data.current.weather_code >= 51; // Code WMO untuk hujan

    if (isRaining) return "Hujan turun! Saatnya sesi indoor trainer atau rest day strategis.";
    if (wind > 20) return "Angin kencang lagi! Fokus latihan cadence dan interval pendek.";
    if (temp > 32) return "Panas menyengat! Bawa bidon ekstra dan jaga hidrasi.";
    if (temp < 20) return "Udara sejuk! Sempurna untuk long endurance ride hari ini.";

    return "Cuaca mendukung! Konsistensi adalah kunci, gowes terus Noor!";
};