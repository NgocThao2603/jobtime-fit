import React, { useState, useEffect } from "react";
import WorkCalendar from "../components/WorkCalendar";
import {calendarApi, jobApi} from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import joblogo from "../assets/joblogo.jpg";
import job from "../assets/job.png";
import { Checkbox } from 'antd';
import  JobCard from "../components/card/index"

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const groupByDay = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const day = item.dayOfWeek;

      if (!grouped[day]) {
        grouped[day] = {
          day: day,
          time: [],
        };
      }

      grouped[day].time.push({
        start: item.start,
        end: item.end,
      });
    });

    const result = Object.values(grouped);
    return result;
  };

  const createCalendar = async (data) => {
    try {
      const response = await calendarApi.createCalendar(data);
      console.log("Calendar created successfully:", response);
    } catch (error) {
      console.error("Error creating calendar:", error);
    }
  };

  const handleSave = async () => {
    try {
      const data = groupByDay(events);
      const results = await Promise.all(
        data.map(async (item) => await createCalendar(item))
      );
      console.log("All calendars created:", results);
      toast.success("Tạo lịch thành công!", {
        autoClose: 2000,
        onClose: () => toggleModal(),
      });
    } catch (error) {
      toast.error("Failed to create calendars");
      console.error("Failed to create one or more calendars:", error);
    }
  };
  const onChange = e => {
    console.log(`checked = ${e.target.checked}`);
  };
  
  const [jobListInformation, setJobListInformation] = useState();
  useEffect(() => {
    const fetchJobList = async () => {
      try {
        const response = await jobApi.getJobList();
        console.log("Job list fetched successfully:", response);
        setJobListInformation(response.data);
      } catch (error) {
        console.error("Error fetching job list:", error);
      }
    };
    fetchJobList();
  }
  , []);



  return (
    <div>
      <div className="flex justify-between w-full bg-[#E8F5E9]">
        <div className="py-2 flex">
        <div className="h-12 w-12 ml-14 overflow-hidden rounded-full">
         <img src={joblogo} alt="JobTime Fit Logo" className="w-full h-full object-cover" />
        </div>
        <div className ="ml-10 flex items-center">
          Trang chủ
        </div>
        </div>
        <div className="p-2">
        <button
          className="bg-[#4CAF4F] text-black font-semibold py-2 px-4 rounded hover:bg-blue-600"
          onClick={toggleModal}
        >
          Nhập lịch
        </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[80%] p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={toggleModal}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold text-center mb-3 text-green-500">
              Nhập lịch bạn có thể làm việc
            </h2>

            <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 mb-3">
              Per week
            </button>

            <div className="mb-6">
              <div>
                <WorkCalendar events={events} setEvents={setEvents} />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600"
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
        <div className="">
        <img src={job} alt="JobTime Fit Logo"/>
        </div>
        <div className="px-16">
          <div className ="flex mt-7 justify-between">
            <h1 className="text-2xl font-semibold"> Danh sách công việc</h1>
             <div>
             <Checkbox onChange={onChange}>
           <span className="text-xl font-semibold">Nghỉ ngày lễ</span> 
          </Checkbox>
             </div>
          </div>
        <JobCard listJob={jobListInformation} />
        </div>
    </div>
  );
};

export default Home;
