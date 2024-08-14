import { Menu } from "@/constants/menu";
import { Route, Routes } from "react-router-dom";
import AddExpenseDashboard from "./components/AddExpenseDashboard";
import AddExpenseContextProvider from "./addExpense.context";

interface AddExpenseProps {
  menu: Menu;
}

const AddExpense = (props: AddExpenseProps) => {
  const { menu } = props;

  return (
    <AddExpenseContextProvider>
      <Routes>
        <Route path="/" element={<AddExpenseDashboard menu={menu} />} />
      </Routes>
    </AddExpenseContextProvider>
  );
};

export { AddExpense };
