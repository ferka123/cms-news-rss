import e from "express";
import { db } from "../db";

export async function getNewsCountStats(imported: boolean, periodDays: number) {
  const currentPeriodAgo = new Date();
  currentPeriodAgo.setDate(currentPeriodAgo.getDate() - periodDays);
  const previousPeriodAgo = new Date();
  previousPeriodAgo.setDate(previousPeriodAgo.getDate() - periodDays * 2);

  const thisPeriodCount = await db.news.count({
    where: {
      pub_date: {
        gte: currentPeriodAgo,
      },
      imported_from: imported ? { isNot: null } : null,
    },
  });

  const previousPeriodCount = await db.news.count({
    where: {
      pub_date: {
        gte: previousPeriodAgo,
        lt: currentPeriodAgo,
      },
      imported_from: imported ? { isNot: null } : null,
    },
  });

  const difference = thisPeriodCount - previousPeriodCount;
  const percentageChange = (difference / previousPeriodCount) * 100;

  return { thisPeriodCount, previousPeriodCount, difference, percentageChange };
}

export async function getFailedImportCountStats(periodDays: number) {
  const currentPeriodAgo = new Date();
  currentPeriodAgo.setDate(currentPeriodAgo.getDate() - periodDays);
  const previousPeriodAgo = new Date();
  previousPeriodAgo.setDate(previousPeriodAgo.getDate() - periodDays * 2);

  const thisPeriodCount = await db.failedImport.count({
    where: {
      createdAt: {
        gte: currentPeriodAgo,
      },
    },
  });

  const previousPeriodCount = await db.failedImport.count({
    where: {
      createdAt: {
        gte: previousPeriodAgo,
        lt: currentPeriodAgo,
      },
    },
  });

  const difference = thisPeriodCount - previousPeriodCount;
  const percentageChange = (difference / previousPeriodCount) * 100 || 0;

  return { thisPeriodCount, previousPeriodCount, difference, percentageChange };
}

export async function getTotalAuthors(periodDays: number) {
  const periodAgo = new Date();
  periodAgo.setDate(periodAgo.getDate() - periodDays);

  const total = await db.user.count();

  const addedInPeriod = await db.user.count({
    where: {
      pub_date: {
        lt: periodAgo,
      },
    },
  });

  return { total, addedInPeriod };
}

export async function getNewsCountGroupedByMonths() {
  return db.$queryRaw<{ name: string; total: number }[]>`
    SELECT TO_CHAR(pub_date, 'YYYY-Mon') as name, COUNT(*)::integer as total
    FROM "News"
    WHERE pub_date >= NOW() - INTERVAL '1 YEAR' AND pub_state = 'active'
    GROUP BY name
    ORDER BY name ASC;
`;
}

export type TopAuthors = {
  name: string;
  total: number;
  image: string;
  authorId: string;
}[];

export async function getTopAuthors() {
  return db.$queryRaw<TopAuthors>`
    SELECT n.author_id as authorId, COUNT(*)::integer as total, m.src as image, u.name
    FROM "News" as n
    JOIN "User" as u ON n.author_id = u.id
    LEFT JOIN "Media" as m ON u.media_id = m.id
    WHERE n.pub_state = 'active'
    GROUP BY n.author_id, image, u.name
    ORDER BY total DESC
    LIMIT 10;
  `;
}
