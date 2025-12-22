'use client';

import Link from 'next/link';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#030014] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#030014]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#00FF88]/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-50 px-6 py-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-white"><Icons.Shield /></div>
            </div>
            <span className="font-bold text-lg hidden sm:block">Formation-IA-Act.fr</span>
          </Link>
          <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2">
            <div className="w-4 h-4"><Icons.ArrowLeft /></div>
            Retour
          </Link>
        </div>
      </header>

      <main className="relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Politique de Confidentialité</h1>
          <p className="text-white/60 mb-8">Protection de vos données personnelles - RGPD</p>
          
          <div className="prose prose-invert prose-lg max-w-none space-y-8">
            
            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00FF88] mb-4">1. Responsable du traitement</h2>
              <div className="text-white/70 space-y-2">
                <p><strong className="text-white">Formation IA Act SAS</strong></p>
                <p>123 Avenue de l&apos;Innovation, 75001 Paris, France</p>
                <p>Email DPO : dpo@formation-ia-act.fr</p>
                <p>Téléphone : [Numéro de téléphone]</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00FF88] mb-4">2. Données collectées</h2>
              <div className="text-white/70 space-y-4">
                <p>Nous collectons les données suivantes :</p>
                
                <p><strong className="text-white">2.1 Données d&apos;identification</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nom et prénom</li>
                  <li>Adresse email professionnelle</li>
                  <li>Numéro de téléphone (optionnel)</li>
                  <li>Fonction / Poste</li>
                  <li>Nom de l&apos;entreprise</li>
                </ul>

                <p className="mt-4"><strong className="text-white">2.2 Données de facturation</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Adresse de facturation</li>
                  <li>Numéro SIRET (pour les entreprises)</li>
                  <li>Numéro de TVA intracommunautaire</li>
                </ul>

                <p className="mt-4"><strong className="text-white">2.3 Données de connexion</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Adresse IP</li>
                  <li>Type de navigateur</li>
                  <li>Date et heure de connexion</li>
                  <li>Pages visitées</li>
                </ul>

                <p className="mt-4"><strong className="text-white">2.4 Données de formation</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Progression dans les modules</li>
                  <li>Résultats des quiz</li>
                  <li>Réponses aux audits</li>
                  <li>Certificats obtenus</li>
                </ul>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00FF88] mb-4">3. Finalités du traitement</h2>
              <div className="text-white/70 space-y-4">
                <p>Vos données sont utilisées pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Exécution du contrat :</strong> fourniture de l&apos;accès à la formation, suivi de progression, délivrance des certificats</li>
                  <li><strong className="text-white">Facturation :</strong> émission des factures, gestion des paiements, relation avec les OPCO</li>
                  <li><strong className="text-white">Support client :</strong> réponse à vos questions, assistance technique</li>
                  <li><strong className="text-white">Amélioration des services :</strong> analyse d&apos;utilisation pour améliorer nos formations</li>
                  <li><strong className="text-white">Communication :</strong> envoi d&apos;informations sur les mises à jour de la formation (avec votre consentement)</li>
                  <li><strong className="text-white">Obligations légales :</strong> respect des obligations comptables et fiscales, déclarations aux organismes de formation</li>
                </ul>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00FF88] mb-4">4. Base légale</h2>
              <div className="text-white/70 space-y-4">
                <p>Le traitement de vos données repose sur :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">L&apos;exécution du contrat</strong> (Article 6.1.b RGPD) pour la fourniture de la formation</li>
                  <li><strong className="text-white">L&apos;obligation légale</strong> (Article 6.1.c RGPD) pour les obligations comptables et déclaratives</li>
                  <li><strong className="text-white">L&apos;intérêt légitime</strong> (Article 6.1.f RGPD) pour l&apos;amélioration de nos services</li>
                  <li><strong className="text-white">Le consentement</strong> (Article 6.1.a RGPD) pour les communications marketing</li>
                </ul>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00FF88] mb-4">5. Destinataires des données</h2>
              <div className="text-white/70 space-y-4">
                <p>Vos données peuvent être partagées avec :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Stripe</strong> - Prestataire de paiement (données de paiement uniquement)</li>
                  <li><strong className="text-white">Vercel</strong> - Hébergeur de la plateforme</li>
                  <li><strong className="text-white">Votre OPCO</strong> - En cas de demande de financement</li>
                  <li><strong className="text-white">Autorités compétentes</strong> - En cas d&apos;obligation légale</li>
                </ul>
                <p className="mt-4">Nous ne vendons jamais vos données à des tiers.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00FF88] mb-4">6. Durée de conservation</h2>
              <div className="text-white/70 space-y-4">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Données de compte :</strong> durée de la relation commerciale + 3 ans</li>
                  <li><strong className="text-white">Données de facturation :</strong> 10 ans (obligation légale)</li>
                  <li><strong className="text-white">Données de formation :</strong> durée de l&apos;accès (12 mois) + 5 ans pour les certificats</li>
                  <li><strong className="text-white">Données de connexion :</strong> 1 an</li>
                  <li><strong className="text-white">Cookies :</strong> 13 mois maximum</li>
                </ul>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00FF88] mb-4">7. Vos droits</h2>
              <div className="text-white/70 space-y-4">
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
                  <li><strong className="text-white">Droit de rectification :</strong> corriger vos données inexactes</li>
                  <li><strong className="text-white">Droit à l&apos;effacement :</strong> demander la suppression de vos données</li>
                  <li><strong className="text-white">Droit à la limitation :</strong> limiter le traitement de vos données</li>
                  <li><strong className="text-white">Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                  <li><strong className="text-white">Droit d&apos;opposition :</strong> vous opposer au traitement de vos données</li>
                  <li><strong className="text-white">Droit de retrait du consentement :</strong> retirer votre consentement à tout moment</li>
                </ul>
                <p className="mt-4">Pour exercer ces droits, contactez : <strong className="text-white">dpo@formation-ia-act.fr</strong></p>
                <p>Vous pouvez également introduire une réclamation auprès de la CNIL : www.cnil.fr</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00FF88] mb-4">8. Cookies</h2>
              <div className="text-white/70 space-y-4">
                <p>Notre site utilise des cookies pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Cookies essentiels :</strong> fonctionnement du site, authentification</li>
                  <li><strong className="text-white">Cookies de performance :</strong> analyse d&apos;utilisation (avec consentement)</li>
                  <li><strong className="text-white">Cookies de préférence :</strong> mémorisation de vos choix</li>
                </ul>
                <p className="mt-4">Vous pouvez gérer vos préférences de cookies via le bandeau de consentement ou les paramètres de votre navigateur.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00FF88] mb-4">9. Sécurité</h2>
              <div className="text-white/70 space-y-4">
                <p>Nous mettons en œuvre les mesures suivantes pour protéger vos données :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Chiffrement SSL/TLS des communications</li>
                  <li>Hébergement sécurisé (Vercel, certifié SOC 2)</li>
                  <li>Paiements sécurisés via Stripe (certifié PCI-DSS)</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Mots de passe hashés</li>
                  <li>Sauvegardes régulières</li>
                </ul>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00FF88] mb-4">10. Transferts internationaux</h2>
              <div className="text-white/70 space-y-4">
                <p>Certaines de nos données peuvent être hébergées aux États-Unis (Vercel, Stripe). Ces transferts sont encadrés par :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Le Data Privacy Framework (DPF) UE-US</li>
                  <li>Les clauses contractuelles types de la Commission Européenne</li>
                </ul>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00FF88] mb-4">11. Contact</h2>
              <div className="text-white/70">
                <p>Pour toute question relative à cette politique ou à vos données personnelles :</p>
                <p className="mt-2"><strong className="text-white">Délégué à la Protection des Données (DPO)</strong></p>
                <p>Email : dpo@formation-ia-act.fr</p>
                <p>Adresse : 123 Avenue de l&apos;Innovation, 75001 Paris, France</p>
              </div>
            </section>

            <p className="text-white/40 text-sm text-center pt-8">
              Dernière mise à jour : Décembre 2025
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center text-white/30 text-sm">
          <p>© 2025 Formation-IA-Act.fr. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
