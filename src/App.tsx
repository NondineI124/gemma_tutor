import React, { useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import { Message, Subject, OfflineNote } from './types';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { QuickPrompts } from './components/QuickPrompts';
import { ChatInput } from './components/ChatInput';
import { OfflineKitModal } from './components/OfflineKitModal';
import { 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  BookOpen, 
  Loader2, 
  WifiOff, 
  RefreshCw 
} from 'lucide-react';

const INITIAL_WELCOME_MESSAGE: Message = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `Bonjour et bienvenue ! 👋

Je suis **Gemma tutor**, votre tuteur pédagogique solidaire. Mon objectif est de vous accompagner avec patience, clarté et bienveillance dans vos études, quelles que soient les difficultés autour de vous.

**Comment puis-je vous aider aujourd'hui ?**
1. 📖 **Expliquer un concept pas à pas** (Maths, Sciences, Français, Histoire...)
2. 📝 **Proposer des exercices pratiques** adaptés à votre rythme
3. 📌 **Rédiger une fiche de révision synthétique**
4. 💡 **Vous donner des conseils d'étude sans internet**

N'hésitez pas à choisir une discipline ci-dessus ou à me poser directement votre première question !`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  subject: 'Général'
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('tuteur_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : [INITIAL_WELCOME_MESSAGE];
      }
    } catch (e) {
      console.error("Erreur chargement historique:", e);
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [currentSubject, setCurrentSubject] = useState<Subject>('Général');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOfflineKitOpen, setIsOfflineKitOpen] = useState(false);
  const [batterySaveMode, setBatterySaveMode] = useState(false);

  // Toggle battery-saver class on document.body
  useEffect(() => {
    if (batterySaveMode) {
      document.body.classList.add('battery-saver');
    } else {
      document.body.classList.remove('battery-saver');
    }
  }, [batterySaveMode]);

  const [offlineNotes, setOfflineNotes] = useState<OfflineNote[]>(() => {
    try {
      const saved = localStorage.getItem('tuteur_offline_notes');
      return saved ? JSON.parse(saved) : [
        {
          id: 'note-1',
          title: 'Méthode d\'apprentissage autonome',
          content: '1. Lire le cours 15 min.\n2. Rédiger 3 questions de mémoire.\n3. Répondre sans regarder le texte.',
          subject: 'Général',
          date: new Date().toLocaleDateString()
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Monitor network online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save messages to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('tuteur_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error("Erreur sauvegarde historique:", e);
    }
  }, [messages]);

  // Save notes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('tuteur_offline_notes', JSON.stringify(offlineNotes));
    } catch (e) {
      console.error("Erreur sauvegarde notes:", e);
    }
  }, [offlineNotes]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech synthesis
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop current speech
    const cleanText = text.replace(/[*_#`~]/g, ''); // Remove markdown symbols
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95; // Slightly slower for clear teaching
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (
    text: string, 
    mode: 'normal' | 'pas-a-pas' | 'exercice' | 'revision' = 'normal',
    image?: string
  ) => {
    if ((!text.trim() && !image) || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      image,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: currentSubject,
      mode
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Call server backend API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content, image: m.image })),
          subject: currentSubject,
          mode
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur réseau HTTP: ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || "Désolé, je n'ai pas réussi à obtenir la réponse. Veuillez réorganiser votre question.";

      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: currentSubject,
        mode
      };

      setMessages(prev => [...prev, aiMessage]);

      if (soundEnabled) {
        handleSpeak(replyText.slice(0, 300)); // Read first 300 chars aloud if sound enabled
      }
    } catch (error: any) {
      console.error("Erreur appel Tuteur:", error);

      // Offline or network error fallback
      const offlineFallbackText = `⚠️ **Connexion interrompue ou instable**

Je n'ai pas pu contacter le serveur en direct. Cependant, vos messages sont enregistrés localement.

**Conseil pour continuer vos études hors-ligne :**
- Ouvrez le **Kit Révision** en haut à droite pour consulter vos fiches enregistrées.
- Révisez les concepts à voix haute ou rédigez une fiche résumé.
- Dès que le réseau sera rétabli, vous pourrez poser de nouvelles questions !`;

      const aiMessage: Message = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: offlineFallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: currentSubject
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Voulez-vous vraiment effacer l'historique de discussion ?")) {
      setMessages([INITIAL_WELCOME_MESSAGE]);
      window.speechSynthesis?.cancel();
    }
  };

  const handleSaveNote = (title: string, content: string, subject: Subject) => {
    const newNote: OfflineNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      subject,
      date: new Date().toLocaleDateString()
    };
    setOfflineNotes(prev => [newNote, ...prev]);
  };

  return (
    <div className={`flex flex-col min-h-screen font-sans selection:bg-indigo-500/20 ${
      batterySaveMode ? 'bg-black text-gray-300 battery-saver' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Header Bar */}
      <Header
        currentSubject={currentSubject}
        onSubjectChange={setCurrentSubject}
        isOnline={isOnline}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onOpenOfflineKit={() => setIsOfflineKitOpen(true)}
        onClearChat={handleClearChat}
        messagesCount={messages.length}
        batterySaveMode={batterySaveMode}
        onToggleBatterySave={() => setBatterySaveMode(prev => !prev)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-3 flex flex-col justify-between">
        
        {/* Offline Banner if disconnected */}
        {!isOnline && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Vous êtes hors-ligne. L'historique et le Kit de révision restent accessibles !</span>
            </div>
            <button
              onClick={() => setIsOfflineKitOpen(true)}
              className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium text-[11px] whitespace-nowrap transition-colors"
            >
              Voir Kit Hors-Ligne
            </button>
          </div>
        )}

        {/* Quick Prompts Carousel */}
        <QuickPrompts
          subject={currentSubject}
          onSelectPrompt={(text, mode) => handleSendMessage(text, mode)}
        />

        {/* Chat Messages List */}
        <div className="flex-1 my-2 space-y-1">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              soundEnabled={soundEnabled}
              onSpeak={handleSpeak}
              onSelectPrompt={(text) => handleSendMessage(text, 'pas-a-pas')}
            />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 my-4 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <span>Le tuteur prépare votre explication bienveillante...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Fixed Input Bar */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onClearChat={handleClearChat}
      />

      {/* Offline Kit Modal */}
      <OfflineKitModal
        isOpen={isOfflineKitOpen}
        onClose={() => setIsOfflineKitOpen(false)}
        notes={offlineNotes}
        onSaveNote={handleSaveNote}
      />

    </div>
  );
}
