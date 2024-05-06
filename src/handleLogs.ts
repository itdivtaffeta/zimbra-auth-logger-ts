import getPrettyLogs from "./utils/logs";
import createXlsx from "./utils/excel";
import generateChart from "./utils/chart";
import sendEmail from "./utils/email";
import { getCountryIp, getIPAddresses } from "./utils/ipAddress";
import { ILog } from "./types/log";
import logger from "./utils/logger";

const handleLogs = async () => {
  logger.info("Job started");
  let log: ILog[] = [];
  try {
    log = await getPrettyLogs();
  } catch (error) {
    logger.error("failed to parse logs", error);
    return;
  }

  //   get indonesian ips
  let indonesianIPs: string[] = [];
  try {
    indonesianIPs = getIPAddresses();
  } catch (error) {
    logger.error("failed to get indonesian ips", error);
    return;
  }

  try {
    // delete duplicate ip
    const ips = log.map((item) => item?.ips).flat();
    const uniqueIps = [...new Set(ips)];

    // get country ip
    const ipCountry = new Map<string, string>();
    for (const ip of uniqueIps) {
      const country = getCountryIp(ip, indonesianIPs);
      ipCountry.set(ip, country);
    }

    // set country to attempts
    for (const item of log) {
      for (const attempt of item.attempts) {
        attempt.country = ipCountry.get(attempt.ip);
      }
    }
  } catch (error) {
    logger.error("failed to get country ip", error);
    return;
  }

  let excel;
  try {
    excel = await createXlsx(log);
  } catch (error) {
    logger.error("failed to create xlsx", error);
    return;
  }

  let chart;
  try {
    chart = await generateChart(log);
  } catch (error) {
    logger.error("failed to create chart", error);
    return;
  }

  try {
    const info = await sendEmail({
      logs: log,
      xlsx: excel,
      chart,
    });
    // console.log(info);
    // logger.info("Email sent", info.response);
  } catch (error) {
    logger.error("failed to send email", error);

    return;
  }

  logger.info("Job finished");
};

export default handleLogs;
