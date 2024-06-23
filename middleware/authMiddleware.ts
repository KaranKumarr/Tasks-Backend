import { NextFunction, Response } from "express";
const jwt = require("jsonwebtoken");
import "dotenv/config";

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
};

const authenticateToken = (req, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401);
    next(new Error("Cannot verify user without token."));
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      res.status(403);
      next(new Error("Cannot verify token without JWT secret."));
      return;
    }
    const userId: string = user.userId;
    req.user = userId;
    next();
  });
};

export { generateAccessToken, authenticateToken };
