export interface Payload {
  sub: string;
  email: string;
  timestamp: string;
}

export const MfaStatus = {
  ENABLE: 'enable',
  DISABLE: 'disable',
} as const;

export type MfaStatus = (typeof MfaStatus)[keyof typeof MfaStatus];
