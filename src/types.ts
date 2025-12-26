// export const DATABASE_STRATEGY = 'database_strategy';
// export const ORM_STRATEGY = 'orm_strategy';
// export const POSTGRES_URL = 'postgres_url';
// export const MONGO_URL = 'mongo_url';
// export const SQLITE_URL = 'sqlite_url';

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

export enum EAccountStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
  UNVERIFIED = 'unverified',
}

export enum ELoggerStrategy {
  CONSOLE = 'console',
  WINSTON = 'winston',
  PINO = 'pino',
}

export enum EEnvVars {
  NODE_ENV = 'NODE_ENV',
  POSTGRES_URL = 'POSTGRES_URL',
  SQLITE_URL = 'SQLITE_URL',
  DATABASE_STRATEGY = 'DATABASE_STRATEGY',
  ORM_STRATEGY = 'ORM_STRATEGY',
  POSTGRES_USERNAME = 'POSTGREST_USERNAME',
  POSTGRES_PASSWORD = 'POSTGRES_PASSWORD',
  PADDLE_PRODUCTION_API_KEY = 'PADDLE_PRODUCTION_API_KEY',
  PADDLE_DEVELOPMENT_API_KEY = 'PADDLE_DEVELOPMENT_API_KEY',
}

export enum ENodeEnv {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
}

export enum EDatabaseStrategy {
  POSTGRES = 'POSTGRES',
  SQLITE = 'SQLITE',
}

export enum EOrmStrategy {
  DRIZZLE = 'DRIZZLE',
}
