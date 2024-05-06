import { ILog } from "../types/log";
import { ChartConfiguration } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const generateChart = async (logs: ILog[]) => {
  const data = logs
    .map((item) => {
      return {
        email: item?.email,
        values: item?.failedLoginAttempt,
      };
    })
    ?.sort((a, b) => {
      return b?.values - a?.values;
    })
    ?.slice(0, 10);

  const canvasRenderService = new ChartJSNodeCanvas({
    width: 650,
    height: 550,
    backgroundColour: "white",
  });

  const configuration: ChartConfiguration<"bar", number[], unknown> = {
    type: "bar",
    data: {
      labels: data.map((item) => item?.email),
      datasets: [
        {
          label: "Failed Login Attempt",
          data: data.map((item) => item?.values),
          backgroundColor: "#156891",
        },
      ],
    },
  };

  return await canvasRenderService.renderToBuffer(configuration);
};

export default generateChart;
