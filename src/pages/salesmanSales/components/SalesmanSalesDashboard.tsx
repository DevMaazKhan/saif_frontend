import customerApi from "@/api/customer.api";
import inventoryTransactionApi from "@/api/inventoryTransaction.api";
import productApi from "@/api/product.api";
import salesmanApi from "@/api/salesman.api";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/comboBox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menu } from "@/constants/menu";
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
    accessorKey: "transactionNo",
    header: "Transaction No",
  },
  {
    accessorKey: "Date",
    header: "Date",
    cell: ({ row }) => <span>{moment(row.original.transactionDate).format("DD-MMM-YYYY hh:mm A")}</span>,
  },
  {
    accessorKey: "transactionAmount",
    header: "Amount",
    cell: ({ row }) => <span>{formatAmount(row.original.transactionAmount)}</span>,
  },
  {
    accessorKey: "Party",
    header: "Party",
    cell: ({ row }) => <span>{row.original.party?.nameFull}</span>,
  },
];

const ItemStockDashboard = (props: PageProps) => {
  const { menu } = props;
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [selectedDateFrom, setSelectedDateFrom] = useState(moment().format("YYYY-MM-DD"));
  const [selectedDateTo, setSelectedDateTo] = useState(moment().add(1, "month").format("YYYY-MM-DD"));
  const [withDate, setWithDate] = useState(false);
  const [withProduct, setWithProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const { data: salesman } = useQuery(["salesman"], salesmanApi.getAllSalesman);

  const { mutate: getSalesmanSales, data: salesmanInvoices } = useMutation({
    mutationFn: inventoryTransactionApi.getSalesmanSales,
  });

  const onCustomerChange = (itemID: string) => {
    const customer = salesman?.responseData.parties.find((el) => el.id === itemID);

    if (customer) {
      setSelectedSalesman(customer);
    }
  };

  const table = useReactTable({
    data: salesmanInvoices?.responseData.invoices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (selectedSalesman) {
      getSalesmanSales({ withProduct, productID: selectedProduct, salesmanID: selectedSalesman.id, dateFrom: selectedDateFrom, dateTo: selectedDateTo, withDate });
    }
  }, [selectedSalesman, withDate, selectedDateFrom, selectedDateTo, withProduct, selectedProduct]);

  const totalSales = useMemo(() => salesmanInvoices?.responseData.invoices.reduce((prev, curr) => (prev += curr.transactionAmount), 0), [salesmanInvoices]);

  const { data: items } = useQuery(["items"], {
    queryFn: () => productApi.getAllProducts(),
  });

  return (
    <div className="p-2">
      <PageHeader menu={menu} />

      <div className="w-[300px]">
        <Combobox
          key="selectCompany"
          label="Select Salesman"
          placeholder="Select Salesman"
          onChange={(value, option) => {
            onCustomerChange(option.id);
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
            Salesman Sales: <b>{formatAmount(totalSales)}</b>
          </span>
          <hr className="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />

          <div className="w-full mt-6">
            <div className="flex flex-col gap-4 mt-3">
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

            <div className="flex flex-col gap-4 mt-3">
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  id="withProduct"
                  checked={withProduct}
                  onCheckedChange={(checked) => {
                    setWithProduct(checked as boolean);
                  }}
                />
                <Label htmlFor="withProduct">With Product</Label>
              </div>

              <div className={`flex flex-row gap-4  ${withProduct ? "opacity-100" : "opacity-40"}`}>
                <Select
                  disabled={!withProduct}
                  onValueChange={(value) => {
                    setSelectedProduct(value);
                  }}
                >
                  <SelectTrigger className="w-[300px]" autoFocus>
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {items?.responseData.items?.map((party) => (
                      <SelectItem value={party.id}>{party.nameFull}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default ItemStockDashboard;
