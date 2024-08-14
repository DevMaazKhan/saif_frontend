import customerApi from "@/api/customer.api";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menu } from "@/constants/menu";
import { DotsVerticalIcon, Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    accessorKey: "nameFull",
    header: "Name Full",
  },
  {
    accessorKey: "areaName",
    header: "Area",
    cell: ({ row: { original } }) => <span>{original?.area?.name}</span>,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const { data: countries } = useQuery(["customers"], customerApi.getAllCustomers);

  const navigate = useNavigate();

  function onEditClickHandler(productID: string) {
    navigate(`edit/${productID}`);
  }

  const table = useReactTable({
    data: filteredData,
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
                  Edit Customer
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

  useEffect(() => {
    setFilteredData(countries?.responseData.parties.filter((el) => el.nameFull.toLowerCase().startsWith(searchQuery.toLowerCase())) || []);
  }, [countries, searchQuery]);

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

      <div className="mb-3">
        <Input
          placeholder="Search Customer By Name"
          className="w-[300px]"
          autoFocus
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
      </div>
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
