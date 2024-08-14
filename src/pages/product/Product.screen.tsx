import { Menu } from "@/constants/menu";
import { Route, Routes } from "react-router-dom";
import ProductTable from "./components/ProductTable";
import ProductCreateEdit from "./components/ProductCreateEdit";
import ProductContextProvider from "./Product.context";

interface ProductProps {
  menu: Menu;
}

const Product = (props: ProductProps) => {
  const { menu } = props;

  return (
    <ProductContextProvider>
      <Routes>
        <Route path="/" element={<ProductTable menu={menu} />} />
        <Route path="/new" element={<ProductCreateEdit menu={menu} />} />
        <Route path="edit/:id" element={<ProductCreateEdit menu={menu} />} />
      </Routes>
    </ProductContextProvider>
  );
};

export { Product };
