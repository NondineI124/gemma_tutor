import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Message } from '../types';
import { 
  Bot, 
  User, 
  Volume2, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  Lightbulb,
  Share2,
  Image as ImageIcon
} from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  soundEnabled: boolean;
  onSpeak: (text: string) => void;
  onSelectPrompt?: (text: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  soundEnabled,
  onSpeak,
  onSelectPrompt
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareP2P = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Leçon Gemma tutor / Exétat',
          text: message.content,
        });
      } catch (err) {
        console.log("Partage P2P annulé:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(message.content);
        alert("Texte de la leçon copié ! Vous pouvez maintenant le coller et le partager par Bluetooth, SMS ou WhatsApp.");
      } catch (err) {
        console.error("Erreur de copie:", err);
      }
    }
  };

  return (
    <div className={`flex gap-2.5 sm:gap-3 my-3 sm:my-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div 
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 font-medium text-xs shadow-xs ${
          isUser 
            ? 'bg-slate-200 text-slate-700 font-semibold' 
            : 'bg-indigo-600 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5 text-white" />}
      </div>

      {/* Bubble Container */}
      <div className={`flex flex-col max-w-[88%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Author Label & Metadata */}
        <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">
            {isUser ? 'Vous' : 'Gemma Tuteur'}
          </span>
          {message.subject && message.subject !== 'Général' && (
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200 text-[10px] font-medium">
              {message.subject}
            </span>
          )}
          <span>• {message.timestamp}</span>
        </div>

        {/* User image attachment preview if present */}
        {message.image && (
          <div className="mb-2 max-w-sm rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
            <img 
              src={message.image} 
              alt="Document / Image analysée" 
              className="w-full h-auto max-h-64 object-contain"
            />
            <div className="p-1.5 bg-slate-800 text-slate-200 text-[10px] flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-indigo-400" />
              <span>Image transmise pour analyse multimodale</span>
            </div>
          </div>
        )}

        {/* Bubble content */}
        <div 
          className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs'
              : 'bg-white text-slate-900 rounded-tl-none border border-slate-200 shadow-xs'
          }`}
        >
          {!isUser && (
            <div className="absolute top-2.5 right-2 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
              <button
                onClick={() => onSpeak(message.content)}
                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                title="Écouter l'explication"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCopy}
                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                title="Copier le texte"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {/* Text Content with Markdown & KaTeX Math */}
          <div className={`markdown-content ${isUser ? 'text-white' : 'text-slate-800'} pr-1 space-y-2`}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                strong: ({ children }) => (
                  <strong className={`font-semibold ${isUser ? 'text-indigo-100' : 'text-indigo-700'}`}>
                    {children}
                  </strong>
                ),
                h1: ({ children }) => (
                  <h1 className={`text-base font-bold mt-2 mb-1 ${isUser ? 'text-white' : 'text-slate-900'}`}>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className={`text-sm font-bold mt-2 mb-1 ${isUser ? 'text-white' : 'text-slate-900'}`}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className={`text-xs font-bold mt-1.5 mb-1 ${isUser ? 'text-indigo-100' : 'text-indigo-600'}`}>
                    {children}
                  </h3>
                ),
                ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-1.5">{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                code: ({ children }) => (
                  <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                    isUser ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-indigo-700 border border-slate-200'
                  }`}>
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className={`border-l-2 pl-3 py-1 my-2 rounded-r italic text-xs ${
                    isUser 
                      ? 'border-indigo-300 bg-indigo-700/50 text-indigo-100' 
                      : 'border-indigo-500 bg-indigo-50/60 text-slate-700'
                  }`}>
                    {children}
                  </blockquote>
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Quick interactive follow-ups and P2P Share if generated by AI */}
          {!isUser && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {onSelectPrompt && (
                  <>
                    <button
                      onClick={() => onSelectPrompt("Peux-tu me donner un exemple concret ?")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-indigo-700 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-colors"
                    >
                      <Lightbulb className="w-3 h-3 text-indigo-600" />
                      Exemple concret
                    </button>
                    <button
                      onClick={() => onSelectPrompt("Propose-moi un petit exercice sur ce sujet.")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-colors"
                    >
                      <HelpCircle className="w-3 h-3 text-emerald-600" />
                      Un exercice
                    </button>
                    <button
                      onClick={() => onSelectPrompt("Explique encore plus simplement s'il te plaît.")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
                    >
                      <BookOpen className="w-3 h-3 text-slate-600" />
                      Explication plus simple
                    </button>
                  </>
                )}
              </div>

              {/* P2P Share Button */}
              <button
                onClick={handleShareP2P}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-[11px] transition-colors"
                title="Partager cette leçon via Bluetooth, SMS ou WhatsApp (API navigator.share)"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Partager hors-ligne</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
