import React from 'react';
import { Subject } from '../types';
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  Lightbulb, 
  BrainCircuit, 
  HeartHandshake,
  GraduationCap,
  Award
} from 'lucide-react';

interface QuickPromptsProps {
  subject: Subject;
  onSelectPrompt: (promptText: string, mode?: 'normal' | 'pas-a-pas' | 'exercice' | 'revision') => void;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ subject, onSelectPrompt }) => {
  const exetatPrompt = {
    label: "Préparation Exétat 🎓",
    text: "Donne-moi un exercice type de l'Examen d'État avec sa correction pas à pas.",
    icon: Award,
    mode: 'exercice' as const,
    featured: true
  };

  const getSubjectPrompts = (): { label: string; text: string; icon: any; mode?: 'normal' | 'pas-a-pas' | 'exercice' | 'revision'; featured?: boolean }[] => {
    switch (subject) {
      case 'Mathématiques':
        return [
          exetatPrompt,
          { label: "Théorème de Pythagore", text: "Peux-tu m'expliquer le théorème de Pythagore pas à pas avec un exemple très clair ?", icon: BrainCircuit, mode: 'pas-a-pas' },
          { label: "Exercice d'Algèbre", text: "Propose-moi un exercice guidé sur la résolution d'équations du premier degré.", icon: HelpCircle, mode: 'exercice' },
          { label: "Fiche Fractions", text: "Fais-moi une fiche rapide de révision sur les opérations avec des fractions.", icon: BookOpen, mode: 'revision' }
        ];
      case 'Physique-Chimie':
        return [
          exetatPrompt,
          { label: "Lois de Newton", text: "Explique-moi la première loi de Newton (principe d'inertie) simplement.", icon: Lightbulb, mode: 'pas-a-pas' },
          { label: "Exercice Masse Volumique", text: "Propose-moi un petit problème pratique sur le calcul de la masse volumique.", icon: HelpCircle, mode: 'exercice' },
          { label: "Fiche d'Électricité", text: "Rappelle-moi la loi d'Ohm U = R x I avec un schéma en texte.", icon: BookOpen, mode: 'revision' }
        ];
      case 'Français & Littérature':
        return [
          exetatPrompt,
          { label: "Méthode de la Dissertation", text: "Quelles sont les étapes essentielles pour rédiger un bon plan de dissertation ?", icon: BrainCircuit, mode: 'pas-a-pas' },
          { label: "Exercice de Grammaire", text: "Donne-moi 3 phrases pour m'entraîner à accorder le participe passé.", icon: HelpCircle, mode: 'exercice' },
          { label: "Figures de Style", text: "Rappelle-moi les figures de style principales (métaphore, comparaison, hyperbole).", icon: BookOpen, mode: 'revision' }
        ];
      case 'SVT & Biologie':
        return [
          exetatPrompt,
          { label: "La Photosynthèse", text: "Explique-moi le mécanisme de la photosynthèse étape par étape.", icon: Lightbulb, mode: 'pas-a-pas' },
          { label: "Génétique de Base", text: "Comment fonctionne l'hérédité des caractères ? Fais-moi un résumé simple.", icon: BookOpen, mode: 'revision' }
        ];
      case 'Histoire-Géo':
        return [
          exetatPrompt,
          { label: "Grandes dates clés", text: "Donne-moi une frise chronologique synthétique des grands événements du XXe siècle.", icon: BookOpen, mode: 'revision' },
          { label: "Méthode d'Analyse de Carte", text: "Comment analyser efficacement une carte géographique ou un document ?", icon: BrainCircuit, mode: 'pas-a-pas' }
        ];
      default:
        return [
          exetatPrompt,
          { label: "Explication Pas à Pas", text: "Peux-tu me réexpliquer la leçon du jour de façon progressive et très bien structurée ?", icon: BrainCircuit, mode: 'pas-a-pas' },
          { label: "Nouveau Quiz / Exercice", text: "Propose-moi un exercice interactif adapté à mon niveau avec la solution masquée.", icon: HelpCircle, mode: 'exercice' },
          { label: "Conseil Révision Confinement", text: "Quelles sont les meilleures méthodes pour continuer d'apprendre efficacement chez soi ?", icon: HeartHandshake, mode: 'normal' }
        ];
    }
  };

  const prompts = getSubjectPrompts();

  return (
    <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
      <span className="text-[11px] font-semibold text-indigo-600 shrink-0 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5" />
        Actions Rapides :
      </span>
      {prompts.map((p, idx) => {
        const Icon = p.icon;
        return (
          <button
            key={idx}
            onClick={() => onSelectPrompt(p.text, p.mode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs shrink-0 font-semibold transition-all shadow-xs ${
              p.featured
                ? 'bg-amber-500 hover:bg-amber-600 text-white border border-amber-600 ring-2 ring-amber-400/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${p.featured ? 'text-white' : 'text-indigo-600'}`} />
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
};
