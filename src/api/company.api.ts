/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axios";

const getAllCompanies = async () => {
  let responseData;
  let errorMessage;
  let isDone = false;

  try {
    const res = await axiosInstance.get("/party/company");

    responseData = res.data;
    isDone = true;

    return { responseData, isDone, errorMessage };
  } catch (error: any) {
    console.log(error);
    errorMessage = error.response.data?.message || "";
  }
};

const getSingleCompany = async (partyID: string) => {
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
  return axiosInstance.post("/party", { ...data, type: "3" });
}
function update({ data, partyID }: { data: any; partyID: string }) {
  return axiosInstance.put(`/party/${partyID}`, { ...data, type: "3" });
}

const companyApi = { getAllCompanies, create, update, getSingleCompany };

export default companyApi;
