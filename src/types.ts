export const DATABASE_STRATEGY = 'database_strategy';
export const ORM_STRATEGY = 'orm_strategy';
export const POSTGRES_URL = 'postgres_url';
export const MONGO_URL = 'mongo_url';
export const SQLITE_URL = 'sqlite_url';

export enum EUserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  FIELD_REP = 'FIELD_REP',
}

export enum EOrganizationStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

export enum ESubscriptionStatus {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
}

export enum EPaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  VERIFIED = 'VERIFIED',
  REFUNDED = 'REFUNDED',
}

export enum ESaleStatus {
  DRAFT = 'DRAFT',
  SYNCED = 'SYNCED', // Crucial for your Offline Sync requirement
  CANCELLED = 'CANCELLED',
}

export enum EDatabaseStrategy {
  POSTGRES = 'postgres',
  SQLITE = 'sqlite',
  MONGO = 'mongo',
}

export enum EOrmStrategy {
  DRIZZLE = 'DRIZZLE',
  PRISMA = 'PRISMA',
}
