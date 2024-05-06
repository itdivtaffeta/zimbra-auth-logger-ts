export interface IAttempt {
  count: number;
  ip: string;
  method: string;
  country?: string;
}

export interface ILog {
  email: string;
  ips: string[];
  attempts: IAttempt[];
  total: number;
  failedLoginAttempt: number;
}
