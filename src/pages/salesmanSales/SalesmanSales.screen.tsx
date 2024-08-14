import { Menu } from "@/constants/menu";
import SalesmanSalesContextProvider from "./SalesmanSales.context";
import { Route, Routes } from "react-router-dom";
import SalesmanSalesDashboard from "./components/SalesmanSalesDashboard";

interface SalesmanSalesProps {
  menu: Menu;
}

const SalesmanSales = (props: SalesmanSalesProps) => {
  const { menu } = props;

  return (
    <SalesmanSalesContextProvider>
      <Routes>
        <Route path="/" element={<SalesmanSalesDashboard menu={menu} />} />
      </Routes>
    </SalesmanSalesContextProvider>
  );
};

export { SalesmanSales };
