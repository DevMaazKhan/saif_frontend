/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axios";

function createBackup() {
  return axiosInstance.get("/backup", {
    responseType: "blob",
  });
}

function importBackup(data: any) {
  return axiosInstance.post("/backup/import", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

const backupApi = { createBackup, importBackup };

export default backupApi;
