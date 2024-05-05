import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CirclePlus, X } from "lucide-react";
import { applyParam, removeParams } from "@/lib/common/search-params";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RssParams } from "@/lib/rss/schema";
import Link from "next/link";
import { NewsTableData } from "@/lib/news/queries";
import { pubStateOptions } from "@/lib/news/data";
import { NewsParams } from "@/lib/news/schema";

type Props = { state: NewsTableData["state"] };

const TableTopBar = ({ state }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center justify-between py-4 space-x-4">
      <div className="flex space-x-4">
        <form
          id="name_filter"
          onSubmit={(e) => {
            e.preventDefault();
            const filter = e.currentTarget.elements.namedItem("name_filter");
            if (filter instanceof HTMLInputElement) {
              applyParam(router, searchParams, { q: filter.value });
            }
          }}
        >
          <Input
            placeholder="Filter by name..."
            name="name_filter"
            defaultValue={state.q}
            className="max-w-sm"
          />
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto capitalize">
              {state.status ? `show ${state.status}` : "Filter Status"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {pubStateOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() =>
                  applyParam<NewsParams>(router, searchParams, {
                    status: option.value,
                  })
                }
              >
                Show {option.label}
              </DropdownMenuItem>
            ))}
            {state.status && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    applyParam<RssParams>(router, searchParams, {
                      status: "",
                    })
                  }
                >
                  Clear Filter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {(state.q || state.status) && (
          <Button
            variant="ghost"
            type="reset"
            form="name_filter"
            onClick={() =>
              removeParams<"status">(router, searchParams, ["q", "status"])
            }
            className="px-2 lg:px-3"
          >
            Reset All
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Link href={"/cms/news/create"} scroll={false}>
        <Button>
          <span className="hidden mr-2 md:inline">New Publication</span>
          <CirclePlus size={16} />
        </Button>
      </Link>
    </div>
  );
};

export default TableTopBar;
