import { Router } from "express";
import {
  createTask,
  deleteTask,
  fetchTaskById,
  fetchTasks,
  updateTask,
} from "../controllers/tasksController";

const router = Router();

// Fetch Tasks
router.get("/", fetchTasks);

// Create a task
router.post("/", createTask);

//create a task
router.get("/:id", fetchTaskById);

// Delete a task
router.delete("/:id", deleteTask);

// Update a task
router.patch("/:id", updateTask);

export default router;
