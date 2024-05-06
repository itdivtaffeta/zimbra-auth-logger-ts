import XLSX from "xlsx";
import { ILog } from "../types/log";

const createXlsx = (logs: ILog[]) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(
    logs
      ?.map((log) => {
        return log?.attempts?.map((attempt) => {
          return {
            email: log?.email,
            ip: attempt?.ip,
            country: attempt?.country,
            attempt: attempt?.count,
            method: attempt?.method,
          };
        });
      })
      ?.flat()
      ?.sort((a, b) => {
        return b?.attempt - a?.attempt;
      })
  );
  const ws2 = XLSX.utils.json_to_sheet(
    logs
      ?.map((log) => {
        return {
          email: log?.email,
          failedLoginAttempt: log?.failedLoginAttempt,
          total: log?.total,
        };
      })
      ?.sort((a, b) => {
        return b?.failedLoginAttempt - a?.failedLoginAttempt;
      })
  );
  XLSX.utils.book_append_sheet(wb, ws, "Login Attempts");
  XLSX.utils.book_append_sheet(wb, ws2, "Summary");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
};

export default createXlsx;
