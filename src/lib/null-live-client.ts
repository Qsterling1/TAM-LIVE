import { EventEmitter } from "eventemitter3";
import {
  LiveClientEventTypes,
  GenAILiveClient,
} from "./genai-live-client";

/**
 * No-op client used when engine is not Google Live API.
 * It matches the surface of GenAILiveClient enough for the UI to operate.
 */
export class NullLiveClient
  extends EventEmitter<LiveClientEventTypes>
  implements Pick<
    GenAILiveClient,
    | "connect"
    | "disconnect"
    | "send"
    | "sendRealtimeInput"
    | "sendToolResponse"
    | "status"
    | "session"
    | "model"
  >
{
  public status: "connected" | "disconnected" | "connecting" = "connected";
  public session: null = null;
  public model: string | null = null;

  async connect() {
    this.status = "connected";
    this.emit("open");
    return true;
  }
  disconnect() {
    this.status = "disconnected";
    this.emit("close", {} as CloseEvent);
    return true;
  }
  send() {
    return;
  }
  sendRealtimeInput() {
    return;
  }
  sendToolResponse() {
    return;
  }
}
