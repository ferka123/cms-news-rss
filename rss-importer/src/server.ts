import express, { Express, Request, Response } from "express";
import { deleteTask, intializeCronTasks, updateTask } from "./tasks";
import { RequestError, errorHandler } from "./errorHandler";
import { config } from "./config";

const app: Express = express();
const port = config.IMPORTER_PORT || 5001;

app.post("/task/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (!id) throw new RequestError(400, "Id must be an integer");

  await updateTask(id);
  res.status(200).json({ status: 200, msg: "Task has been updated" });
});

app.delete("/task/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (!id) throw new RequestError(400, "Id must be an integer");

  await deleteTask(id);
  res.status(200).json({ status: 200, msg: "Task has been deleted" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `RSS importer Service is running very good on http://localhost:${port}`
  );
});

intializeCronTasks();
