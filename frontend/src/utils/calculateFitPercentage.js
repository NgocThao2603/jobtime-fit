import moment from "moment";

// Nếu bạn chưa có file constants, copy map này vào cùng file hoặc import từ FitCalendar
const weekDaysMap = {
  "Chủ Nhật": 0,
  "Thứ Hai": 1,
  "Thứ Ba": 2,
  "Thứ Tư": 3,
  "Thứ Năm": 4,
  "Thứ Sáu": 5,
  "Thứ Bảy": 6,
};

function mergeTimeSlots(slots) {
  if (!slots.length) return [];

  // Sort theo thời gian bắt đầu
  slots.sort((a, b) => a.start - b.start);

  const merged = [slots[0]];
  for (let i = 1; i < slots.length; i++) {
    const last = merged[merged.length - 1];
    if (slots[i].start <= last.end) {
      // Nếu trùng hoặc chồng lên nhau, gộp lại
      last.end = moment.max(last.end, slots[i].end);
    } else {
      merged.push(slots[i]);
    }
  }
  return merged;
}

export function calculateFitPercentage(jobTimes = [], userTimes = []) {
  let totalFitMinutes = 0;
  let totalUnfitMinutes = 0;

  jobTimes.forEach((jobItem) => {
    const dayNumber = weekDaysMap[jobItem.day];
    if (dayNumber === undefined) return;

    const startOfWeek = moment().startOf("isoWeek"); // Monday
    const date = moment(startOfWeek).add(dayNumber - 1, "days").format("YYYY-MM-DD");

    jobItem.shifts.forEach((shift) => {
      const shiftStart = moment(`${date}T${shift.start}`);
      const shiftEnd = moment(`${date}T${shift.end}`);

      // Tìm khoảng fit
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

      // Merge các khoảng thời gian fit
      const mergedFitSlots = mergeTimeSlots(fitSlots);

      // Tổng fit time trong ca làm việc
      mergedFitSlots.forEach(({ start, end }) => {
        totalFitMinutes += end.diff(start, "minutes");
      });

      const shiftDuration = shiftEnd.diff(shiftStart, "minutes");
      const fitDuration = mergedFitSlots.reduce((acc, { start, end }) => acc + end.diff(start, "minutes"), 0);

      totalUnfitMinutes += shiftDuration - fitDuration;
    });
  });

  if (totalFitMinutes + totalUnfitMinutes === 0) return 0;

  return Math.round((totalFitMinutes / (totalFitMinutes + totalUnfitMinutes)) * 100);
}
