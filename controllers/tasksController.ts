import { NextFunction, Request, Response } from "express";
import { Task } from "../models/task.entity";
import { myDataSource } from "../ormconfig";
import { convertStringToBoolean } from "../utils/utils";
const taskRepository = myDataSource.getRepository(Task);

interface TaskBodyData {
  title: string;
  description: string;
  isPinned?: boolean;
}

interface TaskUpdateDate {
  title?: string;
  description?: string;
  isPinned?: boolean;
  isComplete?: boolean;
  dueDate?: number;
}

// Extending Request
interface AppRequest<T> extends Request {
  user: T;
}

// Appending interace to UserRequest Type
type UserRequest = AppRequest<{ user: string }>;

const fetchTasks = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  try {
    const tasks = await taskRepository.findBy({ userId: Number(user) });
    res
      .status(200)
      .json({ tasks: tasks ? tasks : [], count: tasks ? tasks.length : 0 });
  } catch (error) {
    res.status(500);
    next(new Error("Could not fetch tasks at the moment."));
  }
};

const fetchTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const convertedId: number = parseInt(id, 10);
  if (!convertedId) {
    res.status(401);
    next(new Error("Invalid task ID provided."));
  }
  try {
    const task = await taskRepository.findOneBy({ id: convertedId });
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404);
      next(new Error("Could not find task with given id."));
    }
  } catch (error) {
    res.status(500);
    next(new Error("Could not fetch task at the moment."));
  }
};

const createTask = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  try {
    const data: TaskBodyData = req.body;
    if (!data.title || !data.description) {
      res.status(400);
      next(
        new Error(
          "One or more of following fields are missings: [title, description]"
        )
      );
    }
    if (data.title.length > 50) {
      res.status(400);
      next(new Error("Title is too big."));
    }
    const task = new Task();
    task.description = data.description;
    task.title = data.title;
    task.isPinned = data.isPinned ? data.isPinned : false;
    task.userId = Number(user);

    await taskRepository.save(task);

    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500);
    next(new Error("Error creating a task."));
  }
};

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const convertedId: number = parseInt(id, 10);
  if (!convertedId) {
    res.status(400);
    next(new Error("Invalid task ID provided."));
  }
  try {
    const task = await taskRepository.findOneBy({ id: convertedId });
    if (task) {
      await taskRepository.delete({ id: convertedId });
      res.status(200).json({ message: "success", task });
    } else {
      res.status(404);
      next(new Error("Could not find task with given id."));
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    next(new Error("Error deleting task."));
  }
};

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const convertedId: number = parseInt(id, 10);
  if (!convertedId) {
    res.status(401);
    next(new Error("Invalid task ID provided."));
  }

  const taskData: TaskUpdateDate = req.body;

  if (typeof req.body.isPinned === "string") {
    taskData.isPinned = convertStringToBoolean(req.body.isPinned);
  }
  
  if (typeof req.body.isComplete === "string") {
    taskData.isComplete = convertStringToBoolean(req.body.isComplete);
  }

  try {
    const task = await taskRepository.findOneBy({ id: convertedId });
    if (task) {
      task.description = taskData.description
        ? taskData.description
        : task.description;
      task.title = taskData.title ? taskData.title : task.title;
      task.dueDate = taskData.dueDate ? taskData.dueDate : task.dueDate;
      task.isPinned = taskData.isPinned ? taskData.isPinned : task.isPinned;
      task.isComplete = taskData.isComplete
        ? taskData.isComplete
        : task.isComplete;

      const updatedTask = await taskRepository.save(task);

      res.status(202).json({ message: "success", task: updatedTask });
    } else {
      res.status(404);
      next(new Error("Could not find task with given id."));
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    next(new Error("Error updating task."));
  }
};

export { fetchTasks, createTask, fetchTaskById, deleteTask, updateTask };
