import accountTransactionApi from "@/api/accountTransaction.api";
import coaApi from "@/api/coa.api";
import inventoryTransactionApi from "@/api/inventoryTransaction.api";
import itemStockApi from "@/api/itemStock.api";
import productApi from "@/api/product.api";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/comboBox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menu } from "@/constants/menu";
import { TRANSACTION_TYPES } from "@/constants/setup";
import { formatAmount } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";

interface PageProps {
  menu: Menu;
}

const columns = [
  {
    accessorKey: "narration",
    header: "Narration",
  },
  {
    accessorKey: "credit",
    header: "Amount",
    cell: ({ row }) => formatAmount(row.original?.credit),
  },
  {
    accessorKey: "amount",
    header: "Account",
    cell: ({ row }) => row.original?.account?.acName,
  },
];

const ViewExpenseDashboard = (props: PageProps) => {
  const { menu } = props;
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedDateFrom, setSelectedDateFrom] = useState(moment().format("YYYY-MM-DD"));
  const [selectedDateTo, setSelectedDateTo] = useState(moment().add(1, "month").format("YYYY-MM-DD"));
  const [withDate, setWithDate] = useState(false);
  const { data: expenseAccounts } = useQuery(["expenseAccounts"], {
    queryFn: () => coaApi.getAllExpenseAccount(),
  });

  const { mutate: getExpenseByAccount, data: expenses } = useMutation({
    mutationFn: accountTransactionApi.getAllExpensesByAccount,
  });

  const onAccountChange = (acID: string) => {
    const account = expenseAccounts?.responseData.expenseAccounts.find((el) => el.id === acID);

    if (account) {
      setSelectedAccount(account);
    }
  };

  const table = useReactTable({
    data: expenses?.responseData.expenses || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (selectedAccount) {
      getExpenseByAccount({ accountID: selectedAccount.id, dateFrom: selectedDateFrom, dateTo: selectedDateTo, withDate });
    }
  }, [selectedAccount, withDate, selectedDateFrom, selectedDateTo]);

  const total = useMemo(() => expenses?.responseData.expenses?.reduce((prev, curr) => (prev += +curr.credit), 0), [expenses?.responseData.expenses]);

  return (
    <div className="p-2">
      <PageHeader menu={menu} />

      <div className="w-[300px]">
        <Combobox
          key="selectCompany"
          label="Select Expense Account"
          placeholder="Select Expense Account"
          onChange={(value, option) => {
            onAccountChange(option.id);
          }}
          value={selectedAccount.id}
          options={expenseAccounts?.responseData.expenseAccounts || []}
          autoFocus
          labelKey="acName"
          valueKey="id"
          searchKey="acName"
        />
      </div>

      {selectedAccount ? (
        <div className="shadow-md w-full rounded-sm p-3 mt-3 flex flex-col">
          <span>Total Expense: {formatAmount(total)}</span>

          <div className="w-full mt-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  id="withDate"
                  checked={withDate}
                  onCheckedChange={(checked) => {
                    setWithDate(checked as boolean);
                  }}
                />
                <Label htmlFor="withDate">With Date</Label>
              </div>

              <div className={`flex flex-row gap-4  ${withDate ? "opacity-100" : "opacity-40"}`}>
                <div>
                  <Label>Date From</Label>
                  <Input
                    type="date"
                    value={selectedDateFrom}
                    onChange={(e) => {
                      setSelectedDateFrom(e.target.value);
                    }}
                    disabled={!withDate}
                  />
                </div>
                <div>
                  <Label>Date To</Label>
                  <Input
                    type="date"
                    value={selectedDateTo}
                    onChange={(e) => {
                      setSelectedDateTo(e.target.value);
                    }}
                    disabled={!withDate}
                  />
                </div>
              </div>
            </div>
            <Table className="mt-3">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ViewExpenseDashboard;
