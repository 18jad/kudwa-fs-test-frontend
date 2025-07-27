// Profit & Loss Data Table Component
// Displays integrated financial data in structured, expandable format as per CURSOR.md

import {
  AccountBalance,
  KeyboardArrowDown,
  KeyboardArrowRight,
  TrendingDown,
  TrendingUp
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import type { ProfitLossData } from "../services/apiService";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  "& .MuiTableCell-head": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: "bold"
  }
}));

const SectionHeader = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  "& .MuiTableCell-root": {
    fontWeight: "bold",
    fontSize: "1.1rem"
  }
}));

const AccountRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  }
}));

const CompanyRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  "& .MuiTableCell-root": {
    paddingLeft: theme.spacing(4),
    fontSize: "0.9rem"
  }
}));

interface ProfitLossTableProps {
  data: ProfitLossData | null;
  loading?: boolean;
}

interface ExpandableRowProps {
  section: ProfitLossData["sections"][0];
  periods: string[];
}

const ExpandableRow: React.FC<ExpandableRowProps> = ({ section, periods }) => {
  const [open, setOpen] = useState(false);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(
    new Set()
  );

  const toggleAccount = (accountKey: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountKey)) {
      newExpanded.delete(accountKey);
    } else {
      newExpanded.add(accountKey);
    }
    setExpandedAccounts(newExpanded);
  };

  const calculatePeriodTotal = (
    accountData: Record<string, any[]>,
    period: string
  ) => {
    let total = 0;
    Object.values(accountData[period] || {}).forEach(
      (companyAccounts: any[]) => {
        companyAccounts.forEach((account) => {
          total += account.amount;
        });
      }
    );
    return total;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getAmountColor = (amount: number, type: string) => {
    if (type === "income") {
      return amount >= 0 ? "success.main" : "error.main";
    } else {
      return amount >= 0 ? "error.main" : "success.main";
    }
  };

  return (
    <>
      <SectionHeader>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
            </IconButton>
            {section.type === "income" ? (
              <TrendingUp color="success" />
            ) : (
              <TrendingDown color="error" />
            )}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {section.title}
            </Typography>
          </Box>
        </TableCell>
        {periods.map((period) => (
          <TableCell key={period} align="right">
            <Typography
              variant="h6"
              color={getAmountColor(
                calculatePeriodTotal(section.accounts, period),
                section.type
              )}
            >
              {formatCurrency(calculatePeriodTotal(section.accounts, period))}
            </Typography>
          </TableCell>
        ))}
      </SectionHeader>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={periods.length + 1}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small">
                <TableBody>
                  {Object.entries(section.accounts).map(
                    ([periodKey, periodData]) => {
                      if (!periods.includes(periodKey)) return null;

                      return Object.entries(periodData).map(
                        ([companyName, accounts]) =>
                          accounts.map((account, accountIndex) => {
                            const accountKey = `${periodKey}-${companyName}-${account.accountCode}`;
                            const isExpanded = expandedAccounts.has(accountKey);

                            return (
                              <React.Fragment key={accountKey}>
                                <AccountRow>
                                  <TableCell>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        pl: 2
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          toggleAccount(accountKey)
                                        }
                                      >
                                        {isExpanded ? (
                                          <KeyboardArrowDown />
                                        ) : (
                                          <KeyboardArrowRight />
                                        )}
                                      </IconButton>
                                      <AccountBalance
                                        sx={{ mr: 1, fontSize: 16 }}
                                      />
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          fontWeight="medium"
                                        >
                                          {account.accountName}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {account.accountCode} • {companyName}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  {periods.map((period) => (
                                    <TableCell key={period} align="right">
                                      {period === periodKey && (
                                        <Typography
                                          variant="body2"
                                          color={getAmountColor(
                                            account.amount,
                                            section.type
                                          )}
                                          fontWeight="medium"
                                        >
                                          {formatCurrency(account.amount)}
                                        </Typography>
                                      )}
                                    </TableCell>
                                  ))}
                                </AccountRow>
                                <TableRow>
                                  <TableCell
                                    style={{ paddingBottom: 0, paddingTop: 0 }}
                                    colSpan={periods.length + 1}
                                  >
                                    <Collapse
                                      in={isExpanded}
                                      timeout="auto"
                                      unmountOnExit
                                    >
                                      <CompanyRow>
                                        <TableCell colSpan={periods.length + 1}>
                                          <Box sx={{ py: 1 }}>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              <strong>
                                                Original Account Name:
                                              </strong>{" "}
                                              {account.originalAccountName}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              <strong>Period:</strong>{" "}
                                              {periodKey}
                                            </Typography>
                                            <Chip
                                              label={companyName}
                                              size="small"
                                              variant="outlined"
                                              sx={{ mt: 0.5 }}
                                            />
                                          </Box>
                                        </TableCell>
                                      </CompanyRow>
                                    </Collapse>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            );
                          })
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ProfitLossTable: React.FC<ProfitLossTableProps> = ({
  data,
  loading = false
}) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Loading profit & loss data...
        </Typography>
      </Paper>
    );
  }

  if (!data) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No financial data available. Please run data integration first.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Profit & Loss Statement
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
          <Chip
            label={`${data.summary.totalRecords} records`}
            variant="outlined"
          />
          <Chip
            label={`${data.summary.companiesIncluded.join(", ")}`}
            variant="outlined"
          />
          <Chip
            label={`${data.summary.periodRange.start} to ${data.summary.periodRange.end}`}
            variant="outlined"
          />
        </Box>
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account</TableCell>
              {data.periods.map((period) => (
                <TableCell key={period} align="right">
                  {new Date(period + "-01").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short"
                  })}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.sections.map((section, index) => (
              <ExpandableRow
                key={`${section.title}-${index}`}
                section={section}
                periods={data.periods}
              />
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
};

export default ProfitLossTable;
