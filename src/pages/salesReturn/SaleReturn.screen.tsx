import { Menu } from "@/constants/menu";
import { Route, Routes } from "react-router-dom";
import SalesReturnDashboard from "./components/SaleReturnDashboard";
import SalesReturnContextProvider from "./SaleReturn.context";

interface SalesReturnProps {
  menu: Menu;
}

const SalesReturn = (props: SalesReturnProps) => {
  const { menu } = props;

  return (
    <SalesReturnContextProvider>
      <Routes>
        <Route path="/" element={<SalesReturnDashboard menu={menu} />} />
      </Routes>
    </SalesReturnContextProvider>
  );
};

export { SalesReturn };
