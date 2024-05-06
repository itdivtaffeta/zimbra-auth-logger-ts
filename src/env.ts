interface IEnv {
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
  EMAIL_FROM: string;
  EMAIL_TO: string;
  EMAIL_USE_AUTH: boolean;
  CRON_SCHEDULE: string;
  [key: string]: string | number | Boolean | undefined;
}

const env: IEnv = {
  EMAIL_HOST: process.env.EMAIL_HOST!,
  EMAIL_PORT: Number(process.env.EMAIL_PORT || 587),
  EMAIL_USERNAME: process.env.EMAIL_USERNAME!,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!,
  EMAIL_FROM: process.env.EMAIL_FROM!,
  EMAIL_TO: process.env.EMAIL_TO!,
  EMAIL_USE_AUTH: process.env.EMAIL_USE_AUTH?.toLowerCase() === "true",
  CRON_SCHEDULE: process.env.CRON_SCHEDULE!,
};

const checkEnvValue = () => {
  for (const key in env) {
    if (!env[key]) {
      throw new Error(`Missing env var: ${key}`);
    }
  }
};

export const checkEnv = async () => {
  checkEnvValue();
};

export default env;
