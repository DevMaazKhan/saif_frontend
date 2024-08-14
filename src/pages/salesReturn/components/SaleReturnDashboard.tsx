import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil1Icon, TrashIcon, UploadIcon } from "@radix-ui/react-icons";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Menu } from "@/constants/menu";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import customerApi from "@/api/customer.api";
import inventoryTransactionApi from "@/api/inventoryTransaction.api";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { v4 as uuid } from "uuid";
import { formatAmount } from "@/lib/utils";
import productApi from "@/api/product.api";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Combobox } from "@/components/ui/comboBox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const columns = [
  {
    accessorKey: "itemName",
    header: "Product",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <span>{formatAmount(row.original.price)}</span>,
  },
  {
    accessorKey: "comQty",
    header: "Com Qty",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span>{formatAmount(+row.original.price * +row.original?.comQty)}</span>,
  },
];

const formDefaultValues = {
  customerID: "",
  lineItems: [],
};
const lineItemFormDefaultValues = {
  itemID: "",
  price: "",
  comQty: "",
  bonusQty: "",
  id: "",
  itemName: "",
};

const formSchema = yup.object().shape({
  customerID: yup.string().required("Customer is a required field"),
  lineItems: yup.array().optional(),
});
const lineItemFormSchema = yup.object().shape({
  itemID: yup.string().required("Company ID is a required field"),
  price: yup.string().required("Purchase Price is a required field"),
  comQty: yup.string().optional(),
  bonusQty: yup.string().optional(),
  id: yup.mixed().optional(),
  itemName: yup.mixed().optional(),
});

interface PageProps {
  menu: Menu;
}

