export type Money = string; // canonical nonnegative integer cents at external boundaries
export type Role = 'manager' | 'agent' | 'alpha' | 'beta' | 'gamma' | 'worker' | 'issuer' | 'outsider';
export type Scenario = 'funded' | 'insufficient' | 'draw-boundary';
export type Ref = string;

export type Scope = {
  runId: string;
  fundId: string;
  facilityId: string;
  investmentId: string;
  policyVersion: string;
  assetId: string;
  issuer: string;
};

export type PositionRef = { lp: string; gate: Ref; position: Ref };

export type FacilitySnapshot = {
  scope: Scope;
  version: string;
  principal: Money;
  borrowingBase: Money;
  creditLimit: Money;
  headroom: string; // signed integer cents
  available: Money;
  deficiency: Money;
  processing: 'Current' | 'EligibilityUpdatePending' | 'Paused';
};

export type Receipt = {
  updateId: string;
  commandId: string;
  committedAt: string;
  created: Ref[];
  archived: Ref[];
};

export type Outcome =
  | { status: 'committed'; receipt: Receipt }
  | { status: 'rejected'; code: string }
  | { status: 'unknown'; commandId: string };
