import { config as dotEnvConfig } from "dotenv";

interface Settings {
  apiUrl: string;
  token: string;
}

class Configs {

  settings: Settings

  constructor() {
    dotEnvConfig();

    this.settings = {
      apiUrl: process.env.API_URL || "https://api.daily.co/v1/",
      token: process.env.TOKEN || ""
    };
  }
}

export const settings = new Configs().settings;
