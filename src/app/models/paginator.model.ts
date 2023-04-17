export interface ResponseData {
  data: any;
  message: string;
  success: boolean;
}


export interface QueryParamsMeta {
  filters?: {name: string; value: string}[];
  order_by?: string[];
  page?: number;
  page_size?: number;
  search?: string;
}

export interface PaginatorMeta {
  pages: number;
  records: number;
  page_size: number;
  current_page: number;
  current_records: number;
  next_page: string;
  previous_page: string;
  results: any[];
}
