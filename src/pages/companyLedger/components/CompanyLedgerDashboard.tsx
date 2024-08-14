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
import { CompanyLedgerPrint } from "./CompanyLedgerPrint";
import companyApi from "@/api/company.api";
import { Combobox } from "@/components/ui/comboBox";

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
];

const CompanyLedgerDashboard = (props: PageProps) => {
  const { menu } = props;
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDateFrom, setSelectedDateFrom] = useState(moment().format("YYYY-MM-DD"));
  const [selectedDateTo, setSelectedDateTo] = useState(moment().add(1, "month").format("YYYY-MM-DD"));
  const [withDate, setWithDate] = useState(false);
  const [cashToReceive, setCashToReceive] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: companies } = useQuery(["companies"], companyApi.getAllCompanies);

  const { mutate: getCompanyPurchases, data: customerInvoices } = useMutation({
    mutationFn: inventoryTransactionApi.getCompanyPurchases,
  });
  const { mutate: getCompanyAccountData, data: companyAccountData } = useMutation({
    mutationFn: inventoryTransactionApi.getCompanyAccountData,
  });
  const { mutate: companyReceiveCash } = useMutation({
    mutationFn: inventoryTransactionApi.companyReceiveCash,
    onSuccess: () => {
      getCompanyAccountData({ companyID: selectedCompany.id });
      setModalOpen(false);
    },
  });

  const companyData = useMemo(() => companyAccountData?.responseData?.data, [companyAccountData]);

  const onCompanyChange = (itemID: string) => {
    const company = companies?.responseData.parties.find((el) => el.id === itemID);

    if (company) {
      setSelectedCompany(company);
    }
  };

  const table = useReactTable({
    data: customerInvoices?.responseData.invoices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function onSubmit() {
    if (+cashToReceive < 0) {
      return;
    }

    companyReceiveCash({
      companyID: selectedCompany.id,
      amount: cashToReceive,
    });
  }

  useEffect(() => {
    if (selectedCompany) {
      getCompanyPurchases({ companyID: selectedCompany.id, dateFrom: selectedDateFrom, dateTo: selectedDateTo, withDate });
      getCompanyAccountData({ companyID: selectedCompany.id });
    }
  }, [selectedCompany, withDate, selectedDateFrom, selectedDateTo]);

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
              <CompanyLedgerPrint
                customerName={selectedCompany.nameFull}
                cashReceived={companyData?.totalCompanyCash}
                credit={companyData?.totalCompanyCredit}
                totalSales={companyData?.totalCompanyPurchases}
                items={customerInvoices?.responseData.invoices?.map((invoice) => ({
                  transactionNumber: invoice.transactionNo,
                  date: moment(invoice.transactionDate).format("DD-MMM-YYYY hh:mm A"),
                  amount: invoice.transactionAmount,
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
            label="Select Company"
            placeholder="Select Company"
            onChange={(value, option) => {
              onCompanyChange(option.id);
            }}
            value={selectedCompany.id}
            options={companies?.responseData.parties || []}
            autoFocus
            labelKey="nameFull"
            valueKey="id"
            searchKey="nameFull"
          />
        </div>

        {selectedCompany ? (
          <div className="shadow-md w-full rounded-sm p-3 mt-3 flex flex-col">
            <span>
              Company Name: <b>{selectedCompany.nameFull}</b>
            </span>
            <span>
              Company Total Purchases: <b>{formatAmount(companyData?.totalCompanyPurchases)}</b>
            </span>
            <span>
              Company Cash: <b>{formatAmount(companyData?.totalCompanyCash)}</b>
            </span>
            <div className="flex flex-row items-center gap-2">
              <span>
                Company Credit: <b>{formatAmount(companyData?.totalCompanyCredit)}</b>
                {+(companyData?.totalCompanyCredit || 0) > 0}
              </span>

              <Dialog
                open={modalOpen}
                onOpenChange={(value) => {
                  if (value) {
                    setCashToReceive(companyData?.totalCompanyCredit);
                  }

                  setModalOpen(value);
                }}
              >
                <DialogTrigger asChild>
                  {+(companyData?.totalCompanyCredit || 0) > 0 ? (
                    <Button size="sm" variant="outline">
                      Receive Cash
                    </Button>
                  ) : null}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Receive Cash from {selectedCompany?.nameFull}?</DialogTitle>
                    <DialogDescription>Credit Amount: {companyData?.totalCompanyCredit}</DialogDescription>
                    <DialogDescription>Remaining Credit Amount: {+(companyData?.totalCompanyCredit || 0) - +cashToReceive}</DialogDescription>
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
                        if (e.target.value > companyData?.totalCompanyCredit) {
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

export default CompanyLedgerDashboard;
