// Header Component
// Updated header for financial data integration application

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
        pb: 2
      }}
      spacing={2}
    >
      <Box>
        <NavbarBreadcrumbs />
        <Typography variant="h4" component="h1" sx={{ mt: 1 }}>
          Financial Data Integration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Unified profit & loss reporting from multiple data sources
        </Typography>
      </Box>
    </Stack>
  );
}
