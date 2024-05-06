import { CronJob } from "cron";
import "dotenv/config";
import env, { checkEnv } from "./env";
import handleLogs from "./handleLogs";
import logger from "./utils/logger";

(async () => {
  try {
    await checkEnv();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  logger.info("App started");
  const job = new CronJob(
    env.CRON_SCHEDULE,
    async () => {
      await handleLogs();
    },
    null,
    true,
    "Asia/Jakarta"
  );

  job.start();
})();
