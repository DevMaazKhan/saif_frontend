import { Menu } from "@/constants/menu";
import ItemStockContextProvider from "./ItemStock.context";
import { Route, Routes } from "react-router-dom";
import ItemStockDashboard from "./components/ItemStockDashboard";

interface ItemStockProps {
  menu: Menu;
}

const ItemStock = (props: ItemStockProps) => {
  const { menu } = props;

  return (
    <ItemStockContextProvider>
      <Routes>
        <Route path="/" element={<ItemStockDashboard menu={menu} />} />
      </Routes>
    </ItemStockContextProvider>
  );
};

export { ItemStock };
