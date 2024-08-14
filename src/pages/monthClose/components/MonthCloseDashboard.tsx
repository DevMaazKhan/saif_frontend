import accountTransactionApi from "@/api/accountTransaction.api";
import coaApi from "@/api/coa.api";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menu } from "@/constants/menu";
import { formatAmount } from "@/lib/utils";
import { PDFViewer } from "@react-pdf/renderer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { MonthClosePrint } from "./MonthClosePrint";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "@radix-ui/react-icons";

interface PageProps {
  menu: Menu;
}

const columns = [
  {
    accessorKey: "narration",
    header: "Narration",
  },
  {
    accessorKey: "credit",
    header: "Amount",
    cell: ({ row }) => formatAmount(row.original?.credit),
  },
  {
    accessorKey: "amount",
    header: "Account",
    cell: ({ row }) => row.original?.account?.acName,
  },
];

const MonthCloseDashboard = (props: PageProps) => {
  const { menu } = props;
  const [selectedDateFrom, setSelectedDateFrom] = useState(moment().startOf("month").format("YYYY-MM-DD"));
  const [selectedDateTo, setSelectedDateTo] = useState(moment().endOf("month").format("YYYY-MM-DD"));

  const { mutate: getExpenseByAccount, data: expenses } = useMutation({
    mutationFn: accountTransactionApi.getMonthClose,
  });

  useEffect(() => {
    getExpenseByAccount({ dateFrom: selectedDateFrom, dateTo: selectedDateTo });
  }, [selectedDateFrom, selectedDateTo]);

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
              <MonthClosePrint
                endDate={moment(selectedDateTo).format("DD-MMM-YYYY")}
                startDate={moment(selectedDateFrom).format("DD-MMM-YYYY")}
                purchase={formatAmount(expenses?.responseData.data?.totalPurchases)}
                sales={formatAmount(expenses?.responseData.data?.totalSales)}
                saleReturns={formatAmount(expenses?.responseData.data?.totalSalesReturns)}
                expenses={formatAmount(expenses?.responseData.data?.totalExpenses)}
                profit={formatAmount((expenses?.responseData.data?.totalSales || 0) - (expenses?.responseData.data?.totalExpenses || 0) - (expenses?.responseData.data?.totalPurchases || 0))}
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

        <div className="shadow-md w-full rounded-sm p-3 flex flex-col">
          <div className="w-full">
            <div className="flex flex-col gap-4">
              <div className={`flex flex-row gap-4`}>
                <div>
                  <Label>Date From</Label>
                  <Input
                    type="date"
                    value={selectedDateFrom}
                    onChange={(e) => {
                      setSelectedDateFrom(e.target.value);
                    }}
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
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <span>
                  Purchasing: <b>{formatAmount(expenses?.responseData.data?.totalPurchases)}</b>
                </span>
                <span>
                  Sales: <b>{formatAmount(expenses?.responseData.data?.totalSales)}</b>
                </span>
                <span>
                  Sale Return: <b>{formatAmount(expenses?.responseData.data?.totalSalesReturns)}</b>
                </span>
                <span>
                  Expenses: <b>{formatAmount(expenses?.responseData.data?.totalExpenses)}</b>
                </span>
                <span>
                  Profit: <b>{formatAmount((expenses?.responseData.data?.totalSales || 0) - (expenses?.responseData.data?.totalExpenses || 0) - (expenses?.responseData.data?.totalPurchases || 0))}</b>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthCloseDashboard;
