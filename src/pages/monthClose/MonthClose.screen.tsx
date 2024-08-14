import { Menu } from "@/constants/menu";
import { Route, Routes } from "react-router-dom";
import MonthCloseDashboard from "./components/MonthCloseDashboard";
import MonthCloseContextProvider from "./MonthClose.context";

interface MonthCloseProps {
  menu: Menu;
}

const MonthClose = (props: MonthCloseProps) => {
  const { menu } = props;

  return (
    <MonthCloseContextProvider>
      <Routes>
        <Route path="/" element={<MonthCloseDashboard menu={menu} />} />
      </Routes>
    </MonthCloseContextProvider>
  );
};

export { MonthClose };
