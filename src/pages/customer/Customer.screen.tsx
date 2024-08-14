import { Menu } from "@/constants/menu";
import { Route, Routes } from "react-router-dom";
import CustomerTable from "./components/CustomerTable";
import CustomerCreateEdit from "./components/CustomerCreateEdit";
import CustomerContextProvider from "./Customer.context";

interface CompanyProps {
  menu: Menu;
}

const Customer = (props: CompanyProps) => {
  const { menu } = props;

  return (
    <CustomerContextProvider>
      <Routes>
        <Route path="/" element={<CustomerTable menu={menu} />} />
        <Route path="/new" element={<CustomerCreateEdit menu={menu} />} />
        <Route path="/edit/:id" element={<CustomerCreateEdit menu={menu} />} />
      </Routes>
    </CustomerContextProvider>
  );
};

export { Customer };
