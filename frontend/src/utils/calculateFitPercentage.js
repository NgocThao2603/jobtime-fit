import moment from "moment";

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
  slots.sort((a, b) => a.start - b.start);
  const merged = [slots[0]];
  for (let i = 1; i < slots.length; i++) {
    const last = merged[merged.length - 1];
    if (slots[i].start <= last.end) {
      last.end = moment.max(last.end, slots[i].end);
    } else {
      merged.push(slots[i]);
    }
  }
  return merged;
}

export function calculateFitPercentage(jobTimes = [], userTimes = [], minSessionsPerWeek = []) {
  let totalFitMinutes = 0;
  let totalJobMinutes = 0;

  const fitDaySet = new Set();
  let totalShiftCount = 0;

  jobTimes.forEach((jobItem) => {
    const dayNumber = weekDaysMap[jobItem.day];
    if (dayNumber === undefined) return;

    const startOfWeek = moment().startOf("isoWeek");
    const date = moment(startOfWeek).add(dayNumber - 1, "days").format("YYYY-MM-DD");

    let isAllShiftsFit = true;

    jobItem.shifts.forEach((shift) => {
      const shiftStart = moment(`${date}T${shift.start}`);
      const shiftEnd = moment(`${date}T${shift.end}`);
      const shiftDuration = shiftEnd.diff(shiftStart, "minutes");

      totalJobMinutes += shiftDuration;
      totalShiftCount++;

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

      const mergedFitSlots = mergeTimeSlots(fitSlots);
      const fitDuration = mergedFitSlots.reduce(
        (acc, { start, end }) => acc + end.diff(start, "minutes"),
        0
      );

      if (fitDuration < shiftDuration) {
        isAllShiftsFit = false;
      }

      totalFitMinutes += fitDuration;
    });

    if (isAllShiftsFit) {
      fitDaySet.add(jobItem.day);
    }
  });

  const fitFullDayCount = fitDaySet.size;

  if (fitFullDayCount >= minSessionsPerWeek) {
    return 100;
  }

  if (totalShiftCount === 0) return 0;

  const averageJobTimePerShift = totalJobMinutes / totalShiftCount;
  const requiredFitTime = averageJobTimePerShift * minSessionsPerWeek;

  const fitRatio = totalFitMinutes / requiredFitTime;

  return Math.min(100, Math.round(fitRatio * 100));
}
