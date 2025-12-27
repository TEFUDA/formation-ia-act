// ============================================
// MODIFICATIONS LANDING PAGE - FORMATION IA ACT
// ============================================
// Ce fichier contient les sections à REMPLACER dans ta landing page
// pour mieux valoriser la qualité de ta formation.
// 
// RÉSUMÉ DES CHANGEMENTS :
// 1. Section Quick Wins → Nouveaux chiffres (18 vidéos, 150 questions, simulateur)
// 2. Section Arsenal Complet → Nouvelle structure "Learning by Doing"
// 3. Value Stack → Mise à jour avec les vrais éléments
// 4. Nouvelle section "Outils Intégrés" → Mise en avant des 4 outils dans les modules
// ============================================


// ============================================
// 1. REMPLACER LA SECTION QUICK WINS BAR
// (Ligne ~1850 environ dans ton fichier)
// ============================================

const QuickWinsBarNEW = () => (
  <section className="relative z-10 py-8 px-6 border-y border-white/5 bg-gradient-to-r from-[#00FF88]/5 via-transparent to-[#00F5FF]/5">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: "🎬", value: "18", label: "vidéos (cours + tutos)", sublabel: "Appliquez en temps réel" },
          { icon: "🎯", value: "150+", label: "questions d'audit", sublabel: "Zéro angle mort" },
          { icon: "🎮", value: "1er", label: "simulateur d'audit", sublabel: "Exclusivité marché" },
          { icon: "🛠️", value: "4", label: "outils intégrés", sublabel: "Construisez VOS documents" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-white/80 text-sm font-medium">{stat.label}</div>
            <div className="text-white/40 text-xs">{stat.sublabel}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);


// ============================================
// 2. NOUVELLE SECTION "LEARNING BY DOING"
// À AJOUTER après la section "Before/After" (ligne ~2100)
// C'est LE différenciateur clé de ta formation
// ============================================

