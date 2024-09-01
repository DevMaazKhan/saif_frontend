import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import productApi from "@/api/product.api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pencil1Icon, TrashIcon, UploadIcon } from "@radix-ui/react-icons";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { v4 as uuid } from "uuid";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Menu } from "@/constants/menu";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import salesmanApi from "@/api/salesman.api";
import customerApi from "@/api/customer.api";
import itemStockApi from "@/api/itemStock.api";
import inventoryTransactionApi from "@/api/inventoryTransaction.api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { INVOICE_PAYMENT_TYPES } from "@/constants/setup";
import { formatAmount } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import { SalesInvoicePrint } from "./SalesInvoicePrint";
import moment from "moment";
import { Combobox } from "@/components/ui/comboBox";

const columns = [
  {
    accessorKey: "itemName",
    header: "Product",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "comQty",
    header: "Com Qty",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span>{formatAmount(row.original.price * row?.original?.comQty)}</span>,
  },
];

const formDefaultValues = {
  customerID: "",
  salesmanID: "",
  lineItems: [],
  paymentType: '',
  cashAmount: "",
  id: "",
  date: moment().format("YYYY-MM-DD"),
};

const lineItemFormDefaultValues = {
  itemID: "",
  comQty: "",
  bonusQty: "",
  price: "",
  id: "",
  itemName: "",
};

const formSchema = yup.object().shape({
  id: yup.string().optional(),
  salesmanID: yup.string().optional(),
  customerID: yup.string().required("Customer is a required field"),
  lineItems: yup.array().optional(),
  paymentType: yup.string(),
  cashAmount: yup.string(),
  date: yup.string().required(),
});

const lineItemFormSchema = yup.object().shape({
  itemID: yup.string().required("Company ID is a required field"),
  comQty: yup.string().optional(),
  bonusQty: yup.string().optional(),
  id: yup.mixed().optional(),
  price: yup.mixed().optional(),
  itemName: yup.mixed().optional(),
});

interface PageProps {
  menu: Menu;
}

