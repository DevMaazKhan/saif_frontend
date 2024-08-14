import { Menu } from "@/constants/menu";
import { Route, Routes } from "react-router-dom";
import SalesInvoiceTable from "./components/SaleInvoiceTable";
import SalesInvoiceCreateEdit from "./components/SaleInvoiceCreateEdit";
import SalesInvoiceContextProvider from "./SaleInvoice.context";

interface SalesInvoiceProps {
  menu: Menu;
}

const SalesInvoice = (props: SalesInvoiceProps) => {
  const { menu } = props;

  return (
    <SalesInvoiceContextProvider>
      <Routes>
        <Route path="/" element={<SalesInvoiceTable menu={menu} />} />
        <Route path="/new" element={<SalesInvoiceCreateEdit menu={menu} />} />
        <Route path="/view/:id" element={<SalesInvoiceCreateEdit menu={menu} />} />
      </Routes>
    </SalesInvoiceContextProvider>
  );
};

export { SalesInvoice };
