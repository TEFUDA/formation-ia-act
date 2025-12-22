'use client';

import Link from 'next/link';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#030014] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#030014]" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#8B5CF6]/5 blur-[120px] rounded-full" />
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
          <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>
          
          <div className="prose prose-invert prose-lg max-w-none space-y-8">
            
            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">1. Éditeur du site</h2>
              <div className="text-white/70 space-y-2">
                <p><strong className="text-white">Raison sociale :</strong> Formation IA Act SAS</p>
                <p><strong className="text-white">Forme juridique :</strong> Société par Actions Simplifiée (SAS)</p>
                <p><strong className="text-white">Capital social :</strong> 10 000 €</p>
                <p><strong className="text-white">Siège social :</strong> 123 Avenue de l&apos;Innovation, 75001 Paris, France</p>
                <p><strong className="text-white">SIRET :</strong> 123 456 789 00012</p>
                <p><strong className="text-white">RCS :</strong> Paris B 123 456 789</p>
                <p><strong className="text-white">N° TVA intracommunautaire :</strong> FR12 123456789</p>
                <p><strong className="text-white">N° de déclaration d&apos;activité :</strong> 11 75 12345 75 (préfecture de Paris)</p>
                <p><strong className="text-white">Certification Qualiopi :</strong> N° 2024/12345-1</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">2. Directeur de la publication</h2>
              <div className="text-white/70">
                <p><strong className="text-white">Nom :</strong> [Nom du dirigeant]</p>
                <p><strong className="text-white">Qualité :</strong> Président</p>
                <p><strong className="text-white">Email :</strong> contact@formation-ia-act.fr</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">3. Hébergement</h2>
              <div className="text-white/70">
                <p><strong className="text-white">Hébergeur :</strong> Vercel Inc.</p>
                <p><strong className="text-white">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                <p><strong className="text-white">Site web :</strong> https://vercel.com</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">4. Propriété intellectuelle</h2>
              <div className="text-white/70 space-y-4">
                <p>L&apos;ensemble du contenu du site Formation-IA-Act.fr (textes, images, vidéos, logos, icônes, sons, logiciels, etc.) est protégé par le droit d&apos;auteur et le droit des marques.</p>
                <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Formation IA Act SAS.</p>
                <p>Les marques et logos reproduits sur le site sont déposés par les sociétés qui en sont propriétaires.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">5. Responsabilité</h2>
              <div className="text-white/70 space-y-4">
                <p>Formation IA Act SAS s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, elle ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à disposition.</p>
                <p>En conséquence, l&apos;utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.</p>
                <p>Formation IA Act SAS ne pourra être tenue responsable des dommages directs ou indirects résultant de l&apos;accès ou de l&apos;utilisation du site.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">6. Liens hypertextes</h2>
              <div className="text-white/70 space-y-4">
                <p>Le site peut contenir des liens hypertextes vers d&apos;autres sites. Formation IA Act SAS n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">7. Droit applicable</h2>
              <div className="text-white/70">
                <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
              </div>
            </section>

            <section className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-[#00F5FF] mb-4">8. Contact</h2>
              <div className="text-white/70">
                <p>Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :</p>
                <p className="mt-2"><strong className="text-white">Email :</strong> contact@formation-ia-act.fr</p>
                <p><strong className="text-white">Adresse :</strong> 123 Avenue de l&apos;Innovation, 75001 Paris, France</p>
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
