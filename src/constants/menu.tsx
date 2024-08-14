import { Company } from "@/pages/company/Company.screen";
import { Customer } from "@/pages/customer/Customer.screen";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { ItemStock } from "@/pages/itemStock/ItemStock.screen";
import { Product } from "@/pages/product/Product.screen";
import { PurchaseInvoice } from "@/pages/purchaseInvoice/PurchaseInvoice.screen";
import { SalesInvoice } from "@/pages/salesInvoice/SaleInvoice.screen";
import { Salesman } from "@/pages/salesman/Salesman.screen";
import { DashboardIcon, GearIcon } from "@radix-ui/react-icons";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdPointOfSale } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { CustomerSales } from "@/pages/customerSales/CustomerSales.screen";
import { SalesmanSales } from "@/pages/salesmanSales/SalesmanSales.screen";
import { SalesReturn } from "@/pages/salesReturn/SaleReturn.screen";
import { SalesmanCustomers } from "@/pages/salesmanCustomer/SalesmanCustomers.screen";
import { COA } from "@/pages/coa/coa.screen";
import { AddExpense } from "@/pages/addExpense/addExpense.screen";
import { ViewExpense } from "@/pages/viewExpenses/viewExpense.screen";
import { MonthClose } from "@/pages/monthClose/MonthClose.screen";
import { CompanyLedger } from "@/pages/companyLedger/CompanyLedger.screen";

export interface Menu {
  id: string;
  title: string;
  path?: string;
  component: (props: any) => JSX.Element;
  hidden?: boolean;
  icon?: JSX.Element;
  pageTitle?: string;
  child?: Menu[];
}

export const MENU: Menu[] = [
  {
    id: "INVENTORY",
    title: "Inventory",
    component: Dashboard,
    icon: <AiOutlineShoppingCart className="w-[18px] h-[18px]" />,
    child: [
      {
        id: "PURCHASE_INVOICE",
        title: "Purchase Invoice",
        path: "purchase-invoice",
        pageTitle: "Purchase Invoice",
        component: PurchaseInvoice,
      },
    ],
  },
  {
    id: "SALES",
    title: "Sales",
    component: Dashboard,
    icon: <MdPointOfSale className="w-[18px] h-[18px]" />,
    child: [
      {
        id: "SALE_INVOICE",
        title: "Sale Invoice",
        path: "sale-invoice",
        pageTitle: "Sale Invoice",
        component: SalesInvoice,
      },
      {
        id: "SALE_RETURN",
        title: "Sale Return",
        path: "sale-return",
        pageTitle: "Sale Return",
        component: SalesReturn,
      },
    ],
  },
  {
    id: "REPORTS",
    title: "Reports",
    component: Dashboard,
    icon: <HiOutlineDocumentReport className="w-[18px] h-[18px]" />,
    child: [
      {
        id: "COMPANY_LEDGER",
        title: "Company Ledger",
        path: "company-ledger",
        pageTitle: "Company Ledger",
        component: CompanyLedger,
      },
      {
        id: "CUSTOMER_SALES",
        title: "Customer Sales",
        path: "customer-sales",
        pageTitle: "Customer Sales",
        component: CustomerSales,
      },
      {
        id: "SALESMAN_SALES",
        title: "Salesman Sales",
        path: "salesman-sales",
        pageTitle: "Salesman Sales",
        component: SalesmanSales,
      },
      {
        id: "SALESMAN_CUSTOMER",
        title: "Salesman Customers",
        path: "salesman-customers",
        pageTitle: "Salesman Customers",
        component: SalesmanCustomers,
      },
      {
        id: "ITEM_STOCK",
        title: "View Item Stock",
        path: "item-stock",
        pageTitle: "View Item Stock",
        component: ItemStock,
      },
      {
        id: "VIEW_EXPENSES",
        title: "View Expenses",
        path: "view-expense",
        pageTitle: "View Expenses",
        component: ViewExpense,
      },
      {
        id: "MONTH_CLOSE",
        title: "Month Close",
        path: "month-close",
        pageTitle: "Month Close",
        component: MonthClose,
      },
    ],
  },
  {
    id: "SETUP",
    title: "Setup",
    component: Dashboard,
    icon: <GearIcon className="w-[18px] h-[18px]" />,
    child: [
      {
        id: "PRODUCT",
        title: "Product",
        path: "product",
        pageTitle: "Product",
        component: Product,
      },
      {
        id: "CUSTOMER",
        title: "Customer",
        path: "customer",
        pageTitle: "Customers",
        component: Customer,
      },
      {
        id: "COMPANY",
        title: "Company",
        path: "company",
        pageTitle: "Company",
        component: Company,
      },
      {
        id: "SALESMAN",
        title: "Salesman",
        path: "salesman",
        pageTitle: "Salesman",
        component: Salesman,
      },
      {
        id: "EXPENSE_ACCOUNT",
        title: "Expense Accounts",
        path: "expense_accounts",
        pageTitle: "Expense Accounts",
        component: COA,
      },
      {
        id: "ADD_EXPENSE",
        title: "Add Expense",
        path: "add_expense",
        pageTitle: "Add Expense",
        component: AddExpense,
      },
    ],
  },
];
