import express, { Express, Request, Response } from "express";
import {
  deleteTasks,
  intializeCronTasks,
  updateMultipleTaskStatus,
  updateTask,
} from "./tasks";
import { RequestError, errorHandler } from "./errorHandler";
import { config } from "./config";
import { MultipleIdSchema, UpdateStatusSchema } from "./tasks/schema";
import bodyParser from "body-parser";

const app: Express = express();
app.use(bodyParser.json());

const port = config.IMPORTER_PORT || 5001;

app.patch("/task/status", async (req: Request, res: Response) => {
  const body = UpdateStatusSchema.safeParse(req.body);

  if (!body.success)
    throw new RequestError(400, body.error.flatten().formErrors.join(", "));

  await updateMultipleTaskStatus(body.data.ids, body.data.paused);
  console.log(
    `[Importer] Tasks ${body.data.ids} have been ${
      body.data.paused ? "paused" : "resumed"
    }`
  );
  res.status(200).json({ status: 200, msg: "Task statuses have been updated" });
});

app.post("/task/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (!id) throw new RequestError(400, "Id must be an integer");

  await updateTask(id);
  console.log(`[Importer] Task ${id} has been updated`);
  res.status(200).json({ status: 200, msg: "Task has been updated" });
});

app.delete("/task", async (req: Request, res: Response) => {
  const body = MultipleIdSchema.safeParse(req.body);

  if (!body.success)
    throw new RequestError(400, body.error.flatten().formErrors.join(", "));

  await deleteTasks(body.data.ids);
  console.log(`[Importer] Tasks ${body.data.ids} have been updated`);
  res.status(200).json({ status: 200, msg: "Tasks have been deleted" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `RSS importer Service is running very good on http://localhost:${port}`
  );
});

intializeCronTasks();
