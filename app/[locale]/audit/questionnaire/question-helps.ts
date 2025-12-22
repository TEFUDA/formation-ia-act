// ============================================
// AIDE CONTEXTUELLE POUR CHAQUE QUESTION
// ============================================
// Ce fichier contient les explications détaillées pour chaque question de l'audit.
// Importez-le dans le questionnaire pour enrichir l'expérience utilisateur.

export interface QuestionHelpData {
  what: string;      // Qu'est-ce que ça veut dire ?
  why: string;       // Pourquoi c'est important ?
  how: string;       // Comment vérifier / trouver la réponse ?
  tips?: string[];   // Conseils pratiques
}

export const questionHelps: Record<string, QuestionHelpData> = {
  // =====================
  // INVENTORY - INVENTAIRE IA
  // =====================
  'inv1': {
    what: "Un inventaire IA est une liste exhaustive de tous les outils et systèmes utilisant l'intelligence artificielle dans votre entreprise : logiciels, applications, services cloud, etc.",
    why: "L'AI Act impose aux organisations de connaître précisément leurs systèmes IA pour pouvoir les classifier et appliquer les obligations correspondantes. Sans inventaire, impossible de savoir si vous êtes concerné par des obligations.",
    how: "Envoyez un questionnaire à chaque département en demandant : 'Utilisez-vous des outils qui font des prédictions, des recommandations, de la reconnaissance d'image/texte, ou de l'automatisation intelligente ?' Listez aussi tous les logiciels avec des fonctions 'smart' ou 'AI'.",
    tips: [
      "Pensez aux outils du quotidien : correcteurs orthographiques IA, filtres anti-spam, chatbots",
      "N'oubliez pas les outils gratuits utilisés par les employés (ChatGPT, etc.)",
      "Créez un fichier Excel simple avec : Nom, Département, Usage, Fournisseur"
    ]
  },
  'inv2': {
    what: "L'IA générative crée du nouveau contenu (texte, images, code, audio). Les outils populaires incluent ChatGPT, Claude, Copilot, Midjourney, DALL-E, Gemini.",
    why: "Ces outils posent des risques spécifiques : confidentialité des données saisies, propriété intellectuelle du contenu généré, hallucinations (informations fausses présentées comme vraies).",
    how: "Demandez à vos équipes s'ils utilisent ces outils, même gratuitement. Vérifiez les extensions de navigateur, les abonnements payés en note de frais, les comptes créés avec des emails professionnels.",
    tips: [
      "Beaucoup d'employés utilisent ces outils sans le dire par peur d'être jugés",
      "Créez un cadre bienveillant pour les recenser plutôt qu'interdire",
      "Une politique d'encadrement définit ce qui peut/ne peut pas être partagé avec ces outils"
    ]
  },
  'inv3': {
    what: "Le nombre total de systèmes ou outils utilisant l'IA dans votre organisation, qu'ils soient achetés, développés en interne, gratuits ou payants.",
    why: "Plus vous avez de systèmes IA, plus la gouvernance devient complexe et plus les risques de non-conformité augmentent. Cela aide à dimensionner les ressources nécessaires.",
    how: "Basez-vous sur votre inventaire. Si vous n'en avez pas, estimez en listant : logiciels métier avec IA, outils bureautiques (Office 365 a de l'IA), CRM, ERP, RH, marketing, etc.",
    tips: [
      "Une même suite logicielle peut contenir plusieurs systèmes IA distincts",
      "Microsoft 365 seul contient 10+ fonctions IA différentes",
      "En cas de doute, arrondissez au-dessus"
    ]
  },
  'inv4': {
    what: "Savoir précisément quels services (RH, Finance, Marketing, Production, IT, etc.) utilisent des outils IA et lesquels.",
    why: "Chaque département peut avoir des usages à risque différents. Les RH utilisant l'IA pour le recrutement = haut risque. Le marketing utilisant l'IA pour des visuels = risque moindre.",
    how: "Organisez des entretiens de 15 min avec chaque responsable de département. Question clé : 'Quels outils utilisez-vous qui font des choses automatiquement ou intelligemment ?'",
    tips: [
      "Les départements les plus utilisateurs d'IA : IT, Marketing, RH, Service Client",
      "N'oubliez pas les usages 'shadow IT' - outils installés sans l'accord de l'IT",
      "Créez une matrice Département x Outils IA"
    ]
  },
  'inv5': {
    what: "Chaque système IA devrait avoir une fiche avec : nom, description, fournisseur, usage prévu, données utilisées, responsable interne, date de mise en service.",
    why: "L'AI Act exige une documentation technique. Commencer par des fiches simples facilite la mise en conformité et permet de réagir vite en cas d'incident ou de contrôle.",
    how: "Créez un template simple (Word ou Excel) et demandez à chaque responsable d'outil de le remplir. 15 minutes par système suffisent pour une première version.",
    tips: [
      "Utilisez notre template 'Registre IA' disponible dans la formation",
      "Commencez par les 5 systèmes les plus critiques",
      "Un responsable = une personne nommée, pas 'l'équipe IT'"
    ]
  },
  'inv6_pro': {
    what: "Distinguer les systèmes IA développés par vos équipes (in-house) de ceux achetés à des fournisseurs externes (SaaS, licences, etc.).",
    why: "Les obligations AI Act diffèrent selon que vous êtes 'fournisseur' (développeur) ou 'déployeur' (utilisateur) d'un système IA. Les obligations des fournisseurs sont plus lourdes.",
    how: "Pour chaque système de votre inventaire, indiquez : 'Interne' si développé par vos équipes, 'Externe' si acheté, 'Mixte' si personnalisation interne d'une solution externe.",
    tips: [
      "Un modèle IA open source que vous avez fine-tuné = vous êtes fournisseur",
      "Utiliser ChatGPT tel quel = vous êtes déployeur",
      "Intégrer une API IA dans votre produit = dépend du niveau de personnalisation"
    ]
  },

  // =====================
  // CLASSIFICATION DES RISQUES
  // =====================
  'class1': {
    what: "Déterminer si vos systèmes IA sont utilisés dans des domaines considérés 'à haut risque' par l'AI Act : RH, éducation, santé, justice, finance, infrastructures critiques.",
    why: "Les systèmes à haut risque ont des obligations beaucoup plus strictes : évaluation de conformité, documentation technique détaillée, système de gestion des risques, etc.",
    how: "Croisez votre inventaire avec la liste de l'Annexe III de l'AI Act. Exemples : IA pour le recrutement, scoring crédit, diagnostic médical, vidéosurveillance = haut risque.",
    tips: [
      "L'Annexe III liste 8 domaines à haut risque - consultez-la dans notre formation",
      "En cas de doute sur la classification, considérez le système comme haut risque par précaution",
      "La classification doit être documentée et justifiée"
    ]
  },
  'class2': {
    what: "L'IA utilisée dans le recrutement inclut : tri de CV, matching candidat-poste, scoring de candidatures, chatbots de pré-sélection, analyse vidéo d'entretiens.",
    why: "L'IA en recrutement est classée 'haut risque' car elle impacte directement l'accès à l'emploi, un droit fondamental. Des biais algorithmiques peuvent discriminer certains groupes.",
    how: "Listez tous les outils utilisés par votre équipe RH pour le recrutement. Posez-leur la question : 'Y a-t-il une fonction qui trie, note ou recommande automatiquement des candidats ?'",
    tips: [
      "LinkedIn Recruiter utilise de l'IA - vous êtes probablement concerné",
      "Les ATS (Applicant Tracking Systems) modernes intègrent souvent de l'IA",
      "Même un simple filtre automatique sur les CV peut être considéré comme de l'IA"
    ]
  },
  'class3': {
    what: "Les systèmes de scoring attribuent une note ou un score à des personnes pour prédire un comportement : risque de crédit, risque d'assurance, potentiel commercial, etc.",
    why: "Ces systèmes peuvent avoir un impact majeur sur les personnes (refus de crédit, primes d'assurance élevées). L'AI Act les classe souvent à haut risque.",
    how: "Identifiez tout système qui calcule un 'score', une 'note', un 'rating' ou un 'potentiel' sur des personnes physiques. Vérifiez vos outils CRM, assurance, crédit.",
    tips: [
      "Le lead scoring commercial est généralement moins risqué que le scoring crédit",
      "Si le score influence une décision impactant la personne, c'est probablement haut risque",
      "Documentez l'usage fait du score et qui peut le consulter"
    ]
  },
  'class4': {
    what: "La biométrie inclut : reconnaissance faciale, empreintes digitales, reconnaissance vocale, reconnaissance de l'iris, analyse de la démarche.",
    why: "La biométrie est très encadrée car elle traite des données sensibles permettant d'identifier une personne de manière unique. Certains usages sont interdits par l'AI Act.",
    how: "Vérifiez vos systèmes de contrôle d'accès, de pointage, de vidéosurveillance. Demandez à votre DSI et à votre responsable sécurité.",
    tips: [
      "Le déverrouillage de PC par empreinte ou Windows Hello = biométrie",
      "La reconnaissance faciale dans l'espace public est très limitée",
      "Même pour l'accès interne, des obligations s'appliquent (consentement, etc.)"
    ]
  },
  'class5': {
    what: "Les droits fondamentaux incluent : droit au travail, droit à l'éducation, droit à la santé, droit à la vie privée, non-discrimination, liberté d'expression.",
    why: "L'AI Act vise principalement à protéger ces droits. Tout système IA qui peut les affecter nécessite une attention particulière.",
    how: "Pour chaque système IA, demandez-vous : 'Cette décision peut-elle empêcher quelqu'un d'accéder à un service, un emploi, un prêt, des soins ?'",
    tips: [
      "Une décision 'avec supervision humaine' = quelqu'un peut contredire l'IA",
      "Une décision 'automatisée' = l'IA décide seule sans intervention humaine possible",
      "La supervision humaine doit être effective, pas juste symbolique"
    ]
  },

  // =====================
  // GOUVERNANCE IA
  // =====================
  'gov1': {
    what: "Un Référent IA (ou AI Officer) est une personne désignée pour superviser l'utilisation de l'IA dans l'organisation, assurer la conformité et coordonner les initiatives IA.",
    why: "L'AI Act recommande une gouvernance claire. Un référent identifié facilite la mise en conformité, la gestion des incidents et le dialogue avec les autorités.",
    how: "Vérifiez si quelqu'un dans votre organisation a officiellement ce rôle (même à temps partiel). Sinon, identifiez qui s'occupe actuellement des questions IA.",
    tips: [
      "Ce n'est pas forcément un poste à temps plein, surtout pour les PME",
      "Le profil idéal combine compétences tech, juridiques et métier",
      "Dans une petite structure, ça peut être le DPO ou le DSI"
    ]
  },
  'gov2': {
    what: "Une politique IA formelle est un document officiel qui définit les règles d'utilisation de l'IA dans l'entreprise : usages autorisés, interdits, processus de validation, etc.",
    why: "Sans politique formelle, chacun fait ce qu'il veut et les risques de non-conformité explosent. C'est aussi une preuve de bonne foi en cas de contrôle.",
    how: "Vérifiez si un document 'Politique IA', 'Charte IA' ou équivalent existe. Demandez aux RH, à la DSI, au service juridique.",
    tips: [
      "Une politique IA peut être intégrée à la charte informatique existante",
      "Utilisez notre template 'Politique IA Entreprise' pour démarrer",
      "Faites valider la politique par la direction et communiquez-la à tous"
    ]
  },
  'gov3': {
    what: "Un processus de validation implique qu'avant de déployer un nouveau système IA, quelqu'un vérifie s'il est conforme aux règles internes et à l'AI Act.",
    why: "Mieux vaut prévenir que guérir. Valider avant déploiement évite de découvrir un problème de conformité une fois le système en production.",
    how: "Demandez-vous : quand un nouveau logiciel IA est proposé, qui décide si on peut l'utiliser ? Y a-t-il une checklist, un comité, une procédure formelle ?",
    tips: [
      "La validation peut être simple : checklist + approbation du Référent IA",
      "Pour les systèmes à haut risque, le processus doit être plus rigoureux",
      "Documentez chaque validation (même si c'est approuvé)"
    ]
  },
  'gov4': {
    what: "Un comité ou instance de gouvernance IA est un groupe de personnes (direction, DSI, juridique, métiers) qui se réunit régulièrement pour piloter la stratégie IA.",
    why: "L'IA a des implications transverses (tech, juridique, RH, métier). Un comité assure une vision d'ensemble et des décisions cohérentes.",
    how: "Vérifiez si des réunions régulières sur l'IA existent avec des participants de différents services. Sinon, l'IA est-elle à l'ordre du jour d'un comité existant ?",
    tips: [
      "Pas besoin de créer un nouveau comité - ajoutez l'IA à un comité existant",
      "Fréquence recommandée : mensuel ou trimestriel selon la maturité",
      "Gardez des comptes-rendus comme preuve de gouvernance active"
    ]
  },

  // =====================
  // DOCUMENTATION TECHNIQUE
  // =====================
  'doc1': {
    what: "La documentation technique pour l'IA inclut : description du système, données utilisées, logique de fonctionnement, performances, limites connues, mesures de sécurité.",
    why: "L'AI Act exige une documentation technique détaillée pour les systèmes à haut risque. C'est aussi utile pour la maintenance, la formation des utilisateurs et les audits.",
    how: "Vérifiez si vos systèmes IA ont des fiches techniques au-delà du simple manuel utilisateur. Y a-t-il des documents décrivant comment l'IA fonctionne 'sous le capot' ?",
    tips: [
      "Pour les systèmes achetés, demandez la documentation au fournisseur",
      "Pour les systèmes internes, faites documenter par l'équipe de développement",
      "Notre template 'Documentation Technique' vous guide pas à pas"
    ]
  },
  'doc2': {
    what: "L'évaluation d'impact IA (FRIA - Fundamental Rights Impact Assessment) analyse les risques qu'un système IA fait peser sur les droits des personnes.",
    why: "Obligatoire pour les systèmes à haut risque selon l'AI Act. Elle permet d'identifier et de mitiger les risques avant qu'ils ne se matérialisent.",
    how: "Vérifiez si des analyses de risques ont été faites pour vos systèmes IA. Cherchez des documents appelés 'FRIA', 'PIA IA', 'Analyse d'impact IA'.",
    tips: [
      "La FRIA peut s'appuyer sur une AIPD RGPD existante si elle couvre les aspects IA",
      "Commencez par vos systèmes les plus critiques ou à haut risque",
      "Notre template 'FRIA' simplifie cette analyse"
    ]
  },
  'doc3': {
    what: "Le registre des traitements IA est une liste structurée de tous vos systèmes IA avec leurs caractéristiques : finalité, données, responsable, classification des risques, etc.",
    why: "C'est la base de votre conformité AI Act. Sans registre, vous ne pouvez pas savoir où vous en êtes ni prouver votre conformité en cas de contrôle.",
    how: "Vérifiez si vous avez un document central (Excel, base de données, logiciel dédié) listant tous vos systèmes IA. Est-il complet et à jour ?",
    tips: [
      "Le registre peut être une extension de votre registre RGPD",
      "Mettez à jour le registre à chaque nouveau système ou changement majeur",
      "Désignez un responsable de la tenue du registre"
    ]
  },

  // =====================
  // FORMATION ARTICLE 4
  // =====================
  'train1': {
    what: "L'Article 4 de l'AI Act impose que les personnes utilisant des systèmes IA aient un niveau suffisant de 'maîtrise de l'IA' (AI literacy).",
    why: "Des utilisateurs non formés peuvent mal utiliser l'IA, ne pas détecter ses erreurs, ou prendre des décisions inappropriées basées sur ses sorties.",
    how: "Avez-vous organisé des formations sur l'IA pour vos équipes ? Les utilisateurs de systèmes IA savent-ils comment les utiliser correctement et connaissent-ils leurs limites ?",
    tips: [
      "La formation peut être interne ou via des organismes externes",
      "Adaptez le niveau de formation au rôle : utilisateur vs développeur vs décideur",
      "Notre formation couvre les exigences de l'Article 4"
    ]
  },
  'train2': {
    what: "Une formation spécifique couvre les particularités de chaque système IA utilisé, pas juste l'IA en général. Chaque outil a ses forces, limites et bonnes pratiques.",
    why: "Connaître 'l'IA' en général ne suffit pas. Il faut savoir utiliser correctement chaque outil spécifique de l'entreprise.",
    how: "Quand un nouveau système IA est déployé, y a-t-il une formation pour les utilisateurs ? Existe-t-il des guides d'utilisation spécifiques ?",
    tips: [
      "Les fournisseurs de solutions IA proposent souvent des formations",
      "Créez des 'fiches réflexe' pour chaque outil IA",
      "Formez les nouveaux arrivants lors de l'onboarding"
    ]
  },
  'train3': {
    what: "Le plan de formation AI Act est un programme structuré pour s'assurer que toutes les personnes concernées seront formées d'ici l'entrée en vigueur des obligations.",
    why: "L'Article 4 entre en vigueur en février 2025. Il faut anticiper pour que tout le monde soit formé à temps.",
    how: "Avez-vous planifié des formations IA pour 2024-2025 ? Y a-t-il un budget et un calendrier définis ?",
    tips: [
      "Priorisez les utilisateurs de systèmes à haut risque",
      "Incluez la formation IA dans le plan de formation annuel",
      "Gardez des preuves de formation (attestations, feuilles de présence)"
    ]
  },

  // =====================
  // TRANSPARENCE
  // =====================
  'trans1': {
    what: "La transparence signifie informer les utilisateurs et les personnes affectées qu'ils interagissent avec ou sont évalués par une IA.",
    why: "L'AI Act impose des obligations de transparence. Les personnes ont le droit de savoir quand une IA influence des décisions les concernant.",
    how: "Vos clients/utilisateurs savent-ils qu'ils interagissent avec des systèmes IA ? Y a-t-il des mentions, des avertissements, des explications ?",
    tips: [
      "Un simple message 'Ce service utilise l'IA' peut suffire dans certains cas",
      "Pour les décisions importantes, expliquez le rôle de l'IA dans la décision",
      "Mettez à jour vos CGU et politiques de confidentialité"
    ]
  },
  'trans2': {
    what: "Un chatbot ou assistant virtuel doit clairement indiquer qu'il n'est pas humain. L'utilisateur ne doit pas être trompé sur la nature de son interlocuteur.",
    why: "L'AI Act interdit de faire passer une IA pour un humain. C'est une question d'honnêteté et de respect de l'utilisateur.",
    how: "Vérifiez vos chatbots, assistants virtuels, réponses automatiques. Est-il clair qu'il s'agit d'une IA et non d'un humain ?",
    tips: [
      "Commencez le chat par 'Je suis un assistant virtuel' ou équivalent",
      "Évitez de donner un prénom humain trompeur à votre chatbot",
      "Offrez toujours la possibilité de parler à un humain"
    ]
  },
  'trans3': {
    what: "Pour les contenus générés par IA (textes, images, vidéos), la transparence implique d'indiquer que le contenu a été créé ou modifié par une IA.",
    why: "Avec les deepfakes et le contenu synthétique, il devient important de distinguer le vrai du généré. L'AI Act impose un marquage des contenus IA.",
    how: "Si vous publiez du contenu généré par IA, est-ce indiqué ? Y a-t-il une politique interne sur ce sujet ?",
    tips: [
      "Ajoutez une mention 'Image générée par IA' ou 'Texte assisté par IA'",
      "Pour les images, des métadonnées de marquage existent (C2PA)",
      "La transparence renforce la confiance de vos audiences"
    ]
  },

  // =====================
  // SÉCURITÉ & RGPD
  // =====================
  'sec1': {
    what: "La sécurité des systèmes IA inclut : protection contre les accès non autorisés, contre les manipulations malveillantes (adversarial attacks), contre les fuites de données.",
    why: "Les systèmes IA peuvent être vulnérables à des attaques spécifiques. Leur compromission peut avoir des conséquences importantes (décisions erronées, fuites de données sensibles).",
    how: "Vos systèmes IA ont-ils fait l'objet d'une analyse de sécurité ? Sont-ils inclus dans vos procédures de sécurité informatique standard ?",
    tips: [
      "Incluez les systèmes IA dans vos audits de sécurité réguliers",
      "Attention aux données envoyées à des IA cloud (ChatGPT, etc.)",
      "Mettez à jour vos systèmes IA comme vos autres logiciels"
    ]
  },
  'sec2': {
    what: "Le RGPD s'applique dès que des données personnelles sont traitées par l'IA : pour l'entraînement, en entrée, ou en sortie du système.",
    why: "L'AI Act et le RGPD sont complémentaires. Un système IA conforme à l'AI Act mais pas au RGPD reste illégal.",
    how: "Vos systèmes IA sont-ils inclus dans votre registre RGPD ? Les bases légales sont-elles définies ? Les droits des personnes sont-ils respectés ?",
    tips: [
      "Travaillez avec votre DPO pour aligner IA et RGPD",
      "Attention au profilage automatisé (Article 22 RGPD)",
      "Les données d'entraînement doivent aussi être conformes RGPD"
    ]
  },
  'sec3': {
    what: "Une procédure en cas d'incident IA définit comment réagir si le système dysfonctionne, produit des résultats erronés, ou est compromis.",
    why: "Les incidents arriveront. Mieux vaut être préparé pour réagir vite, limiter les dégâts et respecter les obligations de notification.",
    how: "Avez-vous une procédure documentée pour les incidents IA ? Qui prévenir ? Comment suspendre un système problématique ?",
    tips: [
      "Intégrez les incidents IA dans votre procédure de gestion des incidents IT",
      "Désignez des responsables clairs par système IA",
      "Testez votre procédure avec des exercices"
    ]
  },

  // =====================
  // FOURNISSEURS IA
  // =====================
  'sup1': {
    what: "L'évaluation des fournisseurs IA consiste à vérifier que vos fournisseurs de solutions IA respectent eux-mêmes l'AI Act et peuvent vous fournir les garanties nécessaires.",
    why: "Vous êtes co-responsable de la conformité des systèmes que vous utilisez. Un fournisseur non conforme vous expose à des risques.",
    how: "Avez-vous demandé à vos fournisseurs IA leur position sur l'AI Act ? Disposez-vous de leurs certifications, documentations, engagements ?",
    tips: [
      "Ajoutez des clauses AI Act dans vos contrats fournisseurs",
      "Demandez les documentations techniques et évaluations de conformité",
      "Préférez les fournisseurs avec des engagements AI Act explicites"
    ]
  },
  'sup2': {
    what: "Les contrats avec les fournisseurs IA doivent inclure des clauses sur la conformité, la responsabilité, l'accès à la documentation, la gestion des incidents.",
    why: "En cas de problème, le contrat définit qui est responsable de quoi. Sans clauses appropriées, vous pourriez être tenu responsable de défaillances du fournisseur.",
    how: "Relisez vos contrats avec les fournisseurs IA. Y a-t-il des mentions sur la conformité réglementaire, l'IA, les responsabilités ?",
    tips: [
      "Utilisez notre template 'Contrat Fournisseur IA'",
      "Renégociez les contrats existants pour ajouter des clauses AI Act",
      "Vérifiez la chaîne de sous-traitance (vos fournisseurs utilisent-ils des sous-traitants IA ?)"
    ]
  },
  'sup3': {
    what: "Le monitoring des fournisseurs consiste à suivre régulièrement leur conformité et la performance de leurs systèmes IA.",
    why: "La conformité initiale ne suffit pas. Il faut s'assurer que le fournisseur reste conforme dans le temps et que le système fonctionne correctement.",
    how: "Avez-vous des revues régulières avec vos fournisseurs IA ? Recevez-vous des rapports de performance, de conformité ?",
    tips: [
      "Planifiez des revues annuelles minimum avec les fournisseurs critiques",
      "Demandez des mises à jour sur leur roadmap conformité AI Act",
      "Surveillez les incidents signalés sur leurs systèmes"
    ]
  },

  // =====================
  // DEFAULT HELP
  // =====================
  'default': {
    what: "Cette question évalue un aspect important de votre conformité AI Act.",
    why: "L'AI Act impose des obligations spécifiques dans ce domaine. Votre réponse permettra d'identifier les actions prioritaires.",
    how: "Réfléchissez à vos pratiques actuelles et choisissez la réponse qui décrit le mieux votre situation.",
    tips: [
      "En cas de doute, choisissez la réponse la plus prudente",
      "Vous pourrez refaire l'audit plus tard pour mesurer vos progrès",
      "N'hésitez pas à consulter vos collègues concernés"
    ]
  }
};

// Fonction helper pour obtenir l'aide d'une question
export function getQuestionHelp(questionId: string): QuestionHelpData {
  return questionHelps[questionId] || questionHelps['default'];
}
