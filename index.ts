import express from "express";
import morgan from "morgan";
import tasksRouter from "./routes/tasks";
import * as dotenv from "dotenv";
import { myDataSource } from "./ormconfig";
const { errorHandler } = require("./middleware/errorMiddleware");
const bodyParser = require("body-parser");

const app = express();

const port = process.env.PORT || 8000;

dotenv.config();

// Initializing PG Database
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// Routes and Middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/tasks", tasksRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
