import { Router } from "express";
import { loginUser, registerUser } from "../controllers/usersController";

const router = Router();

// Register User
router.post("/signup", registerUser);

// Login User
router.post("/signin", loginUser);

export default router;
