import React from "react";
import { cachedGetPublicNewsList } from "@/lib/public/queries";
import { LinkPagination } from "../../components/link-pagination";
import { mainPageSearchParams } from "@/lib/public/schemas";
import { PageSearchParams } from "../types";
import { CardList } from "./components/card-list";
import { Header } from "./components/header";
import SearchBar from "./components/search-bar";
import { PopularTags } from "./components/popular-tags";
import { Metadata } from "next";
import { cachedGetPopularTags } from "@/lib/tags/queries";

export async function generateMetadata(): Promise<Metadata> {
  const populartaTags = await cachedGetPopularTags(20, 7);

  return {
    title: "Home | News Website",
    keywords: populartaTags.map((tag) => tag.name).join(", "),
  };
}

export default async function Home({ searchParams }: PageSearchParams) {
  const params = mainPageSearchParams.parse(searchParams);
  const list = await cachedGetPublicNewsList({ type: "main", ...params });
  return (
    <React.Fragment>
      <Header>
        <SearchBar />
      </Header>
      <main className="flex-1 max-w-screen-2xl mx-auto w-full flex flex-col">
        <PopularTags />
        <CardList cards={list.data} />
        <LinkPagination
          className="py-6"
          searchParams={searchParams}
          totalPages={list.state.totalPages}
          page={list.state.page}
        />
      </main>
    </React.Fragment>
  );
}
