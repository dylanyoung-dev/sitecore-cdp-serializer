export interface BaseResponse {
  href: string;
  offset?: number;
  limit?: number;
  items: any[];
}