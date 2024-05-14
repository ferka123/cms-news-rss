import { PageSearchParams } from "@/app/types";
import { cachedGetPublicNewsList } from "@/lib/public/queries";
import { searchPageSearchParams } from "@/lib/public/schemas";
import { CardList } from "../components/card-list";
import { LinkPagination } from "@/components/link-pagination";
import { Header } from "../components/header";
import SearchBar from "../components/search-bar";
import React from "react";
import { NoResultsFound } from "../components/not-found";
import { Metadata } from "next";
import type { NewsCard, BaseCard } from "@/lib/public/types";

export async function generateMetadata({
  searchParams,
}: PageSearchParams): Promise<Metadata> {
  const params = searchPageSearchParams.parse(searchParams);

  const list = await cachedGetPublicNewsList({ type: "search", ...params });
  const news = list.data.filter(
    (news): news is NewsCard & BaseCard => news.type === "news"
  );

  return {
    title: params.q || "Search",
    description: params.q ? `Searching for ${params.q}` : "Searching news",
    keywords: news
      .slice(0, 5)
      .map((news) => news.title)
      .join(", "),
  };
}

export default async function Search({ searchParams }: PageSearchParams) {
  const params = searchPageSearchParams.parse(searchParams);
  const list = await cachedGetPublicNewsList({ type: "search", ...params });
  return (
    <React.Fragment>
      <Header>
        <SearchBar defaultValue={params.q} />
      </Header>
      <main className="flex-1 max-w-screen-2xl mx-auto w-full flex flex-col">
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
          <NoResultsFound description="Please try again with a different search term." />
        )}
      </main>
    </React.Fragment>
  );
}
