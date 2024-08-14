import accountTransactionApi from "@/api/accountTransaction.api";
import coaApi from "@/api/coa.api";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/comboBox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Menu } from "@/constants/menu";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { DotsVerticalIcon, Pencil1Icon, PlusIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const columns = [
  {
    accessorKey: "narration",
    header: "Narration",
  },
  {
    accessorKey: "credit",
    header: "Amount",
  },
  {
    accessorKey: "amount",
    header: "Account",
    cell: ({ row }) => row.original?.account?.acName,
  },
];

const formDefaultValues = {
  id: "",
  acID: "",
  amount: "",
  narration: "",
};

interface PageProps {
  menu: Menu;
}

const AddExpenseDashboard = (props: PageProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { menu } = props;

  const { toast } = useToast();
  const { startLoading, endLoading } = useLoadingContext();
  const queryClient = useQueryClient();

  const { data: expenseAccounts } = useQuery(["expensesAccounts"], coaApi.getAllExpenseAccount);
  const { data: expenses } = useQuery(["expenses"], accountTransactionApi.getAllExpenses);

  const { mutate: createAccount } = useMutation({
    mutationFn: accountTransactionApi.createExpense,
    onSettled: () => {
      endLoading();
      toast({
        title: "Expense Created Successfully",
        className: "bg-green-400 text-white",
      });
      formMethods.reset(formDefaultValues);
      queryClient.invalidateQueries(["expenses"]);
    },
  });
  const { mutate: updateExpense } = useMutation({
    mutationFn: accountTransactionApi.updateExpense,
    onSettled: () => {
      endLoading();
      toast({
        title: "Expense Updated Successfully",
        className: "bg-green-400 text-white",
      });
      formMethods.reset(formDefaultValues);
      queryClient.invalidateQueries(["expenses"]);
    },
  });

  const formMethods = useForm({
    defaultValues: formDefaultValues,
  });

  function onEditClickHandler(ac: any) {
    formMethods.reset({
      acID: ac.accountID,
      amount: ac.credit,
      id: ac.id,
      narration: ac.narration,
    });

    setSheetOpen(true);
  }

  const table = useReactTable({
    data: expenses?.responseData.expenses || [],
    columns: [
      ...columns,
      {
        id: "actions",
        cell: ({ row: { original } }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <DotsVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 justify-start"
                  onClick={() => {
                    onEditClickHandler(original);
                  }}
                >
                  Edit Account
                  <Pencil1Icon />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  function onSubmit(data: any) {
    startLoading("Created Expense Account");

    if (data.id) {
      updateExpense({ data, expenseID: data.id });
      setSheetOpen(false);
      formMethods.reset(formDefaultValues);
    } else {
      createAccount(data);
      setSheetOpen(false);
      formMethods.reset(formDefaultValues);
    }
  }

  const expenseID = formMethods.watch("id");

  return (
    <>
      <Sheet
        open={sheetOpen}
        onOpenChange={(value) => {
          if (!value) {
            formMethods.reset(formDefaultValues);
          }

          setSheetOpen(value);
        }}
      >
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>{expenseID ? "Update Expense" : "Add Expense"}</SheetTitle>
          </SheetHeader>
          <form
            className="flex-1 flex flex-col justify-between"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              formMethods.handleSubmit(onSubmit)();
            }}
          >
            <div className="flex flex-col gap-3 mt-3">
              <Controller
                name="acID"
                control={formMethods.control}
                render={({ field, fieldState }) => (
                  <Combobox
                    label="Select Account"
                    placeholder="Select Account"
                    value={field.value}
                    onChange={(value, option) => {
                      field.onChange(option.id);
                    }}
                    disabled={!!expenseID}
                    options={expenseAccounts?.responseData.expenseAccounts || []}
                    labelKey="acName"
                    valueKey="id"
                    searchKey="acName"
                    error={fieldState.error?.message || undefined}
                  />
                )}
              />
              <Controller
                name="amount"
                control={formMethods.control}
                render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} className="w-full" placeholder="Amount" type="number" />}
              />
              <Controller
                name="narration"
                control={formMethods.control}
                render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} className="w-full" placeholder="Comment" />}
              />
            </div>

            <SheetFooter>
              <Button type="submit">Add</Button>
              <Button type="button" variant="destructive">
                Cancel
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <div className="p-2">
        <PageHeader
          menu={menu}
          actions={
            <Button
              icon={<PlusIcon className="text-white" />}
              onClick={(e) => {
                e.stopPropagation();
                setSheetOpen(true);
              }}
            >
              Add New Expense
            </Button>
          }
        />

        <div className="rounded-md border">
          <Table>
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
    </>
  );
};

export default AddExpenseDashboard;
