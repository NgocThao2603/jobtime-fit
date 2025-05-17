import moment from "moment";

export function calculateFitPercentage(jobTimes, userTimes) {
  let fitTime = 0;
  let unfitTime = 0;

  const weekDaysMap = {
    "Chủ Nhật": 0,
    "Thứ Hai": 1,
    "Thứ Ba": 2,
    "Thứ Tư": 3,
    "Thứ Năm": 4,
    "Thứ Sáu": 5,
    "Thứ Bảy": 6,
  };

  jobTimes.forEach((item) => {
    const dayNumber = weekDaysMap[item.day];
    if (dayNumber === undefined) return;

    const date = moment().day(dayNumber).format("YYYY-MM-DD");

    item.shifts.forEach((shift) => {
      const shiftStart = moment(`${date}T${shift.start}`);
      const shiftEnd = moment(`${date}T${shift.end}`);

      let fitSlots = [];

      userTimes.forEach((userItem) => {
        if (weekDaysMap[userItem.day] !== dayNumber) return;

        userItem.slots.forEach((slot) => {
          const slotStart = moment(`${date}T${slot.start}`);
          const slotEnd = moment(`${date}T${slot.end}`);

          const latestStart = moment.max(shiftStart, slotStart);
          const earliestEnd = moment.min(shiftEnd, slotEnd);

          if (latestStart.isBefore(earliestEnd)) {
            fitSlots.push({ start: latestStart, end: earliestEnd });
          }
        });
      });

      // Tính fit/unfit time
      fitSlots.forEach((fit) => {
        fitTime += moment(fit.end).diff(moment(fit.start), "minutes");
      });

      // Tính phần unfit
      let current = shiftStart;
      fitSlots.sort((a, b) => a.start - b.start);
      fitSlots.forEach((fit) => {
        if (current.isBefore(fit.start)) {
          unfitTime += moment(fit.start).diff(current, "minutes");
        }
        current = moment.max(current, fit.end);
      });
      if (current.isBefore(shiftEnd)) {
        unfitTime += moment(shiftEnd).diff(current, "minutes");
      }
    });
  });

  const total = fitTime + unfitTime;
  const percentage = total === 0 ? 0 : Math.round((fitTime / total) * 100);
  return percentage;
}
