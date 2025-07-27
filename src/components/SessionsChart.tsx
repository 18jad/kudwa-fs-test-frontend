import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts/LineChart";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

interface SessionsChartProps {
  data?: {
    periods: string[];
    revenue: number[];
    expenses: number[];
    netIncome: number[];
  };
}

export default function SessionsChart({ data }: SessionsChartProps) {
  const theme = useTheme();

  if (!data) {
    return (
      <Card variant="outlined" sx={{ width: "100%" }}>
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            Financial Trends
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            No financial data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const colorPalette = [
    theme.palette.success.main, // Revenue - Green
    theme.palette.error.main, // Expenses - Red
    theme.palette.primary.main // Net Income - Blue
  ];

  // Calculate trend
  const totalRevenue = data.revenue.reduce((a, b) => a + b, 0);
  const totalExpenses = data.expenses.reduce((a, b) => a + b, 0);
  const netIncome = totalRevenue - totalExpenses;
  const isProfit = netIncome >= 0;
  const trendPercent =
    totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : "0";

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Financial Trends
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1
            }}
          >
            <Typography variant="h4" component="p">
              ${(totalRevenue / 1000000).toFixed(1)}M
            </Typography>
            <Chip
              size="small"
              color={isProfit ? "success" : "error"}
              label={`${isProfit ? "+" : ""}${trendPercent}%`}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Revenue vs Expenses across all periods
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "point",
              data: data.periods.slice(-12), // Show last 12 periods
              tickInterval: (index, i) => (i + 1) % 2 === 0, // Show every 2nd label
              height: 24
            }
          ]}
          yAxis={[{ width: 60 }]}
          series={[
            {
              id: "revenue",
              label: "Revenue",
              showMark: false,
              curve: "linear",
              area: true,
              data: data.revenue.slice(-12)
            },
            {
              id: "expenses",
              label: "Expenses",
              showMark: false,
              curve: "linear",
              area: true,
              data: data.expenses.slice(-12)
            },
            {
              id: "netincome",
              label: "Net Income",
              showMark: false,
              curve: "linear",
              area: true,
              data: data.netIncome.slice(-12)
            }
          ]}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-revenue": {
              fill: "url('#revenue')"
            },
            "& .MuiAreaElement-series-expenses": {
              fill: "url('#expenses')"
            },
            "& .MuiAreaElement-series-netincome": {
              fill: "url('#netincome')"
            }
          }}
          hideLegend
        >
          <AreaGradient color={theme.palette.success.main} id="revenue" />
          <AreaGradient color={theme.palette.error.main} id="expenses" />
          <AreaGradient color={theme.palette.primary.main} id="netincome" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
