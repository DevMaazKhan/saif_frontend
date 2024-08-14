import productApi from "@/api/product.api";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menu } from "@/constants/menu";
import { formatAmount } from "@/lib/utils";
import { DotsVerticalIcon, Pencil1Icon, PlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    accessorKey: "nameFull",
    header: "Name Full",
    cell: ({ row }) => <span>{row.original.nameFull}</span>,
  },
  {
    accessorKey: "purchasePrice",
    header: "Purchase Price",
    cell: ({ row }) => <span>{formatAmount(row.original.purchasePrice)}</span>,
  },
  {
    accessorKey: "salePrice",
    header: "Sale Price",
    cell: ({ row }) => <span>{formatAmount(row.original.salePrice)}</span>,
  },
];

interface PageProps {
  menu: Menu;
}

const ProductTable = (props: PageProps) => {
  const { menu } = props;
  const { data: products } = useQuery(["products"], {
    queryFn: () => productApi.getAllProducts(""),
  });

  function onEditClickHandler(productID: string) {
    navigate(`edit/${productID}`);
  }

  const table = useReactTable({
    data: products?.responseData.items || [],
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
                  Edit Product
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

export default ProductTable;
