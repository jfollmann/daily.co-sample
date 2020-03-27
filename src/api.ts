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

  newRoom = () => {
    const body = {
      privacy: "private",
      properties: {
        eject_at_room_exp: true,
        exp: '`expr $(date +%s) + 3600`',
        enable_chat: true,
        enable_knocking: true,
        autojoin: true
      }
    };

    return this.api.post("rooms", body, { headers: this.headers });
  }

  createMettingToken = (room: string) => {
    const body = {
      properties: {
        room_name: room,
        is_owner: true,
        eject_at_token_exp: true
      }
    };

    return this.api.post("meeting-tokens", body, { headers: this.headers });
  }

  getMettingToken = (token: string) => {
    return this.api.get(`meeting-tokens/${token}`, { headers: this.headers });
  }
}

const instance = new ApiService();
export { instance as DailyService };