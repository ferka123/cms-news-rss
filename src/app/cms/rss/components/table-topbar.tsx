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
import { RssTableData } from "@/lib/rss/queries";
import type { RssParams } from "@/lib/rss/schema";

type Props = { state: RssTableData["state"] };

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
            placeholder="Filter source name..."
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
            <DropdownMenuItem
              onSelect={() =>
                applyParam<RssParams>(router, searchParams, {
                  status: "active",
                })
              }
            >
              Show Active
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                applyParam<RssParams>(router, searchParams, {
                  status: "paused",
                })
              }
            >
              Show Paused
            </DropdownMenuItem>
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
      <Button>
        <span className="hidden mr-2 md:inline">New Source</span>
        <CirclePlus size={16} />
      </Button>
    </div>
  );
};

export default TableTopBar;
