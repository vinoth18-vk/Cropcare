import React, { useState, useEffect } from 'react';
import { Camera, Mic, Users, Calendar, AlertTriangle, Leaf, Globe, Phone, Building, User } from 'lucide-react';
import { DiseaseDetector } from './components/DiseaseDetector';
import { WeatherAlert } from './components/WeatherAlert';
import { VoiceAssistant } from './components/VoiceAssistant';
import { CommunityForum } from './components/CommunityForum';
import { PreventionCalendar } from './components/PreventionCalendar';
import { GovernmentSchemes } from './components/GovernmentSchemes';
import { UserProfile } from './components/UserProfile';
import { OfflineIndicator } from './components/OfflineIndicator';
import { translations } from './utils/translations';

function App() {
  const [activeTab, setActiveTab] = useState('detector');
  const [language, setLanguage] = useState('en');
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const t = translations[language];

  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  const tabs = [
    { id: 'detector', label: t.diseaseDetection, icon: Camera },
    { id: 'weather', label: t.weatherAlerts, icon: AlertTriangle },
    { id: 'community', label: t.community, icon: Users },
    { id: 'calendar', label: t.preventionCalendar, icon: Calendar },
    { id: 'schemes', label: t.govSchemes, icon: Building },
    { id: 'profile', label: t.profile, icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CropGuard AI</h1>
                <p className="text-sm text-green-600">{t.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="ta">🇮🇳 தமிழ்</option>
              </select>

              {/* Voice Mode Toggle */}
              <button
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isVoiceMode 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Mic className="h-4 w-4" />
                <span>{isVoiceMode ? t.voiceOn : t.voiceOff}</span>
              </button>

              {/* Emergency Contact */}
              <button className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                <Phone className="h-4 w-4" />
                <span>{t.emergency}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-500 text-white border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Voice Assistant Overlay */}
      {isVoiceMode && (
        <VoiceAssistant 
          language={language} 
          onClose={() => setIsVoiceMode(false)}
          onNavigate={setActiveTab}
        />
      )}

      {/* Offline Indicator */}
      <OfflineIndicator language={language} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'detector' && <DiseaseDetector language={language} />}
        {activeTab === 'weather' && <WeatherAlert language={language} />}
        {activeTab === 'community' && <CommunityForum language={language} />}
        {activeTab === 'calendar' && <PreventionCalendar language={language} />}
        {activeTab === 'schemes' && <GovernmentSchemes language={language} />}
        {activeTab === 'profile' && <UserProfile language={language} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t.aboutCropGuard}</h3>
              <p className="text-gray-300">{t.aboutDescription}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t.quickLinks}</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-green-400">{t.govSchemes}</a></li>
                <li><a href="#" className="hover:text-green-400">{t.expertHelp}</a></li>
                <li><a href="#" className="hover:text-green-400">{t.tutorials}</a></li>
                <li><a href="#" className="hover:text-green-400">{t.faq}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t.contact}</h3>
              <div className="text-gray-300 space-y-2">
                <p>{t.helpline}: 1800-XXX-XXXX</p>
                <p>{t.email}: support@cropguard.ai</p>
                <p>{t.hours}: 24/7 {t.available}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
            <p>&copy; 2024 CropGuard AI. {t.allRightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;