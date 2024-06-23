import { Router } from "express";
import {
  createTask,
  deleteTask,
  fetchTaskById,
  fetchTasks,
  updateTask,
} from "../controllers/tasksController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Fetch Tasks
router.get("/", authenticateToken, fetchTasks);

// Create a task
router.post("/", authenticateToken, createTask);

//create a task
router.get("/:id", authenticateToken, fetchTaskById);

// Delete a task
router.delete("/:id", authenticateToken, deleteTask);

// Update a task
router.patch("/:id", authenticateToken, updateTask);

export default router;
