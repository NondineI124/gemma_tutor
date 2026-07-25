import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Download, 
  HeartHandshake, 
  CheckCircle2, 
  Sparkles, 
  BrainCircuit, 
  ShieldAlert, 
  FileText,
  Save,
  Smile
} from 'lucide-react';
import { OfflineNote } from '../types';

interface OfflineKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: OfflineNote[];
  onSaveNote: (title: string, content: string, subject: any) => void;
}

export const OfflineKitModal: React.FC<OfflineKitModalProps> = ({
  isOpen,
  onClose,
  notes,
  onSaveNote
}) => {
  const [activeTab, setActiveTab] = useState<'guides' | 'notes' | 'quizzes' | 'wellbeing'>('guides');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  if (!isOpen) return null;

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onSaveNote(newTitle, newContent, 'Général');
    setNewTitle('');
    setNewContent('');
  };

  const exportNotesAsText = () => {
    const textData = notes.map(n => `=== ${n.title} (${n.date}) ===\nMatière : ${n.subject}\n\n${n.content}\n\n`).join('\n');
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes_revision_edulibre.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden text-slate-900">
        
        {/* Modal Header */}
        <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Kit Révision & Étude Hors-Ligne</h2>
              <p className="text-xs text-slate-500">Ressources, fiches et conseils utilisables sans réseau internet</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 text-xs font-medium px-4 pt-1 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('guides')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guides' 
                ? 'border-indigo-600 text-indigo-600 font-semibold' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Conseils d'Étude Confinement
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'notes' 
                ? 'border-indigo-600 text-indigo-600 font-semibold' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Mes Fiches Sauvegardées ({notes.length})
          </button>

          <button
            onClick={() => setActiveTab('wellbeing')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wellbeing' 
                ? 'border-indigo-600 text-indigo-600 font-semibold' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            Gestion du Stress & Concentration
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-sm leading-relaxed">
          {activeTab === 'guides' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                <h3 className="font-semibold text-indigo-900 flex items-center gap-1.5 mb-1 text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Stratégies pour continuer d'apprendre en situation difficile
                </h3>
                <p className="text-xs text-indigo-800">
                  Même sans connexion constante ni électricité continue, vous pouvez maintenir vos acquis scolaires grâce à ces règles éprouvées :
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-indigo-900 text-xs mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    1. La méthode des sessions de 20 minutes
                  </h4>
                  <p className="text-xs text-slate-600">
                    Étudiez par tranches courtes mais très concentrées. Relisez un concept, notez 3 idées clés, puis posez-vous des questions sans regarder le cours.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-indigo-900 text-xs mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    2. Création de fiches mémoire (Flashcards)
                  </h4>
                  <p className="text-xs text-slate-600">
                    Inscrivez une question sur un bout de papier et la réponse au dos. Répétez-les régulièrement pour faire travailler votre mémoire à long terme.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-indigo-900 text-xs mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    3. La technique de l'enseignement
                  </h4>
                  <p className="text-xs text-slate-600">
                    Expliquez une leçon à un proche ou à haute voix comme si vous étiez le professeur. Si vous savez l'expliquer simplement, c'est que vous l'avez comprise.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-indigo-900 text-xs mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    4. Sauvegarde régulière de vos notes
                  </h4>
                  <p className="text-xs text-slate-600">
                    Dès que le tuteur génère une réponse claire, utilisez le bouton "Copier" ou enregistrez la fiche ci-contre pour la relire plus tard sans internet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleCreateNote} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-semibold text-slate-800">Enregistrer une nouvelle fiche personnelle</h4>
                <input
                  type="text"
                  placeholder="Titre de la fiche (ex: Formules de Trigonométrie)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                <textarea
                  placeholder="Contenu de la révision ou explication retenue..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Enregistrer la fiche
                  </button>
                </div>
              </form>

              {notes.length > 0 ? (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600">Vos fiches enregistrées :</span>
                    <button
                      onClick={exportNotesAsText}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-indigo-700 text-xs transition-colors border border-slate-200 font-medium"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Télécharger toutes les fiches (.txt)
                    </button>
                  </div>
                  {notes.map((note) => (
                    <div key={note.id} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-indigo-700">{note.title}</span>
                        <span className="text-[10px] text-slate-400">{note.date}</span>
                      </div>
                      <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  Aucune fiche personnelle sauvegardée pour l'instant.
                </div>
              )}
            </div>
          )}

          {activeTab === 'wellbeing' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <h3 className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1 text-sm">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  Exercice de respiration & Calme mental (4-4-4)
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Lorsque le stress ou l'anxiété montent et que la concentration devient difficile, accordez-vous 2 minutes pour pratiquer la respiration carrée :
                </p>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-xs text-emerald-900">
                  <li>Inspiration lente par le nez pendant <strong>4 secondes</strong>.</li>
                  <li>Maintien de l'air dans les poumons pendant <strong>4 secondes</strong>.</li>
                  <li>Expiration douce par la bouche pendant <strong>4 secondes</strong>.</li>
                  <li>Repos poumons vides pendant <strong>4 secondes</strong>. Répétez 4 fois.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-semibold text-slate-900 text-xs mb-1">Maintien de l'espoir et de la persévérance</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chaque petite notion apprise aujourd'hui est une pierre posée pour votre avenir. L'éducation est une force personnelle inestimable que personne ne peut vous enlever. Soyez fier de chaque effort accompli.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium transition-colors"
          >
            Fermer le Kit
          </button>
        </div>

      </div>
    </div>
  );
};
