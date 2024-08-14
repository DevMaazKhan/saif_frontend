/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axios";

const getAllItems = async () => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get("/item");

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

function create(data: any) {
  return axiosInstance.post("/item", { ...data, type: "1" });
}

const companyApi = { getAllItems, create };

export default companyApi;
