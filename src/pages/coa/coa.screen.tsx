import { Menu } from "@/constants/menu";
import { Route, Routes } from "react-router-dom";
import COADashboard from "./components/COADashboard";
import COAContextProvider from "./coa.context";

interface COAProps {
  menu: Menu;
}

const COA = (props: COAProps) => {
  const { menu } = props;

  return (
    <COAContextProvider>
      <Routes>
        <Route path="/" element={<COADashboard menu={menu} />} />
      </Routes>
    </COAContextProvider>
  );
};

export { COA };
