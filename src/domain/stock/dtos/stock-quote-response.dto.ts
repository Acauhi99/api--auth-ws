import { StockQuoteResult } from "./stock-quote-result.dto";

export interface StockQuoteResponse {
  results: StockQuoteResult[];
  requestedAt: string;
  took: string;
}
