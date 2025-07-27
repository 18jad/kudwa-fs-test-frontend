// Integration Controls Component
// Provides ETL trigger button and progress indicator as per CURSOR.md requirements

import { CheckCircle, Error, PlayArrow, Schedule } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Paper,
  styled,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { apiService, type IntegrationStatus } from "../services/apiService";

const ControlsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2)
}));

const StatusContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap"
}));

interface IntegrationControlsProps {
  onIntegrationComplete?: () => void;
}

const IntegrationControls: React.FC<IntegrationControlsProps> = ({
  onIntegrationComplete
}) => {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);

  // Poll integration status ONLY when processing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const pollStatus = async () => {
      try {
        const response = await apiService.getIntegrationStatus();
        setStatus(response.responseObject);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get status");
      }
    };

    // Initial load to get current status
    pollStatus();

    // Only start polling if integration is processing
    if (status?.isProcessing) {
      interval = setInterval(pollStatus, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status?.isProcessing]); // Only re-run when processing status changes

  // Trigger callback when integration completes successfully
  useEffect(() => {
    if (
      status &&
      !status.isProcessing &&
      status.success &&
      onIntegrationComplete
    ) {
      console.log("🎉 Integration completed successfully, loading data...");
      onIntegrationComplete();
    }
  }, [status, onIntegrationComplete]);

  const handleTriggerIntegration = async () => {
    setIsTriggering(true);
    setError(null);

    try {
      const response = await apiService.triggerIntegration();

      if (response.success) {
        // Immediately update status to show processing started
        setStatus(() => ({
          isProcessing: true,
          message: "Starting integration...",
          success: false,
          recordsProcessed: 0,
          lastRun: new Date().toISOString()
        }));
      } else {
        setError("Failed to start integration");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to trigger integration"
      );
    } finally {
      setIsTriggering(false);
    }
  };

  const getStatusIcon = () => {
    if (!status) return <Schedule color="disabled" />;
    if (status.isProcessing) return <CircularProgress size={20} />;
    if (status.success) return <CheckCircle color="success" />;
    return <Error color="error" />;
  };

  const getStatusColor = () => {
    if (!status) return "default";
    if (status.isProcessing) return "info";
    if (status.success) return "success";
    return "error";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  return (
    <ControlsContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            Data Integration Controls
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Trigger ETL process to integrate Company 1 and Company 2 financial
            data
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={
            status?.isProcessing ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <PlayArrow />
            )
          }
          onClick={handleTriggerIntegration}
          disabled={status?.isProcessing || isTriggering}
          sx={{ minWidth: 200 }}
        >
          {status?.isProcessing || isTriggering
            ? "Processing..."
            : "Run Integration"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {status && (
        <Box>
          <StatusContainer>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {getStatusIcon()}
              <Typography variant="subtitle1" fontWeight="medium">
                Status:
              </Typography>
              <Chip
                label={
                  status.isProcessing
                    ? "Processing"
                    : status.success
                    ? "Completed"
                    : "Failed"
                }
                color={getStatusColor()}
                size="small"
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              Last run: {formatDate(status.lastRun)}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Records processed: {status.recordsProcessed.toLocaleString()}
            </Typography>
          </StatusContainer>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {status.message}
            </Typography>

            {status.isProcessing && (
              <LinearProgress
                variant="indeterminate"
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            )}
          </Box>
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip
          label="Company 1 JSON"
          variant="outlined"
          size="small"
          icon={status?.success ? <CheckCircle /> : <Schedule />}
          color={status?.success ? "success" : "default"}
        />
        <Chip
          label="Company 2 JSON"
          variant="outlined"
          size="small"
          icon={status?.success ? <CheckCircle /> : <Schedule />}
          color={status?.success ? "success" : "default"}
        />
        <Chip
          label="Unified Schema"
          variant="outlined"
          size="small"
          icon={status?.success ? <CheckCircle /> : <Schedule />}
          color={status?.success ? "success" : "default"}
        />
      </Box>
    </ControlsContainer>
  );
};

export default IntegrationControls;