const PurchaseInvoiceCreateEdit = (props: PageProps) => {
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

  const { data: salesman } = useQuery(["salesman"], salesmanApi.getAllSalesman);
  const { data: customer } = useQuery(["customer"], customerApi.getAllCustomers);
  const { data: items } = useQuery(["items"], {
    queryFn: () => productApi.getAllProducts(),
  });

  const { mutate: getItemStock, data: itemStock } = useMutation({
    mutationFn: itemStockApi.getItemStock,
  });

  const { mutate } = useMutation({
    mutationFn: inventoryTransactionApi.createSalesInvoice,
    onSettled: () => {
      endLoading();
      toast({
        title: "Sales Invoice Created Successfully",
        className: "bg-green-400 text-white",
      });
      formMethods.reset(formDefaultValues);
      setTimeout(() => {
        formMethods.setFocus("salesmanID");
      }, 100);
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
    if (data.paymentType.length === 0) {
      toast({
        variant: "destructive",
        title: "Please select Payment Type",
      });

      return;
    }
    if (data.paymentType === INVOICE_PAYMENT_TYPES.PARTIAL && (!data.cashAmount || data.cashAmount < 0)) {
      toast({
        variant: "destructive",
        title: "Add some cash amount",
      });

      return;
    }

    startLoading("Creating Sales Invoice");
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
  };

  const lineItems = formMethods.watch("lineItems");

  console.log(lineItems);

  const customerID = formMethods.watch("customerID");
  const itemID = lineItemFormMethods.watch("itemID");
  const comQty = lineItemFormMethods.watch("comQty");
  const paymentType = formMethods.watch("paymentType");
  const cashAmount = formMethods.watch("cashAmount");

  const totalAmount = useMemo(() => lineItems?.reduce((prev, curr) => (prev += curr.comQty * curr.price), 0), [lineItems]);

  useEffect(() => {
    if (itemID) {
      getItemStock(itemID);
      const item = items?.responseData?.items?.find((el) => el.id === itemID);
      if (!item) return;
      lineItemFormMethods.reset({
        ...lineItemFormMethods.getValues(),
        price: item.salePrice,
      });
    }
  }, [itemID]);

  const params = useParams();

  const invoiceID = useMemo(() => params.id, [params]);

  const { mutate: getSingleSalesInvoice, data: invoice } = useMutation(["singleSalesInvoice"], {
    mutationFn: inventoryTransactionApi.getSingleSalesInvoice,
    onSuccess: (data) => {
      const invoice = data?.responseData.invoice;

      console.log(invoice?.inventoryTransactionItems);

      if (invoice) {
        formMethods.reset({
          salesmanID: invoice.salesmanID,
          customerID: invoice.partyID,
          id: invoice.id,
          lineItems:
            invoice?.inventoryTransactionItems?.map((el) => ({
              comQty: el.comQty,
              bonusQty: el.bonusQty,
              itemName: el?.item?.nameFull,
              price: el?.price,
              id: el?.id,
              itemID: el?.itemID,
              unitsInCarton: el?.item?.unitsInCarton,
            })) || [],
        });
      }
    },
  });

  useEffect(() => {
    if (invoiceID) {
      getSingleSalesInvoice(invoiceID);
    }
  }, [invoiceID]);

  const [showPDFDialog, setShowPDFDialog] = useState(false);

  function openPDFDialog() {
    setShowPDFDialog(true);
  }

  function closePDFDialog() {
    setShowPDFDialog(false);
  }

  const id = formMethods.getValues("id");

  const hidden = useMemo(() => (lineItems?.length || 0) === 0 || !!id, [lineItems, id]);

  const table = useReactTable({
    data: lineItems || [],
    columns: [
      ...columns,
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="flex flex-row gap-1">
              <Button variant="default" size="icon" onClick={() => onEdit(row.original)} disabled={!!formMethods.getValues("id")}>
                <Pencil1Icon />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deleteLineItem(row.original.id)} disabled={!!formMethods.getValues("id")}>
                <TrashIcon />
              </Button>
            </div>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Dialog open={showPDFDialog} onOpenChange={setShowPDFDialog}>
        <DialogContent>
          <DialogHeader></DialogHeader>
          <div className="w-full">
            <PDFViewer style={{ height: "90vh", width: "100%", borderRadius: "20px" }}>
              <SalesInvoicePrint
                salesmanName={invoice?.responseData.invoice?.salesman?.nameFull}
                customerName={invoice?.responseData.invoice?.party?.nameFull}
                totalAmount={invoice?.responseData.invoice?.transactionAmount}
                invoiceDate={moment(invoice?.responseData.invoice?.transactionDate).format("DD/MM/YYYY")}
                items={lineItems?.map((el) => ({ name: el.itemName, price: el?.price, qty: el?.comQty, unit: el?.unitsInCarton })) || []}
              />
            </PDFViewer>
          </div>
        </DialogContent>
      </Dialog>
      <div className="p-2">
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <PageHeader
              menu={menu}
              actions={
                <div className="flex flex-row gap-1">
                  <Button icon={<UploadIcon className="text-white" />} type="submit" disabled={!!formMethods.getValues("id")}>
                    Save
                  </Button>
                  <Button icon={<UploadIcon className="text-white" />} type="button" onClick={openPDFDialog}>
                    Print
                  </Button>
                </div>
              }
            />

            <div className="flex flex-1 gap-2 mt-2">
              <div className="w-[300px]">
                <Controller
                  name="salesmanID"
                  control={formMethods.control}
                  render={({ field, fieldState }) => (
                    <Combobox
                      label="Select Salesman"
                      placeholder="Select Salesman"
                      value={field.value || ""}
                      onChange={(value, option) => {
                        field.onChange(option.id);
                      }}
                      disabled={!!formMethods.getValues("id")}
                      options={salesman?.responseData.parties || []}
                      autoFocus
                      labelKey="nameFull"
                      valueKey="id"
                      searchKey="nameFull"
                      error={fieldState.error?.message || undefined}
                    />
                  )}
                />
              </div>

              <div className="w-[300px]">
                <Controller
                  name="customerID"
                  control={formMethods.control}
                  render={({ field, fieldState }) => (
                    <Combobox
                      label="Select Customer"
                      placeholder="Select Customer"
                      value={field.value || ""}
                      onChange={(value, option) => {
                        field.onChange(option.id);
                      }}
                      disabled={!!formMethods.getValues("id")}
                      options={customer?.responseData.parties || []}
                      labelKey="nameFull"
                      valueKey="id"
                      searchKey="nameFull"
                      error={fieldState.error?.message || undefined}
                    />
                  )}
                />
              </div>

              <div className="w-[300px]">
                <Controller
                  name="date"
                  control={formMethods.control}
                  render={({ field, fieldState }) => (
                    <Input
                      type="date"
                      value={field.value}
                      placeholder="Select Date"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      disabled={!!formMethods.getValues("id")}
                      error={fieldState.error?.message || undefined}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-row gap-3 mt-3">
              <div
                className="bg-primary/20 flex-1 rounded-sm p-3 h-fit shadow-md"
                style={{ opacity: hidden ? ".5" : 1, pointerEvents: hidden ? "none" : "all", userSelect: hidden ? "none" : "auto" }}
                tabIndex={-1}
              >
                <div>
                  Invoice Total: <br /> <span className="font-bold">{formatAmount(totalAmount)}</span>
                </div>
                <hr className="h-px my-1 bg-black/25 border-0" />

                <div>
                  <p className="">Payment Type</p>
                  <Controller
                    control={formMethods.control}
                    name="paymentType"
                    render={({ field }) => (
                      <RadioGroup
                        className="flex flex-col gap-2 mt-3"
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value === INVOICE_PAYMENT_TYPES.PARTIAL) {
                            setTimeout(() => {
                              formMethods.setFocus("cashAmount");
                            }, 100);
                          }
                        }}
                        tabIndex={hidden ? -1 : 0}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={INVOICE_PAYMENT_TYPES.PARTIAL} id={INVOICE_PAYMENT_TYPES.PARTIAL} />
                          <Label htmlFor={INVOICE_PAYMENT_TYPES.PARTIAL}>Partial Cash</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={INVOICE_PAYMENT_TYPES.ON_CREDIT} id={INVOICE_PAYMENT_TYPES.ON_CREDIT} />
                          <Label htmlFor={INVOICE_PAYMENT_TYPES.ON_CREDIT}>On Credit</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={INVOICE_PAYMENT_TYPES.ON_CASH} id={INVOICE_PAYMENT_TYPES.ON_CASH} />
                          <Label htmlFor={INVOICE_PAYMENT_TYPES.ON_CASH}>On Cash</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>

                <div className="mt-3">
                  {paymentType === INVOICE_PAYMENT_TYPES.ON_CASH ? (
                    <span className="text-xs leading-[1] m-0 p-0">
                      <span className="italic font-bold">INVOICE AMOUNT</span> will be cashed from customer
                    </span>
                  ) : paymentType === INVOICE_PAYMENT_TYPES.ON_CREDIT ? (
                    <span className="text-xs leading-[1] m-0 p-0">
                      <span className="italic font-bold">INVOICE AMOUNT</span> will be credited to customer
                    </span>
                  ) : (
                    <>
                      <Controller
                        name="cashAmount"
                        control={formMethods.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className="bg-white"
                            onChange={(e) => {
                              if (e.target.value > totalAmount) {
                                toast({
                                  variant: "destructive",
                                  title: "Invalid Cash Amount",
                                });
                                return;
                              } else {
                                field.onChange(e.target.value);
                              }
                            }}
                            placeholder="Cash"
                            type="number"
                          />
                        )}
                      />
                      <span className="flex flex-col text-xs leading-[1] m-0 p-0 mt-2">
                        <div>
                          <span className="italic font-bold">{cashAmount}</span> will be cashed from customer
                        </div>

                        {cashAmount && +(cashAmount || 0) > 0 ? (
                          <div>
                            <span className="italic font-bold">{+totalAmount - +cashAmount}</span> will be credited to customer
                          </div>
                        ) : null}
                      </span>
                    </>
                  )}
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
                          name="itemID"
                          control={lineItemFormMethods.control}
                          render={({ field, fieldState }) => (
                            <Combobox
                              label="Select Product"
                              placeholder="Select Product"
                              value={field.value || ""}
                              onChange={(value, option) => {
                                console.log(option);

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
                              autoFocus
                              disabled={!!lineItemFormMethods.getValues("id")}
                              options={items?.responseData.items || []}
                              labelKey="nameFull"
                              valueKey="id"
                              searchKey="nameFull"
                              error={fieldState.error?.message || undefined}
                            />
                          )}
                        />
                        {/* <Controller
                          name="itemID"
                          control={lineItemFormMethods.control}
                          render={({ field }) => (
                            <Select {...field} onValueChange={(value) => {}} defaultValue={field.value} disabled={!!lineItemFormMethods.getValues("id")}>
                              <SelectTrigger className="w-full" autoFocus>
                                <SelectValue placeholder="Select Product" />
                              </SelectTrigger>
                              <SelectContent>
                                {items?.responseData.items?.map((party) => (
                                  <SelectItem value={party.id}>{party.nameFull}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        /> */}
                        <div className="flex flex-col">
                          <div className="flex flex-row gap-4">
                            <span className="text-xs">
                              Stock Commercial Qty: <b> {itemStock?.responseData.itemStock.comQty}</b>
                            </span>
                            <span className="text-xs">
                              Stock Bonus Qty: <b> {itemStock?.responseData.itemStock.bonusQty}</b>
                            </span>
                          </div>
                          <span className="text-xs block">
                            Price: <b> {itemStock?.responseData.itemStock.salePrice}</b>
                          </span>
                        </div>

                        <Controller
                          name="comQty"
                          control={lineItemFormMethods.control}
                          render={({ field, fieldState }) => (
                            <Input
                              {...field}
                              error={fieldState.error?.message || undefined}
                              onChange={(e) => {
                                if (+e.target.value > +itemStock?.responseData.itemStock.comQty) {
                                  toast({
                                    variant: "destructive",
                                    title: "Low stock",
                                  });
                                  return;
                                }
                                if (+e.target.value < 0) {
                                  toast({
                                    variant: "destructive",
                                    title: "Invalid Quantity",
                                  });
                                  return;
                                }

                                field.onChange(e);
                              }}
                              className="w-full"
                              placeholder="Com Qty"
                              type="number"
                            />
                          )}
                        />
                        <Controller
                          name="bonusQty"
                          control={lineItemFormMethods.control}
                          render={({ field, fieldState }) => (
                            <Input
                              {...field}
                              error={fieldState.error?.message || undefined}
                              onChange={(e) => {
                                if (+e.target.value > +itemStock?.responseData.itemStock.bonusQty) {
                                  toast({
                                    variant: "destructive",
                                    title: "Low stock",
                                  });
                                  return;
                                }
                                if (+e.target.value < 0) {
                                  toast({
                                    variant: "destructive",
                                    title: "Invalid Quantity",
                                  });
                                  return;
                                }

                                field.onChange(e);
                              }}
                              className="w-full"
                              placeholder="Bonus Qty"
                              type="number"
                            />
                          )}
                        />

                        <div>
                          <span>Total: {formatAmount(+comQty * (itemStock?.responseData.itemStock.salePrice || 0))}</span>
                        </div>
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
          </form>
        </Form>
      </div>
    </>
  );
};

export default PurchaseInvoiceCreateEdit;
