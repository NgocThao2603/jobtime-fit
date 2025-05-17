import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { calendarApi } from "../services/api";

const weekDaysMap = {
  "Chủ Nhật": 0,
  "Thứ Hai": 1,
  "Thứ Ba": 2,
  "Thứ Tư": 3,
  "Thứ Năm": 4,
  "Thứ Sáu": 5,
  "Thứ Bảy": 6,
};

const FitCalendar = ({ jobTimes = [] }) => {
  const calendarRef = useRef(null);
  const [userTimes, setUserTimes] = useState([]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .fc-col-header-cell .fc-col-header-cell-cushion {
        color: #000 !important;
      }
      .fc-event.free {
        background-color: #E8F5E9 !important;
        border-left: 3px solid #4CAF50 !important;
      }
      .fc-event.fit {
        background-color: #E0F2FF !important;
        border-left: 3px solid #0094FF !important;
      }
      .fc-event.unfit {
        background-color: #FFE4E6 !important;
        border-left: 3px solid #F43F5E !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    calendarApi
      .getCalendar()
      .then((res) => {
        setUserTimes(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy calendar từ API:", err);
      });
  }, []);

  const convertJobTimesToEvents = () => {
    const events = [];

    jobTimes.forEach((jobItem) => {
      const dayNumber = weekDaysMap[jobItem.day];
      if (dayNumber === undefined) return;

      const date = moment().day(dayNumber).format("YYYY-MM-DD");

      let jobFitCount = 0;
      const shiftEvents = [];

      jobItem.shifts.forEach((shift) => {
        const shiftStart = moment(`${date}T${shift.start}`);
        const shiftEnd = moment(`${date}T${shift.end}`);

        let fitSlots = [];

        userTimes.forEach((userItem) => {
          if (weekDaysMap[userItem.day] !== dayNumber) return;

          userItem.time.forEach((slot) => {
            const slotStart = moment(slot.start);
            const slotEnd = moment(slot.end);

            const latestStart = moment.max(shiftStart, slotStart);
            const earliestEnd = moment.min(shiftEnd, slotEnd);

            if (latestStart.isBefore(earliestEnd)) {
              fitSlots.push({ start: latestStart, end: earliestEnd });
            }
          });
        });

        if (fitSlots.length > 0) {
          // Nếu có fit slots → tăng tổng fit count
          jobFitCount += fitSlots.length;

          fitSlots.forEach((fit) => {
            shiftEvents.push({
              title: "Fit Time",
              start: fit.start.toISOString(),
              end: fit.end.toISOString(),
              className: "fit",
            });
          });
        }

        // Dù có fit hay không → vẫn phải render phần còn lại (Required) nếu chưa đủ min_sessions
        let current = shiftStart;

        // Sắp xếp các fit để tính phần còn lại
        fitSlots.sort((a, b) => a.start - b.start);
        fitSlots.forEach((fit) => {
          if (current.isBefore(fit.start)) {
            shiftEvents.push({
              title: "Required Time",
              start: current.toISOString(),
              end: fit.start.toISOString(),
              className: "unfit",
            });
          }
          current = moment.max(current, fit.end);
        });

        if (current.isBefore(shiftEnd)) {
          shiftEvents.push({
            title: "Required Time",
            start: current.toISOString(),
            end: shiftEnd.toISOString(),
            className: "unfit",
          });
        }
      });

      // Nếu đã đủ min_sessions_per_week, thì loại bỏ hết các event "unfit"
      if (jobFitCount >= jobItem.min_sessions_per_week) {
        const filtered = shiftEvents.filter((e) => e.className !== "unfit");
        events.push(...filtered);
      } else {
        events.push(...shiftEvents);
      }
    });

    return events;
  };

  const convertUserTimesToEvents = () => {
    const events = [];

    userTimes.forEach((item) => {
      const dayNumber = weekDaysMap[item.day];
      if (dayNumber === undefined) return;

      item.time.forEach((slot) => {
        const slotStart = moment(slot.start);
        const slotEnd = moment(slot.end);

        let fitSlots = [];

        jobTimes.forEach((jobItem) => {
          if (weekDaysMap[jobItem.day] !== dayNumber) return;

          jobItem.shifts.forEach((shift) => {
            const shiftStart = moment(
              `${moment(slot.start).format("YYYY-MM-DD")}T${shift.start}`
            );
            const shiftEnd = moment(
              `${moment(slot.start).format("YYYY-MM-DD")}T${shift.end}`
            );

            const latestStart = moment.max(shiftStart, slotStart);
            const earliestEnd = moment.min(shiftEnd, slotEnd);

            if (latestStart.isBefore(earliestEnd)) {
              fitSlots.push({ start: latestStart, end: earliestEnd });
            }
          });
        });

        // Tạo phần "Free For Work" còn lại sau khi trừ phần trùng (fit)
        let current = slotStart;
        fitSlots.sort((a, b) => a.start - b.start);
        fitSlots.forEach((fit) => {
          if (current.isBefore(fit.start)) {
            events.push({
              title: "Free For Work",
              start: current.toISOString(),
              end: fit.start.toISOString(),
              className: "free",
            });
          }
          current = moment.max(current, fit.end);
        });
        if (current.isBefore(slotEnd)) {
          events.push({
            title: "Free For Work",
            start: current.toISOString(),
            end: slotEnd.toISOString(),
            className: "free",
          });
        }
      });
    });

    return events;
  };

  const allEvents = [
    ...convertUserTimesToEvents(),
    ...convertJobTimesToEvents(),
  ];

  const renderEventContent = (eventInfo) => {
    const start = new Date(eventInfo.event.start);
    const end = new Date(eventInfo.event.end);
    const durationInMinutes = (end - start) / (1000 * 60); // milliseconds → minutes

    return (
      <div className="flex flex-col h-full w-full text-black">
        <div className="flex justify-between items-center p-1 font-semibold">
          <div className="text-sm truncate">{eventInfo.event.title}</div>
        </div>
        {durationInMinutes > 30 && (
          <div className="text-xs px-1">
            {start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-[700px]">
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={false}
        slotDuration="00:30:00"
        slotLabelInterval="02:00:00"
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        dayHeaderFormat={{
          weekday: "long",
        }}
        allDaySlot={false}
        dayCount={7}
        firstDay={1}
        height="100%"
        expandRows={true}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        nowIndicator={true}
        events={allEvents}
        eventContent={renderEventContent}
      />
    </div>
  );
};

export default FitCalendar;
