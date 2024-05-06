import fs from "fs";
import ip from "ip";

const getIPAddresses = () => {
  const niceRSC = fs.readFileSync("./scripts/nice.rsc.txt", "utf-8");

  const IPs = niceRSC
    ?.split("\n")
    ?.filter((ip) => {
      const regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d+/g;
      return regex.test(ip);
    })
    ?.map((ip) => {
      // return ip?.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g)[0];

      const regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d+/g;
      const match = ip.match(regex);
      if (!match) return "";
      return match[0];
    })
    .filter((ip) => ip);

  return IPs;
};

const getCountryIp = (ipAddress: string, indonesiaIps: string[]) => {
  for (const network of indonesiaIps) {
    if (ip.cidrSubnet(network).contains(ipAddress)) {
      return "Indonesia";
    }
  }

  return "Other Country";
};

export { getIPAddresses, getCountryIp };
