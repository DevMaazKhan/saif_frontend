import companyApi from "@/api/company.api";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menu } from "@/constants/menu";
import { DotsVerticalIcon, Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    accessorKey: "nameFull",
    header: "Name Full",
  },
  {
    accessorKey: "email1",
    header: "Email 1",
  },
  {
    accessorKey: "email2",
    header: "Email 2",
  },
  {
    accessorKey: "phone1",
    header: "Phone 1",
  },
  {
    accessorKey: "phone2",
    header: "Phone 2",
  },
];

interface PageProps {
  menu: Menu;
}

const CompanyTable = (props: PageProps) => {
  const { menu } = props;
  const { data: countries } = useQuery(["companies"], companyApi.getAllCompanies);

  const navigate = useNavigate();

  function onEditClickHandler(productID: string) {
    navigate(`edit/${productID}`);
  }

  const table = useReactTable({
    data: countries?.responseData.parties || [],
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
                <DropdownMenuItem className="flex items-center gap-2 justify-start" onClick={() => onEditClickHandler(original.id as string)}>
                  Edit Company
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

export default CompanyTable;
