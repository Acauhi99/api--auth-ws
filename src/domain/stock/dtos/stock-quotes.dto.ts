import { StockQuoteDTO } from "./stock-quote.dto";

export interface StockQuotesDTO {
  results: StockQuoteDTO[];
  requestedAt: string;
  took: string;
}
