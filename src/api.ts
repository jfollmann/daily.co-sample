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

  createRoom = (eventDate: Date, eventDuration = 750) => {
    const eventTimestamp = Math.round(new Date(eventDate).getTime()/1000);

    const body = {
      privacy: "private",
      properties: {
        nbf: eventTimestamp - 300,
        exp: eventTimestamp + eventDuration,
        enable_chat: true,
        enable_knocking: true
      }
    };

    return this.api.post("rooms", body, { headers: this.headers });
  }

  createMettingToken = (room: string, userName: string, owner = false) => {
    const body = {
      properties: {
        user_name: userName,
        room_name: room,
        is_owner: owner,
      }
    };

    return this.api.post("meeting-tokens", body, { headers: this.headers });
  }
}

const instance = new ApiService();
export { instance as DailyService };