import { CronJob, CronTime } from "cron";
import { prisma } from "../db";
import { RequestError } from "../errorHandler";
import { processTask } from "./task.processor";

const intervalToCronTime = (minutes: number) => `*/${minutes} * * * *`;

export const cronTasks = new Map<
  number,
  { job: CronJob; interval: number; paused: boolean }
>();

const createTask = (id: number, interval: number, paused: boolean) => {
  const cronExpression = intervalToCronTime(interval);
  cronTasks.set(id, {
    job: new CronJob(cronExpression, () => processTask(id), null, !paused),
    interval,
    paused,
  });
};

export const updateTask = async (id: number) => {
  const task = await prisma.rss.findUnique({ where: { id } });
  if (!task) throw new RequestError(404, "Rss task not found id=" + id);

  const cronTask = cronTasks.get(id);
  if (!cronTask) createTask(task.id, task.interval, task.paused);
  else {
    if (cronTask.interval !== task.interval) {
      cronTask.job.setTime(new CronTime(intervalToCronTime(task.interval)));
      cronTask.interval = task.interval;
    }
    if (task.paused !== cronTask.paused) {
      if (task.paused) cronTask.job.stop();
      else cronTask.job.start();
      cronTask.paused = task.paused;
    }
  }
};

export const updateMultipleTaskStatus = async (ids: number[], paused: boolean) => {
  ids.forEach((id) => {
    const cronTask = cronTasks.get(id);
    if (cronTask) {
      if (paused) cronTask.job.stop();
      else cronTask.job.start();
      cronTask.paused = paused;
    }
  });
};

export const deleteTasks = async (ids: number[]) => {
  ids.forEach((id) => {
    const task = cronTasks.get(id);
    if (task) {
      task.job.stop();
      cronTasks.delete(id);
    }
  });
};

export const intializeCronTasks = async () => {
  const tasks = await prisma.rss.findMany();
  tasks.forEach((task) => createTask(task.id, task.interval, task.paused));
};
