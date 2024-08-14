/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axios";

const createExpense = async (data: any) => {
  return axiosInstance.post("/accountTransaction/expense/add", { ...data });
};

const updateExpense = async ({ data, expenseID }: { data: any; expenseID: string }) => {
  return axiosInstance.put(`/accountTransaction/expense/update/${expenseID}`, { ...data });
};

const getAllExpenses = async () => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get("/accountTransaction/expense/list");

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getAllExpensesByAccount = async ({ accountID, withDate, dateFrom, dateTo }: { accountID: string; withDate: boolean; dateFrom: string; dateTo: string }) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/accountTransaction/expense/list/${accountID}?withDate=${withDate}&dateFrom=${dateFrom}&dateTo=${dateTo}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getMonthClose = async ({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/accountTransaction/close?dateFrom=${dateFrom}&dateTo=${dateTo}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const accountTransactionApi = {
  getAllExpenses,
  createExpense,
  updateExpense,
  getAllExpensesByAccount,
  getMonthClose,
};

export default accountTransactionApi;
