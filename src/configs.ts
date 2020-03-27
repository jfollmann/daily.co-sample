import { config as dotEnvConfig } from "dotenv";

interface Settings {
  apiUrl: string;
  port: string;
  token: string;
  teamUrl: string;
}

class Configs {
  settings: Settings

  constructor() {
    dotEnvConfig();

    this.settings = {
      apiUrl: process.env.API_URL || "https://api.daily.co/v1/",
      port: process.env.PORT || "3000",
      teamUrl: process.env.TEAM_URL || "",
      token: process.env.TOKEN || ""
    };
  }
}

export const settings = new Configs().settings;
