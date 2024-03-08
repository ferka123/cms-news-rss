import express, { Express, Request, Response } from "express";
import Parser from "rss-parser";
const parser = new Parser({
  customFields: {
    item: [
      ["media:thumbnail", "image"],
      ["media:content", "media:content"],
    ],
  },
});

const app: Express = express();
const port = process.env.IMPORTER_PORT || 5001;

app.get("/", async (req: Request, res: Response) => {
  const feed = await parser.parseURL(
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"
  );
  res.json(feed);
});

app.listen(port, () => {
  console.log(
    `[RSS IMPORTER]: Server is running very good on http://localhost:${port}`
  );
});
