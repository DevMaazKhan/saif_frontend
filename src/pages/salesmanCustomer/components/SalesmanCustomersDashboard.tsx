import customerApi from "@/api/customer.api";
import inventoryTransactionApi from "@/api/inventoryTransaction.api";
import salesmanApi from "@/api/salesman.api";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/comboBox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menu } from "@/constants/menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";

interface PageProps {
  menu: Menu;
}

const columns = [
  {
    accessorKey: "nameFull",
    header: "Customer Name",
  },
  {
    accessorKey: "Area",
    header: "Area",
    cell: ({ row }) => <span>{row.original.area?.name}</span>,
  },
];

const ItemStockDashboard = (props: PageProps) => {
  const { menu } = props;
  const [selectedSalesman, setSelectedSalesman] = useState("");

  const { data: salesman } = useQuery(["salesman"], salesmanApi.getAllSalesman);

  const { mutate: getSalesmanCustomers, data: salesmanCustomers } = useMutation({
    mutationFn: salesmanApi.getSalesmanCustomer,
  });

  const onSalesmanSelect = (salesmanID: string) => {
    const selectedSalesman = salesman?.responseData.parties.find((el) => el.id === salesmanID);

    if (selectedSalesman) {
      setSelectedSalesman(selectedSalesman);
    }
  };

  const table = useReactTable({
    data: salesmanCustomers?.responseData.customers || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (selectedSalesman) {
      getSalesmanCustomers(selectedSalesman.id);
    }
  }, [selectedSalesman]);

  return (
    <div className="p-2">
      <PageHeader menu={menu} />

      <div className="w-[300px]">
        <Combobox
          key="selectCompany"
          label="Select Salesman"
          placeholder="Select Salesman"
          onChange={(value, option) => {
            onSalesmanSelect(option.id);
          }}
          value={selectedSalesman.id}
          options={salesman?.responseData.parties || []}
          autoFocus
          labelKey="nameFull"
          valueKey="id"
          searchKey="nameFull"
        />
      </div>

      {selectedSalesman ? (
        <div className="shadow-md w-full rounded-sm p-3 mt-3 flex flex-col">
          <span>
            Salesman Name: <b>{selectedSalesman.nameFull}</b>
          </span>
          <span>
            Total Customers: <b>{salesmanCustomers?.responseData.customers?.length}</b>
          </span>
          <hr className="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />

          <div className="w-full mt-1">
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

export default ItemStockDashboard;
