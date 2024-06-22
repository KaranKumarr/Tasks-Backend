import { Router } from "express";
import {RegisterUser} from "../controllers/usersController";

const router = Router();

// Login User
router.post('/signin')

// Register User
router.post("/signup", RegisterUser);

export default router;
