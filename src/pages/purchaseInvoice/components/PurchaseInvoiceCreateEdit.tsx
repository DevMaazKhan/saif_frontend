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
import companyApi from "@/api/company.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pencil1Icon, TrashIcon, UploadIcon } from "@radix-ui/react-icons";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { v4 as uuid } from "uuid";
import purchaseInvoiceApi from "@/api/inventoryTransaction.api";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Menu } from "@/constants/menu";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Combobox } from "@/components/ui/comboBox";
import { formatAmount } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Document, PDFViewer, Page, Text, View } from "@react-pdf/renderer";
import { PurchaseInvoicePrint } from "./PurchaseInvoicePrint";
import moment from "moment";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { INVOICE_PAYMENT_TYPES } from "@/constants/setup";
import { Label } from "@/components/ui/label";

const columns = [
  {
    accessorKey: "itemName",
    header: "Product",
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
  {
    accessorKey: "comQty",
    header: "Com Qty",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span>{formatAmount(row.original.purchasePrice * row?.original?.comQty)}</span>,
  },
];

const formDefaultValues = {
  id: "",
  companyID: "",
  lineItems: [],
  paymentType: INVOICE_PAYMENT_TYPES.ON_CASH,
  cashAmount: "",
};

const lineItemFormDefaultValues = {
  itemID: "",
  purchasePrice: "",
  salePrice: "",
  comQty: "",
  bonusQty: "",
  id: "",
  itemName: "",
};

const formSchema = yup.object().shape({
  id: yup.mixed().optional(),
  companyID: yup.string().required("Company is a required field"),
  lineItems: yup.array().optional(),
  paymentType: yup.string().required(),
  cashAmount: yup.string(),
});
const lineItemFormSchema = yup.object().shape({
  itemID: yup.string().required("Company ID is a required field"),
  purchasePrice: yup.string().required("Purchase Price is a required field"),
  salePrice: yup.string().required("Sale Price is a required field"),
  comQty: yup.string().optional(),
  bonusQty: yup.string().optional(),
  id: yup.mixed().optional(),
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

  const params = useParams();

  const invoiceID = useMemo(() => params.id, [params]);

  const formMethods = useForm({
    defaultValues: formDefaultValues,
    resolver: yupResolver(formSchema),
  });
  const lineItemFormMethods = useForm({
    defaultValues: lineItemFormDefaultValues,
    resolver: yupResolver(lineItemFormSchema),
  });

  const { data: companies } = useQuery(["companies"], companyApi.getAllCompanies);
  const { mutate: getItems, data: items } = useMutation(["items"], {
    mutationFn: productApi.getAllProducts,
  });
  const { mutate: getSinglePurchaseInvoice, data: invoice } = useMutation(["singlePurchaseInvoice"], {
    mutationFn: purchaseInvoiceApi.getSinglePurchaseInvoice,
    onSuccess: (data) => {
      formMethods.reset({
        companyID: data?.responseData?.invoice?.partyID,
        id: data?.responseData?.invoice?.id,
        lineItems:
          data?.responseData?.invoice?.inventoryTransactionItems?.map((el) => ({
            comQty: el.comQty,
            bonusQty: el.bonusQty,
            itemName: el?.item?.nameFull,
            purchasePrice: el?.price,
            salePrice: 0,
            id: el?.id,
            itemID: el?.itemID,
          })) || [],
      });
    },
  });

  const { mutate } = useMutation({
    mutationFn: purchaseInvoiceApi.createPurchaseInvoice,
    onSettled: () => {
      endLoading();
      toast({
        title: "Purchase Invoice Created Successfully",
        className: "bg-green-400 text-white",
      });
      formMethods.reset(formDefaultValues);
      setTimeout(() => {
        formMethods.setFocus("companyID");
      }, 100);
    },
  });

  function onSubmit(data: any) {
    if (formMethods.getValues("id")) return;

    if (data.lineItems.length === 0) {
      toast({
        variant: "destructive",
        title: "At least add 1 item",
      });

      return;
    }

    startLoading("Creating Purchase Invoice");
    mutate(data);
  }

  function onLineItemSubmit(data: any) {
    if (formMethods.getValues("id")) return;

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
    if (formMethods.getValues("id")) return;

    const lineItems = [...formMethods.getValues("lineItems")];
    const newLineItems = lineItems.filter((el) => el.id !== id);

    formMethods.reset({
      ...formMethods.getValues(),
      lineItems: newLineItems,
    });
  };

  const onEdit = (item: any) => {
    if (formMethods.getValues("id")) return;

    lineItemFormMethods.reset(item);
    setSheetOpen(true);

    setTimeout(() => {
      lineItemFormMethods.setFocus("comQty");
    }, 100);
  };

  const lineItems = formMethods.watch("lineItems");

  const table = useReactTable({
    data: lineItems || [],
    columns: [
      ...columns,
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="flex flex-row gap-1">
              <Button disabled={!!formMethods.getValues("id")} variant="default" size="icon" onClick={() => onEdit(row.original)}>
                <Pencil1Icon />
              </Button>
              <Button disabled={!!formMethods.getValues("id")} variant="destructive" size="icon" onClick={() => deleteLineItem(row.original.id)}>
                <TrashIcon />
              </Button>
            </div>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  const companyID = formMethods.watch("companyID");
  const itemID = lineItemFormMethods.watch("itemID");
  const company = useMemo(() => companies?.responseData.parties?.find((el) => el.id === companyID), [companyID]);
  const paymentType = formMethods.watch("paymentType");
  const cashAmount = formMethods.watch("cashAmount");

  const purchasePrice = +lineItemFormMethods.watch("purchasePrice") || 0;
  const comQty = +(lineItemFormMethods.watch("comQty") || 0) || 0;
  const salePrice = +lineItemFormMethods.watch("salePrice") || 0;

  const totalAmount = useMemo(() => lineItems?.reduce((prev, curr) => (prev += curr.comQty * curr.purchasePrice), 0), [lineItems]);

  useEffect(() => {
    if (companyID) {
      getItems(`companyID=${companyID}`);
    }
  }, [companyID]);

  useEffect(() => {
    if (itemID) {
      const item = items?.responseData?.items?.find((el) => el.id === itemID);
      if (!item) return;
      lineItemFormMethods.reset({
        ...lineItemFormMethods.getValues(),
        purchasePrice: item.purchasePrice,
        salePrice: item.salePrice,
      });
    }
  }, [itemID]);

  useEffect(() => {
    if (invoiceID) {
      getSinglePurchaseInvoice(invoiceID);
    }
  }, [invoiceID]);

  const [showPDFDialog, setShowPDFDialog] = useState(false);

  function openPDFDialog() {
    setShowPDFDialog(true);
  }
  const id = formMethods.getValues("id");

  const hidden = useMemo(() => (lineItems?.length || 0) === 0 || !!id, [lineItems, id]);

  return (
    <>
      <Dialog open={showPDFDialog} onOpenChange={setShowPDFDialog}>
        <DialogContent>
          <DialogHeader></DialogHeader>
          <div className="w-full">
            <PDFViewer style={{ height: "90vh", width: "100%", borderRadius: "20px" }}>
              <PurchaseInvoicePrint
                totalAmount={invoice?.responseData.invoice?.transactionAmount}
                companyName={invoice?.responseData.invoice?.party?.nameFull}
                invoiceDate={moment(invoice?.responseData.invoice?.transactionDate).format("DD/MM/YYYY")}
                items={lineItems?.map((el) => ({ name: el.itemName, price: el?.purchasePrice, qty: el?.comQty }))}
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
                <div className="flex flex-row gap-x-2">
                  <Button disabled={!!formMethods.getValues("id")} icon={<UploadIcon className="text-white" />} type="submit">
                    Save
                  </Button>
                  <Button icon={<UploadIcon className="text-white" />} onClick={openPDFDialog}>
                    Print
                  </Button>
                </div>
              }
            />
            <div className="flex flex-1 gap-2 mt-2 w-[300px]">
              <Controller
                name="companyID"
                control={formMethods.control}
                render={({ field, fieldState }) => (
                  <Combobox
                    label="Select Company"
                    placeholder="Select Company"
                    value={field.value}
                    onChange={(value, option) => {
                      field.onChange(option.id);
                    }}
                    disabled={(lineItems?.length || 0) > 0 || !!formMethods.getValues("id")}
                    options={companies?.responseData.parties}
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
                style={{ opacity: hidden ? ".5" : 1, pointerEvents: hidden ? "none" : "all", userSelect: hidden ? "none" : "auto" }}
                tabIndex={-1}
              >
                <div>
                  Invoice Total: <br /> <span className="font-bold">{formatAmount(totalAmount)}</span>
                </div>

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
                    if (companyID) {
                      setSheetOpen(value);
                    } else {
                      toast({
                        variant: "destructive",
                        title: "Company is required",
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
                      <span className="text-xs">Company: {company?.nameFull}</span>
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
                          name="purchasePrice"
                          control={lineItemFormMethods.control}
                          render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} className="w-full" placeholder="Purchase Price" type="number" />}
                        />
                        <Controller
                          name="salePrice"
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
                        <div className="flex flex-col">
                          <span>
                            Total Amount: <span className="font-bold">{formatAmount(comQty * purchasePrice)}</span>
                          </span>
                          <span>
                            Sale Amount: <span className="font-bold">{formatAmount(comQty * salePrice)}</span>
                          </span>
                          <span>
                            Difference: <span className="font-bold">{formatAmount(comQty * salePrice - comQty * purchasePrice)}</span>
                          </span>
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
