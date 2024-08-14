/* eslint-disable @typescript-eslint/no-explicit-any */
import { AC_TYPE } from "@/constants/setup";
import { axiosInstance } from "./axios";

const getAllExpenseAccount = async () => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get("/coa");

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

function create(data: any) {
  return axiosInstance.post("/coa", { ...data, acType: AC_TYPE.EXPENSE_ACCOUNT });
}
function update({ data, acID }: { data: any; acID: string }) {
  return axiosInstance.put(`/coa/${acID}`, { ...data });
}

const coaApi = { getAllExpenseAccount, create, update };

export default coaApi;
