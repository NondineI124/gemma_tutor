import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  BrainCircuit, 
  RotateCcw,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  Camera
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string, mode?: 'normal' | 'pas-a-pas' | 'exercice' | 'revision', image?: string) => void;
  isLoading: boolean;
  onClearChat: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onClearChat
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState<'normal' | 'pas-a-pas' | 'exercice' | 'revision'>('normal');
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("L'image choisie est trop volumineuse. Veuillez choisir une image de moins de 8 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setSelectedImage(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const messageContent = inputText.trim() || (selectedImage ? "Analyse de cette image / ce document pédagogique." : "");
    onSendMessage(messageContent, selectedMode, selectedImage || undefined);
    
    setInputText('');
    setSelectedImage(null);
    setSelectedMode('normal');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("La reconnaissance vocale n'est pas prise en charge sur ce navigateur.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.error("Erreur dictée vocale:", err);
      setIsListening(false);
    }
  };

  return (
    <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 sm:p-3 shadow-sm">
      <div className="max-w-4xl mx-auto space-y-2">
        
        {/* Hidden File Input for Image Analysis */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleImageFileChange} 
          className="hidden" 
        />

        {/* Selected Image Thumbnail Preview */}
        {selectedImage && (
          <div className="flex items-center gap-2 p-2 bg-indigo-50/80 border border-indigo-200 rounded-xl max-w-md">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-indigo-300">
              <img src={selectedImage} alt="Aperçu document" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-indigo-900 truncate">Image / Document à analyser</p>
              <p className="text-[10px] text-indigo-600">Formules, énoncé, graphique ou schéma</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="p-1 rounded-full bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
              title="Supprimer l'image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Mode Selector Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-medium text-slate-500 shrink-0">Style de réponse :</span>
          
          <button
            type="button"
            onClick={() => setSelectedMode('normal')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1 ${
              selectedMode === 'normal'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Standard
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode('pas-a-pas')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1 ${
              selectedMode === 'pas-a-pas'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BrainCircuit className="w-3 h-3 text-indigo-300" />
            Explication Pas à Pas
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode('exercice')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1 ${
              selectedMode === 'exercice'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3 h-3 text-indigo-300" />
            Exercice Pratique
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode('revision')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1 ${
              selectedMode === 'revision'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3 h-3 text-indigo-300" />
            Fiche de Révision
          </button>

          <div className="ml-auto shrink-0">
            <button
              type="button"
              onClick={onClearChat}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors text-xs flex items-center gap-1 border border-slate-200"
              title="Effacer la conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
          </div>
        </div>

        {/* Text Input & Action Buttons */}
        <form onSubmit={handleSubmit} className="flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all shadow-xs">
          
          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2.5 rounded-xl border transition-all shrink-0 flex items-center gap-1 ${
              selectedImage 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
            title="Joindre une photo d'exercice, de cours ou de schéma (Analyse multimodale)"
          >
            <ImageIcon className="w-4 h-4 text-indigo-600" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedImage
                ? "Décrivez votre question sur cette photo..."
                : selectedMode === 'exercice' 
                ? "Sur quel sujet souhaitez-vous un exercice ?" 
                : selectedMode === 'pas-a-pas'
                ? "Posez votre question pour une explication étape par étape..."
                : "Posez une question ou téléchargez une photo d'exercice..."
            }
            className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 text-sm px-2 py-1.5 focus:outline-none resize-none max-h-32 font-normal"
          />

          {/* Dictation button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all shrink-0 ${
              isListening
                ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
            }`}
            title={isListening ? "Écoute en cours..." : "Dictée vocale"}
          >
            {isListening ? <MicOff className="w-4 h-4 text-rose-600" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all shrink-0 font-medium ${
              (inputText.trim() || selectedImage) && !isLoading
                ? 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400">
          Modèle multimodal <span className="font-semibold text-slate-600">Gemma Tuteur (Vision & Math LaTeX)</span> • Mode basse consommation
        </p>

      </div>
    </div>
  );
};
