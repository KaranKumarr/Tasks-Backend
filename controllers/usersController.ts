import { NextFunction, Request, Response } from "express";
import { myDataSource } from "../ormconfig";
import { User } from "../models/user.entity";
import { isEmailValid } from "../utils/utils";
const bcrypt = require("bcryptjs");

const saltRounds = bcrypt.genSaltSync(10);

const userRepository = myDataSource.getRepository(User);

interface NewUserData {
  name: string;
  email: string;
  password: string;
}

const RegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData: NewUserData = req.body;

  if (!userData.email || !userData.name || !userData.password) {
    res.status(400);
    next(
      new Error(
        "One or more of the required fieleds [name, email, password] are missing."
      )
    );
    return;
  }

  if (!isEmailValid(userData.email)) {
    res.status(400);
    next(new Error("Invalid email."));
    return;
  }

  const existingUser = await userRepository.findOneBy({
    email: userData.email,
  });

  if (existingUser) {
    res.status(400);
    next(new Error("User already exists with provided email."));
    return;
  }

  if (userData.password.length < 7) {
    res.status(400);
    next(new Error("Password is too short."));
    return;
  }

  if (userData.name.length > 30) {
    next(new Error("Name should be max 30 letters long."));
  }

  try {
    const hashedPassword = bcrypt.hashSync(userData.password, saltRounds);

    const user = new User();

    user.name = userData.name;
    user.email = userData.email.toLowerCase();
    user.password = hashedPassword;

    const createdUser = await userRepository.save(user);

    res.status(200).json({
      message: "success",
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
      },
    });
  } catch (error) {
    res.status(500);
    next(new Error("Cannot register user at the moment."));
  }
};

export { RegisterUser };
