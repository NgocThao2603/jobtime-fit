import axiosClient from "./axiosClient";

const calendarApi = {
  createCalendar: (params) => {
    const url = "/calendar";
    return axiosClient.post(url, params);
  },
};

export default calendarApi;
