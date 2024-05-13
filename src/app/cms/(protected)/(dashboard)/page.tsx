import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getFailedImportCountStats,
  getNewsCountGroupedByMonths,
  getNewsCountStats,
  getTopAuthors,
  getTotalAuthors,
} from "@/lib/dashboard/queries";
import { Activity, Newspaper, Rss, Users2 } from "lucide-react";
import React from "react";
import { PublicationsChart } from "./components/publications-chart";
import { TopAuthors } from "./components/top-authors";

const Dashboard = async () => {
  const [
    imoprtedNews,
    publishedNews,
    failedImports,
    newsGroupedByMonths,
    topAuthors,
    totalAuthors,
  ] = await Promise.all([
    getNewsCountStats(true, 7),
    getNewsCountStats(false, 7),
    getFailedImportCountStats(7),
    getNewsCountGroupedByMonths(),
    getTopAuthors(),
    getTotalAuthors(30),
  ]);

  const chartData = newsGroupedByMonths.map((item) => ({
    ...item,
    name: item.name.split("-")[1],
  }));
  return (
    <div className="h-full bg-muted/40 p-4">
      <div className="rounded-md border bg-background p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">News publications statistics</p>
          <div className="flex flex-col gap-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-background">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Imported this week
                  </CardTitle>
                  <Rss size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.sign(imoprtedNews.thisPeriodCount) === 1 ? "+" : ""}
                    {imoprtedNews.thisPeriodCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.sign(imoprtedNews.percentageChange) === 1 ? "+" : ""}
                    {imoprtedNews.percentageChange.toFixed(2)}% from last week
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Failed Imports
                  </CardTitle>
                  <Activity size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {failedImports.thisPeriodCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.sign(failedImports.percentageChange) === 1 ? "+" : ""}
                    {failedImports.percentageChange.toFixed(2)}% from last week
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Published by authors this week
                  </CardTitle>
                  <Newspaper size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.sign(publishedNews.thisPeriodCount) === 1 ? "+" : ""}
                    {publishedNews.thisPeriodCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.sign(publishedNews.percentageChange) === 1 ? "+" : ""}
                    {publishedNews.percentageChange.toFixed(2)}% from last week
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Authors
                  </CardTitle>
                  <Users2 size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAuthors.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.sign(publishedNews.percentageChange) === 1 ? "+" : ""}
                    {totalAuthors.addedInPeriod} this month
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-5 bg-background">
                <CardHeader>
                  <CardTitle>Publications</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <PublicationsChart data={chartData} />
                </CardContent>
              </Card>
              <Card className="col-span-2 bg-background">
                <CardHeader>
                  <CardTitle>Top Authors</CardTitle>
                  <CardDescription>By publication count</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopAuthors data={topAuthors} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
