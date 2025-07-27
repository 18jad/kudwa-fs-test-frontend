import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";

interface PageViewsBarChartProps {
  data?: {
    accountNames: string[];
    amounts: number[];
    totalAccounts: number;
  };
}

export default function PageViewsBarChart({ data }: PageViewsBarChartProps) {
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light
  ];

  if (!data) {
    return (
      <Card variant="outlined" sx={{ width: "100%" }}>
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            Top Revenue Accounts
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            No financial data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = data.amounts.reduce((a, b) => a + b, 0);
  const avgRevenue = totalRevenue / data.amounts.length;
  const topAccountPercent =
    data.amounts.length > 0
      ? ((data.amounts[0] / totalRevenue) * 100).toFixed(0)
      : "0";

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Top Revenue Accounts
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
              {data.totalAccounts}
            </Typography>
            <Chip
              size="small"
              color="success"
              label={`+${topAccountPercent}%`}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Revenue accounts generating highest income
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "band",
              categoryGapRatio: 0.5,
              data: data.accountNames,
              height: 24
            }
          ]}
          yAxis={[{ width: 60 }]}
          series={[
            {
              id: "revenue-amounts",
              label: "Revenue",
              data: data.amounts
            }
          ]}
          height={250}
          margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          hideLegend
        />
      </CardContent>
    </Card>
  );
}
