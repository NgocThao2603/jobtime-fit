import axiosClient from "./axiosClient";

const calendarApi = {
  createCalendar: (params) => {
    const url = "/calendar";
    return axiosClient.post(url, params);
  },

  getCalendar: () => {
    const url = "/calendar/allCalendar";
    return axiosClient.get(url);
  },
};

const jobApi = {
  getJobList: () => {
    const url = "/jobs";
    return axiosClient.get(url);
  },
  // getJobDetail: (id) => {
  //   const url = `/job/${id}`;
  //   return axiosClient.get(url);
  // },
};

export { calendarApi, jobApi };
