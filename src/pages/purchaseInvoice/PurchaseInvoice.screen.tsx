import { Menu } from "@/constants/menu";
import { Route, Routes } from "react-router-dom";
import PurchaseInvoiceTable from "./components/PurchaseInvoiceTable";
import PurchaseInvoiceCreateEdit from "./components/PurchaseInvoiceCreateEdit";
import PurchaseInvoiceContextProvider from "./PurchaseInvoice.context";

interface PurchaseInvoiceProps {
  menu: Menu;
}

const PurchaseInvoice = (props: PurchaseInvoiceProps) => {
  const { menu } = props;

  return (
    <PurchaseInvoiceContextProvider>
      <Routes>
        <Route path="/" element={<PurchaseInvoiceTable menu={menu} />} />
        <Route path="/new" element={<PurchaseInvoiceCreateEdit menu={menu} />} />
        <Route path="/view/:id" element={<PurchaseInvoiceCreateEdit menu={menu} />} />
      </Routes>
    </PurchaseInvoiceContextProvider>
  );
};

export { PurchaseInvoice };
