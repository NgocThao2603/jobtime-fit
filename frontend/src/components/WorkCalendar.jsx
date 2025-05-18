import React, { useRef, useCallback, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CancelIcon from "@mui/icons-material/Cancel";

export default function WorkCalendar({ events, setEvents }) {
  const calendarRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .fc-col-header-cell-cushion {
        color: #000 !important;
      }
      .fc-timegrid-event {
        background-color: #E8F5E9 !important;
        border-left: 4px solid #4CAF50 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleDateSelect = useCallback(
    (selectInfo) => {
      const title = "Free for work";
      const id = new Date().getTime().toString();
      const startDate = new Date(selectInfo.startStr);
      const dayOfWeek = startDate.toLocaleDateString("vi-VN", {
        weekday: "long",
      });

      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id,
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
          dayOfWeek: dayOfWeek,
        },
      ]);

      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.unselect();
      }
    },
    [setEvents]
  );

  const handleEventChange = (changeInfo) => {
    setEvents(
      events.map((event) =>
        event.id === changeInfo.event.id
          ? {
              ...event,
              start: changeInfo.event.startStr,
              end: changeInfo.event.endStr,
            }
          : event
      )
    );
  };

  const handleEventRemove = useCallback(
    (eventId) => {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      console.log("Removing event with ID:", eventId);
    },
    [setEvents]
  );

  const renderEventContent = (eventInfo) => {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center p-1">
          <div className="text-sm truncate flex-grow font-semibold">
            {eventInfo.event.title}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEventRemove(eventInfo.event.id);
            }}
            className="text-[#0369A1] hover:text-red-700 font-bold -mt-6 -mr-3 cursor-pointer"
            aria-label="Remove event"
          >
            <CancelIcon />
          </button>
        </div>
        <div className="text-xs px-1">
          {new Date(eventInfo.event.start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(eventInfo.event.end).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[600px]">
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
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
        nowIndicator={true}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayCount={7}
        firstDay={1}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        height="100%"
        expandRows={true}
        eventContent={renderEventContent}
        select={handleDateSelect}
        eventChange={handleEventChange}
        events={events}
        eventBackgroundColor="#E8F5E9"
        eventBorderColor="#fff"
        eventTextColor="#0369A1"
      />
    </div>
  );
}
