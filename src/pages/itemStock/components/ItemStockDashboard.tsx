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
import { useEffect, useState } from "react";

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
    cell: ({ row }) => <span>{formatAmount(row.original.inventoryTransactionItems?.reduce((prev, curr) => (prev += curr.comQty * curr.price), 0))}</span>,
  },
  {
    accessorKey: "Party",
    header: "Party",
    cell: ({ row }) => <span>{row.original.party?.nameFull}</span>,
  },
  {
    accessorKey: "comQty",
    header: "Com Qty",
    cell: ({ row }) => (
      <span className={`font-bold ${row.original.transactionType === TRANSACTION_TYPES.PURCHASE_INVOICE ? "text-green-600" : "text-red-600"}`}>
        {row.original.inventoryTransactionItems[0]?.comQty}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Bonus Qty",
    cell: ({ row }) => (
      <span className={`font-bold ${row.original.transactionType === TRANSACTION_TYPES.PURCHASE_INVOICE ? "text-green-600" : "text-red-600"}`}>
        {row.original.inventoryTransactionItems[0]?.bonusQty}
      </span>
    ),
  },
];

const ItemStockDashboard = (props: PageProps) => {
  const { menu } = props;
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedInvoiceType, setSelectedInvoiceType] = useState("both");
  const [selectedDateFrom, setSelectedDateFrom] = useState(moment().format("YYYY-MM-DD"));
  const [selectedDateTo, setSelectedDateTo] = useState(moment().add(1, "month").format("YYYY-MM-DD"));
  const [withDate, setWithDate] = useState(false);
  const { data: products } = useQuery(["products"], {
    queryFn: () => productApi.getAllProducts(""),
  });

  const { mutate: getItemStock, data: itemStock } = useMutation({
    mutationFn: itemStockApi.getItemStock,
  });
  const { mutate: getItemInvoices, data: itemInvoices } = useMutation({
    mutationFn: inventoryTransactionApi.getItemInvoices,
  });

  const onItemChange = (itemID: string) => {
    const item = products?.responseData.items.find((el) => el.id === itemID);

    if (item) {
      setSelectedItem(item);
      getItemStock(itemID);
    }
  };

  const table = useReactTable({
    data: itemInvoices?.responseData.invoices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (selectedItem) {
      getItemInvoices({ itemID: selectedItem.id, invoiceType: selectedInvoiceType, dateFrom: selectedDateFrom, dateTo: selectedDateTo, withDate });
    }
  }, [selectedInvoiceType, selectedItem, withDate, selectedDateFrom, selectedDateTo]);

  console.log(itemInvoices?.responseData.invoices);

  return (
    <div className="p-2">
      <PageHeader menu={menu} />

      <div className="w-[300px]">
        <Combobox
          key="selectCompany"
          label="Select Item"
          placeholder="Select Item"
          onChange={(value, option) => {
            onItemChange(option.id);
          }}
          value={selectedItem.id}
          options={products?.responseData.items || []}
          autoFocus
          labelKey="nameFull"
          valueKey="id"
          searchKey="nameFull"
        />
      </div>

      {itemStock?.responseData?.itemStock ? (
        <div className="shadow-md w-full rounded-sm p-3 mt-3 flex flex-col">
          <span>
            Product Name: <b>{selectedItem.nameFull}</b>
          </span>
          <span>
            Current Sale Price: <b>{selectedItem.salePrice}</b>
          </span>
          <hr className="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
          <span>
            Commercial Quantity: {formatAmount(itemStock?.responseData?.itemStock.comQty)} ({formatAmount(itemStock?.responseData?.itemStock.comQty * itemStock?.responseData?.itemStock.salePrice)})
          </span>
          <span>
            Bonus Quantity: {itemStock?.responseData?.itemStock.bonusQty} ({formatAmount(itemStock?.responseData?.itemStock.bonusQty * itemStock?.responseData?.itemStock.salePrice)})
          </span>

          <div className="w-full mt-6">
            <RadioGroup
              className="flex flex-row gap-2 mb-3"
              value={selectedInvoiceType}
              onValueChange={(value) => {
                setSelectedInvoiceType(value);
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sales" id="sales" />
                <Label htmlFor="sales">Sales</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="purchase" id="purchase" />
                <Label htmlFor="purchase">Purchase</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">Both</Label>
              </div>
            </RadioGroup>

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
