import axios from "../library/axios";

export const getOverviewStats = async () => {
  const { data } = await axios.get("/dashboard/overview", {
    withCredentials: true,
  });
  return data;
};
