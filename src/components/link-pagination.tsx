import { PageSearchParams } from "@/app/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn, formatUrlParams } from "@/lib/utils";

export function LinkPagination({
  searchParams,
  page,
  totalPages,
  ...rest
}: {
  page: number;
  totalPages: number;
} & PageSearchParams &
  React.ComponentProps<typeof Pagination>) {
  const prevPage = page - 1;
  const nextPage = page + 1;

  const urlParams = formatUrlParams(searchParams);

  const makeUrl = (page: number) => {
    urlParams.set("page", page.toString());
    return `?${urlParams.toString()}`;
  };

  return (
    <Pagination {...rest}>
      <PaginationContent>
        <PaginationItem
          className={cn(
            "hidden sm:block",
            page <= 1 && "text-muted pointer-events-none"
          )}
        >
          <PaginationPrevious href={makeUrl(prevPage)} />
        </PaginationItem>
        {page > 1 && (
          <PaginationItem>
            <PaginationLink href={makeUrl(1)}>1</PaginationLink>
          </PaginationItem>
        )}
        {page > 2 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={makeUrl(prevPage)}>
                {prevPage}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationLink href={makeUrl(page)} isActive>
            {page}
          </PaginationLink>
        </PaginationItem>

        {nextPage < totalPages && (
          <>
            <PaginationItem>
              <PaginationLink href={makeUrl(nextPage)}>
                {nextPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {page < totalPages && (
          <PaginationItem>
            <PaginationLink href={makeUrl(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem
          className={cn(
            "hidden sm:block",
            page >= totalPages && "text-muted pointer-events-none"
          )}
        >
          <PaginationNext href={makeUrl(nextPage)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
