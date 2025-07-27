import type { ProfitLossData } from "../services/apiService";

export interface ProfitLossTableProps {
  data: ProfitLossData | null;
  loading?: boolean;
}
