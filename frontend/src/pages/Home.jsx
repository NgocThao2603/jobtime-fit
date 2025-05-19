import React, { useState, useEffect } from "react";
import WorkCalendar from "../components/WorkCalendar";
import {calendarApi, jobApi} from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import joblogo from "../assets/joblogo.jpg";
import job1 from "../assets/job1.png";
import job2 from "../assets/job2.png";
import hust from "../assets/hust.png";
import find_job from "../assets/find_job.jpg";
import { Checkbox } from "antd";
import  JobCard from "../components/card/index";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const images = [find_job, hust, job2, job1]; // mảng import hình ảnh của bạn


const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [hasCalendar, setHasCalendar] = useState(false);
  const [showHolidayOff, setShowHolidayOff] = useState(false);

const toggleModal = async () => {
  const newState = !isModalOpen;
  setIsModalOpen(newState);

  if (!isModalOpen) {
    try {
      const res = await calendarApi.getCalendar(); // gọi API lấy lịch
      if (res?.data?.length > 0) {
          setHasCalendar(true);
        setEvents(() => {
          return res.data.flatMap((item, index) => {
            return item.time.map((time, idx) => ({
              id: `${index}-${idx}`,
              title: "Free for work",
              start: time.start,
              end: time.end,
              allDay: false,
              dayOfWeek: item.day
            }));
          });
        });
      } else {
          setHasCalendar(false);
        setEvents([]); // nếu chưa có thì để trống
      }
    } catch (err) {
      console.error("Lỗi lấy lịch:", err);
    }
  }
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
        onClose: () => {
        toggleModal();
        window.location.reload();  // reload trang
      },
      });
    } catch (error) {
      toast.error("Failed to create calendars");
      console.error("Failed to create one or more calendars:", error);
    }
  };
  const onChange = e => {
    setShowHolidayOff(e.target.checked);
  };
  
  const [jobListInformation, setJobListInformation] = useState();
  const filteredJobList = showHolidayOff
    ? jobListInformation?.filter(job => job.holiday_off === true)
    : jobListInformation;
  useEffect(() => {
    const fetchJobList = async () => {
      try {
        const response = await jobApi.getJobList();
        console.log("Job list fetched successfully:", response);
        setJobListInformation(response.data.data);
      } catch (error) {
        console.error("Error fetching job list:", error);
      }
    };
    fetchJobList();
  }
  , []);

  const handleUpdate = async () => {
    try {
      // 1. Xóa toàn bộ lịch hiện tại trong DB
      const allCalendars = await calendarApi.getCalendar();
      const deletePromises = allCalendars.data.map(item => calendarApi.deleteCalendar(item.id));
      await Promise.all(deletePromises);

      // 2. Gửi dữ liệu mới
      const data = groupByDay(events);
      const createPromises = data.map(item => createCalendar(item));
      await Promise.all(createPromises);

      toast.success("Cập nhật lịch thành công!", {
        autoClose: 2000,
        onClose: () => {
          toggleModal();
          window.location.reload();
        },
      });
    } catch (error) {
      console.error("Lỗi cập nhật lịch:", error);
      toast.error("Cập nhật thất bại");
    }
  };
  const handleClearAllEvents = () => {
    setEvents([]);
  };

  return (
    <div>
      <div className="flex justify-between w-full bg-[#E8F5E9]">
        <div className="py-2 flex">
          <div className="h-12 w-12 ml-20 overflow-hidden rounded-full">
          <img src={joblogo} alt="JobTime Fit Logo" className="w-full h-full object-cover" />
          </div>
          <div className ="ml-10 flex items-center text-[#00528D] text-xl font-semibold">
            Trang chủ
          </div>
        </div>
        <div className="py-2 mr-20 justify-center items-center flex">
          <button
            className="bg-green-600 text-white font-semibold py-2 px-6 rounded-3xl hover:bg-green-700 cursor-pointer transition duration-300"
            onClick={toggleModal}
          >
            Nhập lịch
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[85%] p-6 relative">
            <IconButton
              aria-label="close"
              onClick={toggleModal}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <Close />
            </IconButton>

            <h2 className="text-xl font-semibold text-center mb-4 text-green-700">
              Nhập lịch bạn có thể làm việc trong tuần
            </h2>

            <div className="mb-6">
              <div>
                <WorkCalendar events={events} setEvents={setEvents} />
              </div>
            </div>

            <div className="flex justify-end gap-5">
              <button
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-3xl hover:bg-red-700 cursor-pointer transition duration-300"
                onClick={handleClearAllEvents}
              >
                Xóa tất cả
              </button>
              <button
                className="bg-green-600 text-white font-semibold py-2 px-4 rounded-3xl hover:bg-green-700 cursor-pointer transition duration-300"
                onClick={hasCalendar ? handleUpdate : handleSave}
              >
                {hasCalendar ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
        <div className="w-full mt-2 max-w-[80%] mx-auto">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop={true}
            spaceBetween={10}
            slidesPerView={1}
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} alt={`Slide ${index}`} className="w-full max-h-[80vh] object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-[80%] mx-auto mt-10">
          <div className ="flex mt-7 justify-between">
            <h1 className="text-2xl text-[#00528D] font-semibold">Danh sách công việc</h1>
             <div>
              <Checkbox onChange={onChange}>
                <span className="text-xl text-[#00528D] font-semibold">Nghỉ ngày lễ</span> 
              </Checkbox>
             </div>
          </div>
          <JobCard listJob={filteredJobList} />
        </div>
    </div>
  );
};

export default Home;
