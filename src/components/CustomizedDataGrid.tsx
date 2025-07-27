import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import * as React from "react";
import type { ProfitLossData } from "../services/apiService";

type SparkLineData = number[];

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short"
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function renderSparklineCell(value: SparkLineData, periodLabels?: string[]) {
  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <SparkLineChart
        data={value}
        width={120}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        color="hsl(210, 98%, 42%)"
        margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
        xAxis={{
          scaleType: "band",
          data: periodLabels || []
        }}
      />
    </div>
  );
}

function renderStatus(status: "Income" | "Expense") {
  const colors: { [index: string]: "success" | "error" } = {
    Income: "success",
    Expense: "error"
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

interface RowData {
  id: number;
  pageTitle: string;
  status: "Income" | "Expense";
  users: string;
  eventCount: number;
  viewsPerUser: string;
  averageTime: string;
  conversions: number[];
  periodLabels: string[]; // Add period labels for tooltips
  breakdown: Array<{
    company: string;
    period: string;
    amount: number;
    originalAccountName: string;
  }>;
}

function Row(props: { row: RowData; index: number }) {
  const { row, index } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          height: 36, // DataGrid compact row height
          "&:last-of-type": {
            borderBottom: "1px solid",
            borderBottomColor: "divider"
          },
          "&:hover": {
            backgroundColor: "action.hover"
          },
          backgroundColor:
            index % 2 === 0 ? "background.default" : "action.hover"
        }}
      >
        <TableCell sx={{ padding: "0 8px", width: 48 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              padding: "2px",
              "&:hover": {
                backgroundColor: "action.selected"
              }
            }}
          >
            {open ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ padding: "8px 16px", fontSize: "0.875rem" }}
        >
          {row.pageTitle}
        </TableCell>
        <TableCell align="center" sx={{ padding: "8px 16px" }}>
          {renderStatus(row.status)}
        </TableCell>
        <TableCell
          align="right"
          sx={{ padding: "8px 16px", fontSize: "0.875rem" }}
        >
          {row.users}
        </TableCell>
        <TableCell
          align="right"
          sx={{ padding: "8px 16px", fontSize: "0.875rem" }}
        >
          {row.eventCount}
        </TableCell>
        <TableCell
          align="right"
          sx={{ padding: "8px 16px", fontSize: "0.875rem" }}
        >
          {row.viewsPerUser}
        </TableCell>
        <TableCell
          align="right"
          sx={{ padding: "8px 16px", fontSize: "0.875rem" }}
        >
          {row.averageTime}
        </TableCell>
        <TableCell align="right" sx={{ padding: "8px 16px" }}>
          {renderSparklineCell(row.conversions, row.periodLabels)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Account Breakdown: {row.pageTitle}
              </Typography>
              <Table size="small" aria-label="account breakdown">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        fontWeight: "bold"
                      }}
                    >
                      Company
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        fontWeight: "bold"
                      }}
                    >
                      Period
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        fontWeight: "bold"
                      }}
                    >
                      Original Account Name
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        fontWeight: "bold"
                      }}
                    >
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.breakdown.map((item, idx) => (
                    <TableRow key={idx} sx={{ height: 32 }}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ padding: "2px 8px", fontSize: "0.75rem" }}
                      >
                        {item.company}
                      </TableCell>
                      <TableCell
                        sx={{ padding: "2px 8px", fontSize: "0.75rem" }}
                      >
                        {item.period}
                      </TableCell>
                      <TableCell
                        sx={{ padding: "2px 8px", fontSize: "0.75rem" }}
                      >
                        {item.originalAccountName}
                      </TableCell>
                      <TableCell align="right" sx={{ padding: "2px 8px" }}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          fontSize="0.75rem"
                          color={
                            item.amount >= 0 ? "success.main" : "error.main"
                          }
                        >
                          ${Math.abs(item.amount).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface CustomizedDataGridProps {
  data?: ProfitLossData | null;
}

export default function CustomizedDataGrid({ data }: CustomizedDataGridProps) {
  // Transform financial data to match original structure
  const transformFinancialData = (
    profitLossData: ProfitLossData
  ): RowData[] => {
    const rows: RowData[] = [];
    let rowId = 1;

    // Create a global account groups object to accumulate data across all sections
    const allAccountGroups: Record<
      string,
      {
        accountName: string;
        accountCode: string;
        type: string;
        companies: Set<string>;
        periodAmounts: number[];
        totalAmount: number;
        periodCount: number;
        breakdown: Array<{
          company: string;
          period: string;
          amount: number;
          originalAccountName: string;
        }>;
      }
    > = {};

    profitLossData.sections.forEach((section) => {
      // Process all accounts in this section
      Object.entries(section.accounts).forEach(([period, periodData]) => {
        Object.entries(periodData).forEach(([companyName, accounts]) => {
          accounts.forEach((account) => {
            const key = account.accountCode;

            if (!allAccountGroups[key]) {
              allAccountGroups[key] = {
                accountName: account.accountName,
                accountCode: account.accountCode,
                type: section.type,
                companies: new Set(),
                periodAmounts: new Array(profitLossData.periods.length).fill(0),
                totalAmount: 0,
                periodCount: profitLossData.periods.length,
                breakdown: []
              };
            }

            allAccountGroups[key].companies.add(companyName);
            const periodIndex = profitLossData.periods.indexOf(period);

            if (periodIndex !== -1) {
              const amountToAdd = Math.abs(account.amount);
              allAccountGroups[key].periodAmounts[periodIndex] += amountToAdd;
            }

            allAccountGroups[key].totalAmount += Math.abs(account.amount);

            // Add to breakdown for expandable view
            allAccountGroups[key].breakdown.push({
              company: companyName,
              period: period,
              amount: account.amount,
              originalAccountName: account.originalAccountName
            });
          });
        });
      });
    });

    // Convert all account groups to rows
    Object.values(allAccountGroups).forEach((group) => {
      const row: RowData = {
        id: rowId++,
        pageTitle: group.accountName,
        status: group.type === "income" ? "Income" : "Expense",
        users: Math.round(group.totalAmount).toLocaleString(),
        eventCount: group.companies.size,
        viewsPerUser: Math.round(group.totalAmount / group.periodCount).toFixed(
          0
        ),
        averageTime: `${group.periodCount} periods`,
        conversions: group.periodAmounts,
        periodLabels: profitLossData.periods, // Pass period labels
        breakdown: group.breakdown
      };

      rows.push(row);
    });

    return rows;
  };

  // Get rows from financial data or fallback to empty
  const rows = data ? transformFinancialData(data) : [];

  return (
    <TableContainer
      component={Paper}
      sx={{
        overflow: "clip",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.default"
      }}
    >
      <Table
        aria-label="financial data table"
        sx={{
          "& .MuiTableCell-root": {
            borderTop: "1px solid",
            borderTopColor: "divider",
            fontSize: "0.875rem",
            padding: "8px 16px"
          }
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "background.paper",
              "& .MuiTableCell-head": {
                fontWeight: 600,
                fontSize: "0.875rem",
                padding: "12px 16px"
              }
            }}
          >
            <TableCell sx={{ width: 48, padding: "12px 8px !important" }} />
            <TableCell>Account Name</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="right">Total Amount</TableCell>
            <TableCell align="right">Companies</TableCell>
            <TableCell align="right">Avg per Period</TableCell>
            <TableCell align="right">Period Info</TableCell>
            <TableCell align="right">Period Amounts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row key={row.id} row={row} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
