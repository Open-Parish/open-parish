export type BreadcrumbItem = {
  label: string;
  path?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};
