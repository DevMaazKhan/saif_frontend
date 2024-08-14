import { Menu } from "@/constants/menu";
import CustomerSalesContextProvider from "./CustomerSales.context";
import { Route, Routes } from "react-router-dom";
import CustomerSalesDashboard from "./components/CustomerSalesDashboard";

interface CustomerSalesProps {
  menu: Menu;
}

const CustomerSales = (props: CustomerSalesProps) => {
  const { menu } = props;

  return (
    <CustomerSalesContextProvider>
      <Routes>
        <Route path="/" element={<CustomerSalesDashboard menu={menu} />} />
      </Routes>
    </CustomerSalesContextProvider>
  );
};

export { CustomerSales };
