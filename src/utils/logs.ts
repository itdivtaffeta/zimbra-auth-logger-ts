import { IAttempt, ILog } from "../types/log";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const prettify = (rawLog: string) => {
  const splitLog = rawLog
    ?.split(
      "------------------------------------------------------------------------------------------------------------"
    )
    ?.filter((log) => {
      // filter if log contain "login attempts!"
      const regex = /login attempts!/g;
      return regex.test(log);
    });

  const results: ILog[] = [];

  splitLog.forEach((log) => {
    const matchEmail = log.match(/(\S+@\S+\.\S+)/gm);
    if (!matchEmail) return;
    const email = matchEmail[0];
    const ips = log.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/gm);

    if (!ips) return;

    const matchLoginAttempts = log.match(
      /Logins from IP \[\s*\d+\]\s+\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\s+using\s+\w+/gm
    );

    if (!matchLoginAttempts) return;

    const loginAttempts = matchLoginAttempts?.map((item) => {
      const matchAttempt = item.match(/Logins from IP \[\s*(\d+)\]\s+/gm);

      if (!matchAttempt) return;
      const matchAttempt2 = matchAttempt[0].match(/(\d+)/gm);
      if (!matchAttempt2) return;
      const attempt = matchAttempt2[0];

      const ip = item
        ?.replace(/Logins from IP \[\s*\d+\]\s+/gm, "")
        ?.replace(/using\s+\w+/gm, "")
        ?.trim();

      const matchMethod = item?.match(/using\s+(\w+)/gm);
      if (!matchMethod) return;
      const matchMethod2 = matchMethod[0].match(/(\w+)/gm);
      if (!matchMethod2) return;
      const method = matchMethod2[1];

      const numberAttempt = Number(attempt);

      return {
        count: numberAttempt,
        ip,
        method,
      };
    });

    const filteredLoginAttempts: IAttempt[] = loginAttempts.filter(
      (attempt): attempt is IAttempt => Boolean(attempt)
    );

    const matchFailedLoginAttempt = log.match(
      /(\d+)\sfailed\sof\stotal\s(\d+)\s+login\sattempts!/gm
    );
    if (!matchFailedLoginAttempt) return;
    const matchFailedLoginAttempt2 =
      matchFailedLoginAttempt[0].match(/(\d+)/gm);
    if (!matchFailedLoginAttempt2) return;
    const failedLoginAttempt = matchFailedLoginAttempt2[0];

    const matchTotalLoginAttempt = matchFailedLoginAttempt[0].match(/(\d+)/gm);
    if (!matchTotalLoginAttempt) return;

    const totalLoginAttempt = matchTotalLoginAttempt[1];

    const numberTotalLoginAttempt = Number(totalLoginAttempt);
    const numberFailedLoginAttempt = Number(failedLoginAttempt);

    results.push({
      email,
      ips,
      attempts: filteredLoginAttempts,
      failedLoginAttempt: numberFailedLoginAttempt,
      total: numberTotalLoginAttempt,
    });
  });

  return results as ILog[];
};

const getPrettyLogs = async () => {
  let rawLog;

  try {
    const { stdout, stderr } = await exec("perl ./scripts/login_checkers.pl", {
      // maxBuffer 2 GB
      maxBuffer: 2 * 1024 * 1024 * 1024,
    });

    if (stderr) {
      console.error("stderr : ", stderr);
      throw new Error("failed to execute attack.pl");
    }

    rawLog = stdout;
  } catch (error) {
    console.error(error);
    throw new Error("failed to execute attack.pl");
  }

  try {
    return prettify(rawLog);
  } catch (error) {
    console.error(error);
    throw new Error("failed to prettify log");
  }
};

export default getPrettyLogs;
