/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axios";

const getAllSalesman = async () => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get("/party/salesman");

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getSingleSalesman = async (partyID: string) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/party/${partyID}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getSalesmanCustomer = async (partyID: string) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/party/salesman/${partyID}/customers`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

function create(data: any) {
  return axiosInstance.post("/party", { ...data, type: "2" });
}
function update({ data, partyID }: { data: any; partyID: string }) {
  return axiosInstance.put(`/party/${partyID}`, { ...data, type: "2" });
}

const salesmanApi = { getAllSalesman, create, update, getSingleSalesman, getSalesmanCustomer };

export default salesmanApi;
