import React from 'react';
import { Subject } from '../types';
import { 
  GraduationCap, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Download, 
  Heart,
  Sparkles,
  ShieldCheck,
  BatteryCharging,
  Zap,
  Moon
} from 'lucide-react';

interface HeaderProps {
  currentSubject: Subject;
  onSubjectChange: (subject: Subject) => void;
  isOnline: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenOfflineKit: () => void;
  onClearChat: () => void;
  messagesCount: number;
  batterySaveMode: boolean;
  onToggleBatterySave: () => void;
}

const subjectsList: Subject[] = [
  'Général',
  'Mathématiques',
  'Physique-Chimie',
  'SVT & Biologie',
  'Français & Littérature',
  'Histoire-Géo',
  'Langues Vivantes',
  'Philosophie & Éthique',
  'Méthodologie & Organisation'
];

export const Header: React.FC<HeaderProps> = ({
  currentSubject,
  onSubjectChange,
  isOnline,
  soundEnabled,
  onToggleSound,
  onOpenOfflineKit,
  onClearChat,
  messagesCount,
  batterySaveMode,
  onToggleBatterySave
}) => {
  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
      batterySaveMode 
        ? 'bg-black/95 border-gray-800 text-gray-300' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        {/* Top bar with branding and actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
              batterySaveMode ? 'bg-gray-900 text-emerald-400 border border-gray-800' : 'bg-indigo-600 text-white shadow-xs'
            }`}>
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className={`font-bold text-base sm:text-lg tracking-tight flex items-center gap-1.5 ${
                  batterySaveMode ? 'text-gray-100' : 'text-slate-900'
                }`}>
                  Gemma tutor
                  <span className={`hidden xs:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    batterySaveMode 
                      ? 'bg-gray-900 text-emerald-400 border-gray-800' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    <Heart className="w-2.5 h-2.5 mr-1 fill-emerald-500/30 text-emerald-600" />
                    Soutien Pédagogique
                  </span>
                </h1>
              </div>
              <p className={`text-[11px] sm:text-xs font-medium line-clamp-1 ${
                batterySaveMode ? 'text-gray-400' : 'text-slate-500'
              }`}>
                Tuteur éducatif bienveillant & patient pour étudiants en zone de crise
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Battery Save Mode Toggle */}
            <button
              onClick={onToggleBatterySave}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                batterySaveMode 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={batterySaveMode ? "Mode Survie Actif (Noir pur, 0 animation, batterie préservée)" : "Activer Mode Survie / Économie d'énergie"}
            >
              <BatteryCharging className={`w-4 h-4 ${batterySaveMode ? 'text-emerald-400' : 'text-amber-600'}`} />
              <span className="hidden sm:inline">
                {batterySaveMode ? "Mode Survie ON" : "Survie / Énergie"}
              </span>
            </button>

            {/* Status indicator */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                batterySaveMode
                  ? 'bg-gray-900 text-gray-300 border border-gray-800'
                  : isOnline 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
              title={isOnline ? "Connexion active" : "Mode hors-ligne / Réseau limité"}
            >
              {isOnline ? (
                <>
                  <span className={`w-2 h-2 rounded-full ${batterySaveMode ? 'bg-emerald-400' : 'bg-emerald-500 animate-pulse'}`} />
                  <span className="hidden md:inline">En ligne • IA</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-600" />
                  <span className="hidden md:inline">Hors-ligne</span>
                </>
              )}
            </div>

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                batterySaveMode
                  ? 'bg-gray-900 text-gray-300 border-gray-800'
                  : soundEnabled 
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' 
                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
              title={soundEnabled ? "Synthèse vocale activée" : "Synthèse vocale désactivée"}
            >
              {soundEnabled ? <Volume2 className={`w-4 h-4 ${batterySaveMode ? 'text-gray-300' : 'text-indigo-600'}`} /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Kit Hors-Ligne Button */}
            <button
              onClick={onOpenOfflineKit}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                batterySaveMode
                  ? 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${batterySaveMode ? 'text-gray-300' : 'text-indigo-600'}`} />
              <span className="hidden sm:inline">Ressources Offline</span>
            </button>
          </div>
        </div>

        {/* Subject pills scrollable */}
        <div className={`mt-2.5 pt-2 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5 ${
          batterySaveMode ? 'border-gray-900' : 'border-slate-100'
        }`}>
          <span className={`text-[11px] font-medium shrink-0 mr-1 flex items-center gap-1 ${
            batterySaveMode ? 'text-gray-400' : 'text-slate-500'
          }`}>
            <Sparkles className={`w-3 h-3 ${batterySaveMode ? 'text-gray-400' : 'text-indigo-600'}`} />
            Discipline :
          </span>
          {subjectsList.map((subject) => (
            <button
              key={subject}
              onClick={() => onSubjectChange(subject)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                currentSubject === subject
                  ? batterySaveMode
                    ? 'bg-gray-200 text-black font-semibold'
                    : 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : batterySaveMode
                    ? 'bg-black text-gray-400 border border-gray-800 hover:bg-gray-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
