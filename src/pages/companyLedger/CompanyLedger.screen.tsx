import { Menu } from "@/constants/menu";
import CompanyLedgerContextProvider from "./CompanyLedger.context";
import { Route, Routes } from "react-router-dom";
import CompanyLedgerDashboard from "./components/CompanyLedgerDashboard";

interface CompanyLedgerProps {
  menu: Menu;
}

const CompanyLedger = (props: CompanyLedgerProps) => {
  const { menu } = props;

  return (
    <CompanyLedgerContextProvider>
      <Routes>
        <Route path="/" element={<CompanyLedgerDashboard menu={menu} />} />
      </Routes>
    </CompanyLedgerContextProvider>
  );
};

export { CompanyLedger };