const SaleReturnDashboard = (props: PageProps) => {
  const { menu } = props;
  const { toast } = useToast();
  const { startLoading, endLoading } = useLoadingContext();
  const [sheetOpen, setSheetOpen] = useState(false);

  const formMethods = useForm({
    defaultValues: formDefaultValues,
    resolver: yupResolver(formSchema),
  });

  const lineItemFormMethods = useForm({
    defaultValues: lineItemFormDefaultValues,
    resolver: yupResolver(lineItemFormSchema),
  });

  const { data: customers } = useQuery(["customer"], customerApi.getAllCustomers);
  const { mutate: getItems, data: items } = useMutation(["items"], {
    mutationFn: productApi.getAllProducts,
  });

  const { mutate } = useMutation({
    mutationFn: inventoryTransactionApi.customerSaleReturn,
    onSuccess: () => {
      endLoading();
      toast({
        title: "Sales Invoice Created Successfully",
        className: "bg-green-400 text-white",
      });
      formMethods.reset(formDefaultValues);
      setTimeout(() => {
        formMethods.setFocus("customerID");
      }, 100);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function onSubmit(data: any) {
    if (data.lineItems.length === 0) {
      toast({
        variant: "destructive",
        title: "At least add 1 item",
      });

      return;
    }

    startLoading("Creating Sales Return");
    mutate(data);
  }

  function onLineItemSubmit(data: any) {
    if (+data.comQty + +data.bonusQty === 0) {
      toast({
        variant: "destructive",
        title: "Commercial or Bonus is required",
      });

      return;
    }

    const lineItems = [...formMethods.getValues("lineItems")];

    if (data.id) {
      const newLineItems = lineItems.map((el) => (el.id === data.id ? data : el));

      formMethods.reset({
        ...formMethods.getValues(),
        lineItems: newLineItems,
      });
      setSheetOpen(false);
      lineItemFormMethods.reset({ ...lineItemFormDefaultValues });
    } else {
      const item = items?.responseData?.items.find((el) => el.id === data.itemID);
      formMethods.reset({
        ...formMethods.getValues(),
        lineItems: [...formMethods.getValues("lineItems"), { ...data, id: uuid(), itemName: item.nameFull }],
      });
      setSheetOpen(false);
      lineItemFormMethods.reset({ ...lineItemFormDefaultValues });
    }
  }

  const deleteLineItem = (id: string) => {
    const lineItems = [...formMethods.getValues("lineItems")];
    const newLineItems = lineItems.filter((el) => el.id !== id);

    formMethods.reset({
      ...formMethods.getValues(),
      lineItems: newLineItems,
    });
  };

  const onEdit = (item: any) => {
    lineItemFormMethods.reset(item);
    setSheetOpen(true);

    setTimeout(() => {
      lineItemFormMethods.setFocus("comQty");
    }, 100);
  };

  const lineItems = formMethods.watch("lineItems");
  const customerID = formMethods.watch("customerID");
  const customer = useMemo(() => customers?.responseData.parties?.find((el) => el.id === customerID), [customerID]);

  useEffect(() => {
    getItems("");
  }, []);

  const table = useReactTable({
    data: lineItems || [],
    columns: [
      ...columns,
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="flex flex-row gap-1">
              <Button variant="default" size="icon" onClick={() => onEdit(row.original)}>
                <Pencil1Icon />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deleteLineItem(row.original.id)}>
                <TrashIcon />
              </Button>
            </div>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  const totalAmount = useMemo(() => lineItems?.reduce((prev, curr) => (prev += curr.comQty * curr.price), 0), [lineItems]);

  const itemID = lineItemFormMethods.watch("itemID");

  useEffect(() => {
    if (itemID) {
      const item = items?.responseData?.items?.find((el) => el.id === itemID);
      if (!item) return;
      lineItemFormMethods.reset({
        ...lineItemFormMethods.getValues(),
        price: item.salePrice,
      });
    }
  }, [itemID]);

  return (
    <div className="p-2">
      <Form {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <PageHeader
            menu={menu}
            actions={
              <Button icon={<UploadIcon className="text-white" />} type="submit">
                Save
              </Button>
            }
          />

          <div className="flex flex-1 gap-2 mt-2 w-[300px]">
            <Controller
              name="customerID"
              control={formMethods.control}
              render={({ field, fieldState }) => (
                <Combobox
                  label="Select Customer"
                  placeholder="Select Customer"
                  value={field.value}
                  onChange={(value, option) => {
                    field.onChange(option.id);
                  }}
                  disabled={lineItems?.length > 0}
                  options={customers?.responseData.parties || []}
                  autoFocus
                  labelKey="nameFull"
                  valueKey="id"
                  searchKey="nameFull"
                  error={fieldState.error?.message || undefined}
                />
              )}
            />
          </div>
          <div className="flex flex-row gap-3 mt-3">
            <div
              className="bg-primary/20 flex-1 rounded-sm p-3 h-fit shadow-md"
              style={{ opacity: lineItems?.length === 0 ? ".5" : 1, pointerEvents: lineItems?.length === 0 ? "none" : "all", userSelect: lineItems?.length === 0 ? "none" : "auto" }}
              tabIndex={-1}
            >
              <div>
                Return Total: <br /> <span className="font-bold">{formatAmount(totalAmount)}</span>
              </div>
            </div>
            <div className="flex-[3] shadow-lg p-2 rounded-md h-fit">
              <Sheet
                onOpenChange={(value) => {
                  if (customerID) {
                    setSheetOpen(value);
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Customer is required",
                    });
                  }

                  if (!value) {
                    lineItemFormMethods.reset(lineItemFormDefaultValues);
                  }

                  if (value) {
                    setTimeout(() => {
                      lineItemFormMethods.setFocus("itemID");
                    }, 100);
                  }
                }}
                open={sheetOpen}
              >
                <SheetTrigger asChild>
                  <div className="flex w-full items-end justify-end mb-3">
                    <Button type="button" disabled={!!formMethods.getValues("id")}>
                      Add New Item
                    </Button>
                  </div>
                </SheetTrigger>
                <SheetContent className="flex flex-col">
                  <SheetHeader>
                    <SheetTitle>
                      {lineItemFormMethods.getValues("id") ? "Edit" : "Add New"} Item {lineItemFormMethods.getValues("id") ? `(${lineItemFormMethods.getValues("itemName")})` : ""}
                    </SheetTitle>
                    <span className="text-xs">Company: {customer?.nameFull}</span>
                  </SheetHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      lineItemFormMethods.handleSubmit(onLineItemSubmit)();
                    }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div className="flex flex-col gap-3 mt-3">
                      <Controller
                        control={lineItemFormMethods.control}
                        name="itemID"
                        render={({ field }) => (
                          <Combobox
                            autoFocus
                            label="Select Product"
                            placeholder="Select Product"
                            value={field.value}
                            ref={field.ref}
                            onChange={(value, option) => {
                              const lineItems = [...formMethods.getValues("lineItems")];

                              const existedItem = lineItems.find((el) => el.itemID === option.id);

                              if (existedItem) {
                                toast({
                                  variant: "destructive",
                                  title: "Item exists already",
                                });

                                return;
                              }

                              field.onChange(option.id);

                              setTimeout(() => {
                                lineItemFormMethods.setFocus("comQty");
                              }, 100);
                            }}
                            options={items?.responseData.items || []}
                            labelKey="nameFull"
                            valueKey="id"
                            searchKey="nameFull"
                          />
                        )}
                      />
                      <Controller
                        name="price"
                        control={lineItemFormMethods.control}
                        render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} className="w-full" placeholder="Sale Price" type="number" />}
                      />
                      <Controller
                        name="comQty"
                        control={lineItemFormMethods.control}
                        render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} className="w-full" placeholder="Com Qty" type="number" />}
                      />
                      <Controller
                        name="bonusQty"
                        control={lineItemFormMethods.control}
                        render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} className="w-full" placeholder="Bonus Qty" type="number" />}
                      />
                    </div>

                    <SheetFooter>
                      <Button type="submit">Add</Button>
                      <Button type="submit" variant="destructive">
                        Cancel
                      </Button>
                    </SheetFooter>
                  </form>
                </SheetContent>
              </Sheet>
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
              <Button type="submit" className="hidden"></Button>
            </div>
          </div>
          <Button type="submit" className="hidden" />
        </form>
      </Form>
    </div>
  );
};

export default SaleReturnDashboard;
