import { Menu } from "@/constants/menu";
import { Route, Routes } from "react-router-dom";
import CompanyTable from "./components/SalesmanTable";
import CompanyCreateEdit from "./components/SalesmanCreateEdit";
import CompanyContextProvider from "./Salesman.context";

interface CompanyProps {
  menu: Menu;
}

const Salesman = (props: CompanyProps) => {
  const { menu } = props;

  return (
    <CompanyContextProvider>
      <Routes>
        <Route path="/" element={<CompanyTable menu={menu} />} />
        <Route path="/new" element={<CompanyCreateEdit menu={menu} />} />
        <Route path="/edit/:id" element={<CompanyCreateEdit menu={menu} />} />
      </Routes>
    </CompanyContextProvider>
  );
};

export { Salesman };
