export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  image?: string;
  timestamp: string;
  subject?: string;
  mode?: 'normal' | 'pas-a-pas' | 'exercice' | 'revision';
}

export type Subject = 
  | 'Général'
  | 'Mathématiques'
  | 'Physique-Chimie'
  | 'SVT & Biologie'
  | 'Français & Littérature'
  | 'Histoire-Géo'
  | 'Langues Vivantes'
  | 'Philosophie & Éthique'
  | 'Méthodologie & Organisation';

export interface OfflineNote {
  id: string;
  title: string;
  content: string;
  subject: Subject;
  date: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
