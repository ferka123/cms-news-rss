export type SearchParamProps = {
  searchParams: Record<string, string | string[]>;
};

export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
