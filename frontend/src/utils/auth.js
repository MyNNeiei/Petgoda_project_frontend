import axiosInstance from "./axios";

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};
