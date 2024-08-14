import { Menu } from "@/constants/menu";
import { Route, Routes } from "react-router-dom";
import ViewExpenseDashboard from "./components/ViewExpenseDashboard";
import ViewExpenseContextProvider from "./viewExpense.context";

interface ViewExpenseProps {
  menu: Menu;
}

const ViewExpense = (props: ViewExpenseProps) => {
  const { menu } = props;

  return (
    <ViewExpenseContextProvider>
      <Routes>
        <Route path="/" element={<ViewExpenseDashboard menu={menu} />} />
      </Routes>
    </ViewExpenseContextProvider>
  );
};

export { ViewExpense };
