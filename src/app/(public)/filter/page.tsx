import { cachedGetPublicNewsList } from "@/lib/public/queries";
import React from "react";
import { Header } from "../components/header";
import FilterBar from "../components/filter-bar";
import { CardList } from "../components/card-list";
import { LinkPagination } from "@/components/link-pagination";
import { filterPageSearchParams } from "@/lib/public/schemas";
import type { PageSearchParams } from "@/app/types";
import {
  cachedGetPopularTags,
  cachedGetTagOptionById,
} from "@/lib/tags/queries";
import { PopularTags } from "../components/popular-tags";
import { NoResultsFound } from "../components/not-found";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: PageSearchParams): Promise<Metadata> {
  const params = filterPageSearchParams.parse(searchParams);
  const tag = params.tag ? await cachedGetTagOptionById(params.tag) : null;

  const popularTags = await cachedGetPopularTags(15, 7);

  return {
    title: tag?.label ?? "Filter",
    description: tag ? `News tagged with ${tag.label}` : undefined,
    keywords: popularTags.map((tag) => tag.name).join(", "),
  };
}

export default async function Filter({ searchParams }: PageSearchParams) {
  const params = filterPageSearchParams.parse(searchParams);
  const [list, tag] = await Promise.all([
    cachedGetPublicNewsList({ type: "filter", ...params }),
    params.tag ? cachedGetTagOptionById(params.tag) : Promise.resolve(null),
  ]);

  return (
    <React.Fragment>
      <Header>
        <FilterBar key={tag?.value} defaultValue={tag} />
      </Header>
      <main className="flex-1 max-w-screen-2xl mx-auto w-full flex flex-col">
        <PopularTags />
        {list.data.length > 0 ? (
          <>
            <CardList cards={list.data} />
            {list.state.totalPages > 1 && (
              <LinkPagination
                className="py-6"
                searchParams={searchParams}
                totalPages={list.state.totalPages}
                page={list.state.page}
              />
            )}
          </>
        ) : (
          <NoResultsFound description="Please try again with a different tag." />
        )}
      </main>
    </React.Fragment>
  );
}
