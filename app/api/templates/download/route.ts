// app/api/templates/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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
  const file = searchParams.get('file');

  // MODE TEST: Token désactivé (remettre en prod)
// if (!token) {
//   return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
// }

  const templates = TEMPLATES_BY_PACK[pack] || TEMPLATES_BY_PACK.complet;

  if (file) {
    if (!templates.includes(file)) {
      return NextResponse.json({ error: 'Fichier non autorisé' }, { status: 403 });
    }

    try {
      const filePath = path.join(process.cwd(), 'public', 'resources', file);
      const fileBuffer = await fs.readFile(filePath);
      
      const ext = path.extname(file).toLowerCase();
      const contentTypes: Record<string, string> = {
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.pdf': 'application/pdf',
      };

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentTypes[ext] || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${file}"`,
        },
      });
    } catch {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://formation-ia-act.fr';
  
  const downloadLinks = templates.map(template => ({
    name: template,
    url: `${baseUrl}/api/templates/download?pack=${pack}&token=${token}&file=${encodeURIComponent(template)}`,
  }));

  return NextResponse.json({
    pack,
    totalFiles: templates.length,
    files: downloadLinks,
  });
}
