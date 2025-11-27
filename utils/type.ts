export type Response = {
  config: object;
  data: ResponseData;
  status: number;
  statusText: string;
};

export type ResponseData = {
  current_page: number;
  data: object[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: [];
  next_page_url: string;
  path: string;
  per_page: number;
  per_page_url: number;
  to: number;
  total: number;
};
