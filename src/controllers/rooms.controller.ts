import { Request, Response, NextFunction } from "express";
import RoomsRepository from "../repository/RoomsRepository";

const roomsRepository = new RoomsRepository();

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  let message: String = "Walrus TV";

  const token = req.body.token;
  const isGuest = req.body.isGuest || true;
  const isPrivate = req.body.isPrivate || false;

  if (await roomsRepository.isHostingRoom(token)) {
    return res.status(400).json({
      message: "Already hosting room"
    });
  }

  roomsRepository.createRoom(token, isGuest, isPrivate);

  return res.status(200).json({
    message: message
  });
};
