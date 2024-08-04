import type { Layout } from "@/types";
import OriginList from "./_originList";

const Layout: Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <OriginList />
      {children}
    </div>
  );
};

export default Layout;
