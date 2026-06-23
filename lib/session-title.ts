const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type SessionTitleContext = {
  district: string;
  block: string;
  gramPanchayat: string;
  village: string;
  surveyDate: string | Date;
};

export function buildSessionTitle(context: SessionTitleContext) {
  const surveyDate = context.surveyDate instanceof Date
    ? context.surveyDate
    : new Date(context.surveyDate);
  const month = MONTH_NAMES[surveyDate.getMonth()] ?? "Unknown";
  const year = surveyDate.getFullYear();

  return `${context.district} ${context.block} ${context.gramPanchayat} ${context.village} - ${month} ${year}`;
}
