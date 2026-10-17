// The single source of truth for "what exists". Every item cites where in
// https://github.com/freehold-earth/freehold the state can be verified.
// Update an item's state here when it changes; every page follows.

export type StatusState = 'preview' | 'in-development' | 'planned';

export interface StatusItem {
  id: string;
  label: string;
  state: StatusState;
  /** Repo path, `tag:<name>`, or https URL proving the state. */
  source: string;
  /** Where a reader can see it, when it exists. */
  link?: string;
}

export const STATE_LABEL: Record<StatusState, string> = {
  preview: 'Developer preview',
  'in-development': 'In development',
  planned: 'Planned',
};

const TREE = 'https://github.com/freehold-earth/freehold/tree/main';

export const STATUS: readonly StatusItem[] = [
  {
    id: 'context-store',
    label: 'Encrypted local storage',
    state: 'preview',
    source: 'context-store/README.md',
    link: `${TREE}/context-store`,
  },
  {
    id: 'multi-device-sync',
    label: 'Sync between your devices',
    state: 'in-development',
    source: 'context-store/src/sync/crdt-sync.ts',
  },
  {
    id: 'agent',
    label: 'Personal AI agent',
    state: 'preview',
    source: 'agent/README.md',
    link: `${TREE}/agent`,
  },
  {
    id: 'bring-your-own-model',
    label: 'Choose your own open model',
    state: 'preview',
    source: 'agent/README.md',
    link: `${TREE}/agent`,
  },
  {
    id: 'local-models',
    label: 'Local model out of the box',
    state: 'in-development',
    source: 'docs/decisions/006-pci-agent-runtime-targets-and-mobile-story.md',
  },
  {
    id: 'spal-spec',
    label: 'A language for your privacy rules',
    state: 'preview',
    source: 'spec/README.md',
    link: `${TREE}/spec`,
  },
  {
    id: 'enforcement-contracts',
    label: 'Policy enforcement contracts',
    state: 'preview',
    source: 'contracts/README.md',
    link: `${TREE}/contracts`,
  },
  {
    id: 'zk-proofs',
    label: 'Zero-knowledge proof service',
    state: 'preview',
    source: 'zkp/README.md',
    link: `${TREE}/zkp`,
  },
  {
    id: 'identity-didkey',
    label: 'Self-owned identity (did:key)',
    state: 'preview',
    source: 'identity/README.md',
    link: `${TREE}/identity`,
  },
  {
    id: 'one-time-ids',
    label: 'One-time identities',
    state: 'preview',
    source: 'identity/src/did.ts',
    link: `${TREE}/identity`,
  },
  {
    id: 'authorisation-records',
    label: 'Prove it was you, when you choose',
    state: 'preview',
    source: 'identity/src/did.ts',
    link: `${TREE}/identity`,
  },
  {
    id: 'shielded-funding',
    label: 'Untraceable funding for one-time IDs',
    state: 'in-development',
    source: 'identity/src/funding.ts',
  },
  {
    id: 'link-proof',
    label: 'Prove it was you without revealing who you are',
    state: 'planned',
    source: 'docs/concepts/identity-privacy-model.md',
  },
  {
    id: 'identity-passport',
    label: 'Verified identity credentials',
    state: 'planned',
    source: 'docs/decisions/008-positioning-nightframes-passport.md',
  },
  {
    id: 'age-proof-demo',
    label: 'Age-proof demo',
    state: 'preview',
    source: 'demo/README.md',
    link: `${TREE}/demo`,
  },
  {
    id: 'one-click-install',
    label: 'One-click install',
    state: 'planned',
    source: 'docs/architecture/technical-appendix.md',
  },
  {
    id: 'phone-agent',
    label: 'Agent on your phone',
    state: 'planned',
    source: 'docs/decisions/006-pci-agent-runtime-targets-and-mobile-story.md',
  },
  {
    id: 'community-node-kit',
    label: 'Community node kit',
    state: 'planned',
    source: 'docs/concepts/manifesto.md',
  },
  {
    id: 'policy-templates',
    label: 'Ready-made privacy policies',
    state: 'planned',
    source: 'docs/concepts/manifesto.md',
  },
  {
    id: 'compute-locality',
    label: 'Rules for where your data is processed',
    state: 'planned',
    source: 'docs/decisions/008-positioning-nightframes-passport.md',
  },
];

export function getStatus(id: string): StatusItem {
  const item = STATUS.find((s) => s.id === id);
  if (!item) throw new Error(`Unknown status id: ${id}`);
  return item;
}

export function byState(state: StatusState): StatusItem[] {
  return STATUS.filter((s) => s.state === state);
}
