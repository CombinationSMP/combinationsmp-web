// import "@/styles/fonts.scss";
import palette from "@/styles/vars.module.scss";
import "@/styles/globals.scss";
import type { Layout } from "@/types";
import { type Metadata } from "next";
import banner from "@/../public/assets/banner.png";

export const metadata: Metadata = {
  title: "CombinationSMP",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const RootLayout: Layout = ({ children }) => {
  return (
    <html>
      <body>
        <div
          style={{
            backgroundColor: palette.primary,
            backgroundImage: `url("${banner.src}")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            width: "100vw",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            overflowY: "scroll",
            padding: "2rem 0",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
