import purchaseInvoiceApi from "@/api/inventoryTransaction.api";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menu } from "@/constants/menu";
import { DotsVerticalIcon, EyeOpenIcon, Pencil1Icon, PlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { formatAmount } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const columns = [
  {
    accessorKey: "transactionNo",
    header: "Name Full",
  },
  {
    accessorKey: "transactionDate",
    header: "Name Short",
    cell: ({ row }) => <span>{moment(row.original.transactionDate).format("DD-MMM-YYYY hh:mm A")}</span>,
  },
  {
    accessorKey: "netAmount",
    header: "Price",
    cell: ({ row }) => <span>{formatAmount(row.original.netAmount)}</span>,
  },
];

interface PageProps {
  menu: Menu;
}

const PurchaseInvoiceTable = (props: PageProps) => {
  const { menu } = props;
  const { data: countries } = useQuery(["purchaseInvoices"], purchaseInvoiceApi.getAllPurchaseInvoices);

  function onEditClickHandler(invoiceID: any) {
    navigate(`view/${invoiceID}`);
  }

  const table = useReactTable({
    data: countries?.responseData.invoices || [],
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
                <DropdownMenuItem className="flex items-center gap-2 justify-start" onClick={() => onEditClickHandler((original.id as string) || "")}>
                  View Invoice
                  <EyeOpenIcon />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  const navigate = useNavigate();

  function onClickHandler() {
    navigate("new");
  }

  return (
    <div className="p-2">
      <PageHeader
        menu={menu}
        actions={
          <Button icon={<PlusIcon className="text-white" />} onClick={onClickHandler}>
            Add New
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
  );
};

export default PurchaseInvoiceTable;
