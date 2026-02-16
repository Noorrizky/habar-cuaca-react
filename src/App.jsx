import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Navigation, Calendar } from 'lucide-react';
import { searchLocation } from './services/weatherApi';
import { useWeather } from './hooks/useWeather';
import { useDebounce } from './hooks/useDebounce';
import { getWeatherDescription } from './utils/weatherIcons';

export default function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  // Default ke Tabalong, South Kalimantan
  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem('last_location');
    return saved ? JSON.parse(saved) : { lat: -2.1866, lon: 115.3942, name: "Tabalong, Indonesia" };
  });

  const debouncedQuery = useDebounce(query, 500);
  const { data, loading } = useWeather(coords);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const getSuggestions = async () => {
      if (isSelecting || debouncedQuery.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const results = await searchLocation(debouncedQuery);
        setSuggestions(results);
      } catch (err) {
        console.error("Search error:", err);
      }
    };
    getSuggestions();
  }, [debouncedQuery, isSelecting]);

  useEffect(() => {
    localStorage.setItem('last_location', JSON.stringify(coords));
  }, [coords]);

  const handleSelectLocation = (item) => {
    setIsSelecting(true);
    setQuery(item.display_name.split(',')[0]);
    setCoords({ lat: item.lat, lon: item.lon, name: item.display_name });
    setSuggestions([]);
  };

  const getGPSLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setIsSelecting(true);
      setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, name: "Current Location" });
      setQuery("Current Location");
    });
  };

  const weather = data ? getWeatherDescription(data.current.weather_code) : null;
  const WeatherIcon = weather?.icon;

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#0B0F14] z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="relative">
          {/* Logo Animasi */}
          <div className="w-20 h-20 border-4 border-[#3DF2E0] rounded-2xl rotate-45 animate-pulse shadow-[0_0_30px_rgba(61,242,224,0.3)]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#3DF2E0] rounded-full animate-ping"></div>
          </div>
        </div>
        <h1 className="mt-10 text-[#3DF2E0] font-black tracking-[0.5em] text-xl uppercase">
          habar-cuaca
        </h1>
        <p className="mt-2 text-slate-500 text-[10px] font-bold tracking-widest uppercase italic">
          Precision Weather Forecast
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#0B0F14] pb-10">
      {/* Search Header */}
      <div className="max-w-md mx-auto p-6">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-[#0B0F14] uppercase">habar-cuaca</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">info cuaca hari ini</p>
          </div>
          <div className="text-right">
            {/* <p className="text-[10px] font-black text-[#3DF2E0] bg-[#0B0F14] px-2 py-1 rounded">PRO VERSION</p> */}
          </div>
        </header>

        <div className="relative">
          <div className="flex items-center bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-[#3DF2E0] focus-within:bg-white px-4 py-3 transition-all shadow-sm">
            <Search className="text-slate-400 mr-3" size={18} />
            <input
              className="flex-1 outline-none bg-transparent text-sm font-medium"
              placeholder="Search location..."
              value={query}
              onChange={(e) => { setIsSelecting(false); setQuery(e.target.value); }}
            />
            <button onClick={getGPSLocation} className="ml-2 p-2 hover:text-[#3DF2E0] transition-colors">
              <Navigation size={18} />
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-2xl mt-2 z-50 border border-slate-100 overflow-hidden">
              {suggestions.map((item) => (
                <button
                  key={item.place_id}
                  onClick={() => handleSelectLocation(item)}
                  className="w-full text-left px-5 py-4 hover:bg-[#3DF2E0]/10 border-b border-slate-50 last:border-0 text-sm flex items-center transition-colors"
                >
                  <MapPin size={14} className="mr-3 text-[#0B0F14]" />
                  <span className="truncate font-medium">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Display */}
      <main className="max-w-md mx-auto px-6">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center bg-[#0B0F14] rounded-[2.5rem]">
            <div className="w-8 h-8 border-2 border-[#3DF2E0] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#3DF2E0] text-[10px] font-bold tracking-[0.3em] uppercase">Syncing Weather</p>
          </div>
        ) : data && weather && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-[#0B0F14] rounded-[2.5rem] p-8 text-white shadow-[0_20px_50px_rgba(11,15,20,0.2)] relative overflow-hidden mb-6">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3DF2E0]/10 rounded-full blur-[80px]"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="flex items-center space-x-2 bg-[#3DF2E0]/20 text-[#3DF2E0] px-4 py-1.5 rounded-full mb-8 border border-[#3DF2E0]/30">
                  <MapPin size={12} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{coords.name.split(',')[0]}</span>
                </div>

                <div className="mb-6 relative">
                  <WeatherIcon size={120} className={`${weather.color} drop-shadow-[0_0_20px_rgba(61,242,224,0.3)] animate-float`} />
                </div>

                <h1 className="text-8xl font-black tracking-tighter leading-none mb-2">
                  {Math.round(data.current.temperature_2m)}°
                </h1>
                <p className="text-[#3DF2E0] text-sm font-bold tracking-[0.4em] uppercase opacity-90">{weather.label}</p>

                <div className="w-full grid grid-cols-2 gap-4 mt-12">
                  <WeatherDetail label="Humidity" value={`${data.current.relative_humidity_2m}%`} icon={<Droplets size={16} />} />
                  <WeatherDetail label="Wind Speed" value={`${data.current.wind_speed_10m} km/h`} icon={<Wind size={16} />} />
                </div>
              </div>
            </div>

            {/* Cycling Status - Berdasarkan hobi road bike Anda */}
            <div className="bg-slate-50 rounded-[2rem] p-6 mb-6 flex items-center justify-between border-2 border-transparent hover:border-[#3DF2E0]/30 transition-all">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${data.current.wind_speed_10m < 20 ? 'bg-[#3DF2E0]/10 text-[#0B0F14]' : 'bg-red-50 text-red-600'}`}>
                  <Navigation size={20} className={data.current.wind_speed_10m >= 20 ? 'animate-pulse' : ''} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ride Conditions</p>
                  <h4 className="font-bold text-sm">
                    {data.current.wind_speed_10m > 20 ? "High Winds - Use Caution" : "Perfect for a Ride"}
                  </h4>
                </div>
              </div>
              <div className={`h-2 w-2 rounded-full ${data.current.wind_speed_10m > 20 ? 'bg-red-500' : 'bg-[#3DF2E0]'}`}></div>
            </div>

            {/* Daily Forecast */}
            <div className="px-2">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar size={14} className="text-[#3DF2E0]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">3-Day Forecast</h3>
              </div>
              <div className="space-y-3">
                {data.daily.time.slice(0, 3).map((date, i) => (
                  <div key={date} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-[#0B0F14]">
                      {i === 0 ? 'Tomorrow' : new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>
                    <div className="flex items-center space-x-4 font-black">
                      <span className="text-sm">{Math.round(data.daily.temperature_2m_max[i])}°</span>
                      <span className="text-sm text-slate-300">{Math.round(data.daily.temperature_2m_min[i])}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function WeatherDetail({ label, value, icon }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl flex flex-col items-center justify-center space-y-2 group hover:bg-[#3DF2E0]/5 transition-colors">
      <div className="text-[#3DF2E0] opacity-80 group-hover:opacity-100 transition-opacity">{icon}</div>
      <div className="text-center">
        <p className="text-[8px] uppercase tracking-[0.2em] text-[#3DF2E0] font-black mb-0.5">{label}</p>
        <p className="text-xs font-bold text-white">{value}</p>
      </div>
    </div>
  );
}