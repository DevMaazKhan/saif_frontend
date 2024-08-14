/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axios";

const getAllProducts = async (query?: string) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/item${query ? `?${query}` : ""}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getSingleProduct = async (itemID: string) => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get(`/item/${itemID}`);

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

function create(data: any) {
  return axiosInstance.post("/item", { ...data });
}
function update({ data, itemID }: { data: any; itemID: string }) {
  return axiosInstance.put(`/item/${itemID}`, { ...data });
}

const productApi = { getAllProducts, create, getSingleProduct, update };

export default productApi;
