// app/api/templates/download/route.ts
// Génère et télécharge le ZIP des templates

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import archiver from 'archiver';
import { Readable } from 'stream';

// Templates par pack
const TEMPLATES_BY_PACK: Record<string, string[]> = {
  essentiel: [
    'template-registre-ia.xlsx',
    'modele-politique-ia.docx',
    'matrice-classification-risques.xlsx',
    'checklist-etes-vous-concerne.xlsx',
    'template-documentation-technique.docx',
    'fiche-poste-referent-ia.docx',
  ],
  complet: [
    'template-registre-ia.xlsx',
    'modele-politique-ia.docx',
    'matrice-classification-risques.xlsx',
    'checklist-etes-vous-concerne.xlsx',
    'template-documentation-technique.docx',
    'fiche-poste-referent-ia.docx',
    'guide-ai-act-synthese.pdf',
    'plan-audit-type.xlsx',
    'tableau-bord-conformite-ia.xlsx',
    'guide-audit-pas-a-pas.pdf',
    'checklist-marquage-ce.xlsx',
    'exemples-secteurs-activite.pdf',
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pack = searchParams.get('pack') || 'complet';
  const token = searchParams.get('token');

  // Vérification basique du token (à améliorer avec une vraie validation)
  if (!token) {
    return NextResponse.json(
      { error: 'Token manquant' },
      { status: 401 }
    );
  }

  const templates = TEMPLATES_BY_PACK[pack] || TEMPLATES_BY_PACK.complet;
  const resourcesDir = path.join(process.cwd(), 'public', 'resources');

  try {
    // Créer le ZIP en mémoire
    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks: Buffer[] = [];

    // Collecter les chunks
    archive.on('data', (chunk: Buffer) => chunks.push(chunk));

    // Promesse pour attendre la fin
    const zipPromise = new Promise<Buffer>((resolve, reject) => {
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', reject);
    });

    // Ajouter les fichiers au ZIP
    for (const template of templates) {
      const filePath = path.join(resourcesDir, template);
      try {
        await fs.access(filePath);
        archive.file(filePath, { name: template });
      } catch {
        console.warn(`Template not found: ${template}`);
      }
    }

    // Ajouter un README
    const readme = `
# Pack Templates AI Act - ${pack === 'essentiel' ? 'Essentiel' : 'Complet'}

Merci pour votre achat !

## Contenu du pack (${templates.length} templates)

${templates.map((t, i) => `${i + 1}. ${t}`).join('\n')}

## Comment utiliser ces templates

1. **Registre IA** : Listez tous les systèmes d'IA utilisés dans votre organisation
2. **Politique IA** : Personnalisez avec votre logo et vos règles internes
3. **Matrice de risques** : Classifiez chaque système selon les 4 niveaux AI Act
4. **Documentation technique** : À remplir pour chaque système à haut risque

## Besoin d'aide ?

- Support : support@formation-ia-act.fr
- Formation : https://formation-ia-act.fr/pricing
- Audit : https://formation-ia-act.fr/audit

## Remboursement OPCO

Ces templates peuvent être remboursés par votre OPCO s'ils sont associés 
à notre formation certifiée Qualiopi. Contactez-nous pour plus d'infos.

---
© 2024 Formation-IA-Act.fr - Tous droits réservés
`;

    archive.append(readme, { name: 'README.txt' });

    // Finaliser le ZIP
    archive.finalize();

    // Attendre la fin de la création
    const zipBuffer = await zipPromise;

    // Retourner le fichier ZIP
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="pack-templates-ai-act-${pack}.zip"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error creating ZIP:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du fichier' },
      { status: 500 }
    );
  }
}