const LearningByDoingSection = () => (
  <section className="relative z-10 py-20 px-6 overflow-hidden">
    {/* Background effect */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8B5CF6]/5 to-transparent" />
    
    <div className="max-w-6xl mx-auto relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        className="text-center mb-12"
      >
        <motion.span 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6]/20 to-[#00F5FF]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-full mb-6"
          animate={{ boxShadow: ['0 0 20px rgba(139,92,246,0.2)', '0 0 40px rgba(139,92,246,0.4)', '0 0 20px rgba(139,92,246,0.2)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🚀 Exclusivité formation
        </motion.span>
        <h2 className="text-3xl sm:text-5xl font-black mt-4 mb-6">
          Vous <span className="text-[#00FF88]">construisez</span> votre conformité
          <br /><span className="text-[#8B5CF6]">pendant</span> que vous apprenez
        </h2>
        <p className="text-white/60 text-xl max-w-3xl mx-auto">
          Pas de théorie abstraite. À chaque module, un <span className="text-white font-bold">outil intégré</span> vous permet 
          de créer <span className="text-white font-bold">VOS propres documents</span> de conformité.
        </p>
        
        {/* Pitch unique */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-8 inline-block"
        >
          <div className="bg-gradient-to-r from-[#FF6B00]/20 via-[#FFB800]/20 to-[#FF6B00]/20 border-2 border-[#FFB800]/50 rounded-2xl px-8 py-5">
            <p className="text-lg sm:text-xl text-white font-medium">
              📣 <span className="text-[#FFB800] font-bold">La seule formation</span> où vous repartez avec 
              <span className="text-[#00FF88] font-bold"> TOUS vos documents prêts</span>,
              <br className="hidden sm:block" /> pas juste des connaissances théoriques.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Les 4 outils intégrés aux modules */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {[
          {
            module: "Module 3",
            title: "Wizard de Classification",
            icon: "⚠️",
            color: "#FF6B00",
            description: "Classifiez vos systèmes IA en répondant à 10 questions guidées",
            output: "→ Vous obtenez : Classification de risque pour chaque système",
            benefit: "Plus besoin de deviner si vous êtes concerné"
          },
          {
            module: "Module 4", 
            title: "Éditeur d'Email Intelligent",
            icon: "✉️",
            color: "#00F5FF",
            description: "Générez des emails professionnels pour interroger vos fournisseurs IA",
            output: "→ Vous obtenez : 5 emails prêts à envoyer",
            benefit: "Conformité fournisseurs en 1 clic"
          },
          {
            module: "Module 5",
            title: "Générateur Mentions Légales",
            icon: "⚖️",
            color: "#00FF88",
            description: "Créez vos mentions légales IA conformes à l'Article 50",
            output: "→ Vous obtenez : Mentions légales personnalisées",
            benefit: "Transparence IA garantie"
          },
          {
            module: "Module 6",
            title: "Simulation d'Audit Immersive",
            icon: "🎮",
            color: "#8B5CF6",
            description: "Affrontez un auditeur virtuel dans 120+ scénarios interactifs",
            output: "→ Vous obtenez : Expérience d'audit + score de préparation",
            benefit: "Zéro stress le jour J",
            exclusive: true
          }
        ].map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative group"
          >
            {tool.exclusive && (
              <div className="absolute -top-3 right-4 z-10">
                <motion.span 
                  className="bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white text-xs font-bold px-3 py-1 rounded-full"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🏆 Exclusivité marché
                </motion.span>
              </div>
            )}
            <div 
              className="h-full p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
              style={{ 
                background: `linear-gradient(135deg, ${tool.color}10, transparent)`,
                borderColor: `${tool.color}30`
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: `${tool.color}20` }}
                >
                  <span className="text-3xl">{tool.icon}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-white/40 uppercase">{tool.module}</span>
                  <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                </div>
              </div>
              <p className="text-white/70 mb-3">{tool.description}</p>
              <p className="text-sm font-semibold mb-2" style={{ color: tool.color }}>
                {tool.output}
              </p>
              <p className="text-white/50 text-sm">✓ {tool.benefit}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparaison formations classiques */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
      >
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Formation classique */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">😐</span>
                <h4 className="text-lg font-bold text-white/60">Formation classique</h4>
              </div>
              <ul className="space-y-3">
                {[
                  "Vidéos théoriques PowerPoint",
                  "Quiz de validation basiques",
                  "Templates génériques en PDF",
                  "\"Bonne chance pour la suite\"",
                  "Vous repartez avec... de la théorie"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/50 text-sm">
                    <span className="text-[#FF4444]">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Notre formation */}
            <div className="p-6 bg-gradient-to-br from-[#00FF88]/5 to-transparent">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🚀</span>
                <h4 className="text-lg font-bold text-[#00FF88]">Notre formation</h4>
              </div>
              <ul className="space-y-3">
                {[
                  "18 vidéos dont 12 tutoriels pratiques",
                  "90+ questions avec feedback détaillé",
                  "4 outils INTÉGRÉS aux modules",
                  "Vidéos de correction personnalisées",
                  "Vous repartez avec VOS DOCUMENTS"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white text-sm">
                    <span className="text-[#00FF88]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        className="mt-10 text-center"
      >
        <p className="text-white/60 text-lg mb-4">
          À la fin de la formation, vous avez <span className="text-[#00FF88] font-bold">100% de vos documents prêts</span>.
          <br />Pas 50%. Pas 80%. <span className="text-white font-semibold">Tout.</span>
        </p>
      </motion.div>
    </div>
  </section>
);


// ============================================
// 3. NOUVELLE SECTION "SIMULATEUR D'AUDIT"
// À AJOUTER après "Learning by Doing"
// C'est ton KILLER FEATURE unique sur le marché
// ============================================

const AuditSimulatorSection = () => (
  <section className="relative z-10 py-20 px-6">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <HoloCard glow="#FF6B00">
          <div className="p-8 sm:p-10">
            {/* Badge exclusivité */}
            <div className="text-center mb-8">
              <motion.span 
                className="inline-flex items-center gap-2 bg-[#FF6B00]/20 text-[#FF6B00] text-sm font-bold px-4 py-2 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🏆 Aucune autre formation n'a ça
              </motion.span>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left - Description */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-black mb-6">
                  <span className="text-[#FF6B00]">Simulateur d'audit</span>
                  <br />grandeur nature
                </h2>
                
                <p className="text-white/60 text-lg mb-6">
                  Avant de passer un vrai contrôle, <span className="text-white font-semibold">entraînez-vous face à un auditeur virtuel</span>. 
                  Vivez l'expérience d'un audit AI Act comme si vous y étiez.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: "🎭", text: "120+ dialogues interactifs avec choix multiples", color: "#00F5FF" },
                    { icon: "📊", text: "6 phases d'audit (notification → clôture)", color: "#00FF88" },
                    { icon: "💀", text: "5 scénarios de game over (stress, mensonge, temps...)", color: "#FF4444" },
                    { icon: "🎲", text: "20+ événements aléatoires (conflit DSI, panne imprimante...)", color: "#FFB800" },
                    { icon: "📈", text: "Scoring temps réel (confiance, stress, preuves)", color: "#8B5CF6" },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-white/80">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right - Visual mockup */}
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1b] rounded-2xl border border-white/10 overflow-hidden">
                  {/* Simulated game interface */}
                  <div className="absolute inset-0 p-6">
                    {/* Top bar - Stats */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-xs text-white/40">Confiance</div>
                          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-[#00FF88]" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-white/40">Stress</div>
                          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-[#FFB800]" />
                          </div>
                        </div>
                      </div>
                      <div className="text-[#00F5FF] text-sm font-mono">Phase 3/6</div>
                    </div>

                    {/* Dialogue */}
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                          <span className="text-lg">👔</span>
                        </div>
                        <div>
                          <p className="text-[#FF6B00] text-xs font-bold mb-1">AUDITEUR</p>
                          <p className="text-white/80 text-sm">
                            "Je constate que votre registre IA ne mentionne pas la date de dernière mise à jour. 
                            Comment justifiez-vous cette omission ?"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Choices */}
                    <div className="space-y-2">
                      {[
                        { text: "C'est une erreur, je corrige immédiatement", type: "safe" },
                        { text: "Notre politique interne ne l'exige pas", type: "risky" },
                        { text: "Je ne savais pas que c'était obligatoire", type: "danger" },
                      ].map((choice, i) => (
                        <motion.div 
                          key={i}
                          className={`p-3 rounded-lg border text-sm cursor-pointer transition-all ${
                            i === 0 
                              ? 'border-[#00FF88]/50 bg-[#00FF88]/10 text-white' 
                              : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          {choice.text}
                          {i === 0 && <span className="ml-2 text-[#00FF88]">✓ Optimal</span>}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Badge stats */}
                <div className="absolute -bottom-4 -right-4 bg-[#0A0A1B] border border-[#FF6B00]/30 rounded-xl p-3">
                  <p className="text-[#FF6B00] font-bold text-lg">4 400+ lignes</p>
                  <p className="text-white/40 text-xs">de code dédié</p>
                </div>
              </div>
            </div>

            {/* Bottom - Why it matters */}
            <div className="mt-10 p-6 bg-gradient-to-r from-[#FF6B00]/10 to-transparent border border-[#FF6B00]/20 rounded-xl">
              <p className="text-center text-white/80">
                <span className="text-[#FF6B00] font-bold">Pourquoi c'est crucial ?</span> Un audit mal préparé = stress, erreurs, sanctions. 
                Avec notre simulateur, vous avez déjà "vécu" l'expérience <span className="text-white font-semibold">avant le vrai jour J</span>.
              </p>
            </div>
          </div>
        </HoloCard>
      </motion.div>
    </div>
  </section>
);


// ============================================
// 4. VALUE STACK CORRIGÉ
// REMPLACER la section existante (ligne ~2800 environ)
// Chiffres mis à jour pour refléter la vraie valeur
// ============================================

const ValueStackNEW = () => (
  <section className="relative z-10 py-20 px-6">
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-[#00FF88] text-sm font-medium uppercase tracking-widest">L'offre tout-en-un</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
          Voici <span className="text-[#00FF88]">TOUT</span> ce que vous recevez
        </h2>
      </motion.div>

      <HoloCard glow="#00FF88">
        <div className="p-6 sm:p-8">
          {/* Stack items - MISE À JOUR */}
          <div className="space-y-3">
            {[
              { item: "6 modules vidéo cours (8h de formation)", value: 2500, category: "formation" },
              { item: "12 vidéos tutoriels pratiques + corrections", value: 2000, category: "formation", highlight: true },
              { item: "90+ questions de quiz avec feedback Article AI Act", value: 500, category: "formation" },
              { item: "Audit de conformité 150+ questions", value: 3000, category: "audit", highlight: true },
              { item: "Rapport PDF 30+ pages personnalisé", value: 800, category: "audit" },
              { item: "Simulateur d'audit gamifié (120+ scénarios)", value: 1500, category: "tools", highlight: true },
              { item: "4 outils intégrés (classification, emails, mentions...)", value: 2000, category: "tools" },
              { item: "12 templates prêts à l'emploi (Word, Excel)", value: 600, category: "templates" },
              { item: "Certificat officiel vérifiable (QR code)", value: 500, category: "certification" },
              { item: "Accès 12 mois + mises à jour réglementaires", value: 600, category: "support" },
            ].map((row, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  row.highlight 
                    ? 'bg-[#00FF88]/10 border-[#00FF88]/30' 
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-[#00FF88]"><Icons.Check /></div>
                  <span className={`text-sm ${row.highlight ? 'text-white font-semibold' : 'text-white'}`}>
                    {row.item}
                  </span>
                  {row.highlight && (
                    <span className="text-[8px] bg-[#FFB800] text-black font-bold px-2 py-0.5 rounded-full">
                      EXCLUSIF
                    </span>
                  )}
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-white/30 line-through text-xs">{row.value}€</span>
                  <span className="text-[#00FF88] font-bold text-xs">INCLUS</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total - MISE À JOUR */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/50">Valeur totale du pack</span>
              <span className="text-xl text-white/30 line-through">14 000€</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-bold text-lg">Votre investissement aujourd'hui</span>
              <div>
                <span className="text-4xl font-black text-[#00FF88]">4 990€</span>
                <span className="text-white/30 ml-2">HT</span>
              </div>
            </div>
            
            {/* Savings callout - MISE À JOUR */}
            <motion.div 
              className="bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-xl p-4 text-center"
              animate={{ scale: [1, 1.01, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-[#00FF88] font-bold text-lg">
                🎉 Vous économisez 9 000€ (64% de réduction)
              </p>
              <p className="text-white/50 text-sm mt-1">
                + Finançable OPCO jusqu'à 100%
              </p>
            </motion.div>
          </div>
        </div>
      </HoloCard>
    </div>
  </section>
);


// ============================================
// 5. SECTION "VOTRE VALISE" MISE À JOUR
// Dans la section "Arsenal Complet", REMPLACER la grille des outils
// ============================================

const ToolsGridNEW = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }}
    className="mb-16"
  >
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold">
        🧳 Votre <span className="text-[#FFB800]">valise de survie</span> AI Act
      </h3>
      <p className="text-white/50 mt-2">Tout ce que vous gardez à vie après la formation</p>
    </div>

    {/* Catégories d'outils */}
    <div className="space-y-6">
      
      {/* Outils INTÉGRÉS - La star */}
      <div className="p-6 bg-gradient-to-r from-[#8B5CF6]/10 to-[#00F5FF]/10 border-2 border-[#8B5CF6]/30 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">⚡</span>
          <h4 className="text-lg font-bold text-[#8B5CF6]">4 Outils INTÉGRÉS aux modules</h4>
          <span className="text-xs bg-[#FFB800] text-black font-bold px-2 py-1 rounded-full">EXCLUSIF</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: "Wizard Classification", icon: "⚠️", module: "M3" },
            { name: "Éditeur Email Intelligent", icon: "✉️", module: "M4" },
            { name: "Générateur Mentions Légales", icon: "⚖️", module: "M5" },
            { name: "Simulateur d'Audit", icon: "🎮", module: "M6" },
          ].map((tool, i) => (
            <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">{tool.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{tool.name}</p>
                  <p className="text-white/40 text-xs">{tool.module}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[#8B5CF6] text-sm mt-4 text-center">
          → Construisez VOS documents pendant la formation
        </p>
      </div>

      {/* Templates téléchargeables */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Registre IA Complet", type: "Excel", icon: "📊", desc: "12 onglets pré-remplis" },
          { name: "Politique IA Entreprise", type: "Word", icon: "📜", desc: "18 pages personnalisables" },
          { name: "Check-list Conformité", type: "PDF", icon: "✅", desc: "127 points de contrôle" },
          { name: "Matrice des Risques", type: "Excel", icon: "⚠️", desc: "Scoring automatique" },
          { name: "Modèle FRIA", type: "Word", icon: "⚖️", desc: "Évaluation d'impact" },
          { name: "Template Audit Interne", type: "Excel", icon: "🔍", desc: "Simulation complète" },
          { name: "Emails Fournisseurs", type: "Word", icon: "📧", desc: "5 modèles prêts" },
          { name: "Plan d'Action 90 Jours", type: "Excel", icon: "📅", desc: "Roadmap détaillée" },
          { name: "Guide Documentation", type: "PDF", icon: "📚", desc: "Tout ce qu'il faut documenter" },
          { name: "FAQ Juridique", type: "PDF", icon: "❓", desc: "50 questions/réponses" },
          { name: "Certificat Officiel", type: "PDF", icon: "🏆", desc: "Valeur probante" },
          { name: "Fiches Mémo", type: "PDF", icon: "📝", desc: "Résumés visuels" }
        ].map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -3 }}
            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#00FF88]/30 transition-all cursor-default"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tool.icon}</span>
              <div>
                <p className="font-semibold text-white text-sm">{tool.name}</p>
                <p className="text-white/40 text-xs">{tool.desc}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-white/10 text-white/50 rounded">{tool.type}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <motion.p 
      className="text-center mt-6 text-white/60"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <span className="text-[#00FF88] font-bold">Valeur totale : 4 600€</span> de templates et outils — 
      <span className="text-white"> inclus dans la formation</span>
    </motion.p>
  </motion.div>
);


// ============================================
// 6. SECTION VIDÉOS MISE À JOUR
// REMPLACER la section "VIDÉOS EXTRAORDINAIRES" existante
// ============================================

const VideosSectionNEW = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }}
    className="mb-16"
  >
    <HoloCard glow="#8B5CF6">
      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">🎬</span>
              <div>
                <span className="text-[#FFB800] text-sm font-bold">NOUVEAU</span>
                <h3 className="text-2xl font-bold">
                  <span className="text-[#8B5CF6]">18 vidéos</span> pour maîtriser l'AI Act
                </h3>
              </div>
            </div>
            
            <p className="text-white/60 mb-6">
              Pas juste des cours théoriques. <span className="text-white font-semibold">12 vidéos tutoriels</span> où 
              vous appliquez directement sur VOS documents, avec <span className="text-white font-semibold">corrections incluses</span>.
            </p>

            {/* Breakdown vidéos */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  <span className="text-white">6 vidéos de cours</span>
                </div>
                <span className="text-white/40 text-sm">~90 min</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#00FF88]/10 rounded-lg border border-[#00FF88]/30">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛠️</span>
                  <span className="text-white font-semibold">12 vidéos tutoriels pratiques</span>
                </div>
                <span className="text-[#00FF88] text-sm font-bold">EXCLUSIF</span>
              </div>
            </div>

            <ul className="space-y-2">
              {[
                "Format court (10-20 min) = pas de perte de temps",
                "Vidéos de CORRECTION pour chaque outil",
                "Vous créez VOS documents en suivant",
                "Sous-titres + transcriptions incluses",
                "Accès mobile = formez-vous partout"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                  <span className="text-[#8B5CF6]">▶</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-[#8B5CF6]/20 to-[#00F5FF]/20 rounded-xl border border-white/10 flex items-center justify-center">
              <motion.div
                className="w-20 h-20 bg-[#8B5CF6] rounded-full flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: ['0 0 0 0 rgba(139,92,246,0.4)', '0 0 0 20px rgba(139,92,246,0)', '0 0 0 0 rgba(139,92,246,0.4)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-3xl ml-1">▶</span>
              </motion.div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-[#FFB800] text-black text-xs font-bold px-3 py-1 rounded-full">
              18 vidéos • 8h de contenu
            </div>
          </div>
        </div>

        {/* Highlight correction videos */}
        <div className="mt-8 p-4 bg-gradient-to-r from-[#00FF88]/10 to-transparent border border-[#00FF88]/20 rounded-xl">
          <p className="text-center">
            <span className="text-2xl mr-2">✨</span>
            <span className="text-[#00FF88] font-bold">Bonus unique :</span>
            <span className="text-white/80"> Après chaque exercice, une vidéo de correction vous montre le résultat attendu pour VOTRE cas</span>
          </p>
        </div>
      </div>
    </HoloCard>
  </motion.div>
);


// ============================================
// 7. SECTION AUDIT MISE À JOUR
// Ajouter dans la section "Arsenal Complet" ou créer une section dédiée
// ============================================

const AuditFeatureSection = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }}
    className="mb-16"
  >
    <HoloCard glow="#00F5FF">
      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left - Stats */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">🔍</span>
              <div>
                <span className="text-[#FF4444] text-sm font-bold">VALEUR 3 000€ SEUL</span>
                <h3 className="text-2xl font-bold">
                  Audit de conformité <span className="text-[#00F5FF]">150+ questions</span>
                </h3>
              </div>
            </div>

            <p className="text-white/60 mb-6">
              Pas un simple quiz. Un <span className="text-white font-semibold">véritable audit professionnel</span> qui analyse 
              votre situation sous tous les angles et génère un rapport personnalisé.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { value: "150+", label: "Questions intelligentes", icon: "❓" },
                { value: "12", label: "Catégories analysées", icon: "📊" },
                { value: "30+", label: "Pages de rapport", icon: "📄" },
                { value: "90j", label: "Plan d'action inclus", icon: "📅" },
              ].map((stat, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl text-center">
                  <span className="text-xl">{stat.icon}</span>
                  <p className="text-[#00F5FF] font-bold text-xl mt-1">{stat.value}</p>
                  <p className="text-white/40 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Report preview */}
          <div className="relative">
            <div className="bg-white rounded-xl p-6 shadow-2xl">
              {/* Fake PDF header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-gray-800 font-bold">Rapport de Conformité AI Act</p>
                  <p className="text-gray-500 text-sm">Entreprise : [Votre entreprise]</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Score global</p>
                  <p className="text-3xl font-black text-[#FF6B00]">67%</p>
                </div>
              </div>
              
              {/* Categories preview */}
              <div className="space-y-2">
                {[
                  { name: "Gouvernance", score: 80, color: "#00FF88" },
                  { name: "Documentation", score: 45, color: "#FF6B00" },
                  { name: "Formation Art.4", score: 20, color: "#FF4444" },
                  { name: "Fournisseurs", score: 90, color: "#00FF88" },
                ].map((cat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-gray-600 text-sm w-28">{cat.name}</span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${cat.score}%`, background: cat.color }}
                      />
                    </div>
                    <span className="text-gray-600 text-sm w-10 text-right">{cat.score}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-500 text-xs">+ Plan d'action 90 jours • Budget estimatif • Recommandations prioritaires</p>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute -top-3 -right-3 bg-[#00F5FF] text-black text-xs font-bold px-3 py-1 rounded-full">
              PDF téléchargeable
            </div>
          </div>
        </div>

        {/* What's analyzed */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-white/60 text-center mb-4">12 domaines analysés en profondeur :</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Gouvernance", "Inventaire IA", "Classification risques", "Documentation",
              "Formation", "Données", "Transparence", "Supervision humaine",
              "Sécurité", "Processus", "Fournisseurs", "Audit interne"
            ].map((domain, i) => (
              <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-sm">
                {domain}
              </span>
            ))}
          </div>
        </div>
      </div>
    </HoloCard>
  </motion.div>
);


// ============================================
// INSTRUCTIONS D'INTÉGRATION
// ============================================
/*

POUR INTÉGRER CES MODIFICATIONS :

1. REMPLACER la section "Quick Wins Bar" (ligne ~1850) par QuickWinsBarNEW

2. AJOUTER la section LearningByDoingSection après la section "Before/After" (ligne ~2100)
   C'est LE différenciateur de ta formation

3. AJOUTER la section AuditSimulatorSection après LearningByDoingSection
   Ton killer feature unique

4. Dans la section "Arsenal Complet" :
   - REMPLACER la grille "Votre valise" par ToolsGridNEW
   - REMPLACER la section "Vidéos extraordinaires" par VideosSectionNEW
   - AJOUTER AuditFeatureSection

5. REMPLACER le Value Stack (ligne ~2800) par ValueStackNEW

6. ORDRE RECOMMANDÉ des sections :
   - Hero
   - Quick Wins (nouveau)
   - Problem Agitation
   - Before/After
   - Learning by Doing (NOUVEAU - clé)
   - Audit Simulator (NOUVEAU - killer feature)
   - Arsenal Complet (avec nouvelles sous-sections)
   - Teaser Section
   - ROI Calculator
   - Testimonials
   - Value Stack (mis à jour)
   - Pricing
   - FAQ
   - Final CTA

*/
