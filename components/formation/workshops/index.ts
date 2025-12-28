// Workshop Components Index
// Each workshop is an interactive exercise that helps students build their AI Act documentation

export { default as DiagnosticWorkshop } from './DiagnosticWorkshop';
export { default as InventoryWorkshop } from './InventoryWorkshop';
export { default as RegistryBuilder } from './RegistryBuilder';
export { default as ClassificationWorkshop } from './ClassificationWorkshop';
export { default as EmailGeneratorWorkshop } from './EmailGeneratorWorkshop';
export { default as PolicyGeneratorWorkshop } from './PolicyGeneratorWorkshop';
export { default as ActionPlanWorkshop } from './ActionPlanWorkshop';

// Workshop mapping by exercise ID
export const WORKSHOP_MAP: Record<string, string> = {
  // Module 1 - Diagnostic
  '1.2': 'DiagnosticWorkshop',
  
  // Module 2 - Cartographie
  '2.2': 'InventoryWorkshop',
  '2.4': 'RegistryBuilder',
  
  // Module 3 - Classification
  '3.2': 'ClassificationWorkshop',
  
  // Module 4 - Documentation
  '4.2': 'EmailGeneratorWorkshop',
  
  // Module 5 - Gouvernance
  '5.2': 'PolicyGeneratorWorkshop',
  '5.4': 'LegalMentionsGenerator', // Existing component
  
  // Module 6 - Audit
  '6.2': 'AuditSimulation', // Existing component
  
  // Module 7 - Plan d'action
  '7.2': 'ActionPlanWorkshop',
};

// Workshop data flow - shows how data is passed between workshops
export const WORKSHOP_DATA_FLOW = {
  // M1.2 Diagnostic creates company profile
  DiagnosticWorkshop: {
    outputs: ['workshop_company_profile', 'workshop_diagnostic'],
  },
  
  // M2.2 Inventory creates list of AI systems
  InventoryWorkshop: {
    outputs: ['workshop_ai_inventory'],
  },
  
  // M2.4 Registry imports from inventory and adds compliance data
  RegistryBuilder: {
    inputs: ['workshop_ai_inventory', 'workshop_company_profile'],
    outputs: ['workshop_ai_registry'],
  },
  
  // M3.2 Classification imports from registry and classifies risks
  ClassificationWorkshop: {
    inputs: ['workshop_ai_registry', 'workshop_ai_inventory'],
    outputs: ['workshop_classification_results'],
  },
  
  // M4.2 Email Generator uses registry data to create vendor emails
  EmailGeneratorWorkshop: {
    inputs: ['workshop_ai_registry', 'workshop_classification_results'],
    outputs: ['workshop_vendor_emails'],
  },
  
  // M5.2 Policy Generator uses company profile
  PolicyGeneratorWorkshop: {
    inputs: ['workshop_company_profile'],
    outputs: ['workshop_policy_data'],
  },
  
  // M7.2 Action Plan uses all previous data
  ActionPlanWorkshop: {
    inputs: ['workshop_company_profile', 'workshop_classification_results'],
    outputs: ['workshop_action_plan'],
  },
};

// Helper to check if a workshop has prerequisites met
export const checkPrerequisites = (workshopId: string): { met: boolean; missing: string[] } => {
  const workshopName = WORKSHOP_MAP[workshopId];
  if (!workshopName) return { met: true, missing: [] };
  
  const flow = WORKSHOP_DATA_FLOW[workshopName as keyof typeof WORKSHOP_DATA_FLOW];
  if (!flow || !('inputs' in flow)) return { met: true, missing: [] };
  
  const missing: string[] = [];
  
  if (typeof window !== 'undefined') {
    (flow.inputs as string[]).forEach(key => {
      const data = localStorage.getItem(key);
      if (!data) {
        missing.push(key);
      }
    });
  }
  
  return { met: missing.length === 0, missing };
};

// Get user progress across all workshops
export const getWorkshopProgress = () => {
  if (typeof window === 'undefined') return {};
  
  const progress: Record<string, { completed: boolean; data: any }> = {};
  
  Object.values(WORKSHOP_DATA_FLOW).forEach((flow) => {
    (flow.outputs || []).forEach(key => {
      const data = localStorage.getItem(key);
      progress[key] = {
        completed: !!data,
        data: data ? JSON.parse(data) : null,
      };
    });
  });
  
  return progress;
};
