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
import Link from "next/link";
import { PromoTableData } from "@/lib/promos/queries";
import { promoStateOptions, promoTypeOptions } from "@/lib/promos/data";
import type { PromoParams, PromoSettings } from "@/lib/promos/schema";
import { PromoSettingsForm } from "./promo-settings";

type Props = { state: PromoTableData["state"]; settings: PromoSettings };

const TableTopBar = ({ state, settings }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center justify-between pb-4 space-x-4">
      <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        <form
          className="w-full sm:w-auto"
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
          />
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="capitalize flex-1">
              {state.status ? `show ${state.status}` : "Filter Status"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {promoStateOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                onSelect={() =>
                  applyParam<PromoParams>(router, searchParams, {
                    status: option.value ? "draft" : "active",
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
                    applyParam<PromoParams>(router, searchParams, {
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="capitalize flex-1">
              {state.type ? `show ${state.type}` : "Filter Type"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {promoTypeOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                onSelect={() =>
                  applyParam<PromoParams>(router, searchParams, {
                    type: option.value,
                  })
                }
              >
                Show {option.label}
              </DropdownMenuItem>
            ))}
            {state.type && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    applyParam<PromoParams>(router, searchParams, {
                      type: "",
                    })
                  }
                >
                  Clear Filter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {(state.q || state.status || state.type) && (
          <Button
            variant="ghost"
            type="reset"
            form="name_filter"
            onClick={() =>
              removeParams<"status" | "type">(router, searchParams, [
                "q",
                "status",
                "type",
              ])
            }
            className="px-2 lg:px-3"
          >
            Reset All
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2 self-baseline">
        <PromoSettingsForm settings={settings} />
        <Link href={"/cms/promos/create"} scroll={false}>
          <Button>
            <span className="hidden mr-2 md:inline">New Promo</span>
            <CirclePlus size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TableTopBar;
