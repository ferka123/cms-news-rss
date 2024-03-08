import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.IMPORTER_PORT || 5001;

app.get("/", (req: Request, res: Response) => {
  res.send("RSS Importer says hello");
});

app.listen(port, () => {
  console.log(
    `[RSS IMPORTER]: Server is running very good on http://localhost:${port}`
  );
});
