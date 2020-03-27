import { config as dotEnvConfig } from "dotenv";

interface Settings {
  apiUrl: string;
  token: string;
  teamUrl: string;
}

class Configs {

  settings: Settings

  constructor() {
    dotEnvConfig();

    this.settings = {
      apiUrl: process.env.API_URL || "https://api.daily.co/v1/",
      teamUrl: process.env.TEAM_URL || "https://mpnsaude.daily.co/",
      token: process.env.TOKEN || ""
    };
  }
}

export const settings = new Configs().settings;
