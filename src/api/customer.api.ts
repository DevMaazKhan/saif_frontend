/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axios";

const getAllCustomers = async () => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get("/party/customer");

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getSingleCustomer = async (partyID: string) => {
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

function create(data: any) {
  return axiosInstance.post("/party", { ...data, type: "1" });
}
function update({ data, partyID }: { data: any; partyID: string }) {
  return axiosInstance.put(`/party/${partyID}`, { ...data, type: "1" });
}

const customerApi = { getAllCustomers, create, getSingleCustomer, update };

export default customerApi;
