import { Request, Response, NextFunction } from "express";
import UserRepository from "../repository/UserRepository";

const userRepository = new UserRepository();

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    userRepository.registerNewUser(username, email, password);

    return res.status(200).json({
        message: "Success"
    });
};
