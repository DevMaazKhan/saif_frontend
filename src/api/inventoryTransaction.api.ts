/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axios";

const createPurchaseInvoice = async (data: any) => {
  return axiosInstance.post("/inventoryTransaction/purchaseInvoice", { ...data });
};
const createSalesInvoice = async (data: any) => {
  return axiosInstance.post("/inventoryTransaction/salesInvoice", { ...data });
};
const customerReceiveCash = async (data: any) => {
  return axiosInstance.post("/inventoryTransaction/customer/receiveCash", { ...data });
};
const customerAddCredit = async (data: any) => {
  return axiosInstance.post("/inventoryTransaction/customer/addCredit", { ...data });
};
const companyReceiveCash = async (data: any) => {
  return axiosInstance.post("/inventoryTransaction/company/receiveCash", { ...data });
};
const customerSaleReturn = async (data: any) => {
  return axiosInstance.post("/inventoryTransaction/customer/return", { ...data });
};

const getSinglePurchaseInvoice = async (invoiceID: string) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/inventoryTransaction/purchase/${invoiceID}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getSingleSalesInvoice = async (invoiceID: string) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/inventoryTransaction/sale/${invoiceID}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getAllSalesInvoices = async () => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get("/inventoryTransaction/salesInvoice");

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getAllPurchaseInvoices = async () => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get("/inventoryTransaction/purchaseInvoice");

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getItemInvoices = async ({ itemID, invoiceType, withDate, dateFrom, dateTo }: { itemID: string; invoiceType: string; withDate: boolean; dateFrom: string; dateTo: string }) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/inventoryTransaction/item?itemID=${itemID}&invoiceType=${invoiceType}&withDate=${withDate}&dateFrom=${dateFrom}&dateTo=${dateTo}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getCustomerSales = async ({ customerID, withDate, dateFrom, dateTo }: { customerID: string; withDate: boolean; dateFrom: string; dateTo: string }) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/inventoryTransaction/customer?customerID=${customerID}&withDate=${withDate}&dateFrom=${dateFrom}&dateTo=${dateTo}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getCompanyPurchases = async ({ companyID, withDate, dateFrom, dateTo }: { companyID: string; withDate: boolean; dateFrom: string; dateTo: string }) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/inventoryTransaction/company?companyID=${companyID}&withDate=${withDate}&dateFrom=${dateFrom}&dateTo=${dateTo}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getCustomerAccountData = async ({ customerID }: { customerID: string }) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/inventoryTransaction/customer/accountData?customerID=${customerID}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getCompanyAccountData = async ({ companyID }: { companyID: string }) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/inventoryTransaction/company/accountData?companyID=${companyID}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getSalesmanSales = async ({
  salesmanID,
  withDate,
  dateFrom,
  dateTo,
  withProduct,
  productID,
}: {
  salesmanID: string;
  withDate: boolean;
  dateFrom: string;
  dateTo: string;
  withProduct: boolean;
  productID: string;
}) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(
      `/inventoryTransaction/salesman?salesmanID=${salesmanID}&withDate=${withDate}&dateFrom=${dateFrom}&dateTo=${dateTo}&withProduct=${withProduct}&productID=${productID}`
    );

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const inventoryTransactionApi = {
  createPurchaseInvoice,
  getCustomerAccountData,
  getCustomerSales,
  customerReceiveCash,
  getSalesmanSales,
  getAllPurchaseInvoices,
  getAllSalesInvoices,
  createSalesInvoice,
  getItemInvoices,
  customerSaleReturn,
  getSinglePurchaseInvoice,
  getSingleSalesInvoice,
  getCompanyPurchases,
  getCompanyAccountData,
  companyReceiveCash,
  customerAddCredit,
};

export default inventoryTransactionApi;
