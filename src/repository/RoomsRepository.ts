import { randomRoomId } from "../utils/stringHelpers";
import BaseRedisRepository from "./BaseRedisRepository";

interface Host {
  name: string;
  avatar: string;
  token: string;
  userId: string;
  lastSeen: string;
}

interface User {
  userId: string;
  name: string;
  avatar: string;
  token: string;
  lastSeen: string;
}

interface Playlist {
  requests: any[];
  queue: any[];
}

interface Room {
  roomName: string;
  roomId: string;
  createdAt: string;
  isPrivate: boolean;
  host: Host;
  mediaUrl: string;
  isPlaying: boolean;
  maxUsers: number;
  messagesSent: number;
  playlist: Playlist;
  users: { [key: string]: User };
}

class RoomsRepository extends BaseRedisRepository {
  constructor() {
    super();
  }

  async isHostingRoom(token: string): Promise<boolean> {
    // TODO
    return false;
  }

  async createRoom(token: string, isGuest: boolean, isPrivate: boolean) {
    const currentTime = new Date().toISOString();

    const roomId = randomRoomId();

    const newRoom: Room = {
      roomName: "",
      roomId: roomId,
      createdAt: currentTime,
      isPrivate,
      host: {
        name: "",
        avatar: "",
        token,
        userId: "",
        lastSeen: currentTime
      },
      mediaUrl: "",
      isPlaying: false,
      maxUsers: 1,
      messagesSent: 0,
      playlist: {
        requests: [],
        queue: []
      },
      users: {}
    }

    this.getDb().set(`/${roomId}`, JSON.stringify(newRoom));
  }
}

export default RoomsRepository;
