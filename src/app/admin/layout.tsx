import type { Layout } from "@/types";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import theme from "./_theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import RecoilRoot from "@/app/_components/RecoilRoot";
import PbAuthUpdater from "./_pbAuthUpdater";

const Layout: Layout = ({ children }) => {
  return (
    <html>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <RecoilRoot>
              <PbAuthUpdater />
              <CssBaseline />
              {children}
            </RecoilRoot>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default Layout;
