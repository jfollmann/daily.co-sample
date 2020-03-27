import axios, { AxiosInstance } from "axios";
import { settings } from "./configs";

class ApiService {
  api: AxiosInstance;
  headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.token}` };

  constructor() {
    this.api = axios.create({
      baseURL: settings.apiUrl
    });
  }

  getRooms = () => {
    return this.api.get("rooms", { headers: this.headers });
  }

  createRoom = () => {
    const body = {
      privacy: "private",
      properties: {
        eject_at_room_exp: false,
        exp: Math.round(Date.now() / 1000) + 300, // Agora + 5min (360)
        enable_chat: true,
        enable_knocking: true,
        // autojoin: true
      }
    };

    return this.api.post("rooms", body, { headers: this.headers });
  }

  getMettingToken = (token: string) => {
    return this.api.get(`meeting-tokens/${token}`, { headers: this.headers });
  }

  createMettingToken = (room: string, owner = false) => {
    const body = {
      properties: {
        room_name: room,
        is_owner: owner,
        // eject_at_token_exp: true
      }
    };

    return this.api.post("meeting-tokens", body, { headers: this.headers });
  }
}

const instance = new ApiService();
export { instance as DailyService };