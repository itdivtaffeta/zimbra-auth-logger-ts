import nodemailer from "nodemailer";
import { ILog } from "../types/log";
import env from "../env";

interface IConfig {
  host: string;
  port: number;
  secure: boolean;
  tls: {
    rejectUnauthorized: boolean;
  };
  debug: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

const sendEmail = async ({
  logs,
  xlsx,
  chart,
}: {
  logs: ILog[];
  xlsx: Buffer;
  chart: Buffer;
}) => {
  const config: IConfig = {
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
    debug: false,
  };

  if (env.EMAIL_USE_AUTH) {
    config.auth = {
      user: env.EMAIL_USERNAME,
      pass: env.EMAIL_PASSWORD,
    };
  }

  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "Alert: Brute Force Attack - Zimbra Cloud Taffeta",
    text: "Hello, Team. Berikut adalah IP Address yang mencoba melakukan brute force ke server Zimbra Cloud Taffeta. Mohon pastikan jika ada indikasi brute force. Dan segera blokir di Firewall Anda.",
    html: `<html>
    <body>
        <p>Hello, Team</p>
        <p>Berikut adalah IP Address yang mencoba melakukan brute force ke server Zimbra Cloud Taffeta.
        <p>Mohon pastikan jika ada indikasi brute force. <b>Dan segera blokir di Firewall Anda.</b> </p>
        <br/>
        <img src="cid:chart" alt="chart"/>
        <br/>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>IP Address</th>
              <th>Country</th>
              <th>Attempt</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
          ${logs
            .flatMap((item) =>
              item.attempts.map((attempt) => ({ ...item, attempt }))
            )
            .sort((a, b) => b.attempt.count - a.attempt.count)
            .map(
              (item) => `
                <tr>
                  <td>${item.email}</td>
                  <td>${item.attempt.ip}</td>
                  <td>${item.attempt.country}</td>
                  <td>${item.attempt.count}</td>
                  <td>${item.attempt.method}</td>
                </tr>
              `
            )
            // ?.slice(0, 10)
            ?.join("")}
          </tbody>
        </table>
        <p>Regards,</p>
        <p>IT Administrator</p>
    </body>
</html>`,
    attachments: [
      {
        filename: `bruteforce-${new Date().toISOString().split("T")[0]}.xlsx`,
        content: xlsx,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      {
        filename: "chart.png",
        content: chart,
        contentType: "image/png",
        cid: "chart",
      },
    ],
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmail;
