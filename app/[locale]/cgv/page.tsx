'use client';

import Link from 'next/link';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-[#030014] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#030014]" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00F5FF]/5 blur-[120px] rounded-full" />
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
          <h1 className="text-4xl font-bold mb-4">Conditions Générales de Vente</h1>
          <p className="text-white/60 mb-8">Applicables aux formations professionnelles</p>
          
          <div className="prose prose-invert prose-lg max-w-none space-y-8">
            
            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">Article 1 - Objet et champ d&apos;application</h2>
              <div className="text-white/70 space-y-4">
                <p>Les présentes Conditions Générales de Vente (CGV) s&apos;appliquent à toutes les formations professionnelles proposées par Formation IA Act SAS, organisme de formation certifié Qualiopi.</p>
                <p>Toute commande implique l&apos;acceptation sans réserve des présentes CGV.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">Article 2 - Formations proposées</h2>
              <div className="text-white/70 space-y-4">
                <p>Formation IA Act SAS propose des formations en ligne sur la conformité AI Act européen comprenant :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Modules de formation vidéo</li>
                  <li>Templates et documents juridiques</li>
                  <li>Outils d&apos;audit de conformité</li>
                  <li>Certificats de formation</li>
                  <li>Support et accompagnement</li>
                </ul>
                <p>Le contenu détaillé est disponible sur le site formation-ia-act.fr.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">Article 3 - Tarifs et paiement</h2>
              <div className="text-white/70 space-y-4">
                <p><strong className="text-white">3.1 Prix</strong></p>
                <p>Les prix sont indiqués en euros hors taxes (HT). La TVA applicable (20%) sera ajoutée au moment du paiement.</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pack Solo (1 personne) : 4 990€ HT</li>
                  <li>Pack Équipe (jusqu&apos;à 5 personnes) : 9 990€ HT</li>
                  <li>Pack Entreprise (+5 personnes) : Sur devis</li>
                  <li>Pack Entreprise (50 personnes) : Sur devis</li>
                </ul>
                
                <p className="mt-4"><strong className="text-white">3.2 Modalités de paiement</strong></p>
                <p>Le paiement s&apos;effectue par carte bancaire via notre prestataire sécurisé Stripe, ou par virement bancaire pour les entreprises.</p>
                
                <p className="mt-4"><strong className="text-white">3.3 Financement OPCO</strong></p>
                <p>En tant qu&apos;organisme certifié Qualiopi, nos formations sont éligibles au financement par les OPCO. Nous accompagnons nos clients dans leurs démarches de prise en charge.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">Article 4 - Inscription et accès</h2>
              <div className="text-white/70 space-y-4">
                <p><strong className="text-white">4.1 Inscription</strong></p>
                <p>L&apos;inscription est effective dès réception du paiement complet ou de l&apos;accord de prise en charge OPCO.</p>
                
                <p className="mt-4"><strong className="text-white">4.2 Accès à la plateforme</strong></p>
                <p>L&apos;accès aux contenus de formation est accordé pour une durée de 12 mois à compter de l&apos;inscription. Les identifiants de connexion sont personnels et ne peuvent être partagés.</p>
                
                <p className="mt-4"><strong className="text-white">4.3 Prérequis techniques</strong></p>
                <p>L&apos;apprenant doit disposer d&apos;un ordinateur ou tablette avec connexion internet et navigateur web à jour.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">Article 5 - Droit de rétractation et garantie</h2>
              <div className="text-white/70 space-y-4">
                <p><strong className="text-white">5.1 Droit de rétractation légal</strong></p>
                <p>Conformément à l&apos;article L221-18 du Code de la consommation, vous disposez d&apos;un délai de 14 jours à compter de la conclusion du contrat pour exercer votre droit de rétractation, sans avoir à justifier de motifs.</p>
                
                <p className="mt-4"><strong className="text-white">5.2 Garantie "Satisfait ou Remboursé"</strong></p>
                <p>Au-delà du délai légal, nous offrons une garantie de 30 jours. Si vous n&apos;êtes pas satisfait de la formation, vous pouvez demander un remboursement intégral dans les 30 jours suivant l&apos;inscription.</p>
                
                <p className="mt-4"><strong className="text-white">5.3 Modalités de remboursement</strong></p>
                <p>Pour exercer ce droit, envoyez un email à contact@formation-ia-act.fr. Le remboursement sera effectué dans un délai de 14 jours sur le moyen de paiement utilisé lors de l&apos;achat.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">Article 6 - Certificat de formation</h2>
              <div className="text-white/70 space-y-4">
                <p>À l&apos;issue de la formation et après validation du quiz final (score minimum de 70%), un certificat de formation nominatif est délivré.</p>
                <p>Ce certificat atteste de la formation suivie conformément à l&apos;Article 4 de l&apos;AI Act européen (Règlement UE 2024/1689).</p>
                <p>Le certificat comporte un QR code permettant sa vérification en ligne.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">Article 7 - Propriété intellectuelle</h2>
              <div className="text-white/70 space-y-4">
                <p>L&apos;ensemble des contenus de formation (vidéos, documents, templates, quiz) sont protégés par le droit d&apos;auteur et restent la propriété exclusive de Formation IA Act SAS.</p>
                <p>L&apos;accès à la formation confère un droit d&apos;utilisation personnel et non-exclusif. Toute reproduction, diffusion ou revente des contenus est strictement interdite.</p>
                <p><strong className="text-white">Exception :</strong> Les templates fournis peuvent être utilisés, modifiés et adaptés dans le cadre professionnel du client.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">Article 8 - Responsabilité</h2>
              <div className="text-white/70 space-y-4">
                <p>Formation IA Act SAS s&apos;engage à fournir des contenus de qualité et à jour. Toutefois, la formation a un caractère informatif et pédagogique.</p>
                <p>Elle ne constitue pas un conseil juridique personnalisé. Pour des situations spécifiques, nous recommandons de consulter un professionnel du droit.</p>
                <p>Formation IA Act SAS ne pourra être tenue responsable des décisions prises par les apprenants sur la base des informations fournies.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">Article 9 - Protection des données</h2>
              <div className="text-white/70 space-y-4">
                <p>Les données personnelles collectées sont traitées conformément à notre Politique de Confidentialité et au RGPD.</p>
                <p>Pour plus d&apos;informations, consultez notre <Link href="/confidentialite" className="text-[#00F5FF] hover:underline">Politique de Confidentialité</Link>.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">Article 10 - Réclamations et médiation</h2>
              <div className="text-white/70 space-y-4">
                <p><strong className="text-white">10.1 Réclamations</strong></p>
                <p>Toute réclamation doit être adressée à : contact@formation-ia-act.fr</p>
                <p>Nous nous engageons à répondre dans un délai de 48 heures ouvrées.</p>
                
                <p className="mt-4"><strong className="text-white">10.2 Médiation</strong></p>
                <p>En cas de litige non résolu, vous pouvez recourir gratuitement au médiateur de la consommation : [Nom du médiateur] - www.mediateur.fr</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">Article 11 - Droit applicable</h2>
              <div className="text-white/70">
                <p>Les présentes CGV sont soumises au droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux de Paris seront seuls compétents.</p>
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
