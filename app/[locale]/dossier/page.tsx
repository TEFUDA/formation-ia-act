'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ComplianceDossier from '@/components/formation/ComplianceDossier';

function DossierContent() {
  const router = useRouter();

  const handleNavigateToWorkshop = (workshopId: string) => {
    // Navigate to formation page with the specific exercise
    router.push(`/formation?video=${workshopId}`);
  };

  return (
    <ComplianceDossier 
      moduleColor="#00F5FF"
      onNavigateToWorkshop={handleNavigateToWorkshop}
    />
  );
}

export default function DossierPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a15] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">📁</div>
          <p className="text-white/60">Chargement du dossier...</p>
        </div>
      </div>
    }>
      <DossierContent />
    </Suspense>
  );
}
