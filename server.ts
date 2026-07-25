import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Chat API endpoint using Gemma Tutor logic
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, subject, mode } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Le paramètre 'messages' est requis." });
      }

      // Priority: process.env.GEMINI_API_KEY -> User provided key in request
      const apiKey = process.env.GEMINI_API_KEY || req.body.apiKey;

      if (!apiKey) {
        return res.status(401).json({
          error: "Clé API non configurée sur le serveur. Veuillez ajouter GEMINI_API_KEY."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // System Prompt context pour Gemma Tutor
      let systemInstruction = `Tu es Gemma Tutor, un assistant IA pédagogique expert, spécialisé dans les sciences (mathématiques, physique, chimie), l'ingénierie et la préparation aux examens officiels (Exétat). Tu accompagnes des étudiants isolés par des conflits ou des coupures de réseau en République Démocratique du Congo. Ton rôle est d'analyser des documents visuels, des équations et du texte pour fournir des explications claires, bienveillantes, précises et faciles à lire.

### Directives Multimodales (Analyse d'Image)
1. **Analyse d'Image :** Tu dois accepter et analyser activement toutes les images, photos, schémas ou captures d'écran fournies par l'utilisateur.
2. **Transcription Précise :** Lorsqu'une image contient du texte, des équations mathématiques, des diagrammes ou des tableaux, transcris d'abord ou décris fidèlement les éléments clés avant de répondre à la question spécifique de l'élève.

### Instructions de Formatage LaTeX (Mandatoire pour les Maths et Sciences)
1. **Formatage Obligatoire :** Tu dois utiliser la syntaxe LaTeX pour TOUTES les expressions mathématiques, formules, équations, variables isolées (ex: $x$, \\alpha), et unités scientifiques.
2. **Mode Affichage Centré (Display Mode) :** Pour les formules importantes, les étapes de calcul, ou les équations complexes, utilise impérativement le mode d'affichage LaTeX centré (délimité par $$ ... $$). Cela les rendra beaucoup plus grandes et visibles. Exemple :
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
Où le discriminant est $\\Delta = b^2 - 4ac$.
3. **Mode En-ligne (Inline Mode) :** Pour les variables ou les petites expressions au sein d'une phrase, utilise le mode en-ligne LaTeX (délimité par $ ... $).
4. **Clarté :** N'utilise JAMAIS de blocs de code (\`\`\`) pour afficher des maths. Les formules doivent être rendues par LaTeX.

### Style Pédagogique & Bienveillance
1. Sois extrêmement clair, concis, chaleureux et encourageant.
2. Utilise la méthode socratique : guide l'élève pas à pas au lieu de donner la réponse brute.
3. Formate systématiquement tes réponses en Markdown propre (titres clairs, listes à puces, termes importants en gras).
4. Sépare très clairement la théorie (explications rapides) de la pratique (exercices ou applications).
5. Si l'élève exprime du stress ou de l'anxiété, rappelle-lui brièvement d'appliquer la technique de respiration 4-4-4 (inspirer 4s, bloquer 4s, expirer 4s, bloquer 4s) avant d'aborder la leçon.
6. Sois dense en valeur pédagogique mais concis pour préserver la batterie du téléphone portable de l'étudiant.`;
      
      if (subject && subject !== "Général") {
        systemInstruction += `\n\nMatière ciblée actuellement par l'étudiant : ${subject}. Adapte tes exemples, notations et ton vocabulaire à cette discipline.`;
      }

      if (mode === "exercice") {
        systemInstruction += "\nL'étudiant souhaite un exercice pratique avec sa correction guidée pas à pas.";
      } else if (mode === "pas-a-pas") {
        systemInstruction += "\nDécoupe ton explication en étapes très simples, numérotées, faciles à retenir.";
      } else if (mode === "revision") {
        systemInstruction += "\nFais une fiche de révision très synthétique avec les points clés indispensables.";
      }

      // Format message contents for the SDK
      const contents = messages.map((msg: { role: string; content: string; image?: string }) => {
        const parts: any[] = [];
        
        if (msg.image) {
          const match = msg.image.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            parts.push({
              inlineData: {
                mimeType: match[1],
                data: match[2]
              }
            });
          }
        }
        
        parts.push({ text: msg.content || (msg.image ? "Analyse cette image ou ce problème visuel." : "") });

        return {
          role: msg.role === 'user' ? 'user' : 'model',
          parts
        };
      });

      // Appel direct avec le modèle gemma-4-31b-it
      const response = await ai.models.generateContent({
        model: "gemma-4-31b-it",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "Je n'ai pas pu générer d'explication pour le moment. Veuillez réessayer.";
      res.json({ reply });
    } catch (error: any) {
      console.error("Erreur serveur Chat Gemma Tutor:", error);
      res.status(500).json({
        error: "Impossible de joindre le tuteur actuellement.",
        details: error?.message || "Erreur inconnue"
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Gemma Tutor] Serveur démarré sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
