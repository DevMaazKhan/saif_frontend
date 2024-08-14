import { Menu } from "@/constants/menu";
import SalesmanCustomersContextProvider from "./SalesmanCustomers.context";
import { Route, Routes } from "react-router-dom";
import SalesmanCustomersDashboard from "./components/SalesmanCustomersDashboard";

interface SalesmanCustomersProps {
  menu: Menu;
}

const SalesmanCustomers = (props: SalesmanCustomersProps) => {
  const { menu } = props;

  return (
    <SalesmanCustomersContextProvider>
      <Routes>
        <Route path="/" element={<SalesmanCustomersDashboard menu={menu} />} />
      </Routes>
    </SalesmanCustomersContextProvider>
  );
};

export { SalesmanCustomers };
