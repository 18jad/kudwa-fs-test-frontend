// API Service for Backend Communication
// Handles all communication with the ETL backend as per CURSOR.md requirements

const API_BASE_URL = "http://localhost:8080";

export interface IntegrationStatus {
  isProcessing: boolean;
  lastRun: string | null;
  success: boolean;
  message: string;
  recordsProcessed: number;
}

export interface ProfitLossData {
  periods: string[];
  sections: Array<{
    title: string;
    type: string;
    accounts: Record<
      string,
      Record<
        string,
        Array<{
          accountCode: string;
          accountName: string;
          amount: number;
          originalAccountName: string;
        }>
      >
    >;
  }>;
  summary: {
    totalRecords: number;
    companiesIncluded: string[];
    periodRange: {
      start: string;
      end: string;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;
}

class ApiService {
  /**
   * Trigger ETL data integration
   */
  async triggerIntegration(): Promise<
    ApiResponse<{ status: string; startTime: string }>
  > {
    const response = await fetch(`${API_BASE_URL}/etl/integrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get integration status for progress indicator
   */
  async getIntegrationStatus(): Promise<ApiResponse<IntegrationStatus>> {
    const response = await fetch(`${API_BASE_URL}/etl/integration-status`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get integrated Profit & Loss data for the table
   */
  async getProfitLossData(): Promise<ApiResponse<ProfitLossData>> {
    const response = await fetch(`${API_BASE_URL}/etl/profit-loss-data`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    const response = await fetch(`${API_BASE_URL}/health-check`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();
