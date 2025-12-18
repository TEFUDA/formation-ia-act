# Formation AI Act - Plateforme E-Learning Multilingue

🇪🇺 Plateforme de formation certifiante sur le Règlement Européen AI Act (2024/1689)

## 🚀 Démarrage Rapide

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Lancer en production
npm start
```

## 🌍 Domaines Configurés

| Langue | Domaine |
|--------|---------|
| 🇫🇷 Français | formation-ia-act.fr |
| 🇩🇪 Allemand | ki-verordnung-schulung.de |
| 🇮🇹 Italien | formazione-ai-act.it |
| 🇪🇸 Espagnol | formacion-ai-act.es |
| 🇳🇱 Néerlandais | ai-verordening-training.nl |
| 🇵🇹 Portugais | formacao-ai-act.pt |
| 🇵🇱 Polonais | szkolenie-ai-act.pl |
| 🌍 Anglais | ai-act-certification.com |

## 📁 Structure du Projet

```
formation-ia-act/
├── app/
│   ├── [locale]/              # Pages par langue
│   │   ├── page.tsx           # Landing page
│   │   ├── formation/         # App e-learning
│   │   └── blog/              # Pages SEO
│   └── globals.css
├── components/
│   ├── ui/                    # Composants UI réutilisables
│   ├── landing/               # Composants landing page
│   └── formation/             # Composants e-learning
├── locales/                   # Fichiers de traduction
│   ├── fr.json
│   ├── de.json
│   └── ...
├── content/
│   ├── modules/               # Contenu des modules
│   └── seo/                   # Articles SEO
└── public/
    └── videos/                # Vidéos de formation
```

## 🎯 Fonctionnalités

- ✅ Landing page optimisée conversion
- ✅ 6 modules de formation
- ✅ Système de quiz
- ✅ Certificats PDF
- ✅ Gestion d'équipe
- ✅ Dashboard admin
- ✅ i18n (9 langues)
- ✅ SEO optimisé

## 💰 Pricing

- **Solo** : 499€ (10 places)
- **PME** : 999€ (50 places)
- **Enterprise** : 8 999€ (500 places)

## 🛠️ Déploiement Vercel

1. Connecter le repo GitHub à Vercel
2. Configurer les domaines dans Vercel Dashboard
3. Ajouter les variables d'environnement si nécessaire
4. Deploy !

```bash
# Ou via CLI
npx vercel --prod
```

## 📝 TODO

- [ ] Intégrer les 6 vidéos de formation
- [ ] Ajouter Stripe pour les paiements
- [ ] Générer les 1000 pages SEO
- [ ] Traduire le contenu dans toutes les langues
- [ ] Configurer les emails (Brevo)

## 📄 License

Propriétaire - © 2025 Formation IA Act
