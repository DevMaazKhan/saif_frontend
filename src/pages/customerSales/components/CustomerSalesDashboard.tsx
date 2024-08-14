import customerApi from "@/api/customer.api";
import inventoryTransactionApi from "@/api/inventoryTransaction.api";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Menu } from "@/constants/menu";
import { formatAmount } from "@/lib/utils";
import { UploadIcon } from "@radix-ui/react-icons";
import { PDFViewer } from "@react-pdf/renderer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { CustomerSalesPrint } from "./CustomerSalesPrint";
import { Combobox } from "@/components/ui/comboBox";

interface PageProps {
  menu: Menu;
}

const columns = [
  {
    accessorKey: "narration",
    header: "Message",
  },
  {
    accessorKey: "Date",
    header: "Date",
    cell: ({ row }) => <span>{moment(row.original.createdAt).format("DD-MMM-YYYY hh:mm A")}</span>,
  },
  {
    accessorKey: "credit",
    header: "Amount",
    cell: ({ row }) => <span>{formatAmount(row.original.credit)}</span>,
  },
];

const ItemStockDashboard = (props: PageProps) => {
  const { menu } = props;
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedDateFrom, setSelectedDateFrom] = useState(moment().format("YYYY-MM-DD"));
  const [selectedDateTo, setSelectedDateTo] = useState(moment().add(1, "month").format("YYYY-MM-DD"));
  const [withDate, setWithDate] = useState(false);
  const [cashToReceive, setCashToReceive] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: customers } = useQuery(["customers"], customerApi.getAllCustomers);

  const { mutate: getCustomerSales, data: customerInvoices } = useMutation({
    mutationFn: inventoryTransactionApi.getCustomerSales,
  });
  const { mutate: getCustomerAccountData, data: customerAccountData } = useMutation({
    mutationFn: inventoryTransactionApi.getCustomerAccountData,
  });
  const { mutate: customerReceiveCash } = useMutation({
    mutationFn: inventoryTransactionApi.customerReceiveCash,
    onSuccess: () => {
      getCustomerAccountData({ customerID: selectedCustomer.id });
      setModalOpen(false);
    },
  });

  const customerData = useMemo(() => customerAccountData?.responseData?.data, [customerAccountData]);

  const onCustomerChange = (itemID: string) => {
    const customer = customers?.responseData.parties.find((el) => el.id === itemID);

    if (customer) {
      setSelectedCustomer(customer);
    }
  };

  const table = useReactTable({
    data: customerData?.list || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function onSubmit() {
    if (+cashToReceive < 0) {
      return;
    }

    customerReceiveCash({
      customerID: selectedCustomer.id,
      amount: cashToReceive,
    });
  }

  useEffect(() => {
    if (selectedCustomer) {
      getCustomerSales({ customerID: selectedCustomer.id, dateFrom: selectedDateFrom, dateTo: selectedDateTo, withDate });
      getCustomerAccountData({ customerID: selectedCustomer.id });
    }
  }, [selectedCustomer, withDate, selectedDateFrom, selectedDateTo]);

  const [showPDFDialog, setShowPDFDialog] = useState(false);

  function openPDFDialog() {
    setShowPDFDialog(true);
  }

  return (
    <>
      <Dialog open={showPDFDialog} onOpenChange={setShowPDFDialog}>
        <DialogContent>
          <DialogHeader></DialogHeader>
          <div className="w-full">
            <PDFViewer style={{ height: "90vh", width: "100%", borderRadius: "20px" }}>
              <CustomerSalesPrint
                customerName={selectedCustomer.nameFull}
                cashReceived={customerData?.totalCustomerCash}
                credit={customerData?.totalCustomerCredit}
                totalReturns={customerData?.totalCustomerSaleReturns}
                totalSales={customerData?.totalCustomerSales}
                items={customerData?.list?.map((invoice) => ({
                  transactionNumber: invoice.narration,
                  date: moment(invoice.createdAt).format("DD-MMM-YYYY hh:mm A"),
                  amount: invoice.credit,
                }))}
              />
            </PDFViewer>
          </div>
        </DialogContent>
      </Dialog>
      <div className="p-2">
        <PageHeader
          menu={menu}
          actions={
            <div className="flex flex-row gap-x-2">
              <Button icon={<UploadIcon className="text-white" />} onClick={openPDFDialog}>
                Print
              </Button>
            </div>
          }
        />

        <div className="w-[300px]">
          <Combobox
            key="selectCompany"
            label="Select Customer"
            placeholder="Select Customer"
            onChange={(value, option) => {
              onCustomerChange(option.id);
            }}
            value={selectedCustomer.id}
            options={customers?.responseData.parties || []}
            autoFocus
            labelKey="nameFull"
            valueKey="id"
            searchKey="nameFull"
          />
        </div>

        {selectedCustomer ? (
          <div className="shadow-md w-full rounded-sm p-3 mt-3 flex flex-col">
            <span>
              Customer Name: <b>{selectedCustomer.nameFull}</b>
            </span>
            <span>
              Customer Total Sales: <b>{formatAmount(customerData?.totalCustomerSales)}</b>
            </span>
            <span>
              Customer Total Returns: <b>{formatAmount(customerData?.totalCustomerSaleReturns)}</b>
            </span>
            <span>
              Customer Cash Received: <b>{formatAmount(customerData?.totalCustomerCash)}</b>
            </span>
            <div className="flex flex-row items-center gap-2">
              <span>
                Customer Credit: <b>{formatAmount(customerData?.totalCustomerCredit)}</b>
                {+(customerData?.totalCustomerCredit || 0) > 0}
              </span>

              <Dialog
                open={modalOpen}
                onOpenChange={(value) => {
                  if (value) {
                    setCashToReceive(customerData?.totalCustomerCredit);
                  }

                  setModalOpen(value);
                }}
              >
                <DialogTrigger asChild>
                  {+(customerData?.totalCustomerCredit || 0) > 0 ? (
                    <Button size="sm" variant="outline">
                      Receive Cash
                    </Button>
                  ) : null}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Receive Cash from {selectedCustomer?.nameFull}?</DialogTitle>
                    <DialogDescription>Credit Amount: {customerData?.totalCustomerCredit}</DialogDescription>
                    <DialogDescription>Remaining Credit Amount: {+(customerData?.totalCustomerCredit || 0) - +cashToReceive}</DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onSubmit();
                    }}
                  >
                    <Input
                      className="mt-3 mb-3"
                      autoFocus
                      value={cashToReceive}
                      onChange={(e) => {
                        if (e.target.value > customerData?.totalCustomerCredit) {
                          toast({
                            variant: "destructive",
                            title: "Invalid Amount",
                          });
                        } else {
                          setCashToReceive(e.target.value);
                        }
                      }}
                      type="number"
                      placeholder="Cash Amount"
                    />
                    <DialogFooter>
                      <Button type="submit">Submit</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />

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
    </>
  );
};

export default ItemStockDashboard;
